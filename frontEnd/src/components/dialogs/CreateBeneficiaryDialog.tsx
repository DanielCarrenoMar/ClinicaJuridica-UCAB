import { useEffect, useState } from "react";
import Button from "#components/Button.tsx";
import DatePicker from "#components/DatePicker.tsx";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Dialog from "#components/dialogs/Dialog.tsx";
import { locationData } from "#domain/seedData.ts";
import type { BeneficiaryDAO } from "#database/daos/beneficiaryDAO.ts";

interface NewBeneficiaryDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: BeneficiaryDAO) => void;
}

export default function CreateBeneficiaryDialog({
  open,
  onClose,
  onCreate,
}: NewBeneficiaryDialogProps) {
  const [formKey, setFormKey] = useState(0);

  const [identityCard, setIdentityCard] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<BeneficiaryDAO["gender"]>();

  const [birthDate, setBirthDate] = useState<string>();
  const [nationality, setNationality] = useState<BeneficiaryDAO["idNationality"]>();

  const [stateIndex, setStateIndex] = useState<number>();
  const [munIndex, setMunIndex] = useState<number>();

  const [idState, setIdState] = useState<number>();
  const [municipalityNumber, setMunicipalityNumber] = useState<number>();
  const [parishNumber, setParishNumber] = useState<number>();

  const resetForm = () => {
    setIdentityCard("");
    setFullName("");
    setGender(undefined);
    setBirthDate(undefined);
    setNationality(undefined);

    setStateIndex(undefined);
    setMunIndex(undefined);

    setIdState(undefined);
    setMunicipalityNumber(undefined);
    setParishNumber(undefined);

    // TitleTextInput usa defaultValue internamente; esto fuerza remount para que el UI se resetee.
    setFormKey((k) => k + 1);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!fullName.trim()) return;
    if (!birthDate || !nationality || !idState || !municipalityNumber || !parishNumber || !gender) return;

    onCreate({
      identityCard: identityCard?.trim(),
      hasId: identityCard !== undefined && identityCard.trim().length > 0,
      gender: gender,
      type: "B",
      fullName: fullName.trim(),
      birthDate: birthDate,
      idNationality: nationality,
      idState,
      municipalityNumber,
      parishNumber,
    });

    onClose();
  };

  return (
    <Dialog open={open} title="Nuevo Beneficiario" onClose={onClose}>
      <div key={formKey} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TitleTextInput
            label="Cédula"
            value={identityCard}
            onChange={setIdentityCard}
            placeholder="V-12345678"
          />
          <TitleTextInput
            label="Nombre"
            value={fullName}
            onChange={setFullName}
            placeholder="Nombre y apellido"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker label="Nacimiento" value={birthDate} onChange={(date) => setBirthDate(date)} />

          <TitleDropdown
            label="Género"
            selectedValue={gender ?? undefined}
            onSelectionChange={(value) => setGender(value as BeneficiaryDAO["gender"])}
          >
            <DropdownOption value="M">Masculino</DropdownOption>
            <DropdownOption value="F">Femenino</DropdownOption>
          </TitleDropdown>

          <TitleDropdown
            label="Nacionalidad"
            selectedValue={nationality ?? undefined}
            onSelectionChange={(value) => setNationality(value as BeneficiaryDAO["idNationality"])}
          >
            <DropdownOption value="V">Venezolana</DropdownOption>
            <DropdownOption value="E">Extranjera</DropdownOption>
            <DropdownOption value="J">Juridica</DropdownOption>
          </TitleDropdown>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <TitleDropdown
                              label="Estado*"
                              selectedValue={stateIndex}
                              onSelectionChange={(value) => {
                                  const idx = value as number;
                                  setStateIndex(idx);
                      setIdState(idx + 1);
                                  setMunIndex(undefined);
                      setMunicipalityNumber(undefined);
                                  setParishNumber(undefined);
                              }}
                          >
                              {locationData.map((state, index) => (
                                  <DropdownOption key={index} value={index}>{state.name}</DropdownOption>
                              ))}
                          </TitleDropdown>
                          <TitleDropdown
                              label="Municipio*"
                              selectedValue={munIndex}
                              onSelectionChange={(value) => {
                                  const idx = value as number;
                                  setMunIndex(idx);
                      setMunicipalityNumber(idx + 1);
                                  setParishNumber(undefined);
                              }}
                    disabled={stateIndex === undefined}
                          >
                    {stateIndex !== undefined && locationData[stateIndex].municipalities.map((mun, index) => (
                                  <DropdownOption key={index} value={index}>{mun.name}</DropdownOption>
                              ))}
                          </TitleDropdown>
                          <TitleDropdown
                              label="Parroquia*"
                    selectedValue={parishNumber}
                              onSelectionChange={(value) => {
                      setParishNumber(value as number);
                              }}
                    disabled={munIndex === undefined}
                          >
                    {stateIndex !== undefined && munIndex !== undefined && locationData[stateIndex].municipalities[munIndex].parishes.map((parish, index) => (
                      <DropdownOption key={index} value={index + 1}>{parish}</DropdownOption>
                              ))}
                          </TitleDropdown>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button
          variant="filled"
          onClick={handleSubmit}
          disabled={!identityCard.trim() || !fullName.trim() || !birthDate || !nationality || !idState || !municipalityNumber || !parishNumber || !gender}
        >
          Crear
        </Button>
      </div>
    </Dialog>
  );
}
