import type { CaseActionModel } from "#domain/models/caseAction.ts";
import { User, ClipboardList, AlignLeft } from "flowbite-react-icons/outline";
import Dialog from "#components/dialogs/Dialog.tsx";
import { Clipboard, UserCircle, CalendarMonth } from "flowbite-react-icons/solid";
import InBox from "#components/InBox.tsx";

interface CaseActionDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    caseAction: CaseActionModel | null;
}

export default function CaseActionDetailsDialog({
    open,
    onClose,
    caseAction
}: CaseActionDetailsDialogProps) {
    if (!open || !caseAction) return null;

    const formatedData = caseAction.registryDate.toLocaleDateString("es-ES", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <Dialog
            open={open}
            title="Detalles de la Acción"
            onClose={onClose}
        >
            <div className="flex flex-col gap-3">
                <section className="flex flex-col gap-1">
                    <span className="flex gap-2 items-center">
                        <Clipboard />
                        <h4 className="text-label-small">
                            Caso
                        </h4>
                    </span>
                    <p className="text-body-medium">
                        {caseAction.caseCompoundKey}
                    </p>

                    <span className="flex gap-2 items-center">
                        <UserCircle />
                        <h4 className="text-label-small">
                            Usuario Responsable
                        </h4>
                    </span>
                    <p className="text-body-medium">
                        {caseAction.userName}
                    </p>

                    <span className="flex gap-2 items-center">
                        <CalendarMonth />
                        <h4 className="text-label-small">
                            Fecha de Registro
                        </h4>
                    </span>
                    <p className="text-body-medium">
                        {formatedData}
                    </p>
                </section>

                <section>
                    <span className="flex gap-2 items-center">
                        <h4 className="text-label-medium">
                            Descripción
                        </h4>
                    </span>
                    <InBox className="flex-1 overflow-y-scroll max-h-60">
                        <p className="text-body-small">
                            {caseAction.description}
                        </p>
                    </InBox>
                </section>
            </div>
        </Dialog>
    );
}
