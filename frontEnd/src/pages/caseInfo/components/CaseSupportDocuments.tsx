import { useEffect, useMemo, useState } from 'react';
import SearchBar from '#components/SearchBar.tsx';
import Button from '#components/Button.tsx';
import SupportDocumentCard from '#components/SupportDocumentCard.tsx';
import SupportDocumentDetailsDialog from '#components/dialogs/SupportDocumentDetailsDialog.tsx';
import AddSupportDocumentDialog from '#components/dialogs/AddSupportDocumentDialog.tsx';
import EditSupportDocumentDialog from '#components/dialogs/EditSupportDocumentDialog.tsx';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import { useGetSupportDocumentByCaseId } from '#domain/useCaseHooks/useCase.ts';
import { useCreateSupportDocument, useUpdateSupportDocument, useDeleteSupportDocument } from '#domain/useCaseHooks/useSupportDocument.ts';
import { useNotifications } from '#/context/NotificationsContext';
import Fuse from 'fuse.js';
import { ArrowLeft, ArrowRight } from 'flowbite-react-icons/outline';

interface CaseSupportDocumentsProps {
    caseId: number;
}

export default function CaseSupportDocuments({ caseId }: CaseSupportDocumentsProps) {
    const { notyError } = useNotifications();
    const { supportDocument: supportDocuments, loadSupportDocuments } = useGetSupportDocumentByCaseId(caseId);
    const { createSupportDocument: createNewSupportDocument } = useCreateSupportDocument();
    const { updateSupportDocument: updateSupDocument } = useUpdateSupportDocument();
    const { deleteSupportDocument: deleteSupDocument } = useDeleteSupportDocument();

    const [supportSearchQuery, setSupportSearchQuery] = useState('');
    const [selectedSupportDocument, setSelectedSupportDocument] = useState<SupportDocumentModel | null>(null);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
    const [isAddSupportDialogOpen, setIsAddSupportDialogOpen] = useState(false);
    const [isEditSupportDialogOpen, setIsEditSupportDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        loadSupportDocuments(caseId, { page, limit: pageSize });
    }, [caseId, loadSupportDocuments, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [supportSearchQuery]);

    const supportDocumentsFuse = useMemo(() => {
        return new Fuse(supportDocuments, {
            keys: [
                { name: 'title', weight: 0.65 },
                { name: 'description', weight: 0.35 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }, [supportDocuments]);

    const visibleSupportDocuments = useMemo(() => {
        const trimmed = supportSearchQuery.trim();
        if (trimmed.length === 0) return supportDocuments;
        return supportDocumentsFuse.search(trimmed).map(r => r.item);
    }, [supportDocuments, supportDocumentsFuse, supportSearchQuery]);

    const canGoPrev = page > 1;
    const canGoNext = supportDocuments.length === pageSize;

    return (
        <div className="flex flex-col h-full gap-6">
            <section className="flex justify-between items-center gap-4 max-w-5xl">
                <div className="flex-1">
                    <SearchBar
                        variant='outline'
                        isOpen={true}
                        placeholder="Buscar recaudos..."
                        onChange={setSupportSearchQuery}
                    />
                </div>
                <Button variant='outlined' onClick={() => setIsAddSupportDialogOpen(true)}>
                    Añadir Recaudo
                </Button>
            </section>

            <section className="flex-1 flex flex-col gap-4 pb-20 overflow-y-auto">
                {visibleSupportDocuments
                    .map(doc => (
                        <SupportDocumentCard
                            key={doc.supportNumber}
                            document={doc}
                            onClick={() => {
                                setSelectedSupportDocument(doc);
                                setIsSupportDialogOpen(true);
                            }}
                            onDownload={(e) => {
                                e.stopPropagation();
                                console.log("Downloading", doc.title);
                            }}
                        />
                    ))}
            </section>

            <section className="mt-4 flex items-center justify-between max-w-5xl">
                <Button
                    variant="outlined"
                    icon={<ArrowLeft />}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!canGoPrev}
                >
                    Anterior
                </Button>
                <span className="text-body-small text-onSurface/70">Página {page}</span>
                <Button
                    variant="outlined"
                    icon={<ArrowRight />}
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!canGoNext}
                >
                    Siguiente
                </Button>
            </section>

            <SupportDocumentDetailsDialog
                open={isSupportDialogOpen}
                onClose={() => setIsSupportDialogOpen(false)}
                document={selectedSupportDocument}
                onEdit={() => {
                    setIsSupportDialogOpen(false);
                    setIsEditSupportDialogOpen(true);
                }}
                onDelete={async () => {
                    if (!selectedSupportDocument) return;
                    try {
                        await deleteSupDocument(selectedSupportDocument.idCase, selectedSupportDocument.supportNumber);
                        loadSupportDocuments(caseId, { page, limit: pageSize });
                        setIsSupportDialogOpen(false);
                        setSelectedSupportDocument(null);
                    } catch (error: any) {
                        console.error("Error deleting support document:", error);
                        notyError(error.message || "Error al eliminar el recaudo");
                    }
                }}
            />

            <AddSupportDocumentDialog
                open={isAddSupportDialogOpen}
                onClose={() => setIsAddSupportDialogOpen(false)}
                onAdd={async (data) => {
                    try {
                        let docData: any = {
                            idCase: caseId,
                            title: data.title,
                            description: data.description,
                            submissionDate: data.submissionDate.toISOString(),
                        };

                        if (data.file) {
                            const formData = new FormData();
                            formData.append('idCase', String(caseId));
                            formData.append('title', data.title);
                            formData.append('description', data.description);
                            formData.append('submissionDate', data.submissionDate.toISOString());
                            formData.append('file', data.file);
                            docData = formData;
                        }

                        await createNewSupportDocument(docData);
                        loadSupportDocuments(caseId, { page, limit: pageSize });
                    } catch (error: any) {
                        console.error("Error creating support document:", error);
                        notyError(error.message || "Error al crear el recaudo");
                    }
                }}
            />

            <EditSupportDocumentDialog
                open={isEditSupportDialogOpen}
                onClose={() => setIsEditSupportDialogOpen(false)}
                document={selectedSupportDocument}
                onSave={async (idCase, supportNumber, data) => {
                    try {
                        let docData: any = {
                            title: data.title,
                            description: data.description,
                        };

                        if (data.file) {
                            const formData = new FormData();
                            formData.append('supportNumber', String(supportNumber));
                            formData.append('title', data.title);
                            formData.append('description', data.description);
                            formData.append('file', data.file);
                            docData = formData;
                        } else {
                            docData.supportNumber = supportNumber;
                        }

                        await updateSupDocument(idCase, docData);
                        loadSupportDocuments(caseId, { page, limit: pageSize });
                        setIsEditSupportDialogOpen(false);
                    } catch (error: any) {
                        console.error("Error updating support document:", error);
                        notyError(error.message || "Error al actualizar el recaudo");
                        setIsEditSupportDialogOpen(false);
                    }
                }}
            />
        </div>
    );
}
