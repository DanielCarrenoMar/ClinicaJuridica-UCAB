import { useEffect, useState } from "react";
import { useParams, useNavigate, useBlocker } from "react-router";
import { useUpdateApplicant, useCreateApplicant } from "#domain/useCaseHooks/useApplicant.ts";
import { useGetApplicantOrBeneficiaryById } from "#domain/useCaseHooks/useBeneficiaryApplicant.ts";
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
import { CaretDown, Close, FilePdf, Home, Users } from "flowbite-react-icons/outline";
import { UserEdit as UserEditS } from "flowbite-react-icons/solid";
import { locationData, characteristicsData } from "#domain/seedData.ts";
import { educationLevelData, workConditionData, activityConditionData } from "#domain/seedData.ts";
import type { BeneficiaryTypeModel } from "#domain/typesModel.ts"
import { useGetBeneficiaryById, useUpdateBeneficiary } from "#domain/useCaseHooks/useBeneficiary.ts";
import { typeModelToGenderTypeDao } from "#domain/typesModel.ts";
import type { BeneficiaryTypeDAO } from "#database/typesDAO.ts";

export default function ApplicantInfo() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getBeneficiaryById, loading: loadingBeneficiary } = useGetBeneficiaryById()
    const { getApplicantOrBeneficiaryById, loading, error } = useGetApplicantOrBeneficiaryById();
    const { updateApplicant, loading: updating } = useUpdateApplicant();
    const { createApplicant, loading: creating } = useCreateApplicant();
    const { updateBeneficiary, loading: updatingBeneficiary } = useUpdateBeneficiary();

    const [applicantData, setApplicantData] = useState<ApplicantModel | null>(null);
    const [localApplicantData, setLocalApplicantData] = useState<ApplicantModel>();
    const [isDataModified, setIsDataModified] = useState(false);
    const [activeSection, setActiveSection] = useState("identificacion");
    const [type, setType] = useState<BeneficiaryTypeModel | null>(null);
    const [hasId, setHasId] = useState<boolean | null>(null);

    const [stateIndex, setStateIndex] = useState<number | null>(null);
    const [munIndex, setMunIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDataModified) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDataModified]);

    const blocker = useBlocker(
        ({ nextLocation }) => isDataModified && !nextLocation.pathname.includes("/solicitante/")
    );

    useEffect(() => {
        if (blocker.state === "blocked") {
            const proceed = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?");
            if (proceed) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker]);

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadApplicant = async () => {
            const applicantId = id;
            if (!applicantId) return;

            // Primero verificar si el solicitante existe realmente
            const applicant = await getApplicantOrBeneficiaryById(applicantId);
            if (!applicant) {
                setApplicantData(null);
                return;
            }

            setType(applicant.type);
            setHasId(applicant.hasId ?? null);

            // Normalize head level and study time if applicant is head of household to avoid dirty state on load
            if (applicant.isHeadOfHousehold && applicant.applicantEducationLevel !== undefined) {
                applicant.headEducationLevelId = applicant.applicantEducationLevel;
                if (applicant.applicantStudyTime !== undefined) {
                    applicant.headStudyTime = applicant.applicantStudyTime;
                }
            }

            setApplicantData(applicant);
            setLocalApplicantData(applicant);
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
        const {
            memberCount, workingMemberCount, children7to12Count, studentChildrenCount,
            fullName, identityCard, birthDate, idNationality, gender
        } = localApplicantData || {};

        if (!localApplicantData) return;

        // Family validations
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

        // Mandatory fields validations
        if (!fullName || fullName.trim().length === 0) errors.fullName = "El nombre es obligatorio";
        if (!identityCard || identityCard.trim().length === 0) errors.identityCard = "La cédula es obligatoria";
        if (!birthDate) errors.birthDate = "La fecha de nacimiento es obligatoria";
        if (!idNationality) errors.idNationality = "La nacionalidad es obligatoria";
        if (!gender) errors.gender = "El género es obligatorio";


        setValidationErrors(prev => {
            // Preserve async Duplicate ID error if sync checks pass for ID
            const preservedIdError = prev.identityCard === "Esta cédula ya está registrada" && !errors.identityCard
                ? prev.identityCard
                : undefined;

            return {
                ...errors,
                ...(preservedIdError ? { identityCard: preservedIdError } : {})
            };
        });
    }, [
        localApplicantData?.memberCount, localApplicantData?.workingMemberCount,
        localApplicantData?.children7to12Count, localApplicantData?.studentChildrenCount,
        localApplicantData?.fullName, localApplicantData?.identityCard,
        localApplicantData?.birthDate, localApplicantData?.idNationality, localApplicantData?.gender,
        localApplicantData?.idState, localApplicantData?.municipalityNumber, localApplicantData?.parishNumber,
        localApplicantData?.stateName, localApplicantData?.municipalityName, localApplicantData?.parishName
    ]);

    useEffect(() => {
        if (localApplicantData?.stateName) {
            const sIdx = locationData.findIndex(s => s.name === localApplicantData.stateName);
            if (sIdx !== -1) {
                setStateIndex(sIdx);
                if (localApplicantData.municipalityName) {
                    const mIdx = locationData[sIdx].municipalities.findIndex(m => m.name === localApplicantData.municipalityName);
                    if (mIdx !== -1) {
                        setMunIndex(mIdx);
                    }
                }
            }
        } else if (localApplicantData?.idState) {
            // Fallback to ID if name is not present
            setStateIndex(localApplicantData.idState - 1);
            if (localApplicantData.municipalityNumber) {
                setMunIndex(localApplicantData.municipalityNumber - 1);
            }
        }
    }, [localApplicantData?.stateName, localApplicantData?.municipalityName, localApplicantData?.idState, localApplicantData?.municipalityNumber]);

    useEffect(() => {
        if (localApplicantData?.isHeadOfHousehold) {
            const updates: Partial<ApplicantModel> = {};

            if (localApplicantData.applicantEducationLevel !== undefined &&
                localApplicantData.headEducationLevelId !== localApplicantData.applicantEducationLevel) {
                updates.headEducationLevelId = localApplicantData.applicantEducationLevel;
            }

            if (localApplicantData.applicantStudyTime !== undefined &&
                localApplicantData.headStudyTime !== localApplicantData.applicantStudyTime) {
                updates.headStudyTime = localApplicantData.applicantStudyTime;
            }

            if (Object.keys(updates).length > 0) {
                handleChange(updates);
            }
        }
    }, [localApplicantData?.isHeadOfHousehold, localApplicantData?.applicantEducationLevel, localApplicantData?.applicantStudyTime]);

    // Check duplicate ID
    useEffect(() => {
        const checkId = async () => {
            if (!localApplicantData?.identityCard || !applicantData?.identityCard) return;

            const newId = localApplicantData.identityCard.trim();
            const originalId = applicantData.identityCard;

            if (newId.length > 0 && newId !== originalId) {
                // Clear previous ID error to avoid flickering if valid
                setValidationErrors(prev => {
                    const next = { ...prev };
                    delete next.identityCard;
                    return next;
                });

                const exists = await getBeneficiaryById(newId);

                if (exists) {
                    setValidationErrors(prev => ({ ...prev, identityCard: "Esta cédula ya está registrada" }));
                }
            } else if (newId === originalId) {
                // If reverted to original, replace error if any (unless it's empty, handled by mandatory check above)
                setValidationErrors(prev => {
                    const next = { ...prev };
                    if (next.identityCard === "Esta cédula ya está registrada") {
                        delete next.identityCard;
                    }
                    return next;
                });
            }
        };

        checkId();
    }, [localApplicantData?.identityCard, applicantData?.identityCard]);

    function discardChanges() {
        setLocalApplicantData(applicantData || undefined);
    }

    async function saveChanges() {
        const applicantId = id;
        if (!applicantId) return;
        if (!localApplicantData || !applicantData) return;

        let savedApplicant: ApplicantModel | null = null;

        if (type === "Solicitante") {
            savedApplicant = await updateApplicant(applicantId, localApplicantData);
        } else if (type === "Beneficiario") {
            // Update beneficiary data - convert Model types to DAO types
            const beneficiaryData = {
                identityCard: localApplicantData.identityCard,
                fullName: localApplicantData.fullName || "",
                gender: localApplicantData.gender ? typeModelToGenderTypeDao(localApplicantData.gender) : "M",
                birthDate: localApplicantData.birthDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                idNationality: localApplicantData.idNationality || "V",
                hasId: hasId ?? false,
                type: "B" as BeneficiaryTypeDAO,
                idState: localApplicantData.idState,
                municipalityNumber: localApplicantData.municipalityNumber,
                parishNumber: localApplicantData.parishNumber
            };
            const updatedBeneficiary = await updateBeneficiary(applicantId, beneficiaryData);
            if (updatedBeneficiary) {
                savedApplicant = {
                    ...localApplicantData,
                    identityCard: updatedBeneficiary.identityCard,
                    fullName: updatedBeneficiary.fullName,
                    gender: updatedBeneficiary.gender,
                    birthDate: updatedBeneficiary.birthDate,
                    idNationality: updatedBeneficiary.idNationality,
                    idState: updatedBeneficiary.idState,
                    municipalityNumber: updatedBeneficiary.municipalityNumber,
                    parishNumber: updatedBeneficiary.parishNumber,
                    createdAt: localApplicantData.createdAt || new Date()
                };
            }
        } else if (hasId === true) { // Si no tiene cedula no se puede crear un aplicant
            savedApplicant = await createApplicant(localApplicantData);
        }

        if (savedApplicant) {
            setApplicantData(savedApplicant);
            setLocalApplicantData(savedApplicant);

            // If ID changed, navigate to new URL
            if (savedApplicant.identityCard !== applicantId) {
                navigate(`/solicitante/${savedApplicant.identityCard}`, { replace: true });
            }
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
                        label="Cédula*"
                        value={localApplicantData.identityCard}
                        onChange={(text) => handleChange({ identityCard: text })}
                    />
                    {validationErrors.identityCard && <span className="text-xs text-error mt-1">{validationErrors.identityCard}</span>}
                </div>
                <div>
                    <TitleTextInput
                        label="Nombre y apellido*"
                        value={localApplicantData.fullName || ""}
                        onChange={(text) => { handleChange({ fullName: text }); }}
                    />
                    {validationErrors.fullName && <span className="text-xs text-error mt-1">{validationErrors.fullName}</span>}
                </div>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Sexo*"
                    selectedValue={localApplicantData.gender || undefined}
                    onSelectionChange={(value) => { handleChange({ gender: value as GenderTypeModel }); }}
                >
                    <DropdownOption value="Masculino">Masculino</DropdownOption>
                    <DropdownOption value="Femenino">Femenino</DropdownOption>
                </TitleDropdown>
                {validationErrors.gender && <span className="text-xs text-error mt-1">{validationErrors.gender}</span>}
            </div>
            <div className="col-span-1">
                <DatePicker
                    label="Fecha Nacimiento"
                    value={localApplicantData.birthDate ? localApplicantData.birthDate.toISOString().split('T')[0] : undefined}
                    onChange={(text) => { handleChange({ birthDate: new Date(text) }); }}
                />
                {validationErrors.birthDate && <span className="text-xs text-error mt-1">{validationErrors.birthDate}</span>}
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Nacionalidad*"
                    selectedValue={localApplicantData.idNationality || undefined}
                    onSelectionChange={(value) => { handleChange({ idNationality: value as IdNacionalityTypeModel }); }}
                >
                    <DropdownOption value="V">Venezolana</DropdownOption>
                    <DropdownOption value="E">Extranjera</DropdownOption>
                    <DropdownOption value="J">Juridica</DropdownOption>
                </TitleDropdown>
                {validationErrors.idNationality && <span className="text-xs text-error mt-1">{validationErrors.idNationality}</span>}
            </div>

            {type === "Solicitante" && (
                <>
                    <div className="col-span-1">
                        <TitleTextInput
                            label="Teléfono local"
                            value={localApplicantData.homePhone || ""}
                            onChange={(text) => { handleChange({ homePhone: text }); }}
                        />
                    </div>
                    <div className="col-span-1">
                        <TitleTextInput
                            label="Teléfono celular"
                            value={localApplicantData.cellPhone || ""}
                            onChange={(text) => { handleChange({ cellPhone: text }); }}
                        />
                    </div>
                    <div className="col-span-1">
                        <TitleTextInput
                            label="Correo electrónico"
                            value={localApplicantData.email || ""}
                            onChange={(text) => { handleChange({ email: text }); }}
                        />
                    </div>
                </>
            )}

            <div className="col-span-1">
                <TitleDropdown
                    label="Estado"
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
                {validationErrors.idState && <span className="text-xs text-error mt-1">{validationErrors.idState}</span>}
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Municipio"
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
                {validationErrors.municipalityNumber && <span className="text-xs text-error mt-1">{validationErrors.municipalityNumber}</span>}
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Parroquia"
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
                {validationErrors.parishNumber && <span className="text-xs text-error mt-1">{validationErrors.parishNumber}</span>}
            </div>

            {type === "Solicitante" && (
                <>
                    {/* Estadubinato */}
                    <div className="col-span-1">
                        <TitleDropdown
                            label="Estado Civil"
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
                            label="Concubinato"
                            selectedValue={localApplicantData.isConcubine !== undefined ? (localApplicantData.isConcubine ? 1 : 0) : undefined}
                            onSelectionChange={(value) => { handleChange({ isConcubine: (value as number) === 1 }); }}
                        >
                            <DropdownOption value={1}>Si</DropdownOption>
                            <DropdownOption value={0}>No</DropdownOption>
                        </TitleDropdown>
                    </div>

                    <div className="col-span-1">
                        <TitleDropdown
                            label="Educación alcanzada"
                            selectedValue={localApplicantData.applicantEducationLevel || undefined}
                            onSelectionChange={(value) => { handleChange({ applicantEducationLevel: value as number }); }}
                        >
                            {educationLevelData.map((level, index) => (
                                <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                            ))}
                        </TitleDropdown>
                    </div>
                    <div className="col-span-1">
                        <TitleTextInput
                            label="Tiempo de estudio"
                            value={localApplicantData.applicantStudyTime || ""}
                            onChange={(text) => { handleChange({ applicantStudyTime: text }); }}
                            disabled={!localApplicantData.applicantEducationLevel}
                        />
                    </div>
                    <div className="col-span-1" />

                    <div className="col-span-1">
                        <TitleDropdown
                            label="Condición Trabajo"
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
                            label="Condición Actividad"
                            selectedValue={localApplicantData.activityConditionId || undefined}
                            onSelectionChange={(value) => { handleChange({ activityConditionId: value as number, workConditionId: undefined }); }}
                        >
                            {activityConditionData.map((condition, index) => (
                                <DropdownOption key={index} value={index + 1}>{condition.name}</DropdownOption>
                            ))}
                        </TitleDropdown>
                    </div>
                </>
            )}
        </>
    );

    const housingCharacteristicOptions = (characteristicName: string) =>
        characteristicsData.find((c) => c.name === characteristicName)?.options ?? [];

    const houseInputs = (
        <>
            {/* Tipo de vivienda | habitaciones para dormir | baños */}
            <div className="col-span-1">
                <TitleDropdown
                    label="Tipo de vivienda"
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
                    label="Habitaciones para dormir"
                    value={localApplicantData.bedroomCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        handleChange({ bedroomCount: Number.isNaN(num) ? undefined : num });
                    }}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Baños"
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
                    label="Material de piso"
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
                    label="Material de paredes"
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
                    label="Material de techo"
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
                    label="Servicio de agua potable"
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
                    label="Aguas negras"
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
                    label="Servicio de aseo"
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
                        <h4 className="text-body-large ">Artefactos Domesticos, bienes o servicios del hogar</h4>
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
                    label="Personas que viven en la vivienda"
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
                        label="Personas que trabajan"
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
                            label="Número de niños entre 7 y 12 años"
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
                            label="Cuántos niños estudian"
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
                    label="Ingresos mensuales del hogar"
                    value={localApplicantData.monthlyIncome ?? ""}
                    onChange={(text) => { handleChange({ monthlyIncome: text }); }}
                />
            </div>

            {/* Es jefe de hogar | Educación alcanzada por jefe del hogar */}
            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleDropdown
                        label="Es jefe de hogar"
                        selectedValue={(localApplicantData.isHeadOfHousehold ?? "").toString()}
                        onSelectionChange={(value) => { handleChange({ isHeadOfHousehold: value === "true" }); }}
                    >
                        <DropdownOption value="true">Si</DropdownOption>
                        <DropdownOption value="false">No</DropdownOption>
                    </TitleDropdown>
                </div>
                <div>
                    <TitleDropdown
                        label="Educación alcanzada por jefe del hogar"
                        selectedValue={localApplicantData.headEducationLevelId || undefined}
                        onSelectionChange={(value) => { handleChange({ headEducationLevelId: value as number }); }}
                        disabled={localApplicantData.isHeadOfHousehold !== false}
                    >
                        {educationLevelData.map((level, index) => (
                            <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                        ))}
                    </TitleDropdown>
                    <TitleTextInput
                        label="Tiempo de estudio del jefe de hogar"
                        value={localApplicantData.headStudyTime || ""}
                        onChange={(text) => { handleChange({ headStudyTime: text }); }}
                        disabled={localApplicantData.isHeadOfHousehold !== false || !localApplicantData.headEducationLevelId}
                    />
                </div>
            </div>
        </>
    );

    return (
        <Box className="p-0! h-full min-h-0 flex flex-col">
            <header className="bg-surface/70 flex items-center justify-between rounded-t-xl px-4 h-16 shrink-0">
                <div className="flex items-center gap-2.5">
                    <UserEditS className="size-8!" />
                    <div className='flex flex-col'>
                        <h1 className="text-label-small">{applicantData.fullName}</h1>
                        <p className='text-body-medium'>{type}</p>
                    </div>
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
                            <Button
                                onClick={saveChanges}
                                disabled={updating || creating || updatingBeneficiary || Object.keys(validationErrors).length > 0 || loadingBeneficiary}
                                variant="resalted"
                                className="h-10 w-32"
                            >
                                Guardar
                            </Button>
                        ) : (
                            <Button onClick={() => { }} icon={<FilePdf />} variant="outlined" className="h-10 w-32">
                                Exportar
                            </Button>
                        )
                    }
                </div>
            </header>
            <section className="flex py-2">
                <Tabs selectedId={activeSection} onChange={setActiveSection} className='pb-2'>
                    <Tabs.Item id="identificacion" label="Identificación" icon={<CaretDown />} />
                    {type === "Solicitante" && <Tabs.Item id="vivienda" label="Vivienda y Servicios" icon={<Home />} />}
                    {type === "Solicitante" && <Tabs.Item id="familia" label="Familia y Hogar" icon={<Users />} />}
                </Tabs>
            </section>
            <section className="px-4 pb-6 overflow-y-auto grid grid-cols-3 items-start gap-x-6 gap-y-6">
                {activeSection === "identificacion" && identificationInputs}
                {activeSection === "vivienda" && houseInputs}
                {activeSection === "familia" && familyInputs}
                <footer className="h-60"></footer>
            </section>
        </Box>
    );
}