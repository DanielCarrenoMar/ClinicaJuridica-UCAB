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
            <div className="flex flex-col gap-4">
                <section className="flex flex-wrap justify-between gap-6">
                    {caseAction.caseCompoundKey &&
                        <article>
                            <header className="flex gap-2 items-center">
                                <Clipboard />
                                <h4 className="text-label-small">
                                    Caso
                                </h4>
                            </header>
                            <p className="text-body-medium ps-7">
                                {caseAction.caseCompoundKey}
                            </p>
                        </article>
                    }

                    <article>
                        <header className="flex gap-2 items-center">
                            <UserCircle />
                            <h4 className="text-body-large">
                                Usuario Responsable
                            </h4>
                        </header>
                        <p className="text-body-medium ps-7">
                            {caseAction.userName}
                        </p>
                    </article>

                    <article>
                        <header className="flex gap-2 items-center">
                            <CalendarMonth />
                            <h4 className="text-body-large">
                                Fecha de Registro
                            </h4>
                        </header>
                        <p className="text-body-medium ps-7">
                            {formatedData}
                        </p>
                    </article>
                </section>

                <section>
                    <span className="flex gap-2 items-center">
                        <h4 className="text-label-small">
                            Descripción
                        </h4>
                    </span>
                    <InBox className="flex-1 overflow-y-scroll min-h-30">
                        <p className="text-body-small">
                            {caseAction.description}
                        </p>
                    </InBox>
                </section>
            </div>
        </Dialog>
    );
}
