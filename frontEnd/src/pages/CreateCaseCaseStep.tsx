import { useState } from "react";
import DropDownOption from "#components/DropDown/DropDownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Button from "#components/Button.tsx";
import { useCaseOutletContext } from "./CreateCase.tsx";
import { Upload, Plus, Trash } from "flowbite-react-icons/outline";

function CreateCaseCaseStep() {
    const { applicantModel, caseDAO, updateCaseDAO } = useCaseOutletContext();
    const [files, setFiles] = useState<File[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Array<{
        name: string;
        identification: string;
        relationship: string;
    }>>([]);
    const [newBeneficiary, setNewBeneficiary] = useState({
        name: "",
        identification: "",
        relationship: ""
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddBeneficiary = () => {
        if (newBeneficiary.name && newBeneficiary.identification) {
            setBeneficiaries(prev => [...prev, { ...newBeneficiary }]);
            setNewBeneficiary({ name: "", identification: "", relationship: "" });
        }
    };

    const handleRemoveBeneficiary = (index: number) => {
        setBeneficiaries(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            {/* Información básica del caso */}
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
                <div className="col-span-4">
                    <TitleDropdown
                        label="Área legal"
                        selectedValue={caseDAO.idLegalArea?.toString()}
                        onSelectionChange={(value) => { 
                            updateCaseDAO({ idLegalArea: parseInt(value) });
                        }}
                    >
                        <DropDownOption value="1">Civil</DropDownOption>
                        <DropDownOption value="2">Penal</DropDownOption>
                        <DropDownOption value="3">Laboral</DropDownOption>
                        <DropDownOption value="4">Familia</DropDownOption>
                    </TitleDropdown>
                </div>
                <div className="col-span-4">
                    <TitleTextInput
                        label="Prioridad"
                        value={caseDAO.priority || ""}
                        onChange={(text) => { updateCaseDAO({ priority: text }); }}
                        placeholder="Alta/Media/Baja"
                    />
                </div>

                <div className="col-span-12">
                    <TitleTextInput
                        label="Descripción breve del caso"
                        value={caseDAO.problemSummary || ""}
                        onChange={(text) => { updateCaseDAO({ problemSummary: text }); }}
                        placeholder="Resuma el problema legal..."
                        multiline
                        rows={3}
                    />
                </div>

                <div className="col-span-12">
                    <TitleTextInput
                        label="Hechos relevantes"
                        value={caseDAO.facts || ""}
                        onChange={(text) => { updateCaseDAO({ facts: text }); }}
                        placeholder="Describa los hechos importantes..."
                        multiline
                        rows={4}
                    />
                </div>
            </div>

            {/* Sección de documentos */}
            <div className="border border-[var(--outline)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Documentos del caso
                </h3>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Subir documentos relacionados
                    </label>
                    <div className="border-2 border-dashed border-[var(--outline)] rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
                        <p className="text-[var(--text-secondary)] mb-4">
                            Arrastra y suelta archivos aquí o haz clic para seleccionar
                        </p>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <Button
                            variant="outlined"
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            Seleccionar archivos
                        </Button>
                        <p className="text-sm text-[var(--text-tertiary)] mt-2">
                            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)
                        </p>
                    </div>
                </div>

                {/* Lista de archivos cargados */}
                {files.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2">
                            Archivos cargados ({files.length})
                        </h4>
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center justify-between bg-[var(--surface-secondary)] p-3 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[var(--primary)]/10 rounded flex items-center justify-center">
                                            <span className="text-[var(--primary)] text-sm font-medium">
                                                {file.name.split('.').pop()?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-[var(--text-tertiary)]">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="text"
                                        size="small"
                                        icon={<Trash className="w-4 h-4" />}
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-[var(--error)] hover:bg-[var(--error)]/10"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de beneficiarios */}
            <div className="border border-[var(--outline)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Beneficiarios del caso
                </h3>
                
                {/* Formulario para agregar beneficiario */}
                <div className="grid grid-cols-12 gap-4 mb-6">
                    <div className="col-span-4">
                        <TitleTextInput
                            label="Nombre completo"
                            value={newBeneficiary.name}
                            onChange={(text) => setNewBeneficiary(prev => ({ ...prev, name: text }))}
                            placeholder="Nombre del beneficiario"
                        />
                    </div>
                    <div className="col-span-3">
                        <TitleTextInput
                            label="Cédula/RIF"
                            value={newBeneficiary.identification}
                            onChange={(text) => setNewBeneficiary(prev => ({ ...prev, identification: text }))}
                            placeholder="V-12345678"
                        />
                    </div>
                    <div className="col-span-3">
                        <TitleTextInput
                            label="Parentesco"
                            value={newBeneficiary.relationship}
                            onChange={(text) => setNewBeneficiary(prev => ({ ...prev, relationship: text }))}
                            placeholder="Hijo/a, Esposo/a..."
                        />
                    </div>
                    <div className="col-span-2 flex items-end">
                        <Button
                            variant="filled"
                            icon={<Plus className="w-4 h-4" />}
                            onClick={handleAddBeneficiary}
                            className="w-full"
                        >
                            Agregar
                        </Button>
                    </div>
                </div>

                {/* Lista de beneficiarios */}
                {beneficiaries.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2">
                            Beneficiarios agregados ({beneficiaries.length})
                        </h4>
                        <div className="space-y-2">
                            {beneficiaries.map((beneficiary, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center justify-between bg-[var(--surface-secondary)] p-3 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-[var(--text-primary)]">
                                            {beneficiary.name}
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            {beneficiary.identification} • {beneficiary.relationship}
                                        </p>
                                    </div>
                                    <Button
                                        variant="text"
                                        size="small"
                                        icon={<Trash className="w-4 h-4" />}
                                        onClick={() => handleRemoveBeneficiary(index)}
                                        className="text-[var(--error)] hover:bg-[var(--error)]/10"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Información del solicitante */}
            <div className="bg-[var(--surface-secondary)] rounded-lg p-4">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">
                    Información del solicitante
                </h4>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Nombre completo</p>
                        <p className="font-medium">{applicantModel.fullName || "No especificado"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Cédula</p>
                        <p className="font-medium">{applicantModel.identityCard || "No especificado"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-secondary)]">Teléfono</p>
                        <p className="font-medium">{applicantModel.cellPhone || applicantModel.homePhone || "No especificado"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCaseCaseStep;