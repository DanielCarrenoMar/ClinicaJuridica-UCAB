import TitleDropdown from "#components/TitleDropdown.tsx";
import { User, UserEdit } from "flowbite-react-icons/solid";
import { useCaseOutletContext } from "./CreateCase.tsx";
import TextInput from "#components/TextInput.tsx";
import Button from "#components/Button.tsx";
import Dropdown from "#components/Dropdown/Dropdown.tsx";
import { useNavigate } from "react-router";
import { ChevronRight, Close } from "flowbite-react-icons/outline";
import { useEffect, useState } from "react";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import type { ProcessTypeDAO } from "#database/typesDAO.ts";

import InBox from "#components/InBox.tsx";
import PersonSearchDialog from "#components/dialogs/PersonSearchDialog.tsx";
import CreateBeneficiaryDialog from "#components/dialogs/CreateBeneficiaryDialog.tsx";
import { useCreateBeneficiary, useGetAllBeneficiaries } from "#domain/useCaseHooks/useBeneficiary.ts";
import { UserCircle } from "flowbite-react-icons/solid";
import type { BeneficiaryDAO } from "#database/daos/beneficiaryDAO.ts";

import { subjectsData } from "#domain/seedData.ts";
import PersonCard from "#components/PersonCard.tsx";
import BeneficiaryRelationshipDialog from "#components/dialogs/BeneficiaryRelationshipDialog.tsx";
import type { PersonModel } from "#domain/models/person.ts";
import type { CaseBeneficiaryTypeModel } from "#domain/typesModel.ts";
import type { CaseBeneficiaryModel } from "#domain/models/caseBeneficiary.ts";
import BeneficiaryCard from "#components/BeneficiaryCard.tsx";

function getLegalAreaId(subjectIdx: number, catIdx: number, areaIdx: number): number {
    let id = 0;
    for (let s = 0; s < subjectsData.length; s++) {
        for (let c = 0; c < subjectsData[s].categories.length; c++) {
            if (s === subjectIdx && c === catIdx) {
                return id + areaIdx + 1;
            }
            id += subjectsData[s].categories[c].legalAreas.length;
        }
    }
    return 0;
}

