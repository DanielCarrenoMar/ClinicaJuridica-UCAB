import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useGetCaseById, useUpdateCase } from '#domain/useCaseHooks/useCase.ts';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Tabs from '#components/Tabs.tsx';
import Box from '#components/Box.tsx';
import Dropdown from '#components/Dropdown/Dropdown.tsx'; // Changed from TitleDropdown to Dropdown for better alignment control
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import SearchBar from '#components/SearchBar.tsx';
import AppointmentCard from '#components/AppointmentCard.tsx';
import AppointmentDetailsDialog from '#components/AppointmentDetailsDialog.tsx';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import SupportDocumentCard from '#components/SupportDocumentCard.tsx';
import SupportDocumentDetailsDialog from '#components/SupportDocumentDetailsDialog.tsx';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import { Clipboard, User, CalendarMonth, Book, File, FilePdf } from 'flowbite-react-icons/solid';
import type { CaseStatusTypeModel } from '#domain/typesModel.ts';

const STATUS_COLORS: Record<CaseStatusTypeModel, string> = {
    "Abierto": "bg-success! text-white border-0",
    "En Espera": "bg-warning! text-white border-0",
    "Pausado": "bg-onSurface! text-white border-0",
    "Cerrado": "bg-error! text-white border-0"
};

const MOCK_APPOINTMENTS: AppointmentModel[] = [
    {
        idCase: 1,
        appointmentNumber: 1,
        plannedDate: new Date(2024, 0, 15, 10, 0),
        status: "Completada",
        userId: "user-123",
        userName: "Prof. Alberto",
        registryDate: new Date(2024, 0, 1),
        guidance: "Primera revisión del caso y entrevista inicial."
    },
    {
        idCase: 1,
        appointmentNumber: 2,
        plannedDate: new Date(2024, 1, 20, 14, 30),
        status: "Programada",
        userId: "user-456",
        userName: "Estudiante Maria",
        registryDate: new Date(2024, 1, 15),
        guidance: "Entrega de recaudos pendientes y firma de documentos."
    },
    {
        idCase: 1,
        appointmentNumber: 3,
        plannedDate: new Date(2024, 2, 5, 9, 0),
        status: "Cancelada",
        userId: "user-789",
        userName: "Prof. Alberto",
        registryDate: new Date(2024, 2, 1),
        guidance: "Cancelada por fuerza mayor."
    }
];

const MOCK_SUPPORT_DOCUMENTS: SupportDocumentModel[] = [
    {
        idCase: 1,
        supportNumber: 1,
        title: "Cédula de Identidad",
        description: "Copia legible de la cédula de identidad del solicitante.",
        submissionDate: new Date(2024, 0, 10),
        fileUrl: "#"
    },
    {
        idCase: 1,
        supportNumber: 2,
        title: "Constancia de Residencia",
        description: "Documento emitido por el CNE o Consejo Comunal que avale la residencia actual.",
        submissionDate: new Date(2024, 0, 12),
        fileUrl: "#"
    },
    {
        idCase: 1,
        supportNumber: 3,
        title: "Informe Médico",
        description: "Informe detallado de la condición de salud que motiva la solicitud. Incluye antecedentes y tratamiento actual.",
        submissionDate: new Date(2024, 0, 15),
        fileUrl: "#"
    }
];

