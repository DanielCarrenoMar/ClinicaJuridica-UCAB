import { TrashBin } from "flowbite-react-icons/outline";
import type { SemesterModel } from '#domain/models/semester.ts';
import Button from './Button.tsx';

type Props = {
    semester: SemesterModel;
    onDelete?: (term: string) => void;
}

export default function SemesterListRow({ semester, onDelete }: Props) {
    return (
        <div className="w-full py-2.5 px-4 max-w-5xl bg-white/70 border border-onSurface/20 rounded-2xl flex items-center justify-between hover:bg-surface hover:border-onSurface/40 transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-body-medium font-medium">{semester.term}</div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-body-small text-onSurface/70">
                    {semester.caseCount} {semester.caseCount === 1 ? 'Caso Asociado' : 'Casos Asociados'}
                </div>
                {onDelete && (
                    <Button
                        icon={<TrashBin />}
                        onClick={() => onDelete(semester.term)}
                        variant="outlined"
                        className="p-2!"
                    />
                )}
            </div>
        </div>
    );
}
