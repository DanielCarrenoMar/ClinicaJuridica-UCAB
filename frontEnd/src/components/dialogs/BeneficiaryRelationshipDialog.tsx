import { useEffect, useState } from "react";
import Button from "#components/Button.tsx";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Dialog from "#components/dialogs/Dialog.tsx";
import type { CaseBeneficiaryTypeModel } from "#domain/typesModel.ts";

export interface BeneficiaryRelationshipData {
  type: CaseBeneficiaryTypeModel;
  relationship: string;
  description: string;
}

interface BeneficiaryRelationshipDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: BeneficiaryRelationshipData) => void;
}

export default function BeneficiaryRelationshipDialog({
  open,
  onClose,
  onCreate,
}: BeneficiaryRelationshipDialogProps) {
  const [formKey, setFormKey] = useState(0);

  const [type, setType] = useState<CaseBeneficiaryTypeModel>();
  const [relationship, setRelationship] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setType(undefined);
    setRelationship("");
    setDescription("");

    // TitleTextInput usa defaultValue internamente; esto fuerza remount para que el UI se resetee.
    setFormKey((k) => k + 1);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!type) return;
    if (!relationship.trim()) return;

    onCreate({
      type,
      relationship: relationship.trim(),
      description: description.trim(),
    });

    onClose();
  };

  function handleClose() {
    if (window.confirm("¿Cerrar el diálogo? Se perderán los datos no guardados.")) {
      onClose();
    }
  }

  return (
    <Dialog
      closeOnOutsideClick={false}
      open={open}
      title="Relación con el solicitante"
      onClose={handleClose}
    >
      <div key={formKey} className="flex flex-col gap-4">
        <TitleDropdown
          label="Tipo"
          selectedValue={type ?? undefined}
          onSelectionChange={(value) => setType(value as CaseBeneficiaryTypeModel)}
        >
          <DropdownOption value="Directo">Directo</DropdownOption>
          <DropdownOption value="Indirecto">Indirecto</DropdownOption>
        </TitleDropdown>

        <TitleTextInput
          label="Relación"
          value={relationship}
          onChange={setRelationship}
          placeholder="Ej: Hijo, cónyuge, representante..."
        />

        <TitleTextInput
          label="Descripción"
          value={description}
          onChange={setDescription}
          placeholder="Ej: Hijo del solicitante"
        />
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button
          variant="resalted"
          onClick={handleSubmit}
          disabled={!type || relationship.trim().length === 0 || description.trim().length === 0}
        >
          Guardar
        </Button>
      </div>
    </Dialog>
  );
}