export default function CaseInfo() {
    const { id } = useParams<{ id: string }>();
    const { caseData, loading, error, loadCase } = useGetCaseById();
    const { editCase, loading: updating } = useUpdateCase();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [activeTab, setActiveTab] = useState("general");

    // Citas Tab State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

    // Recaudos Tab State
    const [supportSearchQuery, setSupportSearchQuery] = useState("");
    const [selectedSupportDocument, setSelectedSupportDocument] = useState<SupportDocumentModel | null>(null);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadCase(id);
        }
    }, [id, loadCase]);

    useEffect(() => {
        if (caseData) {
            setFormData(caseData);
        }
    }, [caseData]);

    const handleSave = async () => {
        if (!id) return;
        try {
            await editCase(id, formData);
            setIsEditing(false);
            loadCase(id);
        } catch (e) {
            console.error("Failed to update case", e);
        }
    };

    const handleStatusChange = (newStatus: string) => {
        // Updated to only change local state as requested
        setFormData((prev: any) => ({ ...prev, caseStatus: newStatus }));
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (error) return <div className="text-error">Error al cargar el caso: {error.message}</div>;
    if (!caseData) return <div className="text-onSurface">No se encontró el caso</div>;

    const getStatusColor = (status: CaseStatusTypeModel) => STATUS_COLORS[status] || "bg-surface text-onSurface";

    return (
        <Box className='p-0!'>
            <header className="bg-surface/70 flex items-center justify-between px-4 rounded-xl h-16">
                <span className="flex gap-3 items-center">
                    <Clipboard className='size-6!'/>
                    <div>
                        <h1 className="text-label-small">{caseData.compoundKey}</h1>
                        <p className="text-body-small"> <strong className='text-body-medium'>Fecha:</strong> {caseData.createdAt.toLocaleDateString("es-ES")}</p>
                    </div>
                </span>
                <span className="flex items-center gap-4 h-full">
                    <div>
                        <Dropdown
                            label={formData.caseStatus || caseData.caseStatus} // Use formData for immediate update
                            triggerClassName={getStatusColor(formData.caseStatus || caseData.caseStatus)}
                            selectedValue={formData.caseStatus || caseData.caseStatus}
                            onSelectionChange={(val) => handleStatusChange(val as string)}
                        >
                            <DropdownOption value="Abierto">Abierto</DropdownOption>
                            <DropdownOption value="En Espera">En Espera</DropdownOption>
                            <DropdownOption value="Pausado">Pausado</DropdownOption>
                            <DropdownOption value="Cerrado">Cerrado</DropdownOption>
                        </Dropdown>
                    </div>

                    <Button variant="outlined" onClick={() => { }} className="h-10 w-fit px-4" icon={<FilePdf className="mr-2 h-5 w-5" />}>
                        Exportar
                    </Button>
                </span>
            </header>

            <section className="flex py-2">
                <Tabs selectedId={activeTab} onChange={setActiveTab}>
                    <Tabs.Item id="general" label="General" icon={<Clipboard/>} />
                    <Tabs.Item id="involucrados" label="Involucrados" icon={<User/>} />
                    <Tabs.Item id="citas" label="Citas" icon={<CalendarMonth/>} />
                    <Tabs.Item id="recaudos" label="Recaudos" icon={<File/>} />
                    <Tabs.Item id="historial" label="Historial" icon={<Book/>} />
                </Tabs>
            </section>

            <section className="px-4 pb-6 h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
                    {activeTab === 'general' && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-label-medium text-onSurface">Síntesis del Problema</h3>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                            <Button variant="filled" onClick={handleSave} disabled={updating}>
                                                {updating ? "Guardando..." : "Guardar Cambios"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="outlined" onClick={() => setIsEditing(true)}>Editar Información</Button>
                                    )}
                                </div>

                                <Box className="min-h-[150px] bg-surface rounded-xl p-4">
                                    {isEditing ? (
                                        <TextInput
                                            multiline
                                            defaultText={formData.problemSummary}
                                            onChangeText={(val) => handleChange('problemSummary', val)}
                                            className="h-full"
                                        />
                                    ) : (
                                        <p className="text-body-medium text-onSurface">{caseData.problemSummary}</p>
                                    )}
                                </Box>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                                <div>
                                    <h4 className="text-title-medium text-onSurface font-bold mb-1">Ámbito Legal</h4>
                                    <p className="text-body-medium text-onSurface">{caseData.legalAreaName}</p>
                                </div>
                                <div>
                                    <h4 className="text-title-medium text-onSurface font-bold mb-1">Tipo de Trámite</h4>
                                    <p className="text-body-medium text-onSurface">{caseData.processType}</p>
                                </div>
                                <div>
                                    <h4 className="text-title-medium text-onSurface font-bold mb-1">Tribunal</h4>
                                    {isEditing ? (
                                        <TextInput
                                            defaultText={formData.courtName}
                                            onChangeText={(val) => handleChange('courtName', val)}
                                        />
                                    ) : (
                                        <p className="text-body-medium text-onSurface">{caseData.courtName || "Sin Tribunal"}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'citas' && (
                        <div className="flex flex-col h-full gap-6">
                            <div className="flex justify-between items-center gap-4">
                                <div className='flex-1'>
                                    <SearchBar
                                        isOpen={true}
                                        placeholder="Buscar citas..."
                                        onChange={setSearchQuery}
                                    />
                                </div>
                                <Button variant='outlined' onClick={() => { }}>
                                    Añadir Cita
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4 pb-20">
                                {MOCK_APPOINTMENTS
                                    .filter(apt =>
                                        apt.guidance?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        apt.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        apt.status.toString().toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(apt => (
                                        <AppointmentCard
                                            key={apt.appointmentNumber}
                                            appointment={apt}
                                            applicantName={caseData.applicantName}
                                            onClick={() => {
                                                setSelectedAppointment(apt);
                                                setIsAppointmentDialogOpen(true);
                                            }}
                                        />
                                    ))}
                            </div>

                            <AppointmentDetailsDialog
                                open={isAppointmentDialogOpen}
                                onClose={() => setIsAppointmentDialogOpen(false)}
                                appointment={selectedAppointment}
                                applicantName={caseData.applicantName}
                            />
                        </div>
                    )}

                    {activeTab === 'recaudos' && (
                        <div className="flex flex-col h-full gap-6">
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex-1">
                                    <SearchBar
                                        isOpen={true}
                                        placeholder="Buscar recaudos..."
                                        onChange={setSupportSearchQuery}
                                    />
                                </div>
                                <Button variant='outlined' onClick={() => { }}>
                                    Añadir Recaudo
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4 pb-20">
                                {MOCK_SUPPORT_DOCUMENTS
                                    .filter(doc =>
                                        doc.title.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                                        doc.description.toLowerCase().includes(supportSearchQuery.toLowerCase())
                                    )
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
                            </div>

                            <SupportDocumentDetailsDialog
                                open={isSupportDialogOpen}
                                onClose={() => setIsSupportDialogOpen(false)}
                                document={selectedSupportDocument}
                            />
                        </div>
                    )}

                    {activeTab === 'involucrados' && (
                        <div className="flex flex-col md:flex-row gap-8 h-full">
                            <div className="flex-1 flex flex-col gap-8 bg-surface rounded-xl p-6">
                                <div>
                                    <h3 className="text-title-small text-onSurface mb-4">Solicitante</h3>
                                    <div className="flex items-center gap-3">
                                        <User className="w-8 h-8 text-onSurface" />
                                        <p className="text-body-large text-onSurface font-medium">{caseData.applicantName}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-title-small text-onSurface mb-4">Responsables</h3>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h4 className="text-label-large text-onSurface font-bold mb-2">Profesor</h4>
                                            <div className="flex items-center gap-3">
                                                <User className="w-6 h-6 text-onSurface/70" />
                                                <p className="text-body-medium text-onSurface">{caseData.teacherName || "Sin Profesor Asignado"}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-label-large text-onSurface font-bold mb-2">Estudiantes</h4>
                                            <div className="flex items-center gap-3">
                                                <User className="w-6 h-6 text-onSurface/70" />
                                                <p className="text-body-medium text-onSurface">Juan Alberto Garrido Diaz</p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <User className="w-6 h-6 text-onSurface/70" />
                                                <p className="text-body-medium text-onSurface">Jose Maria Garrido Diaz</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 h-full flex flex-col bg-surface rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-title-small text-onSurface">Beneficiarios</h3>
                                    <Button variant="outlined" className="px-4 py-1" onClick={() => { }}>Añadir</Button>
                                </div>
                                <Box className="flex-1 h-full border border-onSurface/20 bg-transparent flex flex-col gap-4">

                                    <div className="flex justify-between items-start">
                                        <span className="text-body-medium text-onSurface">Jose Luis Enrique Calderon</span>
                                        <span className="text-body-small text-onSurfaceVariant">V-1231231231</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-medium text-onSurface">Pedro Gallego Enrique Calderon</span>
                                        <span className="text-body-small text-onSurfaceVariant">V-1231231231</span>
                                    </div>
                                </Box>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'general' && activeTab !== 'involucrados' && (
                        <div className="flex justify-center items-center h-full text-onSurface/50">
                            Contenido de {activeTab} próximamente
                        </div>
                    )}
                </div>
            </section >
        </Box>
    );
}