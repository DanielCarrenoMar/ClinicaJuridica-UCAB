import { useState } from "react";
import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import Tabs from "#components/Tabs.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import { CaretDown, Home, Users } from "flowbite-react-icons/outline";
import { useCaseOutletContext } from "./CreateCase.tsx";
import type { SexType, IdNacionality } from "#domain/mtypes.ts";
import type { CaseModel } from "#domain/models/case.ts";

function CreateCaseApplicantStep() {
    const { caseModel, setCaseModel } = useCaseOutletContext();
    const [activeStep, setActiveStep] = useState("identificacion");

    const updateApplicant = (field: keyof CaseModel, value: string) => {
        setCaseModel((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

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
                        value={caseModel.applicant.idNumber}
                        onChange={(text) => { updateApplicant("idNumber", text); }}
                        placeholder="V-12345678"
                    />
                </div>
                <div className="col-span-7">
                    <TitleTextInput
                        label="Nombres y Apellidos"
                        value={caseModel.applicant.fullName}
                        onChange={(text) => { updateApplicant("fullName", text); }}
                        placeholder="Juan Perez"
                    />
                </div>

                <div className="col-span-3">
                    <TitleTextInput
                        label="Fecha Nacimiento"
                        value={caseModel.applicant.birthDate}
                        onChange={(text) => { updateApplicant("birthDate", text); }}
                        placeholder="DD/MM/AAAA"
                    />
                </div>
                <div className="col-span-2">
                    <TitleDropdown
                        label="Sexo"
                        selectedValue={caseModel.applicant.sex || undefined}
                        onSelectionChange={(value) => { updateApplicant("sex", value as SexType); }}
                    >
                        <DropDownOption value="M">Masculino</DropDownOption>
                        <DropDownOption value="F">Femenino</DropDownOption>
                        <DropDownOption value="O">Otro</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-3">
                    <TitleDropdown
                        label="Nacionalidad"
                        selectedValue={caseModel.applicant.nationality || undefined}
                        onSelectionChange={(value) => { updateApplicant("nationality", value as IdNacionality); }}
                    >
                        <DropDownOption value="V">Venezolana</DropDownOption>
                        <DropDownOption value="E">Extranjera</DropDownOption>
                        <DropDownOption value="J">Juridica</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-2">
                    <TitleDropdown
                        label="Estado Civil"
                        selectedValue={caseModel.applicant.civilStatus || undefined}
                        onSelectionChange={(value) => { updateApplicant("civilStatus", value as string); }}
                    >
                        <DropDownOption value="S">Soltero/a</DropDownOption>
                        <DropDownOption value="C">Casado/a</DropDownOption>
                        <DropDownOption value="D">Divorciado/a</DropDownOption>
                        <DropDownOption value="V">Viudo/a</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-2">
                    <TitleDropdown
                        label="Concubinato"
                        selectedValue={caseModel.applicant.concubinage || undefined}
                        onSelectionChange={(value) => { updateApplicant("concubinage", value as string); }}
                    >
                        <DropDownOption value="SI">Si</DropDownOption>
                        <DropDownOption value="NO">No</DropDownOption>
                    </TitleDropdown>
                </div>

                <div className="col-span-3">
                    <TitleTextInput
                        label="Telefono Local"
                        value={caseModel.applicant.landline}
                        onChange={(text) => { updateApplicant("landline", text); }}
                        placeholder="0212-1234567"
                    />
                </div>
                <div className="col-span-3">
                    <TitleTextInput
                        label="Telefono Celular"
                        value={caseModel.applicant.mobile}
                        onChange={(text) => { updateApplicant("mobile", text); }}
                        placeholder="0414-1234567"
                    />
                </div>
                <div className="col-span-6">
                    <TitleTextInput
                        label="Correo Electronico"
                        value={caseModel.applicant.email}
                        onChange={(text) => { updateApplicant("email", text); }}
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                <div className="col-span-4">
                    <TitleTextInput
                        label="Periodo Educativo"
                        value={caseModel.applicant.educationPeriod}
                        onChange={(text) => { updateApplicant("educationPeriod", text); }}
                        placeholder="2024-2025"
                    />
                </div>
                <div className="col-span-4">
                    <TitleDropdown
                        label="Nivel de educacion"
                        selectedValue={caseModel.applicant.educationLevel || undefined}
                        onSelectionChange={(value) => { updateApplicant("educationLevel", value as string); }}
                    >
                        <DropDownOption value="PRIMARIA">Primaria</DropDownOption>
                        <DropDownOption value="SECUNDARIA">Secundaria</DropDownOption>
                        <DropDownOption value="UNIVERSITARIA">Universitaria</DropDownOption>
                        <DropDownOption value="POSTGRADO">Postgrado</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-4">
                    <TitleDropdown
                        label="Condicion de Trabajo"
                        selectedValue={caseModel.applicant.workCondition || undefined}
                        onSelectionChange={(value) => { updateApplicant("workCondition", value as string); }}
                    >
                        <DropDownOption value="EMPLEADO">Empleado</DropDownOption>
                        <DropDownOption value="DESEMPLEADO">Desempleado</DropDownOption>
                        <DropDownOption value="INDEPENDIENTE">Independiente</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-4">
                    <TitleDropdown
                        label="Condicion de Actividad"
                        selectedValue={caseModel.applicant.activityCondition || undefined}
                        onSelectionChange={(value) => { updateApplicant("activityCondition", value as string); }}
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
