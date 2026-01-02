import type { ReactNode } from "react";
import type { CaseModel } from "#domain/models/case.ts";
import { Book, ScaleBalanced, User } from "flowbite-react-icons/solid";
import type { CaseStatusTypeModel } from "#domain/typesModel.ts";

interface CaseCardProps {
    caseData: CaseModel;
    matches?: Record<string, Array<[number, number]>>;
}

const statusConfig: Record<CaseStatusTypeModel, { color: string; label: string }> = {
    OPEN: { color: "bg-success", label: "Abierto" },
    IN_PROGRESS: { color: "bg-warning", label: "En Trámite" },
    CLOSED: { color: "bg-error", label: "Cerrado" },
    PAUSED: { color: "bg-onSurface", label: "En Pausa" },
};

function highlightText(text: string | number, indices?: Array<[number, number]>): ReactNode {
    const value = String(text ?? "");
    if (!indices?.length) return value;

    const parts: ReactNode[] = [];
    let lastIndex = 0;

    indices.forEach(([start, end], idx) => {
        if (start > lastIndex) {
            parts.push(value.slice(lastIndex, start));
        }
        parts.push(
            <mark key={`hl-${idx}`} className="bg-warning/40 text-onSurface font-medium">
                {value.slice(start, end + 1)}
            </mark>
        );
        lastIndex = end + 1;
    });

    if (lastIndex < value.length) {
        parts.push(value.slice(lastIndex));
    }

    return parts;
}

export default function CaseCard({ caseData, matches }: CaseCardProps) {
    const {
        compoundKey,
        caseStatus,
        createdAt,
        applicantName,
        legalAreaName,
        problemSummary,
        lastActionDate,
        lastActionDescription
    } = caseData;

    const config = statusConfig[caseStatus] || statusConfig.OPEN;
    const formattedDate = createdAt.toLocaleDateString("es-ES");

    return (
        <div className="bg-surface/70 flex flex-col gap-1 h-28 overflow-hidden relative rounded-3xl w-full max-w-5xl">
            <header className={`flex text-surface justify-between relative ${config.color} px-4 pt-2.5 pb-2`}>
                <h4 className="text-body-medium ">
                    {highlightText(compoundKey, matches?.compoundKey)}
                </h4>
                <h5 className="text-body-small">
                    {formattedDate}
                </h5>
            </header>
            <div className="flex gap-2.5 items-start relative text-body-small w-full px-4 py-2">
                <div className="flex flex-col gap-1 justify-center min-w-40">
                    <span className="flex gap-1 items-center">
                        <User/>
                        <p className="font-light truncate max-w-32">
                            {highlightText(applicantName, matches?.applicantName)}
                        </p>
                    </span>
                    <span className="flex gap-1 items-center">
                        <ScaleBalanced/>
                        <p className="font-ligh truncate max-w-32">
                            {highlightText(legalAreaName, matches?.legalAreaName)}
                        </p>
                    </span>
                </div>

                <div className="h-full w-px bg-onSurface/20 mx-2"></div>

                <div className="flex flex-col text-body-small gap-1 justify-between h-full min-w-40">
                    <span className="flex gap-2 items-start">
                        <Book/>
                        <span className="flex flex-col items-center">
                            <h5 className="align-middle">
                                Última acción {lastActionDate ? `el ${lastActionDate.toLocaleDateString("es-ES")}` : 'N/A'}
                            </h5>
                        </span>
                    </span>
                    <p className="font-lighttruncate">
                        {lastActionDescription || "Sin acciones"}
                    </p>
                </div>

                <div className="flex-1 h-full text-right overflow-hidden text-body-small">
                    <p className=" line-clamp-3">
                        {highlightText(problemSummary, matches?.problemSummary)}
                    </p>
                </div>
            </div>
        </div>
    );
}
