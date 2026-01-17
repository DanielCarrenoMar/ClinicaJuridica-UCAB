import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useGetBeneficiariesByCaseId, useGetCaseById, useGetStudentsByCaseId, useUpdateCaseWithCaseModel, useSetBeneficiariesToCase, useSetStudentsToCase } from '#domain/useCaseHooks/useCase.ts';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';
import Tabs from '#components/Tabs.tsx';
import Box from '#components/Box.tsx';
import Dropdown from '#components/Dropdown/Dropdown.tsx'; // Changed from TitleDropdown to Dropdown for better alignment control
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import { Clipboard, User, CalendarMonth, Book, File } from 'flowbite-react-icons/solid';
import { type CaseStatusTypeModel } from '#domain/typesModel.ts';
import { Close, FilePdf } from 'flowbite-react-icons/outline';
import { type CaseModel } from '#domain/models/case.ts';
import { useAuth } from '../../context/AuthContext';
import type { PersonModel } from '#domain/models/person.ts';
import { caseBeneficiaryModelToDao, type CaseBeneficiaryModel } from '#domain/models/caseBeneficiary.ts';
import { useNotifications } from '#/context/NotificationsContext';
import CaseGeneral from '#pages/caseInfo/components/CaseGeneral.tsx';
import CaseAppointments from '#pages/caseInfo/components/CaseAppointments.tsx';
import CaseSupportDocuments from '#pages/caseInfo/components/CaseSupportDocuments.tsx';
import CaseHistory from '#pages/caseInfo/components/CaseHistory.tsx';
import CaseInvolucrados from '#pages/caseInfo/components/CaseInvolucrados.tsx';
const STATUS_COLORS: Record<CaseStatusTypeModel, string> = {
    "Abierto": "bg-success! text-white border-0",
    "En Espera": "bg-warning! text-white border-0",
    "Pausado": "bg-onSurface! text-white border-0",
    "Cerrado": "bg-error! text-white border-0"
};

type CaseInfoTabs = "General" | "Involucrados" | "Citas" | "Recaudos" | "Historial";

const VALID_TABS: CaseInfoTabs[] = ["General", "Involucrados", "Citas", "Recaudos", "Historial"];

export default function CaseInfo() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const safeId = Number(id) || 0;

    const { user, permissionLevel } = useAuth()
    const { notyError } = useNotifications()
    const { caseData, loading, error, loadCase } = useGetCaseById(safeId);
    const { updateCase, loading: updating } = useUpdateCaseWithCaseModel(user?.identityCard || "");

    // Leer el parámetro 'tab' de la URL, validar que sea una tab válida
    const tabFromUrl = searchParams.get('tab') as CaseInfoTabs | null;
    const initialTab = tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "General";
    const [activeTab, setActiveTab] = useState<CaseInfoTabs>(initialTab);
    const { students: caseStudents, loadStudents: loadCaseStudents } = useGetStudentsByCaseId(safeId);
    const { beneficiaries: caseBeneficiaries, loadBeneficiaries: loadCaseBeneficiaries } = useGetBeneficiariesByCaseId(safeId);
    const { setStudentsToCase } = useSetStudentsToCase()
    const { setBeneficiariesToCase } = useSetBeneficiariesToCase()

    const [localCaseData, setLocalCaseData] = useState<CaseModel>();
    const [localCaseStudents, setLocalStudents] = useState<PersonModel[]>([]); // Local state for students
    const [localCaseBeneficiaries, setLocalBeneficiaries] = useState<CaseBeneficiaryModel[]>([]);
    const [isDataModified, setIsDataModified] = useState(false);

    // Actualizar la tab cuando cambie el parámetro de la URL
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') as CaseInfoTabs | null;
        if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

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
        try {
            await setStudentsToCase(caseData.idCase, localCaseStudents.map(s => s.identityCard));
            await setBeneficiariesToCase(caseData.idCase, localCaseBeneficiaries.map(caseBeneficiaryModelToDao));
            await updateCase(caseData.idCase, localCaseData)
            loadCase(safeId);
            loadCaseStudents(safeId);
            loadCaseBeneficiaries(safeId);
            setIsDataModified(false);
        } catch (e: any) {
            notyError(e.message || "Error al guardar los cambios");
            console.error(e);
        }
    }

    const handleChange = (updateField: Partial<CaseModel>) => {
        setLocalCaseData((prev: any) => ({ ...prev, ...updateField }));
    };


    if (!id) return <div className="text-error">ID del caso no proporcionado en la URL.</div>;
    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (error) return <div className="text-error">Error al cargar el caso: {error.message}</div>;
    if (!caseData) return <div className="">No se encontró el caso</div>;

    const getStatusColor = (status: CaseStatusTypeModel) => STATUS_COLORS[status] || "bg-surface ";


    return (
        <Box className='p-0! min-h-full flex flex-col h-full'>
            <header className="bg-surface/70 flex items-center justify-between px-4 rounded-t-xl h-16">
                <span className="flex gap-3 items-center">
                    <Clipboard className='size-6!' />
                    <div>
                        <h1 className="text-label-small">{caseData.compoundKey}</h1>
                        <span className='flex gap-2'>
                            <p className="text-body-small"> <strong className='text-body-medium'>Fecha Creación:</strong> {caseData.createdAt.toLocaleDateString("es-ES")}</p>
                            <p className="text-body-small"> <strong className='text-body-medium'>Term:</strong> {caseData.term}</p>
                        </span>
                    </div>
                </span>
                <span className="flex items-center gap-4">
                    {
                        isDataModified && <Button onClick={discardChanges} icon={<Close />} variant='outlined'>
                            Cancelar Cambios
                        </Button>
                    }
                    <div>
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
                    </div>
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

            <section className="px-4 pb-6 flex flex-col min-h-0 flex-1">
                {activeTab === 'General' && (
                    <CaseGeneral
                        caseData={caseData}
                        localCaseData={localCaseData}
                        onChange={handleChange}
                    />
                )}
                {activeTab === 'Citas' && (
                    <CaseAppointments
                        caseId={caseData.idCase}
                        applicantName={caseData.applicantName}
                        user={user}
                    />
                )}
                {activeTab === 'Recaudos' && (
                    <CaseSupportDocuments
                        caseId={caseData.idCase}
                    />
                )}
                {activeTab === 'Involucrados' && (
                    <CaseInvolucrados
                        caseId={caseData.idCase}
                        caseData={caseData}
                        localCaseData={localCaseData}
                        localCaseStudents={localCaseStudents}
                        setLocalStudents={setLocalStudents}
                        localCaseBeneficiaries={localCaseBeneficiaries}
                        setLocalBeneficiaries={setLocalBeneficiaries}
                        permissionLevel={permissionLevel}
                        onChange={handleChange}
                    />
                )}
                {activeTab === 'Historial' && (
                    <CaseHistory
                        caseId={caseData.idCase}
                        caseCompoundKey={caseData.compoundKey}
                        user={user}
                    />
                )}
            </section >
        </Box>
    );
}