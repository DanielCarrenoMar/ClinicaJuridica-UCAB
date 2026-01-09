import { useEffect, useState } from "react";
import Button from "#components/Button.tsx";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Dialog from "#components/dialogs/Dialog.tsx";
import type { CaseBeneficiaryTypeDAO } from "#database/typesDAO.ts";

export interface BeneficiaryRelationshipData {
  type: CaseBeneficiaryTypeDAO;
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

  const [type, setType] = useState<CaseBeneficiaryTypeDAO>();
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setType(undefined);
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

    onCreate({
      type,
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
          onSelectionChange={(value) => setType(value as CaseBeneficiaryTypeDAO)}
        >
          <DropdownOption value="D">Directo</DropdownOption>
          <DropdownOption value="I">Indirecto</DropdownOption>
        </TitleDropdown>

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
          disabled={!type || description.trim().length === 0}
        >
          Guardar
        </Button>
      </div>
    </Dialog>
  );
}
