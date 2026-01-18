import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Plus } from "flowbite-react-icons/outline";
import SearchBar from '#components/SearchBar.tsx';
import { useFindAllSemesters, useDeleteSemester, useCreateSemester } from '#domain/useCaseHooks/useSemester.ts';
import SemesterListRow from '#components/SemesterListRow.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';
import AddSemesterDialog from '#components/dialogs/AddSemesterDialog.tsx';

import ConfirmDialog from '#components/dialogs/ConfirmDialog.tsx';

function Semesters() {
    const { semesters, loading, error, refresh } = useFindAllSemesters();
    const { deleteSemester } = useDeleteSemester();
    const { createSemester } = useCreateSemester();
    const [searchValue, setSearchValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null);

    const filteredSemesters = useMemo(() => {
        if (searchValue === '') return semesters;

        const fuse = new Fuse(semesters, {
            keys: ['term'],
            threshold: 0.3,
            location: 0,
            distance: 100,
            minMatchCharLength: 1
        });

        return fuse.search(searchValue).map((result) => result.item);
    }, [semesters, searchValue]);

    const sortedSemesters = useMemo(() => {
        return [...filteredSemesters].sort((a, b) => {
            return b.startDate.getTime() - a.startDate.getTime();
        });
    }, [filteredSemesters]);

    const handleDeleteClick = (term: string) => {
        setSemesterToDelete(term);
    };

    const confirmDelete = async () => {
        if (!semesterToDelete) return;
        try {
            await deleteSemester(semesterToDelete);
            refresh();
            setSemesterToDelete(null);
        } catch (error: any) {
            alert(error.message);
            setSemesterToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0 max-w-5xl">
            <section className="mb-4 flex items-center justify-between gap-6">
                <SearchBar
                    isOpen={isSearchOpen}
                    onToggle={setIsSearchOpen}
                    placeholder="Buscar semestre..."
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
                            Error al cargar los semestres: {error.message}
                        </div>
                    )}
                    {!loading && !error && sortedSemesters.length === 0 && (
                        <div className="text-body-medium text-onSurface/70 text-center py-8">
                            No hay semestres registrados.
                        </div>
                    )}
                    {!loading && !error && sortedSemesters.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {sortedSemesters.map((semester) => (
                                <SemesterListRow
                                    key={semester.term}
                                    semester={semester}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <AddSemesterDialog
                open={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAdd={async (data) => {
                    try {
                        await createSemester(data);
                        refresh();
                        setIsAddDialogOpen(false);
                    } catch (error: any) {
                        alert(error.message);
                    }
                }}
            />

            <ConfirmDialog
                open={!!semesterToDelete}
                title="Eliminar Semestre"
                message={`¿Está seguro de que desea eliminar el semestre "${semesterToDelete}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onConfirm={confirmDelete}
                onCancel={() => setSemesterToDelete(null)}
            />
        </div>
    );
}

export default Semesters;
