import { useEffect, useRef, useState, useCallback } from "react";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import DropdownCheck from "#components/DropdownCheck/DropdownCheck.tsx";
import DropdownOptionCheck from "#components/DropdownCheck/DropdownOptionCheck.tsx";
import Tabs from "#components/Tabs.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Button from "#components/Button.tsx";
import { CaretDown, ChevronRight, Close, Home, Users } from "flowbite-react-icons/outline";
import { CheckCircle, InfoCircle, UserEdit as UserEditS } from "flowbite-react-icons/solid";
import { useCaseOutletContext } from "./CreateCase.tsx";
import type { GenderTypeModel, IdNacionalityTypeModel, MaritalStatusTypeModel } from "#domain/typesModel.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import { useGetApplicantOrBeneficiaryById } from "#domain/useCaseHooks/useBeneficiaryApplicant.ts";
import LoadingSpinner from "#components/LoadingSpinner.tsx";
import ConfirmDialog from "#components/dialogs/ConfirmDialog.tsx";
import { useBlocker, useNavigate } from "react-router";
import DatePicker from "#components/DatePicker.tsx";
import { activityConditionData, characteristicsData, educationLevelData, locationData, workConditionData } from "#domain/seedData.ts";

const LOOKUP_DEBOUNCE_MS = 600;
const AUTOFILL_SPINNER_MS = 420;

