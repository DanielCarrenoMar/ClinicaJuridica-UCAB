import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useGetBeneficiariesByCaseId, useGetCaseActionsByCaseId, useGetCaseById, useGetStudentsByCaseId, useUpdateCaseWithCaseModel, useGetAppointmentByCaseId, useGetSupportDocumentByCaseId, useSetBeneficiariesToCase, useSetStudentsToCase } from '#domain/useCaseHooks/useCase.ts';
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
import { Close, UserAdd, UserEdit } from 'flowbite-react-icons/outline';
import { type CaseModel } from '#domain/models/case.ts';
import InBox from '#components/InBox.tsx';
import { useAuth } from '../context/AuthContext';
import { createAppointment, updateAppointment, deleteAppointment } from '#domain/useCaseHooks/useAppointment.ts';
import type { AppointmentInfoDAO } from '#database/daos/appointmentInfoDAO.ts';
import { createSupportDocument, updateSupportDocument, deleteSupportDocument } from '#domain/useCaseHooks/useSupportDocument.ts';
import type { SupportDocumentDAO } from '#database/daos/supportDocumentDAO.ts';
import AddSupportDocumentDialog from '#components/dialogs/AddSupportDocumentDialog.tsx';
import EditSupportDocumentDialog from '#components/dialogs/EditSupportDocumentDialog.tsx';
import PersonSearchDialog from '#components/dialogs/PersonSearchDialog.tsx';
import PersonCard from '#components/PersonCard.tsx';
import { useGetAllStudents } from '#domain/useCaseHooks/useStudent.ts';
import { useGetAllTeachers } from '#domain/useCaseHooks/useTeacher.ts';
import AddAppointmentDialog from '#components/dialogs/AddAppointmentDialog.tsx';
import AddCaseActionDialog from '#components/dialogs/AddCaseActionDialog.tsx';
import CaseActionDetailsDialog from '#components/dialogs/CaseActionDetailsDialog.tsx';
import type { CaseActionInfoDAO } from '#database/daos/caseActionInfoDAO.ts';
import { createCaseAction } from '#domain/useCaseHooks/useCaseActions.ts';
import type { CaseActionModel } from '#domain/models/caseAction.ts';
import CaseActionCard from '#components/CaseActionCard.tsx';
import type { PersonModel } from '#domain/models/person.ts';
import { useCreateBeneficiary, useGetAllBeneficiaries } from '#domain/useCaseHooks/useBeneficiary.ts';
import CreateBeneficiaryDialog from '#components/dialogs/CreateBeneficiaryDialog.tsx';
import type { BeneficiaryDAO } from '#database/daos/beneficiaryDAO.ts';
import Fuse from 'fuse.js';
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

    const { user, permissionLevel } = useAuth()
    const { caseData, loading, error, loadCase } = useGetCaseById(Number(id));
    const { updateCase, loading: updating } = useUpdateCaseWithCaseModel(user!!.identityCard);
    const [activeTab, setActiveTab] = useState<CaseInfoTabs>("General");
    const { students: caseStudents, loadStudents: loadCaseStudents } = useGetStudentsByCaseId(Number(id));
    const { beneficiaries: caseBeneficiaries, loadBeneficiaries: loadCaseBeneficiaries } = useGetBeneficiariesByCaseId(Number(id));
    const { caseActions, loading: caseActionsLoading, error: caseActionsError, loadCaseActions } = useGetCaseActionsByCaseId(Number(id));
    const { setStudentsToCase } = useSetStudentsToCase()
    const { setBeneficiariesToCase } = useSetBeneficiariesToCase()
    const { createCaseAction: createAction } = createCaseAction();

    const { appointments, loadAppointments } = useGetAppointmentByCaseId(Number(id));
    const { createAppointment: createNewAppointment } = createAppointment();
    const { updateAppointment: updateAppt } = updateAppointment();
    const { deleteAppointment: deleteAppt } = deleteAppointment();

    const { students } = useGetAllStudents();
    const { teachers } = useGetAllTeachers();
    const { beneficiaries, refresh: refreshBeneficiaries } = useGetAllBeneficiaries();
    const { createBeneficiary } = useCreateBeneficiary();

    // Support Document Hooks
    const { supportDocument: supportDocuments, loadSupportDocuments } = useGetSupportDocumentByCaseId(Number(id));
    const { createSupportDocument: createNewSupportDocument } = createSupportDocument();
    const { updateSupportDocument: updateSupDocument } = updateSupportDocument();
    const { deleteSupportDocument: deleteSupDocument } = deleteSupportDocument();

    // Recaudos Tab State
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentModel | null>(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
    const [isEditAppointmentDialogOpen, setIsEditAppointmentDialogOpen] = useState(false);

    const [localCaseData, setLocalCaseData] = useState<CaseModel>();
    const [localCaseStudents, setLocalStudents] = useState<PersonModel[]>([]); // Local state for students
    const [localCaseBeneficiaries, setLocalBeneficiaries] = useState<PersonModel[]>([]); // Local state for beneficiaries
    const [isDataModified, setIsDataModified] = useState(false);

    // Citas Tab State
    const [searchQuery, setSearchQuery] = useState("");
    // Recaudos Tab State
    const [supportSearchQuery, setSupportSearchQuery] = useState("");
    // Historial Tab State
    const [caseActionSearchQuery, setCaseActionSearchQuery] = useState("");
    const [selectedSupportDocument, setSelectedSupportDocument] = useState<SupportDocumentModel | null>(null);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
    const [isAddSupportDialogOpen, setIsAddSupportDialogOpen] = useState(false);
    const [isEditSupportDialogOpen, setIsEditSupportDialogOpen] = useState(false);

    const [isStudentSearchDialogOpen, setIsStudentSearchDialogOpen] = useState(false);
    const [isTeacherSearchDialogOpen, setIsTeacherSearchDialogOpen] = useState(false);
    const [isBeneficiarySearchDialogOpen, setIsBeneficiarySearchDialogOpen] = useState(false);
    const [isCreateBeneficiaryDialogOpen, setIsCreateBeneficiaryDialogOpen] = useState(false);
    const [isAddCaseActionDialogOpen, setIsAddCaseActionDialogOpen] = useState(false);
    const [selectedCaseAction, setSelectedCaseAction] = useState<CaseActionModel | null>(null);
    const [isCaseActionDetailsDialogOpen, setIsCaseActionDetailsDialogOpen] = useState(false);

    useEffect(() => {
        if (!caseData) return
        setLocalCaseData(caseData);
        setLocalStudents(caseStudents);
        setLocalBeneficiaries(caseBeneficiaries);
    }, [caseData, caseStudents, caseBeneficiaries]);
    useEffect(() => {
        if (!localCaseData) return
        const hasChangesLocalData = JSON.stringify(localCaseData) !== JSON.stringify(caseData);
        setIsDataModified(hasChangesLocalData);
        const hasChangesStudents = JSON.stringify(localCaseStudents) !== JSON.stringify(caseStudents);
        const hasChangesBeneficiaries = JSON.stringify(localCaseBeneficiaries) !== JSON.stringify(caseBeneficiaries);
        setIsDataModified(prev => prev || hasChangesStudents || hasChangesBeneficiaries);
    }, [localCaseData, localCaseStudents, localCaseBeneficiaries, caseData, caseStudents, caseBeneficiaries]);

    function discardChanges() {
        setLocalCaseData(caseData || undefined);
        setLocalStudents(caseStudents);
        setLocalBeneficiaries(caseBeneficiaries);
    }
    async function saveChanges() {
        if (!localCaseData || !caseData) return;
        await setStudentsToCase(caseData.idCase, localCaseStudents.map(s => s.identityCard));
        await setBeneficiariesToCase(caseData.idCase, localCaseBeneficiaries.map(b => b.identityCard));
        await updateCase(caseData.idCase, localCaseData)
        loadCase(Number(id));
        loadCaseStudents(Number(id));
        loadCaseBeneficiaries(Number(id));
    }

    const handleChange = (updateField: Partial<CaseModel>) => {
        setLocalCaseData((prev: any) => ({ ...prev, ...updateField }));
    };

    const appointmentsFuse = useMemo(() => {
        return new Fuse(appointments, {
            keys: [
                { name: 'guidance', weight: 0.55 },
                { name: 'userName', weight: 0.25 },
                { name: 'status', weight: 0.2 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }, [appointments]);

    const visibleAppointments = useMemo(() => {
        const trimmed = searchQuery.trim();
        const filtered = trimmed.length === 0
            ? appointments
            : appointmentsFuse.search(trimmed).map(r => r.item);

        const rank = (status: AppointmentModel['status']) => status === 'Programada' ? 0 : 1;

        return filtered
            .map((appointment, index) => ({ appointment, index }))
            .sort((a, b) => rank(a.appointment.status) - rank(b.appointment.status) || a.index - b.index)
            .map(x => x.appointment);
    }, [appointments, appointmentsFuse, searchQuery]);

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

    const caseActionsFuse = useMemo(() => {
        return new Fuse(caseActions, {
            keys: [
                { name: 'description', weight: 0.6 },
                { name: 'notes', weight: 0.2 },
                { name: 'userName', weight: 0.2 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }, [caseActions]);

    const visibleCaseActions = useMemo(() => {
        const trimmed = caseActionSearchQuery.trim();
        if (trimmed.length === 0) return caseActions;
        return caseActionsFuse.search(trimmed).map(r => r.item);
    }, [caseActions, caseActionsFuse, caseActionSearchQuery]);

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
                    <Dropdown
                        selectedValue={localCaseData?.idCourt}
                        onSelectionChange={(val) => handleChange({ idCourt: val as number })}
                    >
                        <DropdownOption value={1}>Civil</DropdownOption>
                        <DropdownOption value={2}>Penal</DropdownOption>
                        <DropdownOption value={3}>Agrario</DropdownOption>
                        <DropdownOption value={4}>Contencioso Administrativo</DropdownOption>
                        <DropdownOption value={5}>Protección de niños, niñas y adolescentes</DropdownOption>
                        <DropdownOption value={6}>Laboral</DropdownOption>
                    </Dropdown>
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
                        variant='outline'
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
                {visibleAppointments
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
                onEdit={() => {
                    setIsAppointmentDialogOpen(false);
                    setIsEditAppointmentDialogOpen(true);
                }}
                onDelete={async () => {
                    if (!selectedAppointment) return;
                    try {
                        await deleteAppt(selectedAppointment.idCase, selectedAppointment.appointmentNumber);
                        loadAppointments(Number(id));
                        setIsAppointmentDialogOpen(false);
                        setSelectedAppointment(null);
                    } catch (error) {
                        console.error("Error deleting appointment:", error);
                    }
                }}
            />

            <AddAppointmentDialog
                open={isAddAppointmentDialogOpen}
                onClose={() => setIsAddAppointmentDialogOpen(false)}
                onAdd={async (data) => {
                    if (!caseData || !user) return;
                    try {
                        const newAppt: AppointmentInfoDAO = {
                            idCase: caseData.idCase,
                            appointmentNumber: 0, // Backend auto-increments
                            plannedDate: data.plannedDate,
                            executionDate: data.executionDate,
                            status: "P", // Programada
                            guidance: data.guidance,
                            userId: user.identityCard,
                            userName: user.fullName,
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
                        variant='outline'
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
            </div>

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
                        loadSupportDocuments(Number(id));
                        setIsSupportDialogOpen(false);
                        setSelectedSupportDocument(null);
                    } catch (error) {
                        console.error("Error deleting support document:", error);
                    }
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
                    <h4 className="text-label-small mb-2">Solicitante</h4>
                    <PersonCard
                        icon={<User />}
                        person={{ identityCard: String(caseData.applicantId), fullName: caseData.applicantName }}
                        to={`/solicitante/${caseData.applicantId}`}
                    />
                </article>

                <article>
                    <h4 className="text-label-small mb-2">Responsables</h4>
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
                            {localCaseData?.teacherName ? (
                                <PersonCard
                                    icon={<UserCircle />}
                                    person={{
                                        identityCard: String(localCaseData.teacherId ?? ''),
                                        fullName: localCaseData.teacherName,
                                    }}
                                />
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
                                        <ul className='flex flex-col gap-3'>
                                            {localCaseStudents.map((student) => (
                                                <li key={student.identityCard}>
                                                    <span className="flex items-center justify-between">
                                                        <PersonCard icon={<UserCircle />} person={student} />
                                                        <Button onClick={() => setLocalStudents((prev) => prev.filter(s => s.identityCard !== student.identityCard))} icon={<Close />} className='p-2!' variant='outlined'></Button>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </InBox>
                                ) : (
                                    <>
                                        {localCaseStudents.length === 0 && (<p className="text-body-small">Sin Estudiantes Asignados</p>)}
                                        <ul>
                                            {localCaseStudents.map((student) => (
                                                <li key={student.identityCard} className="mb-2">
                                                    <PersonCard icon={<UserCircle />} person={student} />
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )
                            }
                        </section>
                        <PersonSearchDialog
                            open={isStudentSearchDialogOpen}
                            title="Buscar Estudiante"
                            placeholder="Buscar por nombre o cédula..."
                            onClose={() => setIsStudentSearchDialogOpen(false)}
                            users={students.filter(s => !localCaseStudents.some(ls => ls.identityCard === s.identityCard))}
                            onSelect={(student) => { setLocalStudents((prev) => [...prev, student]) }}
                        />

                        <PersonSearchDialog
                            open={isTeacherSearchDialogOpen}
                            title="Buscar Profesor"
                            placeholder="Buscar por nombre o cédula..."
                            onClose={() => setIsTeacherSearchDialogOpen(false)}
                            users={teachers.filter(t => t.identityCard !== localCaseData?.teacherId)}
                            onSelect={(teacher) => { handleChange({ teacherId: teacher.identityCard }); handleChange({ teacherName: teacher.fullName }); }}
                        />
                    </div>
                </article>
            </section>

            <section className="flex-1 flex flex-col">
                <header className="flex justify-between items-center mb-4">
                    <h4 className="text-label-small ">Beneficiarios</h4>
                    {permissionLevel < 3 && (
                        <Button variant="outlined" className='h-10' onClick={() => setIsBeneficiarySearchDialogOpen(true)}>Añadir</Button>
                    )}
                </header>
                <InBox>
                    <ul className='flex flex-col gap-3'>
                        {localCaseBeneficiaries.length === 0 && (
                            <p className="text-body-small">Sin Beneficiarios Asignados</p>
                        )}
                        {localCaseBeneficiaries.map((beneficiary) => (
                            <li key={beneficiary.identityCard}>
                                <span className="flex items-center justify-between">
                                    <PersonCard icon={<UserCircle />} person={beneficiary} />
                                    <Button
                                        onClick={() => setLocalBeneficiaries((prev) => prev.filter(b => b.identityCard !== beneficiary.identityCard))}
                                        icon={<Close />}
                                        className='p-2!'
                                        variant='outlined'
                                    />
                                </span>
                            </li>
                        ))}
                    </ul>
                </InBox>

                <PersonSearchDialog
                    open={isBeneficiarySearchDialogOpen}
                    title="Buscar Beneficiario"
                    placeholder="Buscar por nombre o cédula..."
                    onClose={() => setIsBeneficiarySearchDialogOpen(false)}
                    users={beneficiaries.filter(b => !localCaseBeneficiaries.some(lb => lb.identityCard === b.identityCard) && b.identityCard !== caseData.applicantId)}
                    onSelect={(beneficiary) => {
                        setLocalBeneficiaries((prev) => [...prev, beneficiary]);
                    }}
                    headerItems={
                        <Button
                            variant='outlined'
                            onClick={() => {
                                setIsBeneficiarySearchDialogOpen(false);
                                setIsCreateBeneficiaryDialogOpen(true);
                            }}
                        >
                            Crear Nuevo
                        </Button>
                    }
                />

                <CreateBeneficiaryDialog
                    open={isCreateBeneficiaryDialogOpen}
                    onClose={() => setIsCreateBeneficiaryDialogOpen(false)}
                    onCreate={async (data: BeneficiaryDAO) => {
                        console.log("Creating beneficiary:", data);
                        const created = await createBeneficiary(data);
                        await refreshBeneficiaries();
                        if (created) {
                            setLocalBeneficiaries((prev) => [...prev, created]);
                        }
                    }}
                />
            </section>
        </div>
    );

    const HistorialTabContent = (
        <div className="flex flex-col h-full gap-6">
            <section className="flex justify-between items-center gap-4">
                <div className='flex-1'>
                    <SearchBar
                        variant='outline'
                        isOpen={true}
                        placeholder="Buscar acciones..."
                        onChange={setCaseActionSearchQuery}
                    />
                </div>
                <Button variant='outlined' onClick={() => setIsAddCaseActionDialogOpen(true)}>
                    Añadir Acción
                </Button>
            </section>

            <section className="flex flex-col gap-4 pb-20">
                {caseActionsLoading && <LoadingSpinner />}
                {caseActionsError && <div className="text-error">Error al cargar las acciones: {caseActionsError.message}</div>}
                {
                    visibleCaseActions.length === 0 ? (
                        <span className="flex flex-col items-center justify-center gap-4 mt-20">
                            <p className="text-body-small">No hay acciones registradas para este caso.</p>
                        </span>
                    ) : (
                        visibleCaseActions
                            .map((caseAction) => (
                                <CaseActionCard
                                    key={caseAction.actionNumber}
                                    caseAction={caseAction}
                                    onClick={() => {
                                        setSelectedCaseAction(caseAction);
                                        setIsCaseActionDetailsDialogOpen(true);
                                    }}
                                />
                            ))
                    )
                }
            </section>

            <AddCaseActionDialog
                open={isAddCaseActionDialogOpen}
                onClose={() => setIsAddCaseActionDialogOpen(false)}
                onAdd={async (actionData) => {
                    if (!caseData || !user) return;
                    try {
                        const newAction: CaseActionInfoDAO = {
                            idCase: caseData.idCase,
                            caseCompoundKey: caseData.compoundKey,
                            actionNumber: 0, // Backend auto-increments
                            description: actionData.description,
                            notes: actionData.notes,
                            userId: user.identityCard,
                            userName: user.fullName,
                            registryDate: new Date()
                        };
                        await createAction(newAction);
                        loadCaseActions(Number(id));
                    } catch (error) {
                        console.error("Error creating case action:", error);
                    }
                }}
            />

            <CaseActionDetailsDialog
                open={isCaseActionDetailsDialogOpen}
                onClose={() => setIsCaseActionDetailsDialogOpen(false)}
                caseAction={selectedCaseAction}
            />

        </div>
    );

    return (
        <Box className='p-0! h-full overflow-y-auto'>
            <header className="bg-surface/70 flex items-center justify-between px-4 rounded-xl h-16">
                <span className="flex gap-3 items-center">
                    <Clipboard className='size-6!' />
                    <div>
                        <h1 className="text-label-small">{caseData.compoundKey}</h1>
                        <span className='flex gap-2'>
                            <p className="text-body-small"> <strong className='text-body-medium'>Fecha:</strong> {caseData.createdAt.toLocaleDateString("es-ES")}</p>
                            <p className="text-body-small"> <strong className='text-body-medium'>Term:</strong> {caseData.term}</p>
                        </span>
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
                        onSelectionChange={(val) => handleChange({ caseStatus: val as CaseStatusTypeModel })}
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

            <section className="px-4 pb-6 flex flex-col">
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