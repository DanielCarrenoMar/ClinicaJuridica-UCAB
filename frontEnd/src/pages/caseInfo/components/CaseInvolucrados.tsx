import { useState } from 'react';
import Button from '#components/Button.tsx';
import InBox from '#components/InBox.tsx';
import PersonCard from '#components/PersonCard.tsx';
import PersonSearchDialog from '#components/dialogs/PersonSearchDialog.tsx';
import CreateBeneficiaryDialog from '#components/dialogs/CreateBeneficiaryDialog.tsx';
import BeneficiaryRelationshipDialog from '#components/dialogs/BeneficiaryRelationshipDialog.tsx';
import BeneficiaryCard from '#components/BeneficiaryCard.tsx';
import { User, UserCircle } from 'flowbite-react-icons/solid';
import { Close, UserAdd, UserEdit } from 'flowbite-react-icons/outline';
import type { CaseModel } from '#domain/models/case.ts';
import type { PersonModel } from '#domain/models/person.ts';
import type { CaseBeneficiaryModel } from '#domain/models/caseBeneficiary.ts';
import type { CaseBeneficiaryTypeModel } from '#domain/typesModel.ts';
import type { BeneficiaryDAO } from '#database/daos/beneficiaryDAO.ts';
import { useGetAllStudents } from '#domain/useCaseHooks/useStudent.ts';
import { useGetAllTeachers } from '#domain/useCaseHooks/useTeacher.ts';
import { useCreateBeneficiary, useGetAllBeneficiaries } from '#domain/useCaseHooks/useBeneficiary.ts';
import { useNotifications } from '#/context/NotificationsContext';

interface CaseInvolucradosProps {
    caseId: number;
    caseData: CaseModel;
    localCaseData?: CaseModel;
    localCaseStudents: PersonModel[];
    setLocalStudents: (value: PersonModel[] | ((prev: PersonModel[]) => PersonModel[])) => void;
    localCaseBeneficiaries: CaseBeneficiaryModel[];
    setLocalBeneficiaries: (value: CaseBeneficiaryModel[] | ((prev: CaseBeneficiaryModel[]) => CaseBeneficiaryModel[])) => void;
    permissionLevel: number;
    onChange: (updateField: Partial<CaseModel>) => void;
}

