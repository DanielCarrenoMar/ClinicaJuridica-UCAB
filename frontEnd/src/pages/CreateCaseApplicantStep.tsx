import { useState } from "react";
import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import Tabs from "#components/Tabs.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import { CaretDown, Home, Users } from "flowbite-react-icons/outline";
import { useCaseOutletContext } from "./CreateCase.tsx";
import type { SexType, IdNacionality, MaritalStatus } from "#domain/mtypes.ts";

function CreateCaseApplicantStep() {
    const { applicantModel, updateApplicantModel, caseDAO, updateCaseDAO } = useCaseOutletContext();
    const [activeStep, setActiveStep] = useState("identificacion");

    return (
        <>
            <section className="flex py-2">
                <Tabs selectedId={activeStep} onChange={setActiveStep}>
                    <Tabs.Item id="identificacion" label="Identificación" icon={<CaretDown />} />
                    <Tabs.Item id="vivienda" label="Vivienda y Servicios" icon={<Home />} />
                    <Tabs.Item id="familia" label="Familia y Hogar" icon={<Users />} />
                </Tabs>
            </section>
            <section className="grid grid-cols-12 gap-x-6 gap-y-6">
                <div className="col-span-5">
                    <TitleTextInput
                        label="Cedula"
                        value={applicantModel.identityCard}
                        onChange={(text) => { updateApplicantModel({ identityCard: text }); }}
                        placeholder="V-12345678"
                    />
                </div>
                <div className="col-span-7">
                    <TitleTextInput
                        label="Nombres y Apellidos"
                        value={applicantModel.fullName}
                        onChange={(text) => { updateApplicantModel({ fullName: text }); }}
                        placeholder="Juan Perez"
                    />
                </div>

                <div className="col-span-3">
                    <TitleTextInput
                        label="Fecha Nacimiento"
                        value={applicantModel.birthDate.toLocaleDateString()}
                        onChange={(text) => { updateApplicantModel({ birthDate: new Date(text) }); }}
                        placeholder="DD/MM/AAAA"
                    />
                </div>
                <div className="col-span-2">
                    <TitleDropdown
                        label="Sexo"
                        selectedValue={applicantModel.gender || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ gender: value as SexType }); }}
                    >
                        <DropDownOption value="M">Masculino</DropDownOption>
                        <DropDownOption value="F">Femenino</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-3">
                    <TitleDropdown
                        label="Nacionalidad"
                        selectedValue={applicantModel.idNationality || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ idNationality: value as IdNacionality }); }}
                    >
                        <DropDownOption value="V">Venezolana</DropDownOption>
                        <DropDownOption value="E">Extranjera</DropDownOption>
                        <DropDownOption value="J">Juridica</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-2">
                    <TitleDropdown
                        label="Estado Civil"
                        selectedValue={applicantModel.maritalStatus || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ maritalStatus: value as MaritalStatus }); }}
                    >
                        <DropDownOption value="single">Soltero/a</DropDownOption>
                        <DropDownOption value="married">Casado/a</DropDownOption>
                        <DropDownOption value="divorced">Divorciado/a</DropDownOption>
                        <DropDownOption value="widowed">Viudo/a</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-2">
                    <TitleDropdown
                        label="Concubinato"
                        selectedValue={(applicantModel.isConcubine ?? false).toString()}
                        onSelectionChange={(value) => { updateApplicantModel({ isConcubine: value === "true" }); }}
                    >
                        <DropDownOption value="true">Si</DropDownOption>
                        <DropDownOption value="false">No</DropDownOption>
                    </TitleDropdown>
                </div>

                <div className="col-span-3">
                    <TitleTextInput
                        label="Telefono Local"
                        value={applicantModel.homePhone}
                        onChange={(text) => { updateApplicantModel({ homePhone: text }); }}
                        placeholder="0212-1234567"
                    />
                </div>
                <div className="col-span-3">
                    <TitleTextInput
                        label="Telefono Celular"
                        value={applicantModel.cellPhone}
                        onChange={(text) => { updateApplicantModel({ cellPhone: text }); }}
                        placeholder="0414-1234567"
                    />
                </div>
                <div className="col-span-6">
                    <TitleTextInput
                        label="Correo Electronico"
                        value={applicantModel.email}
                        onChange={(text) => { updateApplicantModel({ email: text }); }}
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                <div className="col-span-4">
                    <TitleTextInput
                        label="Periodo Educativo"
                        value={applicantModel.applicantStudyTime}
                        onChange={(text) => { updateApplicantModel({ applicantStudyTime: text }); }}
                        placeholder="2024-2025"
                    />
                </div>
                <div className="col-span-4">
                    <TitleDropdown
                        label="Nivel de educacion"
                        selectedValue={applicantModel.applicantEducationLevel || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ applicantEducationLevel: value as string }); }}
                    >
                        <DropDownOption value="PRIMARIA">Primaria</DropDownOption> {/*Hay que hacer una peticion para traer los tipos de la BD*/}
                        <DropDownOption value="SECUNDARIA">Secundaria</DropDownOption>
                        <DropDownOption value="UNIVERSITARIA">Universitaria</DropDownOption>
                        <DropDownOption value="POSTGRADO">Postgrado</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-4">
                    <TitleDropdown
                        label="Condicion de Trabajo"
                        selectedValue={applicantModel.workCondition || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ workCondition: value as string }); }}
                    >
                        <DropDownOption value="EMPLEADO">Empleado</DropDownOption>
                        <DropDownOption value="DESEMPLEADO">Desempleado</DropDownOption>
                        <DropDownOption value="INDEPENDIENTE">Independiente</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-4">
                    <TitleDropdown
                        label="Condicion de Actividad"
                        selectedValue={applicantModel.activityCondition || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ activityCondition: value as string }); }}
                    >
                        <DropDownOption value="ACTIVO">Activo</DropDownOption>
                        <DropDownOption value="INACTIVO">Inactivo</DropDownOption>
                    </TitleDropdown>
                </div>
            </section>
        </>
    );
}

export default CreateCaseApplicantStep;
