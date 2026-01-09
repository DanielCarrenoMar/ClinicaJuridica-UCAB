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
import { locationData } from "#domain/seedData.ts";
import { educationLevelData, workConditionData, activityConditionData, servicesData } from "#domain/seedData.ts";

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

    useEffect(() => {
        const loadApplicant = async () => {
            const applicantId = id;
            if (!applicantId) return;
            const applicant = await getApplicantById(applicantId);
            if (applicant) {
<<<<<<< HEAD
                setApplicantData(applicant);
                setLocalApplicantData(applicant);

                const sIdx = locationData.findIndex(s => s.name === applicant.stateName);
                if (sIdx !== -1) {
                    setStateIndex(sIdx);
                    const mIdx = locationData[sIdx].municipalities.findIndex(m => m.name === applicant.municipalityName);
                    if (mIdx !== -1) setMunIndex(mIdx);
                }
=======
                // Clonar el objeto profundamente, especialmente las fechas
                const clonedApplicant = {
                    ...applicant,
                    birthDate: applicant.birthDate ? (applicant.birthDate instanceof Date ? new Date(applicant.birthDate) : new Date(applicant.birthDate)) : undefined,
                    createdAt: applicant.createdAt ? (applicant.createdAt instanceof Date ? new Date(applicant.createdAt) : new Date(applicant.createdAt)) : applicant.createdAt,
                    servicesIdAvailable: applicant.servicesIdAvailable ? [...applicant.servicesIdAvailable] : undefined
                };
                setApplicantData(clonedApplicant);
                setLocalApplicantData({ ...clonedApplicant });
>>>>>>> c2ade96 (feat: implementar ediciÃ³n de solicitante y mensaje de no se guardan los cambios)
            }
        };
        loadApplicant();
    }, [id]);

    useEffect(() => {
        if (!localApplicantData || !applicantData) {
            setIsDataModified(false);
            return;
        }
        
        // Función auxiliar para normalizar objetos antes de comparar
        const normalizeForComparison = (obj: ApplicantModel): any => {
            const normalized: any = { ...obj };
            // Normalizar fechas a strings
            if (normalized.birthDate) {
                normalized.birthDate = normalized.birthDate instanceof Date 
                    ? normalized.birthDate.toISOString().split('T')[0] 
                    : new Date(normalized.birthDate).toISOString().split('T')[0];
            } else {
                normalized.birthDate = null;
            }
            if (normalized.createdAt) {
                const createdAtStr = normalized.createdAt instanceof Date 
                    ? normalized.createdAt.toISOString() 
                    : new Date(normalized.createdAt).toISOString();
                normalized.createdAt = createdAtStr;
            }
            // Normalizar arrays
            normalized.servicesIdAvailable = (normalized.servicesIdAvailable || []).sort();
            // Normalizar valores undefined a null para comparación consistente
            Object.keys(normalized).forEach(key => {
                if (normalized[key] === undefined) {
                    normalized[key] = null;
                }
            });
            return normalized;
        };

        const localNormalized = normalizeForComparison(localApplicantData);
        const originalNormalized = normalizeForComparison(applicantData);
        
        const hasChanges = JSON.stringify(localNormalized) !== JSON.stringify(originalNormalized);
        setIsDataModified(hasChanges);
    }, [localApplicantData, applicantData]);

    function discardChanges() {
        if (!applicantData) return;
        // Clonar profundamente el objeto para que React detecte el cambio
        const cloned = {
            ...applicantData,
            birthDate: applicantData.birthDate ? (applicantData.birthDate instanceof Date ? new Date(applicantData.birthDate) : new Date(applicantData.birthDate)) : undefined,
            createdAt: applicantData.createdAt ? (applicantData.createdAt instanceof Date ? new Date(applicantData.createdAt) : new Date(applicantData.createdAt)) : applicantData.createdAt,
            servicesIdAvailable: applicantData.servicesIdAvailable ? [...applicantData.servicesIdAvailable] : undefined
        };
        setLocalApplicantData(cloned);
    }

    async function saveChanges() {
        const applicantId = id;
        if (!applicantId) return;
        if (!localApplicantData || !applicantData) return;
        
        try {
            await updateApplicant(applicantId, localApplicantData);
            // Recargar los datos actualizados
            const updatedApplicant = await getApplicantById(applicantId);
            if (updatedApplicant) {
                const cloned = {
                    ...updatedApplicant,
                    birthDate: updatedApplicant.birthDate ? (updatedApplicant.birthDate instanceof Date ? new Date(updatedApplicant.birthDate) : new Date(updatedApplicant.birthDate)) : undefined,
                    createdAt: updatedApplicant.createdAt ? (updatedApplicant.createdAt instanceof Date ? new Date(updatedApplicant.createdAt) : new Date(updatedApplicant.createdAt)) : updatedApplicant.createdAt,
                    servicesIdAvailable: updatedApplicant.servicesIdAvailable ? [...updatedApplicant.servicesIdAvailable] : undefined
                };
                setApplicantData(cloned);
                setLocalApplicantData({ ...cloned });
            }
        } catch (error) {
            console.error('Error al guardar cambios:', error);
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
                    onChange={() => { }}
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
<<<<<<< HEAD
                    value={(() => {
                        const dateValue = localApplicantData.birthDate instanceof Date
                            ? localApplicantData.birthDate
                            : (localApplicantData.birthDate ? new Date(localApplicantData.birthDate as unknown as string) : undefined);
                        return dateValue ? dateValue.toISOString().split('T')[0] : undefined;
                    })()}
=======
                    value={localApplicantData.birthDate ? (localApplicantData.birthDate instanceof Date ? localApplicantData.birthDate.toISOString().split('T')[0] : new Date(localApplicantData.birthDate).toISOString().split('T')[0]) : undefined}
>>>>>>> c2ade96 (feat: implementar ediciÃ³n de solicitante y mensaje de no se guardan los cambios)
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
                    onSelectionChange={(value) => { handleChange({ applicantEducationLevel: value as number }); }}
                >
                    {educationLevelData.map((level, index) => (
                        <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Trabajo*"
                    selectedValue={localApplicantData.workConditionId || undefined}
                    onSelectionChange={(value) => { handleChange({ workConditionId: value as number }); }}
                >
                    {workConditionData.map((condition, index) => (
                        <DropdownOption key={index} value={index + 1}>{condition.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Actividad*"
                    selectedValue={localApplicantData.activityConditionId || undefined}
                    onSelectionChange={(value) => { handleChange({ activityConditionId: value as number }); }}
                >
                    {activityConditionData.map((condition, index) => (
                        <DropdownOption key={index} value={index + 1}>{condition.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
        </>
    );

    const houseInputs = (
        <>
            <div className="col-span-4">
                <TitleDropdown
                    label="Estado*"
                    selectedValue={stateIndex ?? undefined}
                    onSelectionChange={(value) => {
                        const idx = value as number;
                        setStateIndex(idx);
                        setMunIndex(null);
                        handleChange({
                            stateName: locationData[idx].name,
                            idState: idx + 1,
                            municipalityName: undefined,
                            municipalityNumber: undefined,
                            parishName: undefined,
                            parishNumber: undefined
                        });
                    }}
                >
                    {locationData.map((state, index) => (
                        <DropdownOption key={index} value={index}>{state.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Municipio*"
                    selectedValue={munIndex ?? undefined}
                    onSelectionChange={(value) => {
                        const idx = value as number;
                        setMunIndex(idx);
                        handleChange({
                            municipalityName: locationData[stateIndex!].municipalities[idx].name,
                            municipalityNumber: idx + 1,
                            parishName: undefined,
                            parishNumber: undefined
                        });
                    }}
                    disabled={stateIndex === null}
                >
                    {stateIndex !== null && locationData[stateIndex].municipalities.map((mun, index) => (
                        <DropdownOption key={index} value={index}>{mun.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-4">
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
            <div className="col-span-6">
                <DropdownCheck
                    label="Servicios basicos*"
                    selectedValues={localApplicantData.servicesIdAvailable ?? []}
                    onSelectionChange={(values) => { handleChange({ servicesIdAvailable: values as number[] }); }}
                >
                    {servicesData.map((service) => (
                        <DropdownOptionCheck key={service.id} value={service.id}>{service.name}</DropdownOptionCheck>
                    ))}
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
                    {educationLevelData.map((level, index) => (
                        <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                    ))}
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