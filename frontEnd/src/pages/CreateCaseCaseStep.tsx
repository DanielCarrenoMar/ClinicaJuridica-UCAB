import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import { useCaseOutletContext } from "./CreateCase.tsx";

function CreateCaseCaseStep() {
    const { applicantModel, caseDAO, updateCaseDAO } = useCaseOutletContext();

    return (
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-4">
                <TitleDropdown
                    label="Tipo de proceso"
                    selectedValue={caseDAO.processType}
                    onSelectionChange={(value) => { updateCaseDAO({ processType: value as any }); }}
                >
                    <DropDownOption value="T">Trámite</DropDownOption>
                    <DropDownOption value="A">Asesoría</DropDownOption>
                    <DropDownOption value="CM">Conciliación/Mediación</DropDownOption>
                    <DropDownOption value="R">Redacción</DropDownOption>
                </TitleDropdown>
            </div>
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
            <div className="col-span-6">
                <TitleTextInput
                    label="Núcleo"
                    value={caseDAO.idNucleus?.toString() ?? ""}
                    onChange={(text) => { const num = Number(text); updateCaseDAO({ idNucleus: Number.isNaN(num) ? 0 : num }); }}
                    placeholder="Id de núcleo"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Término"
                    value={caseDAO.term}
                    onChange={(text) => { updateCaseDAO({ term: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="ID solicitante"
                    value={caseDAO.applicantId}
                    onChange={(text) => { updateCaseDAO({ applicantId: text }); }}
                    placeholder="Documento del solicitante"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="ID profesor"
                    value={caseDAO.teacherId}
                    onChange={(text) => { updateCaseDAO({ teacherId: text }); }}
                    placeholder="Documento del profesor"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Periodo profesor"
                    value={caseDAO.teacherTerm}
                    onChange={(text) => { updateCaseDAO({ teacherTerm: text }); }}
                    placeholder="2024-2025"
                />
            </div>
            <div className="col-span-6">
                <TitleTextInput
                    label="Tribunal (opcional)"
                    value={caseDAO.idCourt?.toString() ?? ""}
                    onChange={(text) => { const num = Number(text); updateCaseDAO({ idCourt: Number.isNaN(num) ? undefined : num }); }}
                    placeholder="Id tribunal"
                />
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
                    Solicitante seleccionado: <span className="font-semibold">{applicantModel.beneficiary.name || "Pendiente"}</span>
                </p>
            </div>
        </div>
    );
}

export default CreateCaseCaseStep;
