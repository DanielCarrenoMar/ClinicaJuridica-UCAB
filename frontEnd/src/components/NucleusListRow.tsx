import { TrashBin } from "flowbite-react-icons/outline";
import type { NucleusModel } from '#domain/models/nucleus.ts';
import Button from './Button.tsx';

type Props = {
    nucleus: NucleusModel;
    onDelete?: (id: string) => void;
}

export default function NucleusListRow({ nucleus, onDelete }: Props) {
    return (
        <div className="w-full py-2.5 px-4 max-w-5xl bg-white/70 border border-onSurface/20 rounded-2xl flex items-center justify-between hover:bg-surface hover:border-onSurface/40 transition-colors">
            <div className="flex flex-col gap-0.5">
                <div className="text-body-medium font-medium">{nucleus.idNucleus}</div>
                <div className="text-body-small text-onSurface/50">
                    {nucleus.parishName}, {nucleus.municipalityName}, {nucleus.stateName}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-body-small text-onSurface/70">
                    {nucleus.caseCount} {nucleus.caseCount === 1 ? 'Caso Asociado' : 'Casos Asociados'}
                </div>
                {onDelete && (
                    <Button
                        icon={<TrashBin />}
                        onClick={() => onDelete(nucleus.idNucleus)}
                        variant="outlined"
                        className="p-2!"
                        disabled={nucleus.caseCount > 0}
                    />
                )}
            </div>
        </div>
    );
}
