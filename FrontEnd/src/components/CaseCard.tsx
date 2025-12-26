import type { CaseModel } from "#domain/models/case.ts";
import type { CaseStatus } from "#domain/models/CaseStatus.ts";
import { Book, ScaleBalanced, User } from "flowbite-react-icons/solid";

interface CaseCardProps {
    caseData: CaseModel;
}

const statusConfig: Record<CaseStatus, { color: string; label: string }> = {
    OPEN: { color: "bg-success", label: "Abierto" },
    IN_PROGRESS: { color: "bg-warning", label: "En Trámite" },
    CLOSED: { color: "bg-error", label: "Cerrado" },
    PAUSED: { color: "bg-onSurface", label: "En Pausa" },
};

export default function CaseCard({ caseData }: CaseCardProps) {
    const {
        compoundKey,
        createAt,
        applicantName,
        legalAreaName,
        problemSummary,
        CasesStatus,
    } = caseData;

    const config = statusConfig[CasesStatus] || statusConfig.OPEN;
    const formattedDate = new Date(createAt).toLocaleDateString("es-ES");

    return (
        <div className="bg-surface/70 flex flex-col gap-1 h-28 overflow-hidden relative rounded-3xl w-full max-w-5xl">
            <header className={`flex align-middle items-center justify-between relative ${config.color} px-4 py-2.5`}>
                <h4 className="font-medium text-body-medium text-surface">
                    {compoundKey}
                </h4>
                <h5 className="font-normal text-body-small text-surface">
                    {formattedDate}
                </h5>
            </header>

            <div className="flex gap-2.5 h-14 items-start relative text-body-small w-full px-4 py-2.5">
                <div className="flex flex-col gap-1 justify-center min-w-40">
                    <span className="flex gap-1 items-center">
                        <User/>
                        <p className="font-light truncate max-w-32">
                            {applicantName}
                        </p>
                    </span>
                    <span className="flex gap-1 items-center">
                        <ScaleBalanced/>
                        <p className="font-ligh truncate max-w-32">
                            {legalAreaName}
                        </p>
                    </span>
                </div>

                <div className="h-full w-px bg-onSurface/20 mx-2"></div>

                <div className="flex flex-col text-body-small gap-1 justify-between h-full min-w-40">
                    <span className="flex gap-2 items-start">
                        <Book/>
                        <span className="flex flex-col items-center">
                            <h5 className="align-middle">
                                Última acción {caseData.lastAction?.registryDate ? `el ${caseData.lastAction.registryDate.toLocaleDateString("es-ES")}` : 'N/A'}
                            </h5>
                        </span>
                    </span>
                    <p className="font-lighttruncate">
                        Sin acciones
                    </p>
                </div>

                <div className="flex-1 h-full text-right overflow-hidden text-body-small">
                    <p className=" line-clamp-3">
                        {problemSummary}
                    </p>
                </div>
            </div>
        </div>
    );
}
