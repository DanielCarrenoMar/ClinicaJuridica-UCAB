import TitleDropdown from "#components/TitleDropdown.tsx";
import { User, UserEdit } from "flowbite-react-icons/solid";
import { useCaseOutletContext } from "./CreateCase.tsx";
import TextInput from "#components/TextInput.tsx";
import Button from "#components/Button.tsx";
import Dropdown from "#components/Dropdown/Dropdown.tsx";
import { useNavigate } from "react-router";
import { ChevronRight } from "flowbite-react-icons/outline";
import { useEffect } from "react";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import type { ProcessTypeDAO } from "#database/typesDAO.ts";
import { useCreateCase } from "#domain/useCaseHooks/useCase.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
import { useCreateApplicant } from "#domain/useCaseHooks/useApplicant.ts";

function CreateCaseCaseStep() {
    const navigate = useNavigate();
    const { applicantModel, caseDAO, updateCaseDAO, isApplicantExisting } = useCaseOutletContext();
    const { createCase, error: createCaseError, loading: createCaseLoading } = useCreateCase();
    const { createApplicant, error: createApplicantError, loading: createApplicantLoading } = useCreateApplicant();

    function handleCreateCase(){
        let createdApplicant = applicantModel
        if (!isApplicantExisting){
            createApplicant(applicantModel).then((createdApplicant) => {
                if (!createdApplicant) {
                    throw new Error("Applicant creation failed. Applicant is null.");
                }
                createdApplicant = createdApplicant;
            })
            .catch((error) => {
                console.error("Error creating applicant", error);
            });
        }
        const caseToCreate: CaseDAO = {
            ...caseDAO,
            applicantId: createdApplicant.identityCard,
            userId: 16000001, // TODO: Replace with actual user ID from auth context
        };
        console.log("Creating case with data:", caseToCreate);
        createCase(caseToCreate)
        .then((createdCase) => {
            if (createdCase) navigate(`/caso/${createdCase.idCase}`);
            else throw new Error("Case creation failed. Case is null.");
        })
        .catch((error) => {
            console.error("Error creating case", error);
        });
    }

    useEffect(() => {
        if (!applicantModel.identityCard) {
            navigate("/crearCaso/solicitante");
        }
    }, []);

    return (
        <>
            <header className="bg-surface/70 flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-2.5">
                    <UserEdit className="size-8!" />
                    <h1 className="text-label-medium">Caso</h1>
                </div>
                <div className="flex items-end gap-2.5">
                    <Button onClick={() => { navigate("/crearCaso/solicitante"); }} variant="outlined" icon={<UserEdit />} className="h-10 w-28">Volver</Button>
                    <Button onClick={handleCreateCase} variant="resalted" icon={<ChevronRight />} disabled={createCaseLoading || createApplicantLoading} className="w-32">Aceptar</Button>
                </div>
            </header>
            <div className="px-4 py-2 flex flex-col gap-4">
                <article className="grid grid-cols-4 grid-rows-4 gap-y-4 h-98">
                    <section className="col-span-2">
                        <h3 className="text-label-small mb-2">
                            Solicitante
                        </h3>
                        <span className="flex items-center gap-2">
                            <User />
                            <p className="text-body-small">
                                <strong className="text-body-medium">{applicantModel.fullName} </strong>
                                {`${applicantModel.idNationality}-${applicantModel.identityCard}`}
                            </p>
                        </span>
                    </section>
                    <section className="col-span-2 row-span-2 flex flex-col">
                        <header className="flex justify-between items-center w-full mb-2">
                            <h3 className="text-label-small mb-2">
                                Beneficiarios
                            </h3>
                            <Button variant="outlined" className="h-10">Añadir</Button>
                        </header>
                        <div className="bg-surface rounded-xl border border-onSurface flex-1">

                        </div>
                    </section>
                    <section className="flex gap-3 col-span-2">
                        <TitleDropdown
                            label="Tipo de tramite"
                            selectedValue={caseDAO.processType}
                            onSelectionChange={(value) => { updateCaseDAO({ processType: value as ProcessTypeDAO }); }}
                        >
                            <DropdownOption value="T">Trámite</DropdownOption>
                            <DropdownOption value="A">Asesoría</DropdownOption>
                            <DropdownOption value="CM">Conciliación/Mediación</DropdownOption>
                            <DropdownOption value="R">Redacción</DropdownOption>
                        </TitleDropdown>
                        <TitleDropdown
                            label="Nucleo"
                            selectedValue={caseDAO.idNucleus}
                            onSelectionChange={(value) => { updateCaseDAO({ idNucleus: value as string }) }}
                        >
                            <DropdownOption value="GUAYANA">GUAYANA</DropdownOption>
                        </TitleDropdown>
                    </section>
                    <section className="col-span-2 row-span-3">
                        <h4 className="text-body-large mb-2">
                            Ambito Legal
                        </h4>
                        <span className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Materia</span>
                                <Dropdown
                                    selectedValue={caseDAO.idLegalArea}
                                    //onSelectionChange={(value) => {  }}
                                >
                                    <DropdownOption value={1}>Civil</DropdownOption>
                                    <DropdownOption value={2}>Penal</DropdownOption>
                                    <DropdownOption value={3}>Laboral</DropdownOption>
                                    <DropdownOption value={4}>Familia</DropdownOption>
                                </Dropdown>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Categoria</span>
                                <Dropdown
                                    selectedValue={caseDAO.idLegalArea}
                                    //onSelectionChange={(value) => { }}
                                >
                                    <DropdownOption value={1}>Civil</DropdownOption>
                                    <DropdownOption value={2}>Penal</DropdownOption>
                                    <DropdownOption value={3}>Laboral</DropdownOption>
                                    <DropdownOption value={4}>Familia</DropdownOption>
                                </Dropdown>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Área</span>
                                <Dropdown
                                    selectedValue={caseDAO.idLegalArea}
                                    onSelectionChange={(value) => { updateCaseDAO({ idLegalArea: value as number }) }}
                                >
                                    <DropdownOption value={1}>Rectificación de Actas</DropdownOption>
                                    <DropdownOption value={2}>Inserción de Actas</DropdownOption>
                                    <DropdownOption value={3}>Solicitud de Naturalización</DropdownOption>
                                    <DropdownOption value={4}>Justificativo de Soltería</DropdownOption>
                                </Dropdown>
                            </div>
                        </span>
                    </section>
                    <section className="col-span-2 row-span-2 flex flex-col">
                        <header className="flex justify-between items-center w-full mb-2">
                            <h3 className="text-label-small mb-2">
                                Recaudos consignados
                            </h3>
                            <Button variant="outlined" className="h-10">Añadir</Button>
                        </header>
                        <div className="bg-surface rounded-xl border border-onSurface flex-1">

                        </div>
                    </section>
                </article>
                <article>
                    <header className="flex justify-between items-center w-full">
                        <h3 className="text-label-small mb-2">
                            Sintesis del problema
                        </h3>
                    </header>

                    <TextInput
                        defaultText={caseDAO.problemSummary}
                        onChangeText={(text) => { updateCaseDAO({ problemSummary: text }); }}
                        multiline={true}
                        placeholder="Detalle rapido del caso"
                    />
                </article>
            </div>
        </>
    );
}

export default CreateCaseCaseStep;
