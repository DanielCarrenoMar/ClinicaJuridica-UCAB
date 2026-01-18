import { TrashBin } from "flowbite-react-icons/outline";
import type { SemesterModel } from '#domain/models/semester.ts';
import Button from './Button.tsx';

type Props = {
    semester: SemesterModel;
    onDelete?: (term: string) => void;
}

export default function SemesterListRow({ semester, onDelete }: Props) {
    const userCount = semester.studentCount + semester.teacherCount;
    const isDeletable = semester.caseCount === 0 && userCount === 0;

    return (
        <div className="w-full py-2.5 px-4 max-w-5xl bg-white/70 border border-onSurface/20 rounded-2xl flex items-center justify-between hover:bg-surface hover:border-onSurface/40 transition-colors">
            <div className="flex items-center gap-3">
                <div className="text-body-medium font-medium">{semester.term}</div>
            </div>
            <div className="flex items-center gap-4 text-body-small text-onSurface/70">
                <div>
                    {semester.caseCount} {semester.caseCount === 1 ? 'Caso' : 'Casos'}
                </div>
                <div className="w-1 h-1 rounded-full bg-onSurface/20" />
                <div>
                    {userCount} {userCount === 1 ? 'Usuario' : 'Usuarios'}
                </div>
                {onDelete && (
                    <Button
                        icon={<TrashBin />}
                        onClick={() => onDelete(semester.term)}
                        variant="outlined"
                        disabled={!isDeletable}
                        className="p-2! ms-2"
                        title={!isDeletable ? "No se puede eliminar un semestre con registros asociados" : "Eliminar semestre"}
                    />
                )}
            </div>
        </div>
    );
}
