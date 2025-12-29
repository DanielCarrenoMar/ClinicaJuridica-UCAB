import { useState } from "react";
import DropdownOption from "#components/DropDown/DropDownOption.tsx";
import DropDownCheck from "#components/DropDownCheck/DropDownCheck.tsx";
import DropDownOptionCheck from "#components/DropDownCheck/DropDownOptionCheck.tsx";
import Tabs from "#components/Tabs.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import { CaretDown, Home, Users } from "flowbite-react-icons/outline";
import { useCaseOutletContext } from "./CreateCase.tsx";
import type { SexType, IdNacionality, MaritalStatus } from "#domain/mtypes.ts";

function CreateCaseApplicantStep() {
    const { applicantModel, updateApplicantModel} = useCaseOutletContext();
    const [activeStep, setActiveStep] = useState("identificacion");

    const identificationInputs = (
        <>
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
                    <DropdownOption value="M">Masculino</DropdownOption>
                    <DropdownOption value="F">Femenino</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleDropdown
                    label="Nacionalidad"
                    selectedValue={applicantModel.idNationality || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ idNationality: value as IdNacionality }); }}
                >
                    <DropdownOption value="V">Venezolana</DropdownOption>
                    <DropdownOption value="E">Extranjera</DropdownOption>
                    <DropdownOption value="J">Juridica</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Estado Civil"
                    selectedValue={applicantModel.maritalStatus || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ maritalStatus: value as MaritalStatus }); }}
                >
                    <DropdownOption value="single">Soltero/a</DropdownOption>
                    <DropdownOption value="married">Casado/a</DropdownOption>
                    <DropdownOption value="divorced">Divorciado/a</DropdownOption>
                    <DropdownOption value="widowed">Viudo/a</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Concubinato"
                    selectedValue={(applicantModel.isConcubine ?? false).toString()}
                    onSelectionChange={(value) => { updateApplicantModel({ isConcubine: value === "true" }); }}
                >
                    <DropdownOption value="true">Si</DropdownOption>
                    <DropdownOption value="false">No</DropdownOption>
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
                    <DropdownOption value="PRIMARIA">Primaria</DropdownOption> {/*Hay que hacer una peticion para traer los tipos de la BD*/}
                    <DropdownOption value="SECUNDARIA">Secundaria</DropdownOption>
                    <DropdownOption value="UNIVERSITARIA">Universitaria</DropdownOption>
                    <DropdownOption value="POSTGRADO">Postgrado</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Trabajo"
                    selectedValue={applicantModel.workCondition || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ workCondition: value as string }); }}
                >
                    <DropdownOption value="EMPLEADO">Empleado</DropdownOption>
                    <DropdownOption value="DESEMPLEADO">Desempleado</DropdownOption>
                    <DropdownOption value="INDEPENDIENTE">Independiente</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Actividad"
                    selectedValue={applicantModel.activityCondition || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ activityCondition: value as string }); }}
                >
                    <DropdownOption value="ACTIVO">Activo</DropdownOption>
                    <DropdownOption value="INACTIVO">Inactivo</DropdownOption>
                </TitleDropdown>
            </div>
        </>
    );

    const viviendaInputs = (
        <>
            <div className="col-span-4">
                <TitleTextInput
                    label="Estado"
                    value={applicantModel.stateName ?? ""}
                    onChange={(text) => { updateApplicantModel({ stateName: text }); }}
                    placeholder="Bolivar"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Municipio"
                    value={applicantModel.municipalityName ?? ""}
                    onChange={(text) => { updateApplicantModel({ municipalityName: text }); }}
                    placeholder="Caroni"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Parroquia"
                    value={applicantModel.parishName ?? ""}
                    onChange={(text) => { updateApplicantModel({ parishName: text }); }}
                    placeholder="Unare"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Sector/Barrio"
                    value={applicantModel.neighborhood ?? ""}
                    onChange={(text) => { updateApplicantModel({ neighborhood: text }); }}
                    placeholder="Urb. Los Olivos"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Direccion"
                    value={applicantModel.address ?? ""}
                    onChange={(text) => { updateApplicantModel({ address: text }); }}
                    placeholder="Calle 1, casa 2"
                />
            </div>

            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de vivienda"
                    selectedValue={applicantModel.housingCondition || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ housingCondition: value as string }); }}
                >
                    <DropdownOption value="PROPIA">Propia</DropdownOption>
                    <DropdownOption value="ALQUILADA">Alquilada</DropdownOption>
                    <DropdownOption value="PRESTADA">Prestada</DropdownOption>
                    <DropdownOption value="INVADIDA">Invadida</DropdownOption>
                    <DropdownOption value="OTRA">Otra</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Tipo de vivienda"
                    selectedValue={applicantModel.housingType || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ housingType: value as string }); }}
                >
                    <DropdownOption value="CASA">Casa</DropdownOption>
                    <DropdownOption value="APARTAMENTO">Apartamento</DropdownOption>
                    <DropdownOption value="ANEXO">Anexo</DropdownOption>
                    <DropdownOption value="RANCHO">Rancho</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Regimen de tenencia"
                    selectedValue={applicantModel.tenureType || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ tenureType: value as string }); }}
                >
                    <DropdownOption value="PROPIETARIO">Propietario</DropdownOption>
                    <DropdownOption value="ALQUILER">Alquiler</DropdownOption>
                    <DropdownOption value="CEDIDA">Cedida/Prestada</DropdownOption>
                    <DropdownOption value="POSESION">Posesion</DropdownOption>
                </TitleDropdown>
            </div>

            <div className="col-span-6">
                <DropDownCheck
                    label="Servicios basicos"
                    selectedValues={applicantModel.servicesAvailable ?? []}
                    onSelectionChange={(values) => { updateApplicantModel({ servicesAvailable: values as string[] }); }}
                >
                    <DropDownOptionCheck value="AGUA">Agua</DropDownOptionCheck>
                    <DropDownOptionCheck value="ELECTRICIDAD">Electricidad</DropDownOptionCheck>
                    <DropDownOptionCheck value="GAS">Gas</DropDownOptionCheck>
                    <DropDownOptionCheck value="ASEO">Aseo</DropDownOptionCheck>
                    <DropDownOptionCheck value="INTERNET">Internet</DropDownOptionCheck>
                    <DropDownOptionCheck value="TELEFONO">Telefono</DropDownOptionCheck>
                    <DropDownOptionCheck value="CLOACAS">Cloacas</DropDownOptionCheck>
                </DropDownCheck>
            </div>
        </>
    );

    const familiaInputs = (
        <>
            <div className="col-span-3">
                <TitleDropdown
                    label="Jefe de hogar"
                    selectedValue={(applicantModel.isHeadOfHousehold ?? false).toString()}
                    onSelectionChange={(value) => { updateApplicantModel({ isHeadOfHousehold: value === "true" }); }}
                >
                    <DropdownOption value="true">Si</DropdownOption>
                    <DropdownOption value="false">No</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleDropdown
                    label="Nivel educativo jefe"
                    selectedValue={applicantModel.headEducationLevel || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ headEducationLevel: value as string }); }}
                >
                    <DropdownOption value="PRIMARIA">Primaria</DropdownOption>
                    <DropdownOption value="SECUNDARIA">Secundaria</DropdownOption>
                    <DropdownOption value="UNIVERSITARIA">Universitaria</DropdownOption>
                    <DropdownOption value="POSTGRADO">Postgrado</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Periodo educativo jefe"
                    value={applicantModel.headStudyTime ?? ""}
                    onChange={(text) => { updateApplicantModel({ headStudyTime: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Integrantes del hogar"
                    value={applicantModel.householdSize?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ householdSize: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="4"
                />
            </div>

            <div className="col-span-3">
                <TitleTextInput
                    label="Ninos en el hogar"
                    value={applicantModel.minorsCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ minorsCount: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="1"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Adultos mayores"
                    value={applicantModel.seniorsCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ seniorsCount: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="0"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Personas con discapacidad"
                    value={applicantModel.disabledCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ disabledCount: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="0"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Personas embarazadas"
                    value={applicantModel.pregnantCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ pregnantCount: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="0"
                />
            </div>

            <div className="col-span-4">
                <TitleTextInput
                    label="Ingreso mensual del hogar"
                    value={applicantModel.householdIncome ?? ""}
                    onChange={(text) => { updateApplicantModel({ householdIncome: text }); }}
                    placeholder="$300"
                />
            </div>
        </>
    );

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
                {activeStep === "identificacion" && identificationInputs}
                {activeStep === "vivienda" && viviendaInputs}
                {activeStep === "familia" && familiaInputs}
            </section>
        </>
    );
}

export default CreateCaseApplicantStep;
