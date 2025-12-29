import { useEffect, useRef, useState } from "react";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import DropdownCheck from "#components/DropdownCheck/DropdownCheck.tsx";
import DropdownOptionCheck from "#components/DropdownCheck/DropdownOptionCheck.tsx";
import Tabs from "#components/Tabs.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Button from "#components/Button.tsx";
import { CaretDown, CheckCircle, Close, Home, Users } from "flowbite-react-icons/outline";
import { useCaseOutletContext } from "./CreateCase.tsx";
import type { SexType, IdNacionality, MaritalStatus } from "#domain/mtypes.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import { useGetApplicantOrBeneficiaryById } from "#domain/useCaseHooks/useBeneficiaryApplicant.ts";

const LOOKUP_DEBOUNCE_MS = 600;
const AUTOFILL_SPINNER_MS = 420;

const LoadingSpinner = () => (
    <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        aria-hidden="true"
    />
);

function CreateCaseApplicantStep() {
    const { applicantModel, updateApplicantModel} = useCaseOutletContext();
    const [activeStep, setActiveStep] = useState("identificacion");
    const { getApplicantOrBeneficiaryById, loading: loadingApplicantOrBeneficiary } = useGetApplicantOrBeneficiaryById();
    const [foundApplicant, setFoundApplicant] = useState<ApplicantModel | null>(null);
    const [showAutoFillToast, setShowAutoFillToast] = useState(false);
    const [isApplyingAutoFill, setIsApplyingAutoFill] = useState(false);
    const lookupDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoFillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sanitizedIdentityCard = applicantModel.identityCard?.trim() ?? "";
    const shouldHighlightForm = Boolean(foundApplicant);
    const shouldShowAutoFillToast = showAutoFillToast && Boolean(foundApplicant);
    const toastApplicantName = foundApplicant?.fullName ?? foundApplicant?.name ?? "el registro existente";
    const isAutoFillDisabled = isApplyingAutoFill || loadingApplicantOrBeneficiary;
    const showAutoFillSpinner = isApplyingAutoFill || loadingApplicantOrBeneficiary;

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
        if (!sanitizedIdentityCard || sanitizedIdentityCard.length < 5) {
            setFoundApplicant(null);
            setShowAutoFillToast(false);
            return;
        }

        let isCancelled = false;
        const timeoutId = setTimeout(async () => {
            const applicant = await getApplicantOrBeneficiaryById(sanitizedIdentityCard);
            if (isCancelled) {
                return;
            }

            if (applicant) {
                setFoundApplicant(applicant);
                setShowAutoFillToast(true);
            } else {
                setFoundApplicant(null);
                setShowAutoFillToast(false);
            }
        }, LOOKUP_DEBOUNCE_MS);

        lookupDelayRef.current = timeoutId;

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
            lookupDelayRef.current = null;
        };
    }, [sanitizedIdentityCard, getApplicantOrBeneficiaryById]);

    const handleIdentityCardChange = (text: string) => {
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
        const normalizedServices = foundApplicant.servicesAvailable ? [...foundApplicant.servicesAvailable] : undefined;

        updateApplicantModel({
            ...foundApplicant,
            identityCard: sanitizedIdentityCard,
            birthDate: normalizedBirthDate,
            servicesAvailable: normalizedServices,
        });

        setIsApplyingAutoFill(true);
        if (autoFillTimeoutRef.current) {
            clearTimeout(autoFillTimeoutRef.current);
        }
        autoFillTimeoutRef.current = setTimeout(() => {
            setIsApplyingAutoFill(false);
            setShowAutoFillToast(false);
        }, AUTOFILL_SPINNER_MS);
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
                <DropdownCheck
                    label="Servicios basicos"
                    selectedValues={applicantModel.servicesAvailable ?? []}
                    onSelectionChange={(values) => { updateApplicantModel({ servicesAvailable: values as string[] }); }}
                >
                    <DropdownOptionCheck value="AGUA">Agua</DropdownOptionCheck>
                    <DropdownOptionCheck value="ELECTRICIDAD">Electricidad</DropdownOptionCheck>
                    <DropdownOptionCheck value="GAS">Gas</DropdownOptionCheck>
                    <DropdownOptionCheck value="ASEO">Aseo</DropdownOptionCheck>
                    <DropdownOptionCheck value="INTERNET">Internet</DropdownOptionCheck>
                    <DropdownOptionCheck value="TELEFONO">Telefono</DropdownOptionCheck>
                    <DropdownOptionCheck value="CLOACAS">Cloacas</DropdownOptionCheck>
                </DropdownCheck>
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
            <section className="relative">
                {shouldHighlightForm && (
                    <div
                        className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-success/60 bg-success/5 shadow-[0_15px_35px_rgba(16,185,129,0.35)]"
                        aria-hidden="true"
                    />
                )}
                <div className="relative z-[1] grid grid-cols-12 gap-x-6 gap-y-6">
                    {activeStep === "identificacion" && identificationInputs}
                    {activeStep === "vivienda" && viviendaInputs}
                    {activeStep === "familia" && familiaInputs}
                </div>
            </section>
            {shouldShowAutoFillToast && (
                <div className="fixed top-24 right-6 z-40 w-[360px]">
                    <div className="rounded-2xl bg-surface px-5 py-4 shadow-2xl ring-1 ring-onSurface/10" role="status">
                        <div className="flex items-start gap-3">
                            <div className="text-success">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-label-medium">Cédula encontrada</p>
                                        <p className="text-body-small text-onSurface/70">
                                            Encontramos datos previos de {toastApplicantName}. Autocompleta el formulario o sigue editando manualmente.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-onSurface/60 transition-colors hover:text-onSurface"
                                        onClick={() => { setShowAutoFillToast(false); }}
                                        aria-label="Cerrar notificación"
                                    >
                                        <Close className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="resalted"
                                        onClick={handleAutoFill}
                                        disabled={isAutoFillDisabled}
                                        icon={showAutoFillSpinner ? <LoadingSpinner /> : <CheckCircle className="h-4 w-4" />}
                                        className="h-10 px-4"
                                    >
                                        Autocompletar
                                    </Button>
                                    <span className="text-xs text-onSurface/60">
                                        Revisarás los datos antes de guardar.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateCaseApplicantStep;
