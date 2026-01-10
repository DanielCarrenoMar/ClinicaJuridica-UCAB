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
import { locationData, characteristicsData } from "#domain/seedData.ts";
import { educationLevelData, workConditionData, activityConditionData } from "#domain/seedData.ts";

export default function ApplicantInfo() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getApplicantById, loading, error } = useGetApplicantById();
    const { updateApplicant, loading: updating } = useUpdateApplicant();

    const [applicantData, setApplicantData] = useState<ApplicantModel | null>(null);
    const [localApplicantData, setLocalApplicantData] = useState<ApplicantModel>();
    const [isDataModified, setIsDataModified] = useState(false);
    const [activeSection, setActiveSection] = useState("identificacion");

    const [stateIndex, setStateIndex] = useState<number | null>(null);
    const [munIndex, setMunIndex] = useState<number | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadApplicant = async () => {
            const applicantId = id;
            if (!applicantId) return;
            const applicant = await getApplicantById(applicantId);
            if (applicant) {
                // Clonar el objeto profundamente, especialmente las fechas
                const clonedApplicant = {
                    ...applicant,
                    birthDate: new Date(applicant.birthDate),
                    createdAt: new Date(applicant.createdAt),
                    servicesIdAvailable: applicant.servicesIdAvailable ? [...applicant.servicesIdAvailable] : undefined
                };
                setApplicantData(clonedApplicant);
                setLocalApplicantData({ ...clonedApplicant });

                // Establecer índices de ubicación si existen
                if (applicant.stateName) {
                    const sIdx = locationData.findIndex(s => s.name === applicant.stateName);
                    if (sIdx !== -1) {
                        setStateIndex(sIdx);
                        if (applicant.municipalityName) {
                            const mIdx = locationData[sIdx].municipalities.findIndex(m => m.name === applicant.municipalityName);
                            if (mIdx !== -1) {
                                setMunIndex(mIdx);
                            }
                        }
                    }
                }
            }
        };
        loadApplicant();
    }, [id]);

    useEffect(() => {
        if (!localApplicantData || !applicantData) return;
        const hasChanges = JSON.stringify(localApplicantData) !== JSON.stringify(applicantData);
        setIsDataModified(hasChanges);
    }, [localApplicantData, applicantData]);

    // Validation Effect
    useEffect(() => {
        const errors: Record<string, string> = {};
        const { memberCount, workingMemberCount, children7to12Count, studentChildrenCount } = localApplicantData || {};

        if (memberCount !== undefined && memberCount !== null) {
            if (workingMemberCount !== undefined && workingMemberCount !== null && workingMemberCount > memberCount) {
                errors.workingMemberCount = "No pueden trabajar más personas de las que viven en casa";
            }
            if (children7to12Count !== undefined && children7to12Count !== null && children7to12Count > memberCount) {
                errors.children7to12Count = "No puede haber más niños de los que viven en casa";
            }
            if (studentChildrenCount !== undefined && studentChildrenCount !== null && studentChildrenCount > memberCount) {
                errors.studentChildrenCount = "No puede haber más niños de los que viven en casa";
            }
        }

        setValidationErrors(errors);
    }, [localApplicantData?.memberCount, localApplicantData?.workingMemberCount, localApplicantData?.children7to12Count, localApplicantData?.studentChildrenCount]);

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
            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleTextInput
                        label="Cédula"
                        value={localApplicantData.identityCard}
                        onChange={() => { }}
                        disabled
                    />
                </div>
                <div>
                    <TitleTextInput
                        label="Nombre y apellido"
                        value={localApplicantData.fullName || ""}
                        onChange={(text) => { handleChange({ fullName: text }); }}
                    />
                </div>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Sexo"
                    selectedValue={localApplicantData.gender || undefined}
                    onSelectionChange={(value) => { handleChange({ gender: value as GenderTypeModel }); }}
                >
                    <DropdownOption value="Masculino">Masculino</DropdownOption>
                    <DropdownOption value="Femenino">Femenino</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <DatePicker
                    label="Fecha Nacimiento"
                    value={localApplicantData.birthDate ? localApplicantData.birthDate.toISOString().split('T')[0] : undefined}
                    onChange={(text) => { handleChange({ birthDate: new Date(text) }); }}
                />
            </div>
            <div className="col-span-1">
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

            <div className="col-span-1">
                <TitleTextInput
                    label="Teléfono local*"
                    value={localApplicantData.homePhone || ""}
                    onChange={(text) => { handleChange({ homePhone: text }); }}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Teléfono celular*"
                    value={localApplicantData.cellPhone || ""}
                    onChange={(text) => { handleChange({ cellPhone: text }); }}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Correo electrónico*"
                    value={localApplicantData.email || ""}
                    onChange={(text) => { handleChange({ email: text }); }}
                />
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Estado*"
                    selectedValue={stateIndex !== null ? stateIndex : undefined}
                    onSelectionChange={(value) => {
                        const idx = value as number;
                        setStateIndex(idx);
                        setMunIndex(null);
                        handleChange({
                            stateName: locationData[idx].name,
                            idState: idx + 1,
                        });
                    }}
                >
                    {locationData.map((state, index) => (
                        <DropdownOption key={index} value={index}>{state.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Municipio*"
                    selectedValue={munIndex !== null ? munIndex : undefined}
                    onSelectionChange={(value) => {
                        const idx = value as number;
                        setMunIndex(idx);
                        handleChange({
                            municipalityName: locationData[stateIndex!].municipalities[idx].name,
                            municipalityNumber: idx + 1,
                        });
                    }}
                    disabled={stateIndex === null}
                >
                    {stateIndex !== null && locationData[stateIndex].municipalities.map((mun, index) => (
                        <DropdownOption key={index} value={index}>{mun.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Parroquia*"
                    selectedValue={localApplicantData.parishName || undefined}
                    onSelectionChange={(value) => {
                        const parishList = stateIndex !== null && munIndex !== null ? locationData[stateIndex].municipalities[munIndex].parishes : [];
                        const pIdx = parishList.indexOf(value as string);
                        handleChange({
                            parishName: value as string,
                            parishNumber: pIdx !== -1 ? pIdx + 1 : undefined
                        });
                    }}
                    disabled={munIndex === null}
                >
                    {stateIndex !== null && munIndex !== null && locationData[stateIndex].municipalities[munIndex].parishes.map((parish, index) => (
                        <DropdownOption key={index} value={parish}>{parish}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            {/* Estadubinato */}
            <div className="col-span-1">
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
                    selectedValue={localApplicantData.isConcubine !== undefined ? (localApplicantData.isConcubine ? 1 : 0) : undefined}
                    onSelectionChange={(value) => { handleChange({ isConcubine: (value as number) === 1 }); }}
                >
                    <DropdownOption value={1}>Si</DropdownOption>
                    <DropdownOption value={0}>No</DropdownOption>
                </TitleDropdown>
            </div>

            <div className="col-span-3">
                <TitleDropdown
                    label="Educación alcanzada*"
                    selectedValue={localApplicantData.applicantEducationLevel || undefined}
                    onSelectionChange={(value) => { handleChange({ applicantEducationLevel: value as number }); }}
                >
                    {educationLevelData.map((level, index) => (
                        <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Condición Trabajo*"
                    selectedValue={localApplicantData.workConditionId || undefined}
                    onSelectionChange={(value) => { handleChange({ workConditionId: value as number, activityConditionId: undefined }); }}
                >
                    {workConditionData.map((condition, index) => (
                        <DropdownOption key={index} value={index + 1}>{condition.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Condición Actividad*"
                    selectedValue={localApplicantData.activityConditionId || undefined}
                    onSelectionChange={(value) => { handleChange({ activityConditionId: value as number, workConditionId: undefined }); }}
                >
                    {activityConditionData.map((condition, index) => (
                        <DropdownOption key={index} value={index + 1}>{condition.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
        </>
    );

    const housingCharacteristicOptions = (characteristicName: string) =>
        characteristicsData.find((c) => c.name === characteristicName)?.options ?? [];

    const houseInputs = (
        <>
            {/* Tipo de vivienda | habitaciones para dormir | baños */}
            <div className="col-span-1">
                <TitleDropdown
                    label="Tipo de vivienda*"
                    selectedValue={localApplicantData.houseType}
                    onSelectionChange={(value) => { handleChange({ houseType: value as number }); }}
                >
                    {housingCharacteristicOptions('Tipo de Vivienda').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Habitaciones para dormir*"
                    value={localApplicantData.bedroomCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        handleChange({ bedroomCount: Number.isNaN(num) ? undefined : num });
                    }}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Baños*"
                    value={localApplicantData.bathroomCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        handleChange({ bathroomCount: Number.isNaN(num) ? undefined : num });
                    }}
                />
            </div>

            {/* Material de piso | Material de paredes | material de techo */}
            <div className="col-span-1">
                <TitleDropdown
                    label="Material de piso*"
                    selectedValue={localApplicantData.floorMaterial}
                    onSelectionChange={(value) => { handleChange({ floorMaterial: value as number }); }}
                >
                    {housingCharacteristicOptions('Material del piso').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Material de paredes*"
                    selectedValue={localApplicantData.wallMaterial}
                    onSelectionChange={(value) => { handleChange({ wallMaterial: value as number }); }}
                >
                    {housingCharacteristicOptions('Material de las paredes').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Material de techo*"
                    selectedValue={localApplicantData.roofMaterial}
                    onSelectionChange={(value) => { handleChange({ roofMaterial: value as number }); }}
                >
                    {housingCharacteristicOptions('Material del techo').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Servicio de agua potable*"
                    selectedValue={localApplicantData.potableWaterService}
                    onSelectionChange={(value) => { handleChange({ potableWaterService: value as number }); }}
                >
                    {housingCharacteristicOptions('Servicio de agua potable').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Aguas negras*"
                    selectedValue={localApplicantData.sewageService}
                    onSelectionChange={(value) => { handleChange({ sewageService: value as number }); }}
                >
                    {housingCharacteristicOptions('Eliminacion de excretas (aguas negras)').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Servicio de aseo*"
                    selectedValue={localApplicantData.cleaningService}
                    onSelectionChange={(value) => { handleChange({ cleaningService: value as number }); }}
                >
                    {housingCharacteristicOptions('Servicio de aseo').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            <div className="col-span-3">
                <div className="flex flex-col gap-2">
                    <header>
                        <h4 className="text-body-large ">Artefactos Domesticos, bienes o servicios del hogar*</h4>
                    </header>
                    <DropdownCheck
                        label="Seleccionar"
                        selectedValues={localApplicantData.servicesIdAvailable ?? []}
                        onSelectionChange={(values) => { handleChange({ servicesIdAvailable: values as number[] }); }}
                    >
                        {housingCharacteristicOptions('Artefactos Domesticos, bienes o servicios del hogar').map((option, index) => (
                            <DropdownOptionCheck key={index} value={index + 1}>{option}</DropdownOptionCheck>
                        ))}
                    </DropdownCheck>
                </div>
                {localApplicantData.servicesIdAvailable && localApplicantData.servicesIdAvailable.length > 0 && (
                    <div className="mt-2">
                        <span className="text-body-small font-medium text-onSurface/80 block mb-1">Opciones elegidas:</span>
                        <div className="flex flex-wrap gap-2">
                            {localApplicantData.servicesIdAvailable.map((id) => {
                                const options = housingCharacteristicOptions('Artefactos Domesticos, bienes o servicios del hogar');
                                // ID is 1-based, options array is 0-based
                                const name = options[id - 1];
                                if (!name) return null;
                                return (
                                    <span key={id} className="bg-surface-container-high text-onSurface px-2 py-1 rounded-md text-sm border border-outline-variant">
                                        {name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const familyInputs = (
        <>
            <div className="col-span-1">
                <TitleTextInput
                    label="Personas que viven en la vivienda*"
                    value={localApplicantData.memberCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        handleChange({ memberCount: Number.isNaN(num) ? undefined : num });
                    }}
                />
            </div>
            <div className="col-span-1">
                <div className="flex flex-col">
                    <TitleTextInput
                        label="Personas que trabajan*"
                        value={localApplicantData.workingMemberCount?.toString() ?? ""}
                        onChange={(text) => {
                            const num = Number(text);
                            handleChange({ workingMemberCount: Number.isNaN(num) ? undefined : num });
                        }}
                    />
                    {validationErrors.workingMemberCount && (
                        <span className="text-xs text-error mt-1">{validationErrors.workingMemberCount}</span>
                    )}
                </div>
            </div>

            {/* Numero de niños entre 7 y 12 años | Cuantos niños estudian */}
            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <div className="flex flex-col">
                        <TitleTextInput
                            label="Número de niños entre 7 y 12 años*"
                            value={localApplicantData.children7to12Count?.toString() ?? ""}
                            onChange={(text) => {
                                const num = Number(text);
                                handleChange({ children7to12Count: Number.isNaN(num) ? undefined : num });
                            }}
                        />
                        {validationErrors.children7to12Count && (
                            <span className="text-xs text-error mt-1">{validationErrors.children7to12Count}</span>
                        )}
                    </div>
                </div>
                <div>
                    <div className="flex flex-col">
                        <TitleTextInput
                            label="Cuántos niños estudian*"
                            value={localApplicantData.studentChildrenCount?.toString() ?? ""}
                            onChange={(text) => {
                                const num = Number(text);
                                handleChange({ studentChildrenCount: Number.isNaN(num) ? undefined : num });
                            }}
                        />
                        {validationErrors.studentChildrenCount && (
                            <span className="text-xs text-error mt-1">{validationErrors.studentChildrenCount}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Ingresos mensuales del hogar */}
            <div className="col-span-3">
                <TitleTextInput
                    label="Ingresos mensuales del hogar*"
                    value={localApplicantData.monthlyIncome ?? ""}
                    onChange={(text) => { handleChange({ monthlyIncome: text }); }}
                />
            </div>

            {/* Es jefe de hogar | Educación alcanzada por jefe del hogar */}
            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleDropdown
                        label="Es jefe de hogar*"
                        selectedValue={(localApplicantData.isHeadOfHousehold ?? "").toString()}
                        onSelectionChange={(value) => { handleChange({ isHeadOfHousehold: value === "true" }); }}
                    >
                        <DropdownOption value="true">Si</DropdownOption>
                        <DropdownOption value="false">No</DropdownOption>
                    </TitleDropdown>
                </div>
                <div>
                    <TitleDropdown
                        label="Educación alcanzada por jefe del hogar*"
                        selectedValue={localApplicantData.headEducationLevelId || undefined}
                        onSelectionChange={(value) => { handleChange({ headEducationLevelId: value as number }); }}
                        disabled={localApplicantData.isHeadOfHousehold !== false}
                    >
                        {educationLevelData.map((level, index) => (
                            <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                        ))}
                    </TitleDropdown>
                </div>
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
                <header className="flex justify-between items-center w-full mb-6">
                </header>
                <div className="grid grid-cols-3 items-start gap-x-6 gap-y-6">
                    {activeSection === "identificacion" && identificationInputs}
                    {activeSection === "vivienda" && houseInputs}
                    {activeSection === "familia" && familyInputs}
                </div>
            </section>
        </Box>
    );
}