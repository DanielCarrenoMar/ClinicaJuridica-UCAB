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
import { Pen } from 'flowbite-react-icons/outline';
import type { CaseModel } from '#domain/models/case.ts';

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

type CaseInfoTabs = "General" | "Involucrados" | "Citas" | "Recaudos" | "Historial"; 

export default function CaseInfo() {
    const { id } = useParams<{ id: string }>();
    const { caseData, loading, error } = useGetCaseById(id || "");
    const [localCaseData, setLocalCaseData] = useState<CaseModel>();
    const [isDataModified, setIsDataModified] = useState(false);

    const { editCase, loading: updating } = useUpdateCase();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<CaseInfoTabs>("General");

    // Citas Tab State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

    // Recaudos Tab State
    const [supportSearchQuery, setSupportSearchQuery] = useState("");
    const [selectedSupportDocument, setSelectedSupportDocument] = useState<SupportDocumentModel | null>(null);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);

    useEffect(() => {
        if (!caseData) return
        setLocalCaseData(caseData);
        
    }, [caseData]);
    useEffect(() => {
        if (!localCaseData) return
        const hasChanges = JSON.stringify(localCaseData) !== JSON.stringify(caseData);
        setIsDataModified(hasChanges);
    }, [localCaseData]);



    const handleStatusChange = (newStatus: string) => {
        setLocalCaseData((prev: any) => ({ ...prev, caseStatus: newStatus }));
    };

    const handleChange = (field: string, value: string) => {
        setLocalCaseData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (error) return <div className="text-error">Error al cargar el caso: {error.message}</div>;
    if (!caseData) return <div className="text-onSurface">No se encontró el caso</div>;

    const getStatusColor = (status: CaseStatusTypeModel) => STATUS_COLORS[status] || "bg-surface text-onSurface";

    const GeneralTabContent = (
        <div className="flex flex-col gap-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="text-label-small mb-1">Ámbito Legal</h4>
                    <p className="text-body-medium">{caseData.legalAreaName}</p>
                </div>
                <div>
                    <h4 className="text-label-small mb-1">Tipo de Trámite</h4>
                    <p className="text-body-medium">{caseData.processType}</p>
                </div>
                <div>
                    <header className='flex gap-2 items-center'>
                        <h4 className="text-label-small mb-1">Tribunal</h4>
                    </header>
                    <TextInput
                            defaultText={localCaseData?.courtName}
                            onChangeText={(val) => handleChange('courtName', val)}
                    />
                </div>
            </section>
            <section>
                <header className="flex gap-2 items-center mb-2">
                    <h3 className="text-label-medium">Síntesis del Problema</h3>
                </header>
                <TextInput
                    multiline
                    defaultText={localCaseData?.problemSummary}
                    onChangeText={(val) => handleChange('problemSummary', val)}
                />
            </section>
        </div>
    );

    const CitasTabContent = (
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
    );

    const RecaudosTabContent = (
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
    );

    const InvolucradosTabContent = (
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
    );

    const HistorialTabContent = (
        <div className="flex flex-col gap-4">
            <p className="text-body-medium text-onSurface">Historial de actividades del caso aparecerá aquí.</p>
        </div>
    );

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
                    <Dropdown
                        label={localCaseData?.caseStatus} // Use formData for immediate update
                        triggerClassName={getStatusColor(localCaseData?.caseStatus ?? "Abierto")}
                        selectedValue={localCaseData?.caseStatus}
                        onSelectionChange={(val) => handleStatusChange(val as string)}
                    >
                        <DropdownOption value="Abierto">Abierto</DropdownOption>
                        <DropdownOption value="En Espera">En Espera</DropdownOption>
                        <DropdownOption value="Pausado">Pausado</DropdownOption>
                        <DropdownOption value="Cerrado">Cerrado</DropdownOption>
                    </Dropdown>
                    {
                        isDataModified ? (
                            <Button variant='resalted' className='w-32'>Guardar</Button>
                        ) : (
                            <Button variant="outlined" className='w-32' onClick={() => { }} icon={<FilePdf/>}>
                                Exportar
                            </Button>
                        )
                    }
                </span>
            </header>

            <section className="flex py-2">
                <Tabs selectedId={activeTab} onChange={(id) => setActiveTab(id as CaseInfoTabs)}>
                    <Tabs.Item id="General" label="General" icon={<Clipboard/>} />
                    <Tabs.Item id="Involucrados" label="Involucrados" icon={<User/>} />
                    <Tabs.Item id="Citas" label="Citas" icon={<CalendarMonth/>} />
                    <Tabs.Item id="Recaudos" label="Recaudos" icon={<File/>} />
                    <Tabs.Item id="Historial" label="Historial" icon={<Book/>} />
                </Tabs>
            </section>

            <section className="px-4 pb-6 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2">
                    {activeTab === 'General' && GeneralTabContent}
                    {activeTab === 'Citas' && CitasTabContent}
                    {activeTab === 'Recaudos' && RecaudosTabContent}
                    {activeTab === 'Involucrados' && InvolucradosTabContent}
                    {activeTab === 'Historial' && HistorialTabContent}
                </div>
            </section >
        </Box>
    );
}