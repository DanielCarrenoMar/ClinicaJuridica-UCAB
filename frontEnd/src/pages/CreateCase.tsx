import type { Dispatch, SetStateAction } from "react";
import {  useEffect, useState, useRef } from "react";
import { Outlet, useOutletContext, useNavigate, useLocation } from "react-router";
import Box from "#components/Box.tsx";
import ConfirmDialog from "#components/dialogs/ConfirmDialog.tsx";


import { defaultCaseDAO, type CaseDAO } from "#database/daos/caseDAO.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import type { PersonModel } from "#domain/models/person.ts";

export type CaseOutletContext = {
    caseDAO: CaseDAO;
    setCaseDAO: Dispatch<SetStateAction<CaseDAO>>;
    updateCaseDAO: (updatedFields: Partial<CaseDAO>) => void;
    caseBeneficiaries: PersonModel[];
    setCaseBeneficiaries: Dispatch<SetStateAction<PersonModel[]>>;
    applicantModel: ApplicantModel;
    setApplicantModel: Dispatch<SetStateAction<ApplicantModel>>;
    updateApplicantModel: (updatedFields: Partial<ApplicantModel>) => void;
    isApplicantExisting: boolean;
    setIsApplicantExisting: Dispatch<SetStateAction<boolean>>;
    dbOriginalData: Partial<ApplicantModel> | null;
    setDbOriginalData: Dispatch<SetStateAction<Partial<ApplicantModel> | null>>;
};

export function useCaseOutletContext() {
    return useOutletContext<CaseOutletContext>();
}

function CreateCase() {
    const navigate = useNavigate();
    const location = useLocation();
    const [caseDAO, setCaseDAO] = useState<CaseDAO>(defaultCaseDAO);
    const [caseBeneficiaries, setCaseBeneficiaries] = useState<PersonModel[]>([]);
    const [applicantModel, setApplicantModel] = useState<Partial<ApplicantModel>>({ identityCard: '' } as ApplicantModel);
    const [isApplicantExisting, setIsApplicantExisting] = useState<boolean>(false);
    const [dbOriginalData, setDbOriginalData] = useState<Partial<ApplicantModel> | null>(null);
    const [showNavigateConfirm, setShowNavigateConfirm] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
    const allowNavigationRef = useRef(false);

    // Función para detectar si hay datos ingresados
    const hasUnsavedData = () => {
        // Verificar si hay datos en el solicitante
        const hasApplicantData = applicantModel.identityCard && applicantModel.identityCard.trim().length > 0 &&
            applicantModel.fullName && applicantModel.fullName.trim().length > 0;
        
        // Verificar si hay datos en el caso (más allá de los valores por defecto)
        const hasCaseData = caseDAO.problemSummary && caseDAO.problemSummary.trim().length > 0 ||
            caseDAO.idLegalArea !== null && caseDAO.idLegalArea !== undefined;
        
        return hasApplicantData || hasCaseData;
    };

    // Prevenir cerrar/recargar la página si hay datos sin guardar
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedData() && !allowNavigationRef.current) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [applicantModel, caseDAO]);

    // Interceptar intentos de navegación (clicks en links)
    useEffect(() => {
        if (!hasUnsavedData()) return;

        const handleLinkClick = (e: MouseEvent) => {
            if (allowNavigationRef.current) return;
            
            const target = e.target as HTMLElement;
            const link = target.closest('a[href]') as HTMLAnchorElement;
            
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href || href === location.pathname) return;
            
            // Si estamos navegando dentro del flujo de crear caso, permitir
            if (href.startsWith('/crearCaso')) return;
            
            // Si hay datos sin guardar y queremos salir, mostrar confirmación
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            setPendingNavigation(href);
            setShowNavigateConfirm(true);
        };

        // Usar capture phase para interceptar antes que React Router
        document.addEventListener('click', handleLinkClick, true);
        return () => {
            document.removeEventListener('click', handleLinkClick, true);
        };
    }, [location, applicantModel, caseDAO]);

    // Interceptar botón atrás/adelante del navegador
    const prevLocationRef = useRef(location.pathname);
    useEffect(() => {
        if (!hasUnsavedData()) {
            prevLocationRef.current = location.pathname;
            return;
        }

        // Solo agregar estado si cambiamos de ubicación
        if (prevLocationRef.current !== location.pathname) {
            prevLocationRef.current = location.pathname;
            // Agregar un estado al historial para poder detectar popstate
            window.history.pushState({ preventBack: true }, '', location.pathname);
        }

        const handlePopState = (e: PopStateEvent) => {
            // Si hay datos sin guardar y el usuario usa el botón atrás/adelante
            if (!allowNavigationRef.current && hasUnsavedData()) {
                // Revertir la navegación
                window.history.pushState({ preventBack: true }, '', location.pathname);
                setShowNavigateConfirm(true);
                // El usuario debe confirmar para salir
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location, applicantModel, caseDAO]);

    const handleConfirmNavigate = () => {
        allowNavigationRef.current = true;
        setShowNavigateConfirm(false);
        if (pendingNavigation) {
            // Permitir la navegación
            setTimeout(() => {
                navigate(pendingNavigation);
            }, 0);
        }
        // Limpiar el flag después de un momento para permitir la navegación
        setTimeout(() => {
            allowNavigationRef.current = false;
        }, 100);
    };

    const handleCancelNavigate = () => {
        setShowNavigateConfirm(false);
        setPendingNavigation(null);
    };

    function updateCaseDAO(updatedFields: Partial<CaseDAO>) {
        setCaseDAO((prev) => ({
            ...prev,
            ...updatedFields,
        } as CaseDAO));
    }

    function updateApplicantModel(updatedFields: Partial<ApplicantModel>) {
        setApplicantModel((prev) => ({
            ...prev,
            ...updatedFields,
        } as ApplicantModel));
    }

    return (
        <Box className="p-0!">
            <Outlet context={{
                caseDAO, setCaseDAO, updateCaseDAO,
                caseBeneficiaries, setCaseBeneficiaries,
                applicantModel, setApplicantModel, updateApplicantModel,
                isApplicantExisting, setIsApplicantExisting,
                dbOriginalData, setDbOriginalData
            }} />
            <footer className="h-60"></footer>
            <ConfirmDialog
                open={showNavigateConfirm}
                title="¿Salir sin guardar?"
                message="Tienes datos ingresados que no se han guardado. ¿Estás seguro que deseas salir? Se perderán todos los cambios."
                confirmLabel="Salir"
                cancelLabel="Cancelar"
                onConfirm={handleConfirmNavigate}
                onCancel={handleCancelNavigate}
            />
        </Box>
    );
}
export default CreateCase;
