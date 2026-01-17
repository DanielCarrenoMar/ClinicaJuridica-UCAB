import { useMemo, useState } from 'react';
import SearchBar from '#components/SearchBar.tsx';
import Button from '#components/Button.tsx';
import SupportDocumentCard from '#components/SupportDocumentCard.tsx';
import SupportDocumentDetailsDialog from '#components/dialogs/SupportDocumentDetailsDialog.tsx';
import AddSupportDocumentDialog from '#components/dialogs/AddSupportDocumentDialog.tsx';
import EditSupportDocumentDialog from '#components/dialogs/EditSupportDocumentDialog.tsx';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import type { SupportDocumentDAO } from '#database/daos/supportDocumentDAO.ts';
import { useGetSupportDocumentByCaseId } from '#domain/useCaseHooks/useCase.ts';
import { useCreateSupportDocument, useUpdateSupportDocument, useDeleteSupportDocument } from '#domain/useCaseHooks/useSupportDocument.ts';
import { useNotifications } from '#/context/NotificationsContext';
import Fuse from 'fuse.js';

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

            <section className="flex flex-col gap-4 pb-20 overflow-y-auto">
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
                        loadSupportDocuments(caseId);
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
                        const newDoc: SupportDocumentDAO = {
                            idCase: caseId,
                            supportNumber: 0,
                            title: data.title,
                            description: data.description,
                            submissionDate: data.submissionDate,
                            fileUrl: data.fileUrl || ""
                        };
                        await createNewSupportDocument(newDoc);
                        loadSupportDocuments(caseId);
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
                        await updateSupDocument(idCase, { ...data, supportNumber });
                        loadSupportDocuments(caseId);
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
