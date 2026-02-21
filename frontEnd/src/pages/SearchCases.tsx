import CaseCard from "#components/CaseCard.tsx";
import Button from "#components/Button.tsx";
import DropdownCheck from "#components/DropdownCheck/DropdownCheck.tsx";
import DropdownOptionCheck from "#components/DropdownCheck/DropdownOptionCheck.tsx";
import Fuse from "fuse.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetCases } from "#domain/useCaseHooks/useCase.ts";
import { useLateralMenuContext } from "#layers/LateralMenuLayer.tsx";
import { Close, ArrowLeft, ArrowRight } from "flowbite-react-icons/outline";
import Dropdown from "#components/Dropdown/Dropdown.tsx";
import DropdownOption from "#components/Dropdown/DropdownOption.tsx";

function SearchCases() {
    const [searchParams, setSearchParams] = useSearchParams();
    const getFilterValues = (key: string) => {
        const param = searchParams.get(key);
        // Using '|' as separator because some values contain commas
        return param ? param.split('|') : [];
    };

    const searchText = searchParams.get('q') || '';
    const { setDefaultSearchText } = useLateralMenuContext();

    useEffect(() => {
        setDefaultSearchText(searchText);
    }, [searchText, setDefaultSearchText]);

    const statusFilters = getFilterValues('status');
    const caseTypeFilters = getFilterValues('caseType');
    const courtFilters = getFilterValues('court');
    const termFilters = getFilterValues('term');

    const hasAnyFilters =
        statusFilters.length > 0 ||
        caseTypeFilters.length > 0 ||
        courtFilters.length > 0 ||
        termFilters.length > 0;

    const { cases: realCases, loading, error } = useGetCases();
    const [page, setPage] = useState(1);
    const pageSize = 15;
    const [sortOrder, setSortOrder] = useState("lastActionAsc");

    useEffect(() => {
        setPage(1);
    }, [searchParams]);

    useEffect(() => {
        setPage(1);
    }, [sortOrder]);

    const cases = useMemo(() => [...realCases], [realCases]);


    const filteredCases = useMemo(() => {
        return cases.filter(c => {
            const statusMatch = statusFilters.length === 0 || statusFilters.includes(c.caseStatus);
            const typeMatch = caseTypeFilters.length === 0 || (!!c.subjectName && caseTypeFilters.some(f => f.toLowerCase() === c.subjectName.toLowerCase()));
            const courtMatch = courtFilters.length === 0 || (!!c.courtName && courtFilters.some(f => f.toLowerCase() === (c.courtName || "").toLowerCase()));
            const termMatch = termFilters.length === 0 || (!!c.term && termFilters.includes(c.term));

            return !!(statusMatch && typeMatch && courtMatch && termMatch);
        });
    }, [cases, statusFilters, caseTypeFilters, courtFilters, termFilters]);

    // 2. Then, apply Fuse.js search on the filtered results
    const fuse = useMemo(() => new Fuse(filteredCases, {
        keys: [
            "compoundKey",
            "processType",
            "problemSummary",
            "applicantId",
            "applicantName",
            "idNucleus",
            "term",
            "idLegalArea",
            "legalAreaName",
            "teacherId",
            "teacherName",
            "teacherTerm",
            "idCourt",
        ],
        threshold: 0.35,
        ignoreLocation: true,
        distance: 100,
        minMatchCharLength: 2,
        includeMatches: true
    }), [filteredCases]);

    const searchResults = useMemo(() => {
        const query = searchText.trim();
        if (!query) return filteredCases.map(item => ({ caseData: item, matches: undefined }));

        return fuse.search(query).map(result => {
            const matches: Record<string, Array<[number, number]>> = {};
            (result.matches ?? []).forEach(match => {
                if (!match.key) return;
                matches[match.key] = match.indices as Array<[number, number]>;
            });
            return { caseData: result.item, matches };
        });
    }, [filteredCases, fuse, searchText]);

    const sortedResults = useMemo(() => {
        const compareOptionalDates = (a?: Date, b?: Date, direction: "asc" | "desc" = "asc") => {
            if (!a && !b) return 0;
            if (!a) return 1;
            if (!b) return -1;
            return direction === "asc" ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
        };

        const sorted = [...searchResults];
        sorted.sort((a, b) => {
            switch (sortOrder) {
                case "lastActionAsc":
                    return compareOptionalDates(a.caseData.lastActionDate, b.caseData.lastActionDate, "asc");
                case "createdAtDesc":
                    return b.caseData.createdAt.getTime() - a.caseData.createdAt.getTime();
                case "createdAtAsc":
                    return a.caseData.createdAt.getTime() - b.caseData.createdAt.getTime();
                case "lastActionDesc":
                default:
                    return compareOptionalDates(a.caseData.lastActionDate, b.caseData.lastActionDate, "desc");
            }
        });
        return sorted;
    }, [searchResults, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(sortedResults.length / pageSize));
    const pagedResults = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedResults.slice(start, start + pageSize);
    }, [page, pageSize, sortedResults]);

    const canGoPrev = page > 1;
    const canGoNext = page < totalPages;


    const handleFilterChange = useCallback((key: string, values: (string | number)[]) => {
        const newParams = new URLSearchParams(searchParams);
        if (values.length === 0) {
            newParams.delete(key);
        } else {
            newParams.set(key, values.join('|'));
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleClearFilters = useCallback(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('status');
        newParams.delete('caseType');
        newParams.delete('court');
        newParams.delete('term');
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="mb-3">
                <span className="flex items-center justify-between max-w-5xl flex-wrap gap-3">
                    <ul className="flex gap-3 flex-wrap">
                        <li>
                            <DropdownCheck
                                label="Estatus"
                                showSelectedCountBadge
                                selectedValues={getFilterValues('status')}
                                onSelectionChange={(values) => handleFilterChange('status', values)}
                            >
                                <DropdownOptionCheck value="Abierto">Abierto</DropdownOptionCheck>
                                <DropdownOptionCheck value="En Espera">En Espera</DropdownOptionCheck>
                                <DropdownOptionCheck value="Pausado">Pausado</DropdownOptionCheck>
                                <DropdownOptionCheck value="Cerrado">Cerrado</DropdownOptionCheck>
                            </DropdownCheck>
                        </li>
                        <li>
                            <DropdownCheck
                                label="Tipo de Caso"
                                showSelectedCountBadge
                                selectedValues={getFilterValues('caseType')}
                                onSelectionChange={(values) => handleFilterChange('caseType', values)}
                            >
                                <DropdownOptionCheck value="Materia Civil">Materia Civil</DropdownOptionCheck>
                                <DropdownOptionCheck value="Materia Penal">Materia Penal</DropdownOptionCheck>
                                <DropdownOptionCheck value="Materia Laboral">Materia Laboral</DropdownOptionCheck>
                                <DropdownOptionCheck value="Materia Mercantil">Materia Mercantil</DropdownOptionCheck>
                                <DropdownOptionCheck value="Materia Administrativa">Materia Administrativa</DropdownOptionCheck>
                                <DropdownOptionCheck value="Otros">Otros</DropdownOptionCheck>
                            </DropdownCheck>
                        </li>
                        <li>
                            <DropdownCheck
                                label="Tribunal"
                                showSelectedCountBadge
                                selectedValues={getFilterValues('court')}
                                onSelectionChange={(values) => handleFilterChange('court', values)}
                            >
                                <DropdownOptionCheck value="Civil">Civil</DropdownOptionCheck>
                                <DropdownOptionCheck value="Penal">Penal</DropdownOptionCheck>
                                <DropdownOptionCheck value="Agrario">Agrario</DropdownOptionCheck>
                                <DropdownOptionCheck value="Contencioso Administrativo">Contencioso Administrativo</DropdownOptionCheck>
                                <DropdownOptionCheck value="Protección de niños, niñas y adolescentes">Protección de niños, niñas y adolescentes</DropdownOptionCheck>
                                <DropdownOptionCheck value="Laboral">Laboral</DropdownOptionCheck>
                            </DropdownCheck>
                        </li>
                        <li>
                            <DropdownCheck
                                label="Periodo Academico"
                                showSelectedCountBadge
                                selectedValues={getFilterValues('term')}
                                onSelectionChange={(values) => handleFilterChange('term', values)}
                            >
                                <DropdownOptionCheck value="2024-15">2024-15</DropdownOptionCheck>
                                <DropdownOptionCheck value="2025-15">2025-15</DropdownOptionCheck>
                            </DropdownCheck>
                        </li>
                        <li>
                            <Button
                                type="button"
                                variant="outlined"
                                icon={<Close />}
                                className={`h-10 ${hasAnyFilters ? '' : 'hidden'}`}
                                onClick={handleClearFilters}
                                disabled={!hasAnyFilters}
                            >
                                Borrar filtros
                            </Button>
                        </li>
                    </ul>
                    <span className="flex">
                        <span className="text-body-medium whitespace-nowrap self-center mr-2">
                            Ordenar por:
                        </span>
                        <Dropdown
                            label="Ordenar por"
                            selectedValue={sortOrder}
                            onSelectionChange={(value) => setSortOrder(value as string)}
                        >
                            <DropdownOption value="lastActionAsc">Acción más cercana</DropdownOption>
                            <DropdownOption value="lastActionDesc">Acción más lejana</DropdownOption>
                            <DropdownOption value="createdAtAsc">Creación más cercana</DropdownOption>
                            <DropdownOption value="createdAtDesc">Creación más lejana</DropdownOption>
                        </Dropdown>
                    </span>
                </span>
            </div >
            <ul className="flex flex-col gap-3 overflow-y-auto min-h-0">
                {
                    loading && (
                        <li>Cargando casos...</li>
                    )
                }
                {
                    error &&
                    <li>Error al cargar los casos: {error.message}</li>
                }
                {
                    !loading && searchResults.length === 0 && (
                        <li>No se encontraron casos con los filtros seleccionados.</li>
                    )
                }
                {
                    !loading && pagedResults.map(({ caseData, matches }) => (
                        <li key={caseData.compoundKey}>
                            <CaseCard caseData={caseData} matches={matches} />
                        </li>
                    ))
                }
            </ul>
            <section className="mt-4 flex items-center justify-between max-w-5xl">
                <Button
                    variant="outlined"
                    icon={<ArrowLeft />}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!canGoPrev || loading}
                >
                    Anterior
                </Button>
                <span className="text-body-small text-onSurface/70">Página {page}</span>
                <Button
                    variant="outlined"
                    icon={<ArrowRight />}
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!canGoNext || loading}
                >
                    Siguiente
                </Button>
            </section>
        </div>
    );
}
export default SearchCases;
