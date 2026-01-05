import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useGetCaseActionsByCaseId, useGetCaseById, useGetStudentsByCaseId, useUpdateCase, useGetAppointmentByCaseId, useGetSupportDocumentByCaseId } from '#domain/useCaseHooks/useCase.ts';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import Tabs from '#components/Tabs.tsx';
import Box from '#components/Box.tsx';
import Dropdown from '#components/Dropdown/Dropdown.tsx'; // Changed from TitleDropdown to Dropdown for better alignment control
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import SearchBar from '#components/SearchBar.tsx';
import AppointmentCard from '#components/AppointmentCard.tsx';
import AppointmentDetailsDialog from '#components/dialogs/AppointmentDetailsDialog.tsx';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import SupportDocumentCard from '#components/SupportDocumentCard.tsx';
import SupportDocumentDetailsDialog from '#components/dialogs/SupportDocumentDetailsDialog.tsx';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts';
import EditAppointmentDialog from '#components/dialogs/EditAppointmentDialog.tsx';
import { Clipboard, User, CalendarMonth, Book, File, FilePdf, UserCircle } from 'flowbite-react-icons/solid';
import type { CaseStatusTypeModel } from '#domain/typesModel.ts';
import { CircleMinus, Close, UserAdd, UserEdit } from 'flowbite-react-icons/outline';
import type { CaseModel } from '#domain/models/case.ts';
import InBox from '#components/InBox.tsx';
import { useAuth } from '../context/AuthContext';
import CaseActionCard from '#components/CaseActionCard.tsx';
import { createAppointment, updateAppointment } from '#domain/useCaseHooks/useAppointment.ts';
import type { AppointmentDAO } from '#database/daos/appointmentDAO.ts';
import { createSupportDocument, updateSupportDocument } from '#domain/useCaseHooks/useSupportDocument.ts';
import type { SupportDocumentDAO } from '#database/daos/supportDocumentDAO.ts';
import AddSupportDocumentDialog from '#components/dialogs/AddSupportDocumentDialog.tsx';
import EditSupportDocumentDialog from '#components/dialogs/EditSupportDocumentDialog.tsx';
import UserSearchDialog from '#components/dialogs/UserSearchDialog.tsx';
import { useGetAllStudents } from '#domain/useCaseHooks/useStudent.ts';
import { useGetAllTeachers } from '#domain/useCaseHooks/useTeacher.ts';
import AddAppointmentDialog from '#components/dialogs/AddAppointmentDialog.tsx';
const STATUS_COLORS: Record<CaseStatusTypeModel, string> = {
    "Abierto": "bg-success! text-white border-0",
    "En Espera": "bg-warning! text-white border-0",
    "Pausado": "bg-onSurface! text-white border-0",
    "Cerrado": "bg-error! text-white border-0"
};

type CaseInfoTabs = "General" | "Involucrados" | "Citas" | "Recaudos" | "Historial";