function CreateCaseApplicantStep() {
    const navigate = useNavigate();
    const {
        applicantModel, updateApplicantModel, setIsApplicantExisting, isApplicantExisting,
        dbOriginalData, setDbOriginalData,
    } = useCaseOutletContext();
    const { getApplicantOrBeneficiaryById, loading: loadingApplicantOrBeneficiary } = useGetApplicantOrBeneficiaryById();
    const [identityCardInput, setIdentityCardInput] = useState(applicantModel.identityCard);
    const [isVerifyingIdentityCard, setIsVerifyingIdentityCard] = useState(
        !!(isApplicantExisting && applicantModel.fullName && applicantModel.fullName.trim().length > 0)
    );
    const [stateIndex, setStateIndex] = useState<number | null>(null);
    const [munIndex, setMunIndex] = useState<number | null>(null);

    const [activeSection, setActiveSection] = useState("identificacion");

    const [showAutoFillToast, setShowAutoFillToast] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const [foundApplicant, setFoundApplicant] = useState<ApplicantModel | null>(null);
    const [isApplyingAutoFill, setIsApplyingAutoFill] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [lastIdentityCard, setLastIdentityCard] = useState<string>(
        (isApplicantExisting && applicantModel.fullName && applicantModel.fullName.trim().length > 0)
            ? applicantModel.identityCard.trim()
            : ""
    );

    const [haveMinDataToNextStep, setHaveMinDataToNextStep] = useState(false);

    const isFieldDisabled = (fieldName: keyof ApplicantModel) => {
        if (!isApplicantExisting || !dbOriginalData) return false;
        const dbValue = dbOriginalData[fieldName];
        if (Array.isArray(dbValue) && dbValue.length === 0) return false;
        return dbValue !== undefined && dbValue !== null && dbValue !== "";
    };

    const lookupDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoFillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isFormDirty = useCallback(() => {
        const hasDataEntered = !!(
            (applicantModel.identityCard && applicantModel.identityCard.trim().length > 0) ||
            (applicantModel.fullName && applicantModel.fullName.trim().length > 0) ||
            applicantModel.birthDate ||
            applicantModel.gender ||
            applicantModel.idNationality ||
            applicantModel.email ||
            applicantModel.cellPhone ||
            applicantModel.homePhone
        );

        if (isApplicantExisting && dbOriginalData) {
            // Detectar si campos que estaban vacíos en la BD ahora tienen información
            const relevantFields: (keyof ApplicantModel)[] = [
                'email', 'cellPhone', 'homePhone', 'maritalStatus',
                'isConcubine', 'idState', 'municipalityName', 'parishName',
                'applicantEducationLevel', 'workConditionId', 'activityConditionId',
                'houseType', 'floorMaterial', 'wallMaterial', 'roofMaterial',
                'potableWaterService', 'sewageService', 'cleaningService',
                'servicesIdAvailable', 'memberCount', 'workingMemberCount',
                'children7to12Count', 'studentChildrenCount', 'monthlyIncome',
                'isHeadOfHousehold', 'headEducationLevelId', 'bedroomCount', 'bathroomCount'
            ];

            return relevantFields.some(field => {
                const current = applicantModel[field];
                const original = dbOriginalData[field];
                const isEmptyValue = (val: any) => val === undefined || val === null || val === "";

                return isEmptyValue(original) && !isEmptyValue(current);
            });
        }

        return hasDataEntered;
    }, [applicantModel, isApplicantExisting, dbOriginalData]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty()) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isFormDirty]);

    const blocker = useBlocker(
        ({ nextLocation }) => isFormDirty() && !nextLocation.pathname.includes("/crearCaso/caso")
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

    const sanitizedIdentityCard = applicantModel.identityCard.trim();
    const shouldShowAutoFillToast = showAutoFillToast && Boolean(foundApplicant);
    const toastApplicantName = foundApplicant?.fullName ?? "el registro existente";
    const isAutoFillDisabled = isApplyingAutoFill || loadingApplicantOrBeneficiary;
    const showAutoFillSpinner = isApplyingAutoFill || loadingApplicantOrBeneficiary;

    useEffect(() => {
        setHaveMinDataToNextStep(!!(
            isVerifyingIdentityCard &&
            !showAutoFillToast &&
            Object.keys(validationErrors).length === 0 &&
            applicantModel.fullName &&
            applicantModel.fullName.trim().length > 0 &&
            applicantModel.identityCard &&
            applicantModel.identityCard.trim().length > 0 &&
            applicantModel.birthDate instanceof Date &&
            !isNaN(applicantModel.birthDate.getTime()) &&
            applicantModel.idNationality !== undefined &&
            applicantModel.gender !== undefined
        ));
        /*console.log("Have min data to next step:", {
            "isVerifyingIdentityCard": isVerifyingIdentityCard,
            "NOT showAutoFillToast": !showAutoFillToast,
            "fullName": applicantModel.fullName !== undefined,
            "fullNameTrimmed": applicantModel.fullName?.trim().length > 0,
            "identityCard": applicantModel.identityCard !== undefined,
            "birthDate": applicantModel.birthDate instanceof Date && !isNaN(applicantModel.birthDate.getTime()),
            "idNationality": applicantModel.idNationality !== undefined,
            "gender": applicantModel.gender !== undefined,
        });*/
    }, [applicantModel, showAutoFillToast, isVerifyingIdentityCard, isApplyingAutoFill, validationErrors]);

    // Validation Effect
    useEffect(() => {
        const errors: Record<string, string> = {};
        const { memberCount, workingMemberCount, children7to12Count, studentChildrenCount } = applicantModel;

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

        // Validate identity card contains only numbers
        if (applicantModel.identityCard && /[^0-9]/.test(applicantModel.identityCard)) {
            errors.identityCard = "La cédula solo debe contener números";
        }

        setValidationErrors(errors);
    }, [applicantModel.memberCount, applicantModel.workingMemberCount, applicantModel.children7to12Count, applicantModel.studentChildrenCount, applicantModel.identityCard]);

    useEffect(() => {
        return () => {
            if (lookupDelayRef.current) {
                clearTimeout(lookupDelayRef.current);
            }
            if (autoFillTimeoutRef.current) {
                clearTimeout(autoFillTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!sanitizedIdentityCard || sanitizedIdentityCard.length < 5 || sanitizedIdentityCard === lastIdentityCard) {
            setFoundApplicant(null);
            setShowAutoFillToast(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsVerifyingIdentityCard(true);
            const applicant = await getApplicantOrBeneficiaryById(sanitizedIdentityCard);

            if (applicant) {
                setFoundApplicant(applicant);
                setShowAutoFillToast(true);
                setIsApplicantExisting(true);
            } else {
                setFoundApplicant(null);
                setShowAutoFillToast(false);
                setIsApplicantExisting(false);
            }
        }, LOOKUP_DEBOUNCE_MS);

        lookupDelayRef.current = timeoutId;

        return () => {
            clearTimeout(timeoutId);
            lookupDelayRef.current = null;
        };
    }, [identityCardInput]);

    const handleIdentityCardChange = (text: string) => {
        setIsVerifyingIdentityCard(false)
        setIdentityCardInput(text);
        updateApplicantModel({ identityCard: text });
        setFoundApplicant(null);
        setShowAutoFillToast(false);

        if (lookupDelayRef.current) {
            clearTimeout(lookupDelayRef.current);
            lookupDelayRef.current = null;
        }
    };

    const handleAutoFill = () => {
        if (!foundApplicant || isApplyingAutoFill) {
            return;
        }

        setDbOriginalData({ ...foundApplicant });

        const normalizedBirthDate = foundApplicant.birthDate instanceof Date
            ? foundApplicant.birthDate
            : new Date(foundApplicant.birthDate);
        const normalizedServices = foundApplicant.servicesIdAvailable ? [...foundApplicant.servicesIdAvailable] : undefined;

        updateApplicantModel({
            ...foundApplicant,
            identityCard: sanitizedIdentityCard,
            birthDate: normalizedBirthDate,
            servicesIdAvailable: normalizedServices,
        });

        setIsApplyingAutoFill(true);
        if (autoFillTimeoutRef.current) {
            clearTimeout(autoFillTimeoutRef.current);
        }
        autoFillTimeoutRef.current = setTimeout(() => {
            setIsApplyingAutoFill(false);
            setShowAutoFillToast(false);
        }, AUTOFILL_SPINNER_MS);

        setLastIdentityCard(sanitizedIdentityCard);
    };

    useEffect(() => {
        if (applicantModel.stateName) {
            const sIdx = locationData.findIndex(s => s.name === applicantModel.stateName);
            if (sIdx !== -1) {
                setStateIndex(sIdx);
                if (applicantModel.municipalityName) {
                    const mIdx = locationData[sIdx].municipalities.findIndex(m => m.name === applicantModel.municipalityName);
                    if (mIdx !== -1) {
                        setMunIndex(mIdx);
                    }
                }
            }
        }
    }, [applicantModel.stateName, applicantModel.municipalityName]);

    const identificationInputs = (
        <>
            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleTextInput
                        label="Cédula*"
                        value={applicantModel.identityCard}
                        onChange={handleIdentityCardChange}

                        disabled={isFieldDisabled('identityCard')}
                    />
                    {validationErrors.identityCard && <span className="text-xs text-error mt-1">{validationErrors.identityCard}</span>}
                </div>
                <div>
                    <TitleTextInput
                        label="Nombre y apellido*"
                        value={applicantModel.fullName}
                        onChange={(text) => { updateApplicantModel({ fullName: text }); }}

                        disabled={isFieldDisabled('fullName')}
                    />
                </div>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Sexo*"
                    selectedValue={applicantModel.gender || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ gender: value as GenderTypeModel }); }}
                    disabled={isFieldDisabled('gender')}
                >
                    <DropdownOption value="Masculino">Masculino</DropdownOption>
                    <DropdownOption value="Femenino">Femenino</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <DatePicker
                    label="Fecha Nacimiento*"
                    value={applicantModel.birthDate ? applicantModel.birthDate.toISOString().split('T')[0] : undefined}
                    onChange={(text) => { updateApplicantModel({ birthDate: new Date(text) }); }}
                    disabled={isFieldDisabled('birthDate')}
                />
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Nacionalidad*"
                    selectedValue={applicantModel.idNationality || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ idNationality: value as IdNacionalityTypeModel }); }}
                    disabled={isFieldDisabled('idNationality')}
                >
                    <DropdownOption value="V">Venezolana</DropdownOption>
                    <DropdownOption value="E">Extranjera</DropdownOption>
                    <DropdownOption value="J">Juridica</DropdownOption>
                </TitleDropdown>
            </div>

            <div className="col-span-1">
                <TitleTextInput
                    label="Teléfono local"
                    value={applicantModel.homePhone}
                    onChange={(text) => { updateApplicantModel({ homePhone: text }); }}

                    disabled={isFieldDisabled('homePhone')}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Teléfono celular"
                    value={applicantModel.cellPhone}
                    onChange={(text) => { updateApplicantModel({ cellPhone: text }); }}

                    disabled={isFieldDisabled('cellPhone')}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Correo electrónico"
                    value={applicantModel.email}
                    onChange={(text) => { updateApplicantModel({ email: text }); }}

                    disabled={isFieldDisabled('email')}
                />
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Estado"
                    selectedValue={stateIndex !== null ? stateIndex : undefined}
                    onSelectionChange={(value) => {
                        const idx = value as number;
                        setStateIndex(idx);
                        setMunIndex(null);
                        updateApplicantModel({
                            stateName: locationData[idx].name,
                            idState: idx + 1,
                        });
                    }}
                    disabled={isFieldDisabled('stateName')}
                >
                    {locationData.map((state, index) => (
                        <DropdownOption key={index} value={index}>{state.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Municipio"
                    selectedValue={munIndex !== null ? munIndex : undefined}
                    onSelectionChange={(value) => {
                        const idx = value as number;
                        setMunIndex(idx);
                        updateApplicantModel({
                            municipalityName: locationData[stateIndex!].municipalities[idx].name,
                            municipalityNumber: idx + 1,
                        });
                    }}
                    disabled={stateIndex === null || isFieldDisabled('municipalityName')}
                >
                    {stateIndex !== null && locationData[stateIndex].municipalities.map((mun, index) => (
                        <DropdownOption key={index} value={index}>{mun.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Parroquia"
                    selectedValue={applicantModel.parishName || undefined}
                    onSelectionChange={(value) => {
                        const parishList = stateIndex !== null && munIndex !== null ? locationData[stateIndex].municipalities[munIndex].parishes : [];
                        const pIdx = parishList.indexOf(value as string);
                        updateApplicantModel({
                            parishName: value as string,
                            parishNumber: pIdx !== -1 ? pIdx + 1 : undefined
                        });
                    }}
                    disabled={munIndex === null || isFieldDisabled('parishName')}
                >
                    {stateIndex !== null && munIndex !== null && locationData[stateIndex].municipalities[munIndex].parishes.map((parish, index) => (
                        <DropdownOption key={index} value={parish}>{parish}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            {/* Estadubinato */}
            <div className="col-span-1">
                <TitleDropdown
                    label="Estado Civil"
                    selectedValue={applicantModel.maritalStatus || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ maritalStatus: value as MaritalStatusTypeModel }); }}
                    disabled={isFieldDisabled('maritalStatus')}
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
                    selectedValue={applicantModel.isConcubine !== undefined ? (applicantModel.isConcubine ? 1 : 0) : undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ isConcubine: (value as number) === 1 }); }}
                    disabled={isFieldDisabled('isConcubine')}
                >
                    <DropdownOption value={1}>Si</DropdownOption>
                    <DropdownOption value={0}>No</DropdownOption>
                </TitleDropdown>
            </div>

            <div className="col-span-3">
                <TitleDropdown
                    label="Educación alcanzada"
                    selectedValue={applicantModel.applicantEducationLevel || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ applicantEducationLevel: value as number }); }}
                    disabled={isFieldDisabled('applicantEducationLevel')}
                >
                    {educationLevelData.map((level, index) => (
                        <DropdownOption key={index} value={index + 1}>{level.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Condición Trabajo"
                    selectedValue={applicantModel.workConditionId || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ workConditionId: value as number, activityConditionId: undefined }); }}
                    disabled={isFieldDisabled('workConditionId')}
                >
                    {workConditionData.map((condition, index) => (
                        <DropdownOption key={index} value={index + 1}>{condition.name}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Condición Actividad"
                    selectedValue={applicantModel.activityConditionId || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ activityConditionId: value as number, workConditionId: undefined }); }}
                    disabled={isFieldDisabled('activityConditionId')}
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
                    label="Tipo de vivienda"
                    selectedValue={applicantModel.houseType}
                    onSelectionChange={(value) => { updateApplicantModel({ houseType: value as number }); }}
                    disabled={isFieldDisabled('houseType')}
                >
                    {housingCharacteristicOptions('Tipo de Vivienda').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Habitaciones para dormir"
                    value={applicantModel.bedroomCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ bedroomCount: Number.isNaN(num) ? undefined : num });
                    }}

                    disabled={isFieldDisabled('bedroomCount')}
                />
            </div>
            <div className="col-span-1">
                <TitleTextInput
                    label="Baños"
                    value={applicantModel.bathroomCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ bathroomCount: Number.isNaN(num) ? undefined : num });
                    }}

                    disabled={isFieldDisabled('bathroomCount')}
                />
            </div>

            {/* Material de piso | Material de paredes | material de techo */}
            <div className="col-span-1">
                <TitleDropdown
                    label="Material de piso"
                    selectedValue={applicantModel.floorMaterial}
                    onSelectionChange={(value) => { updateApplicantModel({ floorMaterial: value as number }); }}
                    disabled={isFieldDisabled('floorMaterial')}
                >
                    {housingCharacteristicOptions('Material del piso').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Material de paredes"
                    selectedValue={applicantModel.wallMaterial}
                    onSelectionChange={(value) => { updateApplicantModel({ wallMaterial: value as number }); }}
                    disabled={isFieldDisabled('wallMaterial')}
                >
                    {housingCharacteristicOptions('Material de las paredes').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Material de techo"
                    selectedValue={applicantModel.roofMaterial}
                    onSelectionChange={(value) => { updateApplicantModel({ roofMaterial: value as number }); }}
                    disabled={isFieldDisabled('roofMaterial')}
                >
                    {housingCharacteristicOptions('Material del techo').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>

            <div className="col-span-1">
                <TitleDropdown
                    label="Servicio de agua potable"
                    selectedValue={applicantModel.potableWaterService}
                    onSelectionChange={(value) => { updateApplicantModel({ potableWaterService: value as number }); }}
                    disabled={isFieldDisabled('potableWaterService')}
                >
                    {housingCharacteristicOptions('Servicio de agua potable').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Aguas negras"
                    selectedValue={applicantModel.sewageService}
                    onSelectionChange={(value) => { updateApplicantModel({ sewageService: value as number }); }}
                    disabled={isFieldDisabled('sewageService')}
                >
                    {housingCharacteristicOptions('Eliminacion de excretas (aguas negras)').map((option, index) => (
                        <DropdownOption key={option} value={index}>{option}</DropdownOption>
                    ))}
                </TitleDropdown>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Servicio de aseo"
                    selectedValue={applicantModel.cleaningService}
                    onSelectionChange={(value) => { updateApplicantModel({ cleaningService: value as number }); }}
                    disabled={isFieldDisabled('cleaningService')}
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
                        selectedValues={applicantModel.servicesIdAvailable ?? []}
                        onSelectionChange={(values) => { updateApplicantModel({ servicesIdAvailable: values as number[] }); }}
                        disabled={isFieldDisabled('servicesIdAvailable')}
                    >
                        {housingCharacteristicOptions('Artefactos Domesticos, bienes o servicios del hogar').map((option, index) => (
                            <DropdownOptionCheck key={index} value={index + 1}>{option}</DropdownOptionCheck>
                        ))}
                    </DropdownCheck>
                </div>
                {applicantModel.servicesIdAvailable && applicantModel.servicesIdAvailable.length > 0 && (
                    <div className="mt-2">
                        <span className="text-body-small font-medium text-onSurface/80 block mb-1">Opciones elegidas:</span>
                        <div className="flex flex-wrap gap-2">
                            {applicantModel.servicesIdAvailable.map((id) => {
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
                    value={applicantModel.memberCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ memberCount: Number.isNaN(num) ? undefined : num });
                    }}
                    disabled={isFieldDisabled('memberCount')}
                />
            </div>
            <div className="col-span-1">
                <div className="flex flex-col">
                    <TitleTextInput
                        label="Personas que trabajan"
                        value={applicantModel.workingMemberCount?.toString() ?? ""}
                        onChange={(text) => {
                            const num = Number(text);
                            updateApplicantModel({ workingMemberCount: Number.isNaN(num) ? undefined : num });
                        }}
                        disabled={isFieldDisabled('workingMemberCount')}
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
                            value={applicantModel.children7to12Count?.toString() ?? ""}
                            onChange={(text) => {
                                const num = Number(text);
                                updateApplicantModel({ children7to12Count: Number.isNaN(num) ? undefined : num });
                            }}
                            disabled={isFieldDisabled('children7to12Count')}
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
                            value={applicantModel.studentChildrenCount?.toString() ?? ""}
                            onChange={(text) => {
                                const num = Number(text);
                                updateApplicantModel({ studentChildrenCount: Number.isNaN(num) ? undefined : num });
                            }}
                            disabled={isFieldDisabled('studentChildrenCount')}
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
                    value={applicantModel.monthlyIncome ?? ""}
                    onChange={(text) => { updateApplicantModel({ monthlyIncome: text }); }}

                    disabled={isFieldDisabled('monthlyIncome')}
                />
            </div>

            {/* Es jefe de hogar | Educación alcanzada por jefe del hogar */}
            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleDropdown
                        label="Es jefe de hogar"
                        selectedValue={(applicantModel.isHeadOfHousehold ?? "").toString()}
                        onSelectionChange={(value) => { updateApplicantModel({ isHeadOfHousehold: value === "true" }); }}
                        disabled={isFieldDisabled('isHeadOfHousehold')}
                    >
                        <DropdownOption value="true">Si</DropdownOption>
                        <DropdownOption value="false">No</DropdownOption>
                    </TitleDropdown>
                </div>
                <div>
                    <TitleDropdown
                        label="Educación alcanzada por jefe del hogar"
                        selectedValue={applicantModel.headEducationLevelId || undefined}
                        onSelectionChange={(value) => { updateApplicantModel({ headEducationLevelId: value as number }); }}
                        disabled={isFieldDisabled('headEducationLevelId') || applicantModel.isHeadOfHousehold !== false}
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
        <>
            <header className="bg-surface/70 flex items-center justify-between rounded-t-xl px-4 h-16 shrink-0">
                <div className="flex items-center gap-2.5">
                    <UserEditS className="size-8!" />
                    <h1 className="text-label-medium">Solicitante</h1>
                </div>
                <div className="flex items-end gap-2.5">
                    <Button onClick={() => { setShowCancelConfirm(true); }} variant="outlined" icon={<Close />} className="h-10 w-28">Cancelar</Button>
                    <Button onClick={() => { navigate("/crearCaso/caso"); }} disabled={!haveMinDataToNextStep} variant="outlined" icon={<ChevronRight />} className="w-32">Siguiente</Button>
                </div>
            </header>
            <section className="flex py-2">
                <Tabs selectedId={activeSection} onChange={setActiveSection} className='pb-2'>
                    <Tabs.Item id="identificacion" label="Identificación" icon={<CaretDown />} />
                    <Tabs.Item id="vivienda" label="Vivienda y Servicios" icon={<Home />} />
                    <Tabs.Item id="familia" label="Familia y Hogar" icon={<Users />} />
                </Tabs>
            </section>
            <section className="px-4 pb-6 overflow-y-auto grid grid-cols-3 items-start gap-x-6 gap-y-6">
                {activeSection === "identificacion" && identificationInputs}
                {activeSection === "vivienda" && houseInputs}
                {activeSection === "familia" && familyInputs}
                <footer className="h-60"></footer>
            </section>
            <ConfirmDialog
                open={showCancelConfirm}
                title="Cancelar creación de caso"
                message="Se perderán los datos ingresados. ¿Desea volver al inicio?"
                onConfirm={() => { setShowCancelConfirm(false); navigate("/"); }}
                onCancel={() => { setShowCancelConfirm(false); }}
            />
            {shouldShowAutoFillToast && (
                <div className="fixed top-24 right-6 z-40">
                    <div className="rounded-xl gap-3 bg-surface px-5 py-4 shadow-2xl ring-1 ring-onSurface/10 flex" role="status">
                        <div className="flex flex-col py-2 items-start gap-2">
                            <header className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <InfoCircle />
                                    <h3 className="text-label-small">Cédula encontrada</h3>
                                </div>
                            </header>
                            <p className="mx-2 text-body-small text-onSurface/70">Se encontro el registro de <strong className="text-body-large">{toastApplicantName}</strong></p>
                            <div className="mt-3 flex w-full items-center gap-3">
                                <Button
                                    type="button"
                                    variant="resalted"
                                    onClick={handleAutoFill}
                                    disabled={isAutoFillDisabled}
                                    icon={showAutoFillSpinner ? <LoadingSpinner /> : <CheckCircle className="h-4 w-4" />}
                                    className="flex-1"
                                >
                                    Autocompletar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateCaseApplicantStep;
