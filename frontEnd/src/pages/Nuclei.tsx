import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Plus } from "flowbite-react-icons/outline";
import SearchBar from '#components/SearchBar.tsx';
import { useFindAllNuclei, useDeleteNucleus, useCreateNucleus } from '#domain/useCaseHooks/useNucleus.ts';
import NucleusListRow from '#components/NucleusListRow.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';
import AddNucleusDialog from '#components/dialogs/AddNucleusDialog.tsx';

import ConfirmDialog from '#components/dialogs/ConfirmDialog.tsx';

function Nuclei() {
    const { nuclei, loading, error, refresh } = useFindAllNuclei();
    const { deleteNucleus } = useDeleteNucleus();
    const { createNucleus } = useCreateNucleus();
    const [searchValue, setSearchValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [nucleusToDelete, setNucleusToDelete] = useState<string | null>(null);

    const filteredNuclei = useMemo(() => {
        if (searchValue === '') return nuclei;

        const fuse = new Fuse(nuclei, {
            keys: ['idNucleus', 'parishName', 'municipalityName', 'stateName'],
            threshold: 0.3,
            location: 0,
            distance: 100,
            minMatchCharLength: 1
        });

        return fuse.search(searchValue).map((result) => result.item);
    }, [nuclei, searchValue]);

    const handleDeleteClick = (id: string) => {
        setNucleusToDelete(id);
    };

    const confirmDelete = async () => {
        if (!nucleusToDelete) return;
        try {
            await deleteNucleus(nucleusToDelete);
            refresh();
            setNucleusToDelete(null);
        } catch (error: any) {
            alert(error.message);
            setNucleusToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 max-w-5xl">
            <section className="mb-4 flex items-center justify-between gap-6">
                <SearchBar
                    isOpen={isSearchOpen}
                    onToggle={setIsSearchOpen}
                    placeholder="Buscar núcleo..."
                    onChange={setSearchValue}
                    onSearch={setSearchValue}
                />
                <div className="flex items-center gap-3">
                    <Button
                        icon={<Plus />}
                        onClick={() => setIsAddDialogOpen(true)}
                        variant='outlined'
                    >
                        Añadir
                    </Button>
                </div>
            </section>
            <section className="flex-1 min-h-0">
                <div className="h-full flex flex-col gap-2 overflow-y-auto pb-8">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner />
                        </div>
                    )}
                    {error && (
                        <div className="text-error text-center py-8">
                            Error al cargar los núcleos: {error.message}
                        </div>
                    )}
                    {!loading && !error && filteredNuclei.length === 0 && (
                        <div className="text-body-medium text-onSurface/70 text-center py-8">
                            No hay núcleos registrados.
                        </div>
                    )}
                    {!loading && !error && filteredNuclei.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {filteredNuclei.map((nucleus) => (
                                <NucleusListRow
                                    key={nucleus.idNucleus}
                                    nucleus={nucleus}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <AddNucleusDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAdd={async (data) => {
                    try {
                        await createNucleus(data);
                        refresh();
                        setIsAddDialogOpen(false);
                    } catch (error: any) {
                        alert(error.message);
                    }
                }}
            />

            <ConfirmDialog
                open={!!nucleusToDelete}
                title="Eliminar Núcleo"
                message={`¿Está seguro de que desea eliminar el núcleo "${nucleusToDelete}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={confirmDelete}
                onCancel={() => setNucleusToDelete(null)}
            />
        </div>
    );
}

export default Nuclei;
