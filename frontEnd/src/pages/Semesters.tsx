import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Plus } from "flowbite-react-icons/outline";
import SearchBar from '#components/SearchBar.tsx';
import { useGetAllSemesters } from '#domain/useCaseHooks/useSemester.ts';
import SemesterListRow from '#components/SemesterListRow.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import Button from '#components/Button.tsx';

function Semesters() {
    const { semesters, loading, error, refresh } = useGetAllSemesters();
    const [searchValue, setSearchValue] = useState('');

    const filteredSemesters = useMemo(() => {
        if (searchValue === '') return semesters;

        const fuse = new Fuse(semesters, {
            keys: ['term']
        });

        return fuse.search(searchValue).map((result) => result.item);
    }, [semesters, searchValue]);

    const sortedSemesters = useMemo(() => {
        return [...filteredSemesters].sort((a, b) => {
            return b.startDate.getTime() - a.startDate.getTime();
        });
    }, [filteredSemesters]);

    const handleAddSemester = () => {
        console.log('Adding new semester...');
    };

    const handleDeleteSemester = (term: string) => {
        console.log('Deleting semester:', term);
        // TODO: Implementar eliminación de semestre
    };

    return (
        <div className="flex flex-col h-full min-h-0 max-w-5xl">
            <h1 className="text-headline-small text-onSurface mb-4">Semestres</h1>
            <section className="mb-4 flex items-center justify-between gap-6">
                <SearchBar
                    isOpen={true}
                    placeholder="Buscar semestre..."
                    onChange={setSearchValue}
                />
                <div className="flex items-center gap-3">
                    <Button
                        icon={<Plus />}
                        onClick={handleAddSemester}
                        variant='outlined'
                    >
                        Añadir
                    </Button>
                </div>
            </section>
            <section className="flex-1 min-h-0">
                <div className="h-full flex flex-col gap-2 overflow-y-auto">
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
                                    onDelete={handleDeleteSemester}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Semesters;
