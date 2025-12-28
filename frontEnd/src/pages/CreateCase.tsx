import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router";
import { Close, ChevronRight, UserEdit } from "flowbite-react-icons/outline";
import { UserEdit as UserEditS } from "flowbite-react-icons/solid";
import Box from "#components/Box.tsx";
import Button from "#components/Button.tsx";
import ConfirmDialog from "#components/ConfirmDialog.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import type { CaseModel } from "#domain/models/case.ts";
import type { CaseDAO } from "#database/daos/CaseDAO.ts";
import type { AppointmentDAO } from "#database/daos/AppointmentDAO.ts";

export type CaseOutletContext = {
    caseDAO: CaseDAO;
    setCaseDAO: Dispatch<SetStateAction<CaseDAO>>;
    appointmentDAO: AppointmentDAO;
    setAppointmentDAO: Dispatch<SetStateAction<AppointmentDAO>>;
};

export function useCaseOutletContext() {
    return useOutletContext<CaseOutletContext>();
}

function CreateCase() {
    const navigate = useNavigate();
    const locatetion = useLocation();
    const [caseDAO, setCaseDAO] = useState<CaseDAO>();
    const [appointmentDAO, setAppointmentDAO] = useState<AppointmentDAO>();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const isApplicantStep = locatetion.pathname.includes("solicitante");

    return (
        <LateralMenuLayer locationId="createCase">
            <Box className="p-0! overflow-hidden">
                <header className="bg-surface/70 flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-2.5">
                        <UserEditS className="size-8!" />
                        <h1 className="text-label-medium">Crear caso</h1>
                    </div>
                    <div className="flex items-end gap-2.5">
                        {isApplicantStep ? (
                            <>
                                <Button onClick={() => { setShowCancelConfirm(true); }} variant="outlined" icon={<Close />} className="h-10 w-28">Cancelar</Button>
                                <Button onClick={() => { navigate("/crearCaso/caso"); }} variant="outlined" icon={<ChevronRight />} className="w-32">Siguiente</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => { navigate("/crearCaso/solicitante"); }} variant="outlined" icon={<UserEdit />} className="h-10 w-28">Volver</Button>
                                <Button onClick={() => { navigate("/crearCaso/caso"); }} variant="resalted" icon={<ChevronRight />} className="w-32">Aceptar</Button>
                            </>
                        )
                        }
                        
                    </div>
                </header>
                <div className="px-4 pb-6">
                    {/*<Outlet context={{ caseDAO, setCaseDAO, appointmentDAO, setAppointmentDAO }} />*/}
                </div>
                <ConfirmDialog
                    open={showCancelConfirm}
                    title="Cancelar creación de caso"
                    message="Se perderán los cambios no guardados. ¿Desea volver al inicio?"
                    onConfirm={() => { setShowCancelConfirm(false); navigate("/"); }}
                    onCancel={() => { setShowCancelConfirm(false); }}
                />
            </Box>
        </LateralMenuLayer>
    );
}
export default CreateCase;
