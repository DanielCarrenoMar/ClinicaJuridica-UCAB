import CaseCard from "#components/CaseCard.tsx";
import DropDownCheck from "#components/DropDownCheck/DropDownCheck.tsx";
import DropDownOptionCheck from "#components/DropDownCheck/DropDownOptionCheck.tsx";
import Fuse from "fuse.js";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useGetCases } from "#domain/useCaseHooks/useCase.ts";
import { useLateralMenuContext } from "#layers/LateralMenuLayer.tsx";

function SearchCases() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchText = searchParams.get('q') || '';
    const { setDefaultSearchText } = useLateralMenuContext();

    useEffect(() => {
        setDefaultSearchText(searchText);
    }, [searchText, setDefaultSearchText]);

    const statusFilters = searchParams.getAll('status');
    const caseTypeFilters = searchParams.getAll('caseType');
    const courtFilters = searchParams.getAll('court');
    const termFilters = searchParams.getAll('term');
    const { cases, loading, error } = useGetCases();

    const fuse = useMemo(() => new Fuse(cases, {
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
            "idCourt"
        ],
        threshold: 0.35,
        ignoreLocation: true,
        distance: 100,
        minMatchCharLength: 2,
        includeMatches: true
    }), [cases]);

    const searchResults = useMemo(() => {
        const query = searchText.trim();
        if (!query) return cases.map(item => ({ caseData: item, matches: {} as Record<string, Array<[number, number]>> }));

        return fuse.search(query).map(result => {
            const matches: Record<string, Array<[number, number]>> = {};
            (result.matches ?? []).forEach(match => {
                if (!match.key) return;
                matches[match.key] = match.indices as Array<[number, number]>;
            });
            return { caseData: result.item, matches };
        });
    }, [cases, fuse, searchText]);

    const getFilterValues = (key: string) => {
        const param = searchParams.get(key);
        return param ? param.split(',') : [];
    };

    const handleFilterChange = useCallback((key: string, values: (string | number)[]) => {
        const newParams = new URLSearchParams(searchParams);
        if (values.length === 0) {
            newParams.delete(key);
        } else {
            newParams.set(key, values.join(','));
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    return (
        <>
            <span className="flex text-body-small gap-4">
                {searchText.length > 0 && <div>Buscando: {searchText}</div>}
                <p>{statusFilters.join(', ')}</p>
                <p>{caseTypeFilters.join(', ')}</p>
                <p>{courtFilters.join(', ')}</p>
                <p>{termFilters.join(', ')}</p>
            </span>
            <div className="mb-3">
                <h3 className="text-body-large">
                    Filtros
                </h3>
                <span>
                    <ul className="flex gap-3">
                        <li>
                            <DropDownCheck 
                                label="Estatus" 
                                selectedValues={getFilterValues('status')}
                                onSelectionChange={(values) => handleFilterChange('status', values)}
                            >
                            <DropDownOptionCheck value="OPEN">Abierto</DropDownOptionCheck>
                            <DropDownOptionCheck value="IN_PROGRESS">En Trámite</DropDownOptionCheck>
                            <DropDownOptionCheck value="CLOSED">Cerrado</DropDownOptionCheck>
                            <DropDownOptionCheck value="PAUSED">En Pausa</DropDownOptionCheck>
                            </DropDownCheck>
                        </li>
                        <li>
                            <DropDownCheck 
                                label="Tipo de Caso" 
                                selectedValues={getFilterValues('caseType')}
                                onSelectionChange={(values) => handleFilterChange('caseType', values)}
                            >
                                <DropDownOptionCheck value="PENAL">Penal</DropDownOptionCheck>
                            </DropDownCheck>
                        </li>
                        <li>
                            <DropDownCheck 
                                label="Tribunal" 
                                selectedValues={getFilterValues('court')}
                                onSelectionChange={(values) => handleFilterChange('court', values)}
                            >
                                <DropDownOptionCheck value="TRIBUNAL_1">Tribunal 1</DropDownOptionCheck>
                            </DropDownCheck>
                        </li>
                        <li>
                            <DropDownCheck 
                                label="Periodo Academico" 
                                selectedValues={getFilterValues('term')}
                                onSelectionChange={(values) => handleFilterChange('term', values)}
                            >
                                <DropDownOptionCheck value="2025-15">2025-15</DropDownOptionCheck>
                            </DropDownCheck>
                        </li>
                    </ul>
                </span>
            </div>
            <ul className="flex flex-col gap-3">
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
                    !loading && searchResults.map(({ caseData, matches }) => (
                        <li key={caseData.compoundKey}>
                            <CaseCard caseData={caseData} matches={matches} />
                        </li>
                    ))
                }
            </ul>
        </>
    );
}
export default SearchCases;