function CreateCaseCaseStep() {
    const navigate = useNavigate();
    const { applicantModel, caseDAO, updateCaseDAO, caseBeneficiaries, setCaseBeneficiaries, submitCreateCase, isSubmittingCreateCase } = useCaseOutletContext();
    const { beneficiaries, refresh: refreshBeneficiaries } = useGetAllBeneficiaries();
    const { createBeneficiary } = useCreateBeneficiary();

    const [subjectIndex, setSubjectIndex] = useState<number | null>(null);
    const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
    const [isBeneficiarySearchDialogOpen, setIsBeneficiarySearchDialogOpen] = useState(false);
    const [isCreateBeneficiaryDialogOpen, setIsCreateBeneficiaryDialogOpen] = useState(false);
    const [isBeneficiaryRelationshipDialogOpen, setIsBeneficiaryRelationshipDialogOpen] = useState(false);
    const [pendingCaseBeneficiary, setPendingCaseBeneficiary] = useState<PersonModel | null>(null);

    function handleSelectCaseBeneficiary(person: PersonModel) {
        setPendingCaseBeneficiary(person);
        setIsBeneficiarySearchDialogOpen(false);
        setIsBeneficiaryRelationshipDialogOpen(true);
    }

    function handleAddCaseBeneficiary(type: CaseBeneficiaryTypeModel, relationship: string, description: string) {
        if (!pendingCaseBeneficiary) return;

        const newCaseBeneficiary: CaseBeneficiaryModel = {
            ...pendingCaseBeneficiary,
            idCase: 0,
            caseType: type,
            relationship: relationship.trim(),
            description: description.trim(),
        };

        setCaseBeneficiaries((prev) => [...prev, newCaseBeneficiary]);
        setPendingCaseBeneficiary(null);
        setIsBeneficiaryRelationshipDialogOpen(false);
    }

    useEffect(() => {
        if (!applicantModel.identityCard) {
            navigate("/crearCaso/solicitante");
        }
    }, []);

    const isFormValid =
        (caseDAO.idLegalArea || 0) !== 0 &&
        !!caseDAO.idNucleus &&
        !!caseDAO.processType &&
        !!caseDAO.problemSummary &&
        caseDAO.problemSummary.trim().length > 0;

    return (
        <>
            <header className="bg-surface/70 flex items-center justify-between rounded-t-xl px-4 h-16 shrink-0">
                <div className="flex items-center gap-2.5">
                    <UserEdit className="size-8!" />
                    <h1 className="text-label-medium">Caso</h1>
                </div>
                <div className="flex items-end gap-2.5">
                    <Button onClick={() => { navigate("/crearCaso/solicitante"); }} variant="outlined" icon={<UserEdit />} className="h-10 w-28">Volver</Button>
                    <Button onClick={submitCreateCase} variant="resalted" icon={<ChevronRight />} disabled={isSubmittingCreateCase || !isFormValid} className="w-32">Aceptar</Button>
                </div>
            </header>
            <div className="px-4 py-2 flex flex-col gap-4 overflow-y-auto">
                <article className="grid grid-cols-4 grid-rows-4 gap-y-4 h-98">
                    <section className="col-span-2">
                        <h3 className="text-label-small mb-2">
                            Solicitante
                        </h3>
                        <span className="flex items-center gap-2">
                            <PersonCard person={applicantModel} icon={<User />} />
                        </span>
                    </section>
                    <section className="col-span-2 row-span-4 flex flex-col">
                        <header className="flex justify-between items-center w-full mb-2">
                            <h3 className="text-label-small mb-2">
                                Beneficiarios
                            </h3>
                            <Button variant="outlined" className="h-10" onClick={() => setIsBeneficiarySearchDialogOpen(true)}>Añadir</Button>
                        </header>
                        <InBox className="flex-1">
                            <ul className='flex flex-col gap-3'>
                                {caseBeneficiaries.length === 0 && (
                                    <p className="text-body-small">Sin Beneficiarios Asignados</p>
                                )}
                                {caseBeneficiaries.map((beneficiary) => (
                                    <li key={beneficiary.identityCard}>
                                        <span className="flex items-center justify-between">
                                            <BeneficiaryCard beneficiary={beneficiary} icon={<UserCircle />} />
                                            <Button
                                                onClick={() => setCaseBeneficiaries((prev) => prev.filter(b => b.identityCard !== beneficiary.identityCard))}
                                                icon={<Close />}
                                                className='p-2!'
                                                variant='outlined'
                                            />
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </InBox>
                    </section>
                    <section className="flex gap-3 col-span-2">
                        <TitleDropdown
                            label="Tipo de tramite*"
                            selectedValue={caseDAO.processType}
                            onSelectionChange={(value) => { updateCaseDAO({ processType: value as ProcessTypeDAO }); }}
                        >
                            <DropdownOption value="T">Trámite</DropdownOption>
                            <DropdownOption value="A">Asesoría</DropdownOption>
                            <DropdownOption value="CM">Conciliación/Mediación</DropdownOption>
                            <DropdownOption value="R">Redacción</DropdownOption>
                        </TitleDropdown>
                        <TitleDropdown
                            label="Nucleo*"
                            selectedValue={caseDAO.idNucleus}
                            onSelectionChange={(value) => { updateCaseDAO({ idNucleus: value as string }) }}
                        >
                            <DropdownOption value="GUAYANA">GUAYANA</DropdownOption>
                        </TitleDropdown>
                    </section>
                    <section className="col-span-2 row-span-3">
                        <h4 className="text-body-large mb-2">
                            Ambito Legal*
                        </h4>
                        <span className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Materia</span>
                                <Dropdown
                                    selectedValue={subjectIndex ?? undefined}
                                    onSelectionChange={(value) => {
                                        setSubjectIndex(value as number);
                                        setCategoryIndex(null);
                                        updateCaseDAO({ idLegalArea: 0 });
                                    }}
                                >
                                    {subjectsData.map((subject, index) => (
                                        <DropdownOption key={index} value={index}>{subject.name}</DropdownOption>
                                    ))}
                                </Dropdown>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Categoria</span>
                                <Dropdown
                                    selectedValue={categoryIndex ?? undefined}
                                    onSelectionChange={(value) => { setCategoryIndex(value as number); }}
                                    disabled={subjectIndex === null}
                                >
                                    {subjectIndex !== null && subjectsData[subjectIndex].categories.map((category, index) => (
                                        <DropdownOption key={index} value={index}>{category.name}</DropdownOption>
                                    ))}
                                </Dropdown>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Área</span>
                                <Dropdown
                                    selectedValue={caseDAO.idLegalArea || undefined}
                                    onSelectionChange={(value) => { updateCaseDAO({ idLegalArea: value as number }) }}
                                    disabled={categoryIndex === null}
                                >
                                    {subjectIndex !== null && categoryIndex !== null && subjectsData[subjectIndex].categories[categoryIndex].legalAreas.map((area, index) => (
                                        <DropdownOption key={index} value={getLegalAreaId(subjectIndex!, categoryIndex!, index)}>{area}</DropdownOption>
                                    ))}
                                </Dropdown>
                            </div>
                        </span>
                    </section>
                </article>
                <PersonSearchDialog
                    open={isBeneficiarySearchDialogOpen}
                    title="Buscar Beneficiario"
                    placeholder="Buscar por nombre o cédula..."
                    onClose={() => setIsBeneficiarySearchDialogOpen(false)}
                    users={beneficiaries.filter(b => !caseBeneficiaries.some(cb => cb.identityCard === b.identityCard) && b.identityCard !== applicantModel.identityCard)}
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
                    onCreate={async (data: BeneficiaryDAO) => {
                        const created = await createBeneficiary(data);
                        await refreshBeneficiaries();
                        if (created) {
                            handleSelectCaseBeneficiary(created);
                        }
                    }}
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
                <article>
                    <header className="flex justify-between items-center w-full">
                        <h3 className="text-label-small mb-2">
                            Sintesis del problema*
                        </h3>
                    </header>

                    <TextInput
                        defaultText={caseDAO.problemSummary}
                        onChangeText={(text) => { updateCaseDAO({ problemSummary: text }); }}
                        multiline={true}
                        rows={8}
                        placeholder="Detalle o descripcion del problema"
                    />
                </article>
                <footer className="h-72"></footer>
            </div>
        </>
    );
}

export default CreateCaseCaseStep;
