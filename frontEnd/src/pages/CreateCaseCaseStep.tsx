import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import { useCaseOutletContext } from "./CreateCase.tsx";

function CreateCaseCaseStep() {
    const { applicantModel, caseDAO, updateCaseDAO} = useCaseOutletContext();

    return (
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-6">
                <TitleDropdown
                    label="Area legal"
                    selectedValue={caseDAO.idLegalArea}
                    onSelectionChange={(value) => { updateCaseDAO({ idLegalArea: value as number }) }}
                >
                    <DropDownOption value={1}>Civil</DropDownOption>
                    <DropDownOption value={2}>Penal</DropDownOption>
                    <DropDownOption value={3}>Laboral</DropDownOption>
                    <DropDownOption value={4}>Familia</DropDownOption>
                </TitleDropdown>
            </div>
            <div className="col-span-12">
                <TitleTextInput
                    label="Descripcion breve"
                    value={caseDAO.problemSummary}
                    onChange={(text) => { updateCaseDAO({ problemSummary: text }); }}
                    placeholder="Detalle rapido del caso"
                />
            </div>
            <div className="col-span-12 text-body-medium text-onSurface/80">
                <p>
                    Solicitante seleccionado: <span className="font-semibold">{applicantModel.fullName || "Pendiente"}</span>
                </p>
            </div>
        </div>
    );
}

export default CreateCaseCaseStep;