export default function CaseInvolucrados({
    caseId,
    caseData,
    localCaseData,
    localCaseStudents,
    setLocalStudents,
    localCaseBeneficiaries,
    setLocalBeneficiaries,
    permissionLevel,
    onChange
}: CaseInvolucradosProps) {
    const { notyError } = useNotifications();
    const { students } = useGetAllStudents();
    const { teachers } = useGetAllTeachers();
    const { beneficiaries, refresh: refreshBeneficiaries } = useGetAllBeneficiaries();
    const { createBeneficiary } = useCreateBeneficiary();

    const [isStudentSearchDialogOpen, setIsStudentSearchDialogOpen] = useState(false);
    const [isTeacherSearchDialogOpen, setIsTeacherSearchDialogOpen] = useState(false);
    const [isBeneficiarySearchDialogOpen, setIsBeneficiarySearchDialogOpen] = useState(false);
    const [isCreateBeneficiaryDialogOpen, setIsCreateBeneficiaryDialogOpen] = useState(false);
    const [isBeneficiaryRelationshipDialogOpen, setIsBeneficiaryRelationshipDialogOpen] = useState(false);
    const [pendingCaseBeneficiary, setPendingCaseBeneficiary] = useState<PersonModel | null>(null);

    function handleSelectCaseBeneficiary(person: PersonModel) {
        setPendingCaseBeneficiary(person);
        setIsBeneficiarySearchDialogOpen(false);
        setIsBeneficiaryRelationshipDialogOpen(true);
    }

    async function handleCreateCaseBeneficiary(beneficiaryDao: BeneficiaryDAO) {
        try {
            const created = await createBeneficiary(beneficiaryDao);
            if (!created) {
                throw new Error("Failed to create beneficiary");
            }
            await refreshBeneficiaries();
            handleSelectCaseBeneficiary(created);
        } catch (error: any) {
            notyError(error.message || "Error al crear el beneficiario");
            console.error("Error creating beneficiary:", error);
        }
    }

    function handleAddCaseBeneficiary(type: CaseBeneficiaryTypeModel, relationship: string, description: string) {
        if (!pendingCaseBeneficiary) return;

        const newCaseBeneficiary: CaseBeneficiaryModel = {
            ...pendingCaseBeneficiary,
            idCase: caseId,
            caseType: type,
            relationship: relationship.trim(),
            description: description.trim(),
        };

        setLocalBeneficiaries((prev) => [...prev, newCaseBeneficiary]);

        setPendingCaseBeneficiary(null);
        setIsBeneficiaryRelationshipDialogOpen(false);
    }

    return (
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

                <article className="flex-1 flex flex-col min-h-0">
                    <h4 className="text-label-small mb-2">Responsables</h4>
                    <div className="flex flex-col gap-4 flex-1 min-h-0">
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
                                <span className="flex items-center justify-between">
                                    <PersonCard
                                        icon={<UserCircle />}
                                        to={`/usuario/${localCaseData.teacherId}`}
                                        person={{
                                            identityCard: String(localCaseData.teacherId ?? ''),
                                            fullName: localCaseData.teacherName,
                                        }}
                                    />
                                    {permissionLevel < 3 && (
                                        <Button
                                            onClick={() => {
                                                onChange({ teacherId: undefined });
                                                onChange({ teacherName: undefined });
                                            }}
                                            icon={<Close />}
                                            className='p-2!'
                                            variant='outlined'
                                        />
                                    )}
                                </span>
                            ) : (
                                <p className="text-body-small">Sin Profesor Asignado</p>
                            )}
                        </section>
                        <section className="flex-1 flex flex-col min-h-0">
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
                                    <InBox className="flex-1 min-h-0 overflow-y-auto">
                                        <ul className='flex flex-col gap-3'>
                                            {localCaseStudents.map((student) => (
                                                <li key={student.identityCard}>
                                                    <span className="flex items-center justify-between">
                                                        <PersonCard to={`/usuario/${student.identityCard}`} icon={<UserCircle />} person={student} />
                                                        <Button onClick={() => setLocalStudents((prev) => prev.filter(s => s.identityCard !== student.identityCard))} icon={<Close />} className='p-2!' variant='outlined'></Button>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </InBox>
                                ) : (
                                    <InBox className="flex-1 min-h-0 overflow-y-auto">
                                        {localCaseStudents.length === 0 && (<p className="text-body-small">Sin Estudiantes Asignados</p>)}
                                        <ul className='flex flex-col gap-3'>
                                            {localCaseStudents.map((student) => (
                                                <li key={student.identityCard}>
                                                    <PersonCard to={`/usuario/${student.identityCard}`} icon={<UserCircle />} person={student} />
                                                </li>
                                            ))}
                                        </ul>
                                    </InBox>
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
                            onSelect={(teacher) => {
                                onChange({ teacherId: teacher.identityCard });
                                onChange({ teacherName: teacher.fullName });
                                setIsTeacherSearchDialogOpen(false);
                            }}
                        />
                    </div>
                </article>
            </section>

            <section className="flex-1 flex flex-col">
                <header className="flex justify-between items-center mb-4">
                    <h4 className="text-label-small flex gap-2 items-center">
                        Beneficiarios:
                        <span className="bg-surface-container text-onSurface-variant px-2 py-0.5 rounded-full text-[15px] font-bold">
                            {localCaseBeneficiaries.length}
                        </span>
                    </h4>
                    <Button variant="outlined" className='h-10' onClick={() => setIsBeneficiarySearchDialogOpen(true)}>Añadir</Button>
                </header>
                <InBox className="flex-1 min-h-0 overflow-y-auto">
                    <ul className='flex flex-col gap-3'>
                        {localCaseBeneficiaries.length === 0 && (
                            <p className="text-body-small">Sin Beneficiarios Asignados</p>
                        )}
                        {localCaseBeneficiaries.map((beneficiary) => (
                            <li key={beneficiary.identityCard}>
                                <span className="flex items-center justify-between">
                                    <BeneficiaryCard to={`/solicitante/${beneficiary.identityCard}`} icon={<UserCircle />} beneficiary={beneficiary} />
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
                    onSelect={handleSelectCaseBeneficiary}
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
                    onClose={() => { setIsCreateBeneficiaryDialogOpen(false); setIsBeneficiarySearchDialogOpen(true); }}
                    onCreate={handleCreateCaseBeneficiary}
                />

                <BeneficiaryRelationshipDialog
                    open={isBeneficiaryRelationshipDialogOpen}
                    onClose={() => {
                        setIsBeneficiaryRelationshipDialogOpen(false);
                        setIsBeneficiarySearchDialogOpen(true);
                        setPendingCaseBeneficiary(null);
                    }}
                    onCreate={(data) => {
                        handleAddCaseBeneficiary(data.type, data.relationship, data.description);
                    }}
                />
            </section>
        </div>
    );
}
