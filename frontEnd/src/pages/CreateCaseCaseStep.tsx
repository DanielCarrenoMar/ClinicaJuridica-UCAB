import TitleDropdown from "#components/TitleDropdown.tsx";
import { User, UserEdit } from "flowbite-react-icons/solid";
import { useCaseOutletContext } from "./CreateCase.tsx";
import TextInput from "#components/TextInput.tsx";
import Button from "#components/Button.tsx";
import Dropdown from "#components/Dropdown/Dropdown.tsx";
import { useNavigate } from "react-router";
import { ChevronRight } from "flowbite-react-icons/outline";
import { useEffect, useState } from "react";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import type { ProcessTypeDAO } from "#database/typesDAO.ts";
import { useCreateCase } from "#domain/useCaseHooks/useCase.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
import { useCreateApplicant } from "#domain/useCaseHooks/useApplicant.ts";
import { useAuth } from "../context/AuthContext.tsx";

const legalAmbits = [
    {
        name: "Materia Civil",
        categories: [
            {
                name: "Personas",
                areas: [
                    "Rectificación de Actas",
                    "Inserción de Actas",
                    "Solicitud de Naturalización",
                    "Justificativo de Soltería",
                    "Justificativo de Concubinato",
                    "Invitación al país",
                    "Justificativo de Dependencia Económica / Pobreza",
                    "Declaración Jurada de No Poseer",
                    "Declaración Jurada de Ingresos",
                    "Concubinato Postmortem",
                    "Declaración Jurada",
                    "Justificativo de Testigos"
                ]
            },
            {
                name: "Bienes",
                areas: [
                    "Título Supletorio",
                    "Compra venta bienhechuría",
                    "Partición de comunidad ordinaria",
                    "Propiedad Horizontal",
                    "Cierre de Titularidad",
                    "Aclaratoria"
                ]
            },
            {
                name: "Contratos",
                areas: [
                    "Arrendamiento / Comodato",
                    "Compra - venta de bienes inmuebles",
                    "Compra - venta bienes muebles (vehículos)",
                    "Opción de Compra Venta",
                    "Finiquito de compra venta",
                    "Asociaciones / Fundaciones",
                    "Cooperativas",
                    "Poder",
                    "Cosión de derechos",
                    "Cobro de Bolívares",
                    "Constitución y liquidación de hipoteca",
                    "Servicios / obras"
                ]
            },
            {
                name: "Familia - Tribunales Ordinarios",
                areas: [
                    "Divorcio por separación de hechos (185-A)",
                    "Separación de Cuerpos (189)",
                    "Conversión de separación en divorcio",
                    "Divorcio contencioso",
                    "Partición de comunidad conyugal",
                    "Partición de comunidad concubinaria",
                    "Capitulaciones matrimoniales",
                    "Divorcio Causal No Taxativa Sentencias"
                ]
            },
            {
                name: "Familia - Tribunales Protecc. Niños y Adolescentes",
                areas: [
                    "Divorcio por separación de hechos (185-A)",
                    "Separación de Cuerpos (189)",
                    "Conversión de separación en divorcio",
                    "Divorcio contencioso",
                    "Reconocimiento Voluntario Hijo",
                    "Colocación familiar",
                    "Curatela",
                    "Medidas de proteccion (Identidad, salud, educación, otros)",
                    "Autorización para Viajar",
                    "Autorización para Vender",
                    "Autorización para Trabajar",
                    "Obligación de Manutención / Convivencia Familiar",
                    "Rectificación de Actas",
                    "Inserción de Actas",
                    "Carga Familiar",
                    "Cambio de Residencia",
                    "Ejercicio Unilateral de Patria Potestad",
                    "Divorcio Causal No Taxativa Sentencias",
                    "Tutela"
                ]
            },
            {
                name: "Sucesiones",
                areas: [
                    "Cesión de derechos sucesorales",
                    "Justificativo Únicos y Universales herederos",
                    "Testamento",
                    "Declaración Sucesoral",
                    "Partición de comunidad hereditaria"
                ]
            }
        ]
    },
    {
        name: "Materia Penal",
        categories: [
            {
                name: "General",
                areas: [
                    "Delitos Contra la Propiedad (Robo, Hurto)",
                    "Contra las Personas (homicidio, lesiones)",
                    "Contra las Buenas Costumbres (Violación)",
                    "Delitos contra el Honor",
                    "Violencia Doméstica"
                ]
            }
        ]
    },
    {
        name: "Materia Laboral",
        categories: [
            {
                name: "General",
                areas: [
                    "Calificación de Despido",
                    "Prestaciones Sociales",
                    "Contratos de Trabajo",
                    "Accidentes de Trabajo",
                    "Incapacidad Laboral",
                    "Terminación de Relación Laboral"
                ]
            }
        ]
    },
    {
        name: "Materia Mercantil",
        categories: [
            {
                name: "General",
                areas: [
                    "Firma Personal",
                    "Constitución de Compañías",
                    "Actas de Asamblea",
                    "Compra Venta de Fondo de Comercio / Acciones",
                    "Letras de Cambio"
                ]
            }
        ]
    },
    {
        name: "Materia Administrativa",
        categories: [
            {
                name: "General",
                areas: [
                    "Recursos Administrativos"
                ]
            }
        ]
    },
    {
        name: "Otros",
        categories: [
            {
                name: "General",
                areas: [
                    "Convivencia Ciudadana",
                    "Derechos Humanos",
                    "Tránsito",
                    "Otros",
                    "Diligencias Seguimiento"
                ]
            }
        ]
    }
]

function CreateCaseCaseStep() {
    const navigate = useNavigate();
    const { applicantModel, caseDAO, updateCaseDAO, isApplicantExisting } = useCaseOutletContext();
    const { createCase, error: createCaseError, loading: createCaseLoading } = useCreateCase();
    const { createApplicant, error: createApplicantError, loading: createApplicantLoading } = useCreateApplicant();
    const { user } = useAuth()

    const [subjectIndex, setSubjectIndex] = useState<number | null>(null);
    const [categoryIndex, setCategoryIndex] = useState<number | null>(null);

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
            userId: user?.identityCard || "",
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
            <header className="bg-surface/70 flex items-center justify-between rounded-t-xl px-4 h-16">
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
                                    selectedValue={subjectIndex}
                                    onSelectionChange={(value) => {
                                        setSubjectIndex(value as number);
                                        setCategoryIndex(null);
                                        updateCaseDAO({ idLegalArea: 0 });
                                    }}
                                >
                                    {legalAmbits.map((subject, index) => (
                                        <DropdownOption key={index} value={index}>{subject.name}</DropdownOption>
                                    ))}
                                </Dropdown>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Categoria</span>
                                <Dropdown
                                    selectedValue={categoryIndex}
                                    onSelectionChange={(value) => { setCategoryIndex(value as number); }}
                                    disabled={subjectIndex === null}
                                >
                                    {subjectIndex !== null && legalAmbits[subjectIndex].categories.map((category, index) => (
                                        <DropdownOption key={index} value={index}>{category.name}</DropdownOption>
                                    ))}
                                </Dropdown>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-body-medium self-center w-28">Área</span>
                                <Dropdown
                                    selectedValue={caseDAO.idLegalArea}
                                    onSelectionChange={(value) => { updateCaseDAO({ idLegalArea: (value as number)+1 }) }}
                                    disabled={categoryIndex === null}
                                >
                                    {subjectIndex !== null && categoryIndex !== null && legalAmbits[subjectIndex].categories[categoryIndex].areas.map((area, index) => (
                                        <DropdownOption key={index} value={index}>{area}</DropdownOption>
                                    ))}
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
