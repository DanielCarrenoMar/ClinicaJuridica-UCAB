import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useGetApplicantById, useUpdateApplicant } from "#domain/useCaseHooks/useApplicant.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import type { GenderTypeModel, IdNacionalityTypeModel, MaritalStatusTypeModel } from "#domain/typesModel.ts";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import Button from "#components/Button.tsx";
import Tabs from "#components/Tabs.tsx";
import Box from "#components/Box.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import DropdownCheck from "#components/DropdownCheck/DropdownCheck.tsx";
import DropdownOptionCheck from "#components/DropdownCheck/DropdownOptionCheck.tsx";
import DatePicker from "#components/DatePicker.tsx";
import { CaretDown, Close, Home, Users } from "flowbite-react-icons/outline";
import { UserEdit as UserEditS } from "flowbite-react-icons/solid";

export default function ApplicantInfo() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getApplicantById, loading, error } = useGetApplicantById();
    const { updateApplicant, loading: updating } = useUpdateApplicant();

    const [applicantData, setApplicantData] = useState<ApplicantModel | null>(null);
    const [localApplicantData, setLocalApplicantData] = useState<ApplicantModel>();
    const [isDataModified, setIsDataModified] = useState(false);
    const [activeSection, setActiveSection] = useState("identificacion");

    useEffect(() => {
        const loadApplicant = async () => {
            const applicantId = id;
            if (!applicantId) return;
            const applicant = await getApplicantById(applicantId);
            if (applicant) {
                setApplicantData(applicant);
                setLocalApplicantData(applicant);
            }
        };
        loadApplicant();
    }, [id]);

    useEffect(() => {
        if (!localApplicantData || !applicantData) return;
        const hasChanges = JSON.stringify(localApplicantData) !== JSON.stringify(applicantData);
        setIsDataModified(hasChanges);
    }, [localApplicantData, applicantData]);

    function discardChanges() {
        setLocalApplicantData(applicantData || undefined);
    }

    async function saveChanges() {
        const applicantId = id;
        if (!applicantId) return;
        if (!localApplicantData || !applicantData) return;
        await updateApplicant(applicantId, localApplicantData);
        const updatedApplicant = await getApplicantById(applicantId);
        if (updatedApplicant) {
            setApplicantData(updatedApplicant);
            setLocalApplicantData(updatedApplicant);
        }
    }

    const handleChange = (updateField: Partial<ApplicantModel>) => {
        setLocalApplicantData((prev: any) => ({ ...prev, ...updateField }));
    };

    if (!id) return <div className="text-error">ID del solicitante no proporcionado en la URL.</div>;
    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (error) return <div className="text-error">Error al cargar el solicitante: {error.message}</div>;
    if (!applicantData || !localApplicantData) return <div className="">No se encontró el solicitante</div>;

    const identificationInputs = (
        <>
            <div className="col-span-5">
                <TitleTextInput
                    label="Cedula"
                    value={localApplicantData.identityCard}
                    onChange={() => {}}
                    placeholder="V-12345678"
                    disabled
                />
            </div>
            <div className="col-span-7">
                <TitleTextInput
                    label="Nombres y Apellidos"
                    value={localApplicantData.fullName || ""}
                    onChange={(text) => { handleChange({ fullName: text }); }}
                    placeholder="Juan Perez"
                />
            </div>

            <div className="col-span-3">
                <DatePicker
                    label="Fecha Nacimiento"
                    value={(() => {
                        const dateValue = localApplicantData.birthDate instanceof Date
                            ? localApplicantData.birthDate
                            : (localApplicantData.birthDate ? new Date(localApplicantData.birthDate as unknown as string) : undefined);
                        return dateValue ? dateValue.toISOString().split('T')[0] : undefined;
                    })()}
                    onChange={(text) => { handleChange({ birthDate: new Date(text) }); }}
                />
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Sexo"
                    selectedValue={localApplicantData.gender || undefined}
                    onSelectionChange={(value) => { handleChange({ gender: value as GenderTypeModel }); }}
                >
                    <DropdownOption value="Masculino">Masculino</DropdownOption>
                    <DropdownOption value="Femenino">Femenino</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleDropdown
                    label="Nacionalidad"
                    selectedValue={localApplicantData.idNationality || undefined}
                    onSelectionChange={(value) => { handleChange({ idNationality: value as IdNacionalityTypeModel }); }}
                >
                    <DropdownOption value="V">Venezolana</DropdownOption>
                    <DropdownOption value="E">Extranjera</DropdownOption>
                    <DropdownOption value="J">Juridica</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Estado Civil*"
                    selectedValue={localApplicantData.maritalStatus || undefined}
                    onSelectionChange={(value) => { handleChange({ maritalStatus: value as MaritalStatusTypeModel }); }}
                >
                    <DropdownOption value="Soltero">Soltero/a</DropdownOption>
                    <DropdownOption value="Casado">Casado/a</DropdownOption>
                    <DropdownOption value="Divorciado">Divorciado/a</DropdownOption>
                    <DropdownOption value="Viudo">Viudo/a</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Concubinato*"
                    selectedValue={(localApplicantData.isConcubine ?? false).toString()}
                    onSelectionChange={(value) => { handleChange({ isConcubine: (value as number) === 1 }); }}
                >
                    <DropdownOption value={1}>Si</DropdownOption>
                    <DropdownOption value={0}>No</DropdownOption>
                </TitleDropdown>
            </div>

            <div className="col-span-3">
                <TitleTextInput
                    label="Telefono Local*"
                    value={localApplicantData.homePhone || ""}
                    onChange={(text) => { handleChange({ homePhone: text }); }}
                    placeholder="0212-1234567"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Telefono Celular*"
                    value={localApplicantData.cellPhone || ""}
                    onChange={(text) => { handleChange({ cellPhone: text }); }}
                    placeholder="0414-1234567"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Correo Electronico*"
                    value={localApplicantData.email || ""}
                    onChange={(text) => { handleChange({ email: text }); }}
                    placeholder="ejemplo@correo.com"
                />
            </div>

            <div className="col-span-4">
                <TitleTextInput
                    label="Periodo Educativo*"
                    value={localApplicantData.applicantStudyTime || ""}
                    onChange={(text) => { handleChange({ applicantStudyTime: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Nivel de educacion*"
                    selectedValue={localApplicantData.applicantEducationLevel || undefined}
                    onSelectionChange={(value) => { handleChange({ applicantEducationLevel: value as string }); }}
                >
                    <DropdownOption value={1}>Sin nivel</DropdownOption>
                    <DropdownOption value={2}>Primaria (primer grado)</DropdownOption>
                    <DropdownOption value={3}>Primaria (segundo grado)</DropdownOption>
                    <DropdownOption value={4}>Primaria (tercer grado)</DropdownOption>
                    <DropdownOption value={5}>Primaria (cuarto grado)</DropdownOption>
                    <DropdownOption value={6}>Primaria (quinto grado)</DropdownOption>
                    <DropdownOption value={7}>Primaria (sexto grado)</DropdownOption>
                    <DropdownOption value={8}>Básica (1er año / 7mo grado)</DropdownOption>
                    <DropdownOption value={9}>Básica (2do año / 8mo grado)</DropdownOption>
                    <DropdownOption value={10}>Básica (3er año / 9no grado)</DropdownOption>
                    <DropdownOption value={11}>Media Diversificada (4to año)</DropdownOption>
                    <DropdownOption value={12}>Media Diversificada (5to año)</DropdownOption>
                    <DropdownOption value={13}>Técnico Medio</DropdownOption>
                    <DropdownOption value={14}>Técnico Superior</DropdownOption>
                    <DropdownOption value={15}>Universitaria</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Trabajo*"
                    selectedValue={localApplicantData.workConditionId || undefined}
                    onSelectionChange={(value) => { handleChange({ workConditionId: value as number }); }}
                >
                    <DropdownOption value={1}>Patrono</DropdownOption>
                    <DropdownOption value={2}>Empleado</DropdownOption>
                    <DropdownOption value={3}>Obrero</DropdownOption>
                    <DropdownOption value={4}>Cuenta Propia</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Actividad*"
                    selectedValue={localApplicantData.activityConditionId || undefined}
                    onSelectionChange={(value) => { handleChange({ activityConditionId: value as number }); }}
                >
                    <DropdownOption value={1}>Ama de casa</DropdownOption>
                    <DropdownOption value={2}>Estudiante</DropdownOption>
                    <DropdownOption value={3}>Pensionado / Jubilado</DropdownOption>
                    <DropdownOption value={4}>Otra</DropdownOption>
                </TitleDropdown>
            </div>
        </>
    );

    const houseInputs = (
        <>
            <div className="col-span-4">
                <TitleTextInput
                    label="Estado*"
                    value={localApplicantData.stateName ?? ""}
                    onChange={(text) => { handleChange({ stateName: text }); }}
                    placeholder="Bolivar"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Municipio*"
                    value={localApplicantData.municipalityName ?? ""}
                    onChange={(text) => { handleChange({ municipalityName: text }); }}
                    placeholder="Caroni"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Parroquia*"
                    value={localApplicantData.parishName ?? ""}
                    onChange={(text) => { handleChange({ parishName: text }); }}
                    placeholder="Unare"
                />
            </div>
            <div className="col-span-6">
                <DropdownCheck
                    label="Servicios basicos*"
                    selectedValues={localApplicantData.servicesIdAvailable ?? []}
                    onSelectionChange={(values) => { handleChange({ servicesIdAvailable: values as number[] }); }}
                >
                    <DropdownOptionCheck value={1}>Agua</DropdownOptionCheck>
                    <DropdownOptionCheck value={2}>Electricidad</DropdownOptionCheck>
                    <DropdownOptionCheck value={3}>Gas</DropdownOptionCheck>
                    <DropdownOptionCheck value={4}>Aseo</DropdownOptionCheck>
                    <DropdownOptionCheck value={5}>Internet</DropdownOptionCheck>
                    <DropdownOptionCheck value={6}>Telefono</DropdownOptionCheck>
                    <DropdownOptionCheck value={7}>Cloacas</DropdownOptionCheck>
                </DropdownCheck>
            </div>
        </>
    );

    const familyInputs = (
        <>
            <div className="col-span-3">
                <TitleDropdown
                    label="Jefe de hogar*"
                    selectedValue={(localApplicantData.isHeadOfHousehold ?? false).toString()}
                    onSelectionChange={(value) => { handleChange({ isHeadOfHousehold: value === "true" }); }}
                >
                    <DropdownOption value="true">Si</DropdownOption>
                    <DropdownOption value="false">No</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleDropdown
                    label="Nivel educativo jefe*"
                    selectedValue={localApplicantData.headEducationLevelId || undefined}
                    onSelectionChange={(value) => { handleChange({ headEducationLevelId: value as number }); }}
                >
                    <DropdownOption value={1}>Sin nivel</DropdownOption>
                    <DropdownOption value={2}>Primaria (primer grado)</DropdownOption>
                    <DropdownOption value={3}>Primaria (segundo grado)</DropdownOption>
                    <DropdownOption value={4}>Primaria (tercer grado)</DropdownOption>
                    <DropdownOption value={5}>Primaria (cuarto grado)</DropdownOption>
                    <DropdownOption value={6}>Primaria (quinto grado)</DropdownOption>
                    <DropdownOption value={7}>Primaria (sexto grado)</DropdownOption>
                    <DropdownOption value={8}>Básica (1er año / 7mo grado)</DropdownOption>
                    <DropdownOption value={9}>Básica (2do año / 8mo grado)</DropdownOption>
                    <DropdownOption value={10}>Básica (3er año / 9no grado)</DropdownOption>
                    <DropdownOption value={11}>Media Diversificada (4to año)</DropdownOption>
                    <DropdownOption value={12}>Media Diversificada (5to año)</DropdownOption>
                    <DropdownOption value={13}>Técnico Medio</DropdownOption>
                    <DropdownOption value={14}>Técnico Superior</DropdownOption>
                    <DropdownOption value={15}>Universitaria</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Periodo educativo jefe*"
                    value={localApplicantData.headStudyTime ?? ""}
                    onChange={(text) => { handleChange({ headStudyTime: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Integrantes del hogar que trabajan*"
                    value={localApplicantData.workingMemberCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        handleChange({ workingMemberCount: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder=""
                />
            </div>

            <div className="col-span-3">
                <TitleTextInput
                    label="Ninos entre 7 y 12 años en el hogar*"
                    value={localApplicantData.children7to12Count?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        handleChange({ children7to12Count: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder=""
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Ingreso mensual del hogar*"
                    value={localApplicantData.monthlyIncome ?? ""}
                    onChange={(text) => { handleChange({ monthlyIncome: text }); }}
                    placeholder=""
                />
            </div>
        </>
    );

    return (
        <Box className="p-0! h-full overflow-y-auto">
            <header className="bg-surface/70 flex items-center justify-between rounded-t-xl px-4 h-16">
                <div className="flex items-center gap-2.5">
                    <UserEditS className="size-8!" />
                    <h1 className="text-label-medium">Solicitante</h1>
                </div>
                <div className="flex items-end gap-2.5">
                    {
                        isDataModified && (
                            <Button onClick={discardChanges} icon={<Close />} variant="outlined" className="h-10">
                                Cancelar Cambios
                            </Button>
                        )
                    }
                    {
                        isDataModified ? (
                            <Button onClick={saveChanges} disabled={updating} variant="resalted" className="h-10 w-32">
                                Guardar
                            </Button>
                        ) : (
                            <Button onClick={() => navigate(-1)} variant="outlined" className="h-10 w-32">
                                Volver
                            </Button>
                        )
                    }
                </div>
            </header>
            <section className="flex py-2">
                <Tabs selectedId={activeSection} onChange={setActiveSection}>
                    <Tabs.Item id="identificacion" label="Identificación" icon={<CaretDown />} />
                    <Tabs.Item id="vivienda" label="Vivienda y Servicios" icon={<Home />} />
                    <Tabs.Item id="familia" label="Familia y Hogar" icon={<Users />} />
                </Tabs>
            </section>
            <section className="px-4 pb-6">
                <div className="grid grid-cols-12 gap-x-6 gap-y-6">
                    {activeSection === "identificacion" && identificationInputs}
                    {activeSection === "vivienda" && houseInputs}
                    {activeSection === "familia" && familyInputs}
                </div>
            </section>
        </Box>
    );
}