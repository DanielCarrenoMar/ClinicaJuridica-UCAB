import { useState } from 'react';
import TitleTextInput from '../TitleTextInput.tsx';
import TitleDropdown from '../TitleDropdown.tsx';
import DropdownOption from '../Dropdown/DropdownOption.tsx';
import Button from '../Button.tsx';
import Dialog from './Dialog.tsx';
import { locationData } from '#domain/seedData.ts';
import type { NucleusDAO } from '#database/daos/nucleusDAO.ts';

type Props = {
    open: boolean;
    onClose: () => void;
    onAdd: (data: NucleusDAO) => Promise<void>;
};

export default function AddNucleusDialog({ open, onClose, onAdd }: Props) {
    const [idNucleus, setIdNucleus] = useState('');
    const [stateIndex, setStateIndex] = useState<number | null>(null);
    const [munIndex, setMunIndex] = useState<number | null>(null);
    const [parishName, setParishName] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const states = locationData;
    const municipalities = stateIndex !== null ? states[stateIndex].municipalities : [];
    const parishes = munIndex !== null ? municipalities[munIndex].parishes : [];

    const handleClose = () => {
        setIdNucleus('');
        setStateIndex(null);
        setMunIndex(null);
        setParishName(undefined);
        onClose();
    };

    const handleSubmit = async () => {
        if (!idNucleus || stateIndex === null || munIndex === null || !parishName) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const pIdx = parishes.indexOf(parishName);
        if (pIdx === -1) return;

        setLoading(true);
        try {
            await onAdd({
                idNucleus,
                idState: stateIndex + 1,
                municipalityNumber: munIndex + 1,
                parishNumber: pIdx + 1,
                isActive: true
            });
            handleClose();
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} title="Añadir Núcleo">
            <div className="flex flex-col gap-6">
                <TitleTextInput
                    label="Nombre del Núcleo"
                    placeholder="Ej. Núcleo Guayana"
                    value={idNucleus}
                    onChange={setIdNucleus}
                />

                <div className="grid grid-cols-3 gap-4">
                    <TitleDropdown
                        label="Estado"
                        selectedValue={stateIndex !== null ? stateIndex : undefined}
                        onSelectionChange={(val) => {
                            setStateIndex(val as number);
                            setMunIndex(null);
                            setParishName(undefined);
                        }}
                    >
                        {states.map((s, i) => (
                            <DropdownOption key={i} value={i}>{s.name}</DropdownOption>
                        ))}
                    </TitleDropdown>

                    <TitleDropdown
                        label="Municipio"
                        selectedValue={munIndex !== null ? munIndex : undefined}
                        onSelectionChange={(val) => {
                            setMunIndex(val as number);
                            setParishName(undefined);
                        }}
                        disabled={stateIndex === null}
                    >
                        {municipalities.map((m, i) => (
                            <DropdownOption key={i} value={i}>{m.name}</DropdownOption>
                        ))}
                    </TitleDropdown>

                    <TitleDropdown
                        label="Parroquia"
                        selectedValue={parishName}
                        onSelectionChange={(val) => setParishName(val as string)}
                        disabled={munIndex === null}
                    >
                        {parishes.map((p, i) => (
                            <DropdownOption key={i} value={p}>{p}</DropdownOption>
                        ))}
                    </TitleDropdown>
                </div>

                <div className="flex justify-end w-full mt-4">
                    <Button
                        variant="resalted"
                        onClick={handleSubmit}
                        disabled={loading || !idNucleus || stateIndex === null || munIndex === null || !parishName}
                        className="min-w-48 w-1/2"
                    >
                        Añadir Núcleo
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
