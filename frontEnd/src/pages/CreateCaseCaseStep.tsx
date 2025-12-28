import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import { useCaseOutletContext } from "./CreateCase.tsx";

function CreateCaseCaseStep() {
    const { caseModel, setCaseModel } = useCaseOutletContext();

    const updateCaseDetail = (field: keyof typeof caseModel, value: string) => {
        setCaseModel((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-6">
                <TitleTextInput
                    label="Titulo del caso"
                    value={caseModel.applicantName}
                    onChange={(text) => { updateCaseDetail("title", text); }}
                    placeholder="Conflicto de arrendamiento"
                />
            </div>
            <div className="col-span-6">
                <TitleDropdown
                    label="Area legal"
                    selectedValue={caseModel.caseDetail.legalArea || undefined}
                    onSelectionChange={(value) => { updateCaseDetail("legalArea", value as string); }}
                >
                    <DropDownOption value="civil">Civil</DropDownOption>
                    <DropDownOption value="penal">Penal</DropDownOption>
                    <DropDownOption value="laboral">Laboral</DropDownOption>
                    <DropDownOption value="familiar">Familia</DropDownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-6">
                <TitleDropdown
                    label="Prioridad"
                    selectedValue={caseModel.caseDetail.priority || undefined}
                    onSelectionChange={(value) => { updateCaseDetail("priority", value as string); }}
                >
                    <DropDownOption value="alta">Alta</DropDownOption>
                    <DropDownOption value="media">Media</DropDownOption>
                    <DropDownOption value="baja">Baja</DropDownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-12">
                <TitleTextInput
                    label="Descripcion breve"
                    value={caseModel.caseDetail.summary}
                    onChange={(text) => { updateCaseDetail("summary", text); }}
                    placeholder="Detalle rapido del caso"
                />
            </div>
            <div className="col-span-12 text-body-medium text-onSurface/80">
                <p>
                    Solicitante seleccionado: <span className="font-semibold">{caseModel.applicant.fullName || "Pendiente"}</span>
                </p>
            </div>
        </div>
    );
}

export default CreateCaseCaseStep;
