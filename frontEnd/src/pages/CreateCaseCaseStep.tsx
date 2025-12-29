import DropdownOption from "#components/DropDown/DropDownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import { User } from "flowbite-react-icons/solid";
import { useCaseOutletContext } from "./CreateCase.tsx";
import TextInput from "#components/TextInput.tsx";
import Button from "#components/Button.tsx";
import Dropdown from "#components/DropDown/DropDown.tsx";

function CreateCaseCaseStep() {
    const { applicantModel, caseDAO, updateCaseDAO} = useCaseOutletContext();

    return (
        <div className="p-4 flex flex-col gap-4">
            <article className="grid grid-cols-4 grid-rows-4 gap-y-4">
                <section className="col-span-2">
                    <h3 className="text-label-small mb-2">
                        Solicitante
                    </h3>
                    <span className="flex items-center gap-2">
                        <User/>
                        <p className="text-body-small">
                            <strong className="text-body-medium">{applicantModel.fullName} </strong>
                            {`${applicantModel.idNationality}-${applicantModel.identityCard}`}
                        </p>
                    </span>
                </section>
                <section className="col-span-2 row-span-2 flex flex-col">
                    <header className="flex justify-between items-center w-full mb-2">
                        <h3 className="text-label-small mb-2">
                            Beneficiarios
                        </h3>
                        <Button variant="outlined" className="h-10">Añadir</Button>
                    </header>
                    <div className="bg-surface rounded-xl border border-onSurface flex-1">

                    </div>
                </section>
                <section className="col-span-2">
                    <TitleDropdown
                        label="Tipo de tramite"
                        selectedValue={caseDAO.processType}
                        onSelectionChange={(value) => { updateCaseDAO({ processType: value as any }); }}
                    >
                        <DropdownOption value="T">Trámite</DropdownOption>
                        <DropdownOption value="A">Asesoría</DropdownOption>
                        <DropdownOption value="CM">Conciliación/Mediación</DropdownOption>
                        <DropdownOption value="R">Redacción</DropdownOption>
                    </TitleDropdown>
                </section>
                <section className="col-span-2">
                    <span className="flex gap-4">
                        <Dropdown
                            label="Area legal"
                            selectedValue={caseDAO.idLegalArea}
                            onSelectionChange={(value) => { updateCaseDAO({ idLegalArea: value as number }) }}
                        >
                            <DropdownOption value={1}>Civil</DropdownOption>
                            <DropdownOption value={2}>Penal</DropdownOption>
                            <DropdownOption value={3}>Laboral</DropdownOption>
                            <DropdownOption value={4}>Familia</DropdownOption>
                        </Dropdown>
                        <Dropdown
                            label="Area legal"
                            selectedValue={caseDAO.idLegalArea}
                            onSelectionChange={(value) => { updateCaseDAO({ idLegalArea: value as number }) }}
                        >
                            <DropdownOption value={1}>Civil</DropdownOption>
                            <DropdownOption value={2}>Penal</DropdownOption>
                            <DropdownOption value={3}>Laboral</DropdownOption>
                            <DropdownOption value={4}>Familia</DropdownOption>
                        </Dropdown>
                    </span>
                </section>
                <section className="col-span-2 row-span-2 flex flex-col">
                    <header className="flex justify-between items-center w-full mb-2">
                        <h3 className="text-label-small mb-2">
                            Recaudos consignados
                        </h3>
                        <Button variant="outlined" className="h-10">Añadir</Button>
                    </header>
                    <div className="bg-surface rounded-xl border border-onSurface flex-1">

                    </div>
                </section>
                <section className="col-span-2">
                    <TitleDropdown
                        label="Nucleo"
                        selectedValue={caseDAO.idNucleus}
                        onSelectionChange={(value) => { updateCaseDAO({ idNucleus: value as string }) }}
                    >
                        <DropdownOption value="GUAYANA">GUAYANA</DropdownOption>
                    </TitleDropdown>
                </section>
            </article>
            <article>
                    <header className="flex justify-between items-center w-full">
                        <h3 className="text-label-small mb-2">
                            Sintesis del problema
                        </h3>
                    </header>
                    
                    <TextInput
                        defaultText={caseDAO.problemSummary}
                        onChangeText={(text) => { updateCaseDAO({ problemSummary: text }); }}
                        multiline={true}
                        placeholder="Detalle rapido del caso"
                    />
            </article>
        </div>
    );
}

export default CreateCaseCaseStep;
