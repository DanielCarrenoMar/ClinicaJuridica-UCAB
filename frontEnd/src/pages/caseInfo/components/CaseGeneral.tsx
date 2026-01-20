import TextInput from '#components/TextInput.tsx';
import Dropdown from '#components/Dropdown/Dropdown.tsx';
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import type { CaseModel } from '#domain/models/case.ts';

interface CaseGeneralProps {
    caseData: CaseModel;
    localCaseData?: CaseModel;
    onChange: (updateField: Partial<CaseModel>) => void;
}

const courts = [
    'Civil',
    'Penal',
    'Agrario',
    'Contencioso Administrativo',
    'Protección de niños, niñas y adolescentes',
    'Laboral'
]

export default function CaseGeneral({ caseData, localCaseData, onChange }: CaseGeneralProps) {
    return (
        <div className="flex flex-col gap-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pr-20">
                <article className="flex flex-col">
                    <h4 className="text-label-small mb-1">Ámbito Legal</h4>
                    <div className="flex flex-col gap-2 pl-2 border-l-2 border-onSurface/10">
                        <div>
                            <h5 className="text-body-large">Materia</h5>
                            <p className="text-body-medium font-medium">{caseData.subjectName}</p>
                        </div>
                        <div>
                            <h5 className="text-body-large">Categoría</h5>
                            <p className="text-body-medium font-medium">{caseData.subjectCategoryName}</p>
                        </div>
                        <div>
                            <h5 className="text-body-large">Ámbito</h5>
                            <p className="text-body-medium font-medium">{caseData.legalAreaName}</p>
                        </div>
                    </div>
                </article>
                <article>
                    <h4 className="text-label-small mb-1">Tipo de Trámite</h4>
                    <p className="text-body-medium">{caseData.processType}</p>
                </article>
                <article>
                    <header className='flex gap-2 items-center'>
                        <h4 className="text-label-small mb-1">Tribunal</h4>
                    </header>
                    <Dropdown
                        selectedValue={localCaseData?.idCourt}
                        onSelectionChange={(val) => {
                            onChange({ idCourt: val as number })
                            onChange({ courtName: courts[(val as number) - 1] })
                        }}
                    >
                        {courts.map((courtName, index) => (
                            <DropdownOption key={index} value={index + 1}>{courtName}</DropdownOption>
                        ))}
                    </Dropdown>
                </article>
            </section>
            <section>
                <header className="flex gap-2 items-center mb-2">
                    <h3 className="text-label-medium">Síntesis del Problema</h3>
                </header>
                <TextInput
                    multiline
                    value={localCaseData?.problemSummary || ''}
                    onChangeText={(val) => onChange({ problemSummary: val })}
                    rows={8}
                />
            </section>
        </div>
    );
}
