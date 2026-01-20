import { useEffect, useState } from "react";
import Button from "#components/Button.tsx";
import DatePicker from "#components/DatePicker.tsx";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";
import TitleDropdown from "#components/TitleDropdown.tsx";
import TitleTextInput from "#components/TitleTextInput.tsx";
import Dialog from "#components/dialogs/Dialog.tsx";
import { locationData } from "#domain/seedData.ts";
import type { BeneficiaryDAO } from "#database/daos/beneficiaryDAO.ts";
import type { GenderTypeModel } from "#domain/typesModel.ts";
import { typeModelToGenderTypeDao } from "#domain/typesModel.ts";
import { useGetBeneficiaryById } from "#domain/useCaseHooks/useBeneficiary.ts";

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
  const [gender, setGender] = useState<GenderTypeModel>();
  const [birthDate, setBirthDate] = useState<string>();
  const [idNationality, setNationality] = useState<BeneficiaryDAO["idNationality"]>();

  const [stateIndex, setStateIndex] = useState<number | null>(null);
  const [munIndex, setMunIndex] = useState<number | null>(null);
  const [parishName, setParishName] = useState<string>();
  const [validationError, setValidationError] = useState<string | null>(null);

  const { getBeneficiaryById, loading: isChecking } = useGetBeneficiaryById()

  const resetForm = () => {
    setIdentityCard("");
    setFullName("");
    setGender(undefined);
    setBirthDate(undefined);
    setNationality(undefined);
    setStateIndex(null);
    setMunIndex(null);
    setParishName(undefined);
    setValidationError(null);
    setFormKey((k) => k + 1);
  };

  useEffect(() => {
    const checkId = async () => {
      const id = identityCard.trim();
      if (!id) {
        setValidationError(null);
        return;
      }

      setValidationError(null);

      const exists = await getBeneficiaryById(id);

      if (exists) {
        setValidationError("Este beneficiario ya se encuentra registrado");
      }
    };

    checkId();
  }, [identityCard]);

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!fullName.trim()) return;
    if (!birthDate || !gender || !idNationality) return;

    const idState = stateIndex !== null ? stateIndex + 1 : undefined;
    const municipalityNumber = munIndex !== null ? munIndex + 1 : undefined;
    let parishNumber: number | undefined = undefined;

    if (stateIndex !== null && munIndex !== null && parishName) {
      const parishList = locationData[stateIndex].municipalities[munIndex].parishes;
      const pIdx = parishList.indexOf(parishName);
      parishNumber = pIdx !== -1 ? pIdx + 1 : undefined;
    }

    onCreate({
      identityCard: identityCard.trim(),
      hasId: identityCard.trim().length > 0,
      gender: typeModelToGenderTypeDao(gender),
      type: "B",
      fullName: fullName.trim(),
      birthDate: birthDate,
      idNationality,
      idState,
      municipalityNumber,
      parishNumber,
    });

    onClose();
  };

  function handleClose() {
    const isEmpty = !identityCard.trim() && !fullName.trim() && !gender && !birthDate && !idNationality && stateIndex === null;

    if (isEmpty || window.confirm("¿Cerrar el diálogo? Se perderán los datos no guardados."))
      onClose();
  }

  return (
    <Dialog closeOnOutsideClick={false} open={open} title="Nuevo Beneficiario" onClose={handleClose}>
      <div key={formKey} className="flex flex-col gap-4">
        <div className="grid grid-cols-3 items-start gap-x-6 gap-y-6">
          <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <TitleTextInput
                label="Cédula"
                value={identityCard}
                onChange={setIdentityCard}
              />
              {validationError && <span className="text-xs text-error mt-1">{validationError}</span>}
            </div>
            <div>
              <TitleTextInput
                label="Nombre y apellido*"
                value={fullName}
                onChange={setFullName}
              />
            </div>
          </div>

          <div className="col-span-1">
            <TitleDropdown
              label="Sexo*"
              selectedValue={gender || undefined}
              onSelectionChange={(value) => setGender(value as GenderTypeModel)}
            >
              <DropdownOption value="Masculino">Masculino</DropdownOption>
              <DropdownOption value="Femenino">Femenino</DropdownOption>
            </TitleDropdown>
          </div>
          <div className="col-span-1">
            <DatePicker
              label="Fecha Nacimiento*"
              value={birthDate}
              onChange={(text) => setBirthDate(text)}
            />
          </div>
          <div className="col-span-1">
            <TitleDropdown
              label="Nacionalidad*"
              selectedValue={idNationality ?? undefined}
              onSelectionChange={(value) => setNationality(value as BeneficiaryDAO["idNationality"])}
            >
              <DropdownOption value="V">Venezolana</DropdownOption>
              <DropdownOption value="E">Extranjera</DropdownOption>
              <DropdownOption value="J">Juridica</DropdownOption>
            </TitleDropdown>
          </div>

          <div className="col-span-1">
            <TitleDropdown
              label="Estado"
              selectedValue={stateIndex !== null ? stateIndex : undefined}
              onSelectionChange={(value) => {
                const idx = value as number;
                setStateIndex(idx);
                setMunIndex(null);
                setParishName(undefined);
              }}
            >
              {locationData.map((state, index) => (
                <DropdownOption key={index} value={index}>{state.name}</DropdownOption>
              ))}
            </TitleDropdown>
          </div>
          <div className="col-span-1">
            <TitleDropdown
              label="Municipio"
              selectedValue={munIndex !== null ? munIndex : undefined}
              onSelectionChange={(value) => {
                const idx = value as number;
                setMunIndex(idx);
                setParishName(undefined);
              }}
              disabled={stateIndex === null}
            >
              {stateIndex !== null && locationData[stateIndex].municipalities.map((mun, index) => (
                <DropdownOption key={index} value={index}>{mun.name}</DropdownOption>
              ))}
            </TitleDropdown>
          </div>
          <div className="col-span-1">
            <TitleDropdown
              label="Parroquia"
              selectedValue={parishName || undefined}
              onSelectionChange={(value) => {
                setParishName(value as string);
              }}
              disabled={munIndex === null}
            >
              {stateIndex !== null && munIndex !== null && locationData[stateIndex].municipalities[munIndex].parishes.map((parish, index) => (
                <DropdownOption key={index} value={parish}>{parish}</DropdownOption>
              ))}
            </TitleDropdown>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <Button
          variant="resalted"
          onClick={handleSubmit}
          disabled={fullName.trim().length === 0 || !birthDate || !idNationality || !gender || !!validationError || isChecking}
        >
          Crear
        </Button>
      </div>
    </Dialog>
  );
}