export default function CaseInfo() {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div className="text-error">ID del caso no proporcionado en la URL.</div>;

    const { permissionLevel } = useAuth()
    const { caseData, loading, error } = useGetCaseById(Number(id));
    const { editCase, loading: updating } = useUpdateCase();
    const [activeTab, setActiveTab] = useState<CaseInfoTabs>("Citas");
    const { students: caseStudents } = useGetStudentsByCaseId(Number(id));
    const { caseActions, loading: caseActionsLoading, error: caseActionsError } = useGetCaseActionsByCaseId(Number(id));

    const { appointments, loadAppointments } = useGetAppointmentByCaseId(Number(id));
    const { createAppointment: createNewAppointment } = createAppointment();
    const { updateAppointment: updateAppt } = updateAppointment();

    const { students } = useGetAllStudents();
    const { teachers } = useGetAllTeachers();

    // Support Document Hooks
    const { supportDocument: supportDocuments, loadSupportDocuments } = useGetSupportDocumentByCaseId(Number(id));
    const { createSupportDocument: createNewSupportDocument } = createSupportDocument();
    const { updateSupportDocument: updateSupDocument } = updateSupportDocument();

    const userContext = useAuth();

    // Recaudos Tab State
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
    const [isEditAppointmentDialogOpen, setIsEditAppointmentDialogOpen] = useState(false);

    const [localCaseData, setLocalCaseData] = useState<CaseModel>();
    const [isDataModified, setIsDataModified] = useState(false);

    // Citas Tab State
    const [searchQuery, setSearchQuery] = useState("");
    // Recaudos Tab State
    const [supportSearchQuery, setSupportSearchQuery] = useState("");
    const [selectedSupportDocument, setSelectedSupportDocument] = useState<SupportDocumentModel | null>(null);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
    const [isAddSupportDialogOpen, setIsAddSupportDialogOpen] = useState(false);
    const [isEditSupportDialogOpen, setIsEditSupportDialogOpen] = useState(false);

    const [isStudentSearchDialogOpen, setIsStudentSearchDialogOpen] = useState(false);
    const [isTeacherSearchDialogOpen, setIsTeacherSearchDialogOpen] = useState(false);

    useEffect(() => {
        if (!caseData) return
        setLocalCaseData(caseData);

    }, [caseData]);
    useEffect(() => {
        if (!localCaseData) return
        const hasChanges = JSON.stringify(localCaseData) !== JSON.stringify(caseData);
        setIsDataModified(hasChanges);
    }, [localCaseData]);

    function discardChanges() {
        setLocalCaseData(caseData || undefined);
    }
    function saveChanges() {
        if (!localCaseData) return;
        editCase(localCaseData.idCase, localCaseData)
            .then(() => {
                setIsDataModified(false);
            })
            .catch((err) => {
                console.error("Error updating case:", err);
            });
    }



    const handleStatusChange = (newStatus: string) => {
        setLocalCaseData((prev: any) => ({ ...prev, caseStatus: newStatus }));
    };

    const handleChange = (updateField: Partial<CaseModel>) => {
        setLocalCaseData((prev: any) => ({ ...prev, ...updateField }));
    };

    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (error) return <div className="text-error">Error al cargar el caso: {error.message}</div>;
    if (!caseData) return <div className="">No se encontró el caso</div>;

    const getStatusColor = (status: CaseStatusTypeModel) => STATUS_COLORS[status] || "bg-surface ";

    const GeneralTabContent = (
        <div className="flex flex-col gap-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <article className="flex flex-col">
                    <h4 className="text-label-small mb-1">Ámbito Legal</h4>
                    <div className="flex flex-col gap-2 pl-2 border-l-2 border-onSurface/10">
                        <div>
                            <h5 className="text-body-large">Materia</h5>
                            <p className="text-body-medium font-medium">{caseData.subjectName}</p>
                        </div>
                        <div>
                            <h5 className="text-body-large">Categoría</h5>
                            <p className="text-body-medium font-medium">{caseData.subjectCategoryName}</p>
                        </div>
                        <div>
                            <h5 className="text-body-large">Ámbito</h5>
                            <p className="text-body-medium font-medium">{caseData.legalAreaName}</p>
                        </div>
                    </div>
                </article>
                <article>
                    <h4 className="text-label-small mb-1">Tipo de Trámite</h4>
                    <p className="text-body-medium">{caseData.processType}</p>
                </article>
                <article>
                    <header className='flex gap-2 items-center'>
                        <h4 className="text-label-small mb-1">Tribunal</h4>
                    </header>
                    <TextInput
                        value={localCaseData?.courtName || ''}
                        onChangeText={(val) => handleChange({ courtName: val })}
                        placeholder=''
                    />
                </article>
            </section>
            <section>
                <header className="flex gap-2 items-center mb-2">
                    <h3 className="text-label-medium">Síntesis del Problema</h3>
                </header>
                <TextInput
                    multiline
                    value={localCaseData?.problemSummary || ''}
                    onChangeText={(val) => handleChange({ problemSummary: val })}
                />
            </section>
        </div>
    );

    const CitasTabContent = (
        <div className="flex flex-col h-full gap-6">
            <section className="flex justify-between items-center gap-4">
                <div className='flex-1'>
                    <SearchBar
                        isOpen={true}
                        placeholder="Buscar citas..."
                        onChange={setSearchQuery}
                    />
                </div>
                <Button variant='outlined' onClick={() => setIsAddAppointmentDialogOpen(true)}>
                    Añadir Cita
                </Button>
            </section>

            <section className="flex flex-col gap-4 pb-20">
                {appointments
                    .filter(apt =>
                        (apt.guidance?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
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
            </section>

            <AppointmentDetailsDialog
                open={isAppointmentDialogOpen}
                onClose={() => setIsAppointmentDialogOpen(false)}
                appointment={selectedAppointment}
                applicantName={caseData.applicantName}
                onEdit={() => {
                    setIsAppointmentDialogOpen(false);
                    setIsEditAppointmentDialogOpen(true);
                }}
            />

            <AddAppointmentDialog
                open={isAddAppointmentDialogOpen}
                onClose={() => setIsAddAppointmentDialogOpen(false)}
                onAdd={async (data) => {
                    if (!caseData || !userContext.user) return;
                    try {
                        const newAppt: AppointmentDAO = {
                            idCase: caseData.idCase,
                            appointmentNumber: 0, // Backend auto-increments
                            plannedDate: data.plannedDate,
                            executionDate: data.executionDate,
                            status: "P", // Programada
                            guidance: data.guidance,
                            userId: userContext.user.identityCard,
                            registryDate: new Date()
                        };
                        await createNewAppointment(newAppt);
                        loadAppointments(Number(id));
                    } catch (error) {
                        console.error("Error creating appointment:", error);
                    }
                }}
            />

            <EditAppointmentDialog
                open={isEditAppointmentDialogOpen}
                onClose={() => setIsEditAppointmentDialogOpen(false)}
                appointment={selectedAppointment}
                onSave={async (idCase, appointmentNumber, data) => {
                    try {
                        await updateAppt(idCase, { ...data, appointmentNumber });
                        loadAppointments(Number(id));
                        setIsEditAppointmentDialogOpen(false);
                    } catch (error) {
                        console.error("Error updating appointment:", error);
                    }
                }}
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
                <Button variant='outlined' onClick={() => setIsAddSupportDialogOpen(true)}>
                    Añadir Recaudo
                </Button>
            </div>

            <div className="flex flex-col gap-4 pb-20">
                {supportDocuments
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
                onEdit={() => {
                    setIsSupportDialogOpen(false);
                    setIsEditSupportDialogOpen(true);
                }}
            />

            <AddSupportDocumentDialog
                open={isAddSupportDialogOpen}
                onClose={() => setIsAddSupportDialogOpen(false)}
                onAdd={async (data) => {
                    if (!caseData) return;
                    try {
                        const newDoc: SupportDocumentDAO = {
                            idCase: caseData.idCase,
                            supportNumber: 0, // Backend handles this
                            title: data.title,
                            description: data.description,
                            submissionDate: data.submissionDate,
                            fileUrl: data.fileUrl || ""
                        };
                        await createNewSupportDocument(newDoc);
                        loadSupportDocuments(Number(id));
                    } catch (error) {
                        console.error("Error creating support document:", error);
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
                        loadSupportDocuments(Number(id));
                        setIsEditSupportDialogOpen(false);
                    } catch (error) {
                        console.error("Error updating support document:", error);
                    }
                }}
            />
        </div>
    );

    const InvolucradosTabContent = (
        <div className="flex flex-col md:flex-row gap-8 h-full">
            <section className="flex-1 flex flex-col gap-8">
                <article>
                    <h4 className="text-label-small mb-4">Solicitante</h4>
                    <span className="flex items-center gap-3">
                        <User />
                        <p className="text-body-medium">{caseData.applicantName}</p>
                    </span>
                </article>

                <article>
                    <h4 className="text-label-small mb-4">Responsables</h4>
                    <div className="flex flex-col gap-4">
                        <section>
                            <header className="flex justify-between items-center mb-2">
                                <h5 className="text-body-large">Profesor</h5>
                                {permissionLevel < 3 && (
                                    <Button icon={<UserEdit />} variant="outlined" className='h-10' onClick={() => setIsTeacherSearchDialogOpen(true)}>
                                        Cambiar
                                    </Button>
                                )}
                            </header>
                            {caseData.teacherName ? (
                                <span className="flex items-center gap-3">
                                    <UserCircle />
                                    <p className="text-body-medium">{caseData.teacherName}</p>
                                </span>
                            ) : (
                                <p className="text-body-small">Sin Profesor Asignado</p>
                            )}
                        </section>
                        <section>
                            <header className="flex justify-between items-center mb-2">
                                <h5 className="text-body-large">Estudiantes</h5>
                                {permissionLevel < 3 && (
                                    <Button icon={<UserAdd />} variant="outlined" className='h-10' onClick={() => setIsStudentSearchDialogOpen(true)}>
                                        Asignar
                                    </Button>
                                )}
                            </header>
                            {
                                permissionLevel < 3 ? (
                                    <InBox>
                                        <ul>
                                            {caseStudents.map((student) => (
                                                <li key={student.identityCard} className="flex items-center gap-3 mb-2">
                                                    <UserCircle />
                                                    <p className="text-body-medium">{student.fullName}</p>
                                                    <CircleMinus />
                                                </li>
                                            ))}
                                        </ul>
                                    </InBox>
                                ) : (
                                    <>
                                        {caseStudents.length === 0 && (<p className="text-body-small">Sin Estudiantes Asignados</p>)}
                                        <ul>
                                            {caseStudents.map((student) => (
                                                <li key={student.identityCard} className="flex items-center gap-3 mb-2">
                                                    <UserCircle />
                                                    <p className="text-body-medium">{student.fullName}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )
                            }
                        </section>
                        <UserSearchDialog
                            open={isStudentSearchDialogOpen}
                            title="Buscar Estudiante"
                            placeholder="Buscar por nombre o cédula..."
                            onClose={() => setIsStudentSearchDialogOpen(false)}
                            users={students}
                            onSelect={() => { }}
                        />

                        <UserSearchDialog
                            open={isTeacherSearchDialogOpen}
                            title="Buscar Profesor"
                            placeholder="Buscar por nombre o cédula..."
                            onClose={() => setIsTeacherSearchDialogOpen(false)}
                            users={teachers}
                            onSelect={() => { }}
                        />
                    </div>
                </article>
            </section>

            <section className="flex-1 flex flex-col">
                <header className="flex justify-between items-center mb-4">
                    <h4 className="text-label-small ">Beneficiarios</h4>
                    <Button variant="outlined" className='h-10' onClick={() => { }}>Añadir</Button>
                </header>
                <InBox>
                    <div className="flex justify-between items-start">
                        <span className="text-body-medium ">Jose Luis Enrique Calderon</span>
                        <span className="text-body-small Variant">V-1231231231</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-body-medium ">Pedro Gallego Enrique Calderon</span>
                        <span className="text-body-small Variant">V-1231231231</span>
                    </div>
                </InBox>
            </section>
        </div>
    );

    const HistorialTabContent = (
        <div className="flex flex-col h-full gap-6">
            <section className="flex justify-between items-center gap-4">
                <div className='flex-1'>
                    <SearchBar
                        isOpen={true}
                        placeholder="Buscar acciones..."
                        onChange={() => { }}
                    />
                </div>
                <Button variant='outlined' onClick={() => { }}>
                    Añadir Acción
                </Button>
            </section>

            <section className="flex flex-col gap-4 pb-20">
                {caseActionsLoading && <LoadingSpinner />}
                {caseActionsError && <div className="text-error">Error al cargar las acciones: {caseActionsError.message}</div>}
                {
                    caseActions.length === 0 ? (
                        <span className="flex flex-col items-center justify-center gap-4 mt-20">
                            <p className="text-body-small">No hay acciones registradas para este caso.</p>
                        </span>
                    ) : (
                        caseActions.map((caseAction) => (
                            <CaseActionCard key={caseAction.id} caseAction={caseAction} />
                        ))
                    )
                }
            </section>


        </div>
    );

    return (
        <Box className='p-0!'>
            <header className="bg-surface/70 flex items-center justify-between px-4 rounded-xl h-16">
                <span className="flex gap-3 items-center">
                    <Clipboard className='size-6!' />
                    <div>
                        <h1 className="text-label-small">{caseData.compoundKey}</h1>
                        <p className="text-body-small"> <strong className='text-body-medium'>Fecha:</strong> {caseData.createdAt.toLocaleDateString("es-ES")}</p>
                    </div>
                </span>
                <span className="flex items-center gap-4 h-full">
                    {
                        isDataModified && <Button onClick={discardChanges} icon={<Close />} variant='outlined'>
                            Cancelar Cambios
                        </Button>
                    }
                    <Dropdown
                        label={localCaseData?.caseStatus}
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
                            <Button variant='resalted' className='w-32' onClick={saveChanges} disabled={updating}>Guardar</Button>
                        ) : (
                            <Button variant="outlined" className='w-32' onClick={() => { }} icon={<FilePdf />}>
                                Exportar
                            </Button>
                        )
                    }
                </span>
            </header>

            <section className="flex py-2">
                <Tabs selectedId={activeTab} onChange={(id) => setActiveTab(id as CaseInfoTabs)}>
                    <Tabs.Item id="General" label="General" icon={<Clipboard />} />
                    <Tabs.Item id="Involucrados" label="Involucrados" icon={<User />} />
                    <Tabs.Item id="Citas" label="Citas" icon={<CalendarMonth />} />
                    <Tabs.Item id="Recaudos" label="Recaudos" icon={<File />} />
                    <Tabs.Item id="Historial" label="Historial" icon={<Book />} />
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