import { useEffect, useRef, useState } from "react";
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
import ConfirmDialog from "#components/ConfirmDialog.tsx";
import { useNavigate } from "react-router";
import DatePicker from "#components/DatePicker.tsx";

const LOOKUP_DEBOUNCE_MS = 600;
const AUTOFILL_SPINNER_MS = 420;

function CreateCaseApplicantStep() {
    const navigate = useNavigate();
    const { applicantModel, updateApplicantModel, setIsApplicantExisting } = useCaseOutletContext();
    const { getApplicantOrBeneficiaryById, loading: loadingApplicantOrBeneficiary } = useGetApplicantOrBeneficiaryById();
    const [identityCardInput, setIdentityCardInput] = useState(applicantModel.identityCard);
    const [isVerifyingIdentityCard, setIsVerifyingIdentityCard] = useState(false);

    const [activeSection, setActiveSection] = useState("identificacion");

    const [showAutoFillToast, setShowAutoFillToast] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const [foundApplicant, setFoundApplicant] = useState<ApplicantModel | null>(null);
    const [isApplyingAutoFill, setIsApplyingAutoFill] = useState(false);
    const [lastIdentityCard, setLastIdentityCard] = useState<string>("");

    const [haveMinDataToNextStep, setHaveMinDataToNextStep] = useState(false);

    const lookupDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoFillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sanitizedIdentityCard = applicantModel.identityCard.trim();
    const shouldShowAutoFillToast = showAutoFillToast && Boolean(foundApplicant);
    const toastApplicantName = foundApplicant?.fullName ?? foundApplicant?.fullName ?? "el registro existente";
    const isAutoFillDisabled = isApplyingAutoFill || loadingApplicantOrBeneficiary;
    const showAutoFillSpinner = isApplyingAutoFill || loadingApplicantOrBeneficiary;

    useEffect(() => {
        setHaveMinDataToNextStep(!!(
            isVerifyingIdentityCard &&
            !showAutoFillToast &&
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
    }, [applicantModel, showAutoFillToast, isVerifyingIdentityCard, isApplyingAutoFill]);

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
            const applicant = await getApplicantOrBeneficiaryById(sanitizedIdentityCard);
            setIsVerifyingIdentityCard(true);

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

    const identificationInputs = (
        <>
            <div className="col-span-5">
                <TitleTextInput
                    label="Cedula"
                    value={applicantModel.identityCard}
                    onChange={handleIdentityCardChange}
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
                <DatePicker
                    label="Fecha Nacimiento"
                    value={applicantModel.birthDate ? applicantModel.birthDate.toISOString().split('T')[0] : undefined}
                    onChange={(text) => { updateApplicantModel({ birthDate: new Date(text) }); }}
                    
                />
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Sexo"
                    selectedValue={applicantModel.gender || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ gender: value as GenderTypeModel });}}
                >
                    <DropdownOption value="male">Masculino</DropdownOption>
                    <DropdownOption value="female">Femenino</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleDropdown
                    label="Nacionalidad"
                    selectedValue={applicantModel.idNationality || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ idNationality: value as IdNacionalityTypeModel }); }}
                >
                    <DropdownOption value="V">Venezolana</DropdownOption>
                    <DropdownOption value="E">Extranjera</DropdownOption>
                    <DropdownOption value="J">Juridica</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Estado Civil*"
                    selectedValue={applicantModel.maritalStatus || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ maritalStatus: value as MaritalStatusTypeModel }); }}
                >
                    <DropdownOption value="single">Soltero/a</DropdownOption>
                    <DropdownOption value="married">Casado/a</DropdownOption>
                    <DropdownOption value="divorced">Divorciado/a</DropdownOption>
                    <DropdownOption value="widowed">Viudo/a</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-2">
                <TitleDropdown
                    label="Concubinato*"
                    selectedValue={(applicantModel.isConcubine ?? false).toString()}
                    onSelectionChange={(value) => { updateApplicantModel({ isConcubine: value === "true" }); }}
                >
                    <DropdownOption value="true">Si</DropdownOption>
                    <DropdownOption value="false">No</DropdownOption>
                </TitleDropdown>
            </div>

            <div className="col-span-3">
                <TitleTextInput
                    label="Telefono Local*"
                    value={applicantModel.homePhone}
                    onChange={(text) => { updateApplicantModel({ homePhone: text }); }}
                    placeholder="0212-1234567"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Telefono Celular*"
                    value={applicantModel.cellPhone}
                    onChange={(text) => { updateApplicantModel({ cellPhone: text }); }}
                    placeholder="0414-1234567"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Correo Electronico*"
                    value={applicantModel.email}
                    onChange={(text) => { updateApplicantModel({ email: text }); }}
                    placeholder="ejemplo@correo.com"
                />
            </div>

            <div className="col-span-4">
                <TitleTextInput
                    label="Periodo Educativo*"
                    value={applicantModel.applicantStudyTime}
                    onChange={(text) => { updateApplicantModel({ applicantStudyTime: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Nivel de educacion*"
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
                    label="Condicion de Trabajo*"
                    selectedValue={applicantModel.workConditionId || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ workConditionId: value as number }); }}
                >
                    <DropdownOption value={1}>Empleado</DropdownOption>
                    <DropdownOption value={2}>Desempleado</DropdownOption>
                    <DropdownOption value={3}>Independiente</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-4">
                <TitleDropdown
                    label="Condicion de Actividad*"
                    selectedValue={applicantModel.activityConditionId || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ activityConditionId: value as number }); }}
                >
                    <DropdownOption value={1}>Activo</DropdownOption>
                    <DropdownOption value={2}>Inactivo</DropdownOption>
                </TitleDropdown>
            </div>
        </>
    );

    const houseInputs = (
        <>
            <div className="col-span-4">
                <TitleTextInput
                    label="Estado*"
                    value={applicantModel.stateName ?? ""}
                    onChange={(text) => { updateApplicantModel({ stateName: text }); }}
                    placeholder="Bolivar"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Municipio*"
                    value={applicantModel.municipalityName ?? ""}
                    onChange={(text) => { updateApplicantModel({ municipalityName: text }); }}
                    placeholder="Caroni"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Parroquia*"
                    value={applicantModel.parishName ?? ""}
                    onChange={(text) => { updateApplicantModel({ parishName: text }); }}
                    placeholder="Unare"
                />
            </div>
            <div className="col-span-6">
                <DropdownCheck
                    label="Servicios basicos*"
                    selectedValues={applicantModel.servicesIdAvailable ?? []}
                    onSelectionChange={(values) => { updateApplicantModel({ servicesIdAvailable: values as number[] }); }}
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
                    selectedValue={(applicantModel.isHeadOfHousehold ?? false).toString()}
                    onSelectionChange={(value) => { updateApplicantModel({ isHeadOfHousehold: value === "true" }); }}
                >
                    <DropdownOption value="true">Si</DropdownOption>
                    <DropdownOption value="false">No</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleDropdown
                    label="Nivel educativo jefe*"
                    selectedValue={applicantModel.headEducationLevelId || undefined}
                    onSelectionChange={(value) => { updateApplicantModel({ headEducationLevelId: value as number }); }}
                >
                    <DropdownOption value={1}>Primaria</DropdownOption>
                    <DropdownOption value={2}>Secundaria</DropdownOption>
                    <DropdownOption value={3}>Universitaria</DropdownOption>
                    <DropdownOption value={4}>Postgrado</DropdownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Periodo educativo jefe*"
                    value={applicantModel.headStudyTime ?? ""}
                    onChange={(text) => { updateApplicantModel({ headStudyTime: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-3">
                <TitleTextInput
                    label="Integrantes del hogar que trabajan*"
                    value={applicantModel.workingMemberCount?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ workingMemberCount: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="4"
                />
            </div>

            <div className="col-span-3">
                <TitleTextInput
                    label="Ninos entre 7 y 12 añosen el hogar*"
                    value={applicantModel.children7to12Count?.toString() ?? ""}
                    onChange={(text) => {
                        const num = Number(text);
                        updateApplicantModel({ children7to12Count: Number.isNaN(num) ? undefined : num });
                    }}
                    placeholder="1"
                />
            </div>
            <div className="col-span-4">
                <TitleTextInput
                    label="Ingreso mensual del hogar*"
                    value={applicantModel.monthlyIncome ?? ""}
                    onChange={(text) => { updateApplicantModel({ monthlyIncome: text }); }}
                    placeholder="$300"
                />
            </div>
        </>
    );

    return (
        <>
            <header className="bg-surface/70 flex items-center justify-between px-4 h-16">
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
