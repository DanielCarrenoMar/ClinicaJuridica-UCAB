import CaseCard from "#components/CaseCard.tsx";
import DropdownCheck from "#components/DropdownCheck/DropdownCheck.tsx";
import DropdownOptionCheck from "#components/DropdownCheck/DropdownOptionCheck.tsx";
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

    // Obtener filtros de los parámetros de búsqueda
    const statusFilters = searchParams.getAll('status');
    const caseTypeFilters = searchParams.getAll('caseType');
    const courtFilters = searchParams.getAll('court');
    const termFilters = searchParams.getAll('term');
    
    const { cases, loading, error } = useGetCases();

    // Configuración de Fuse para búsqueda de texto
    const fuse = useMemo(() => new Fuse(cases, {
        keys: [
            "compoundKey",
            "problemSummary",
            "applicantName",
            "legalAreaName",
            "teacherName",
            "subjectName",
            "subjectCategoryName"
        ],
        threshold: 0.35,
        ignoreLocation: true,
        distance: 100,
        minMatchCharLength: 2,
        includeMatches: true
    }), [cases]);

    // Primero: Filtrar por texto de búsqueda
    const textFilteredResults = useMemo(() => {
        const query = searchText.trim();
        if (!query) return cases.map(item => ({ 
            caseData: item, 
            matches: {} as Record<string, Array<[number, number]>> 
        }));

        return fuse.search(query).map(result => {
            const matches: Record<string, Array<[number, number]>> = {};
            (result.matches ?? []).forEach(match => {
                if (!match.key) return;
                matches[match.key] = match.indices as Array<[number, number]>;
            });
            return { caseData: result.item, matches };
        });
    }, [cases, fuse, searchText]);

    // Segundo: Aplicar filtros de estado, tipo, tribunal y período
    const filteredResults = useMemo(() => {
        return textFilteredResults.filter(({ caseData }) => {
            // Filtro por estado (caseStatus)
            if (statusFilters.length > 0) {
                if (!caseData.caseStatus || !statusFilters.includes(caseData.caseStatus)) {
                    return false;
                }
            }

            // Filtro por tipo de caso (processType)
            if (caseTypeFilters.length > 0) {
                if (!caseData.processType || !caseTypeFilters.includes(caseData.processType)) {
                    return false;
                }
            }

            // Filtro por tribunal (idCourt) - convertido a string para comparar con parámetros
            if (courtFilters.length > 0) {
                const caseCourt = caseData.idCourt?.toString();
                if (!caseCourt || !courtFilters.includes(caseCourt)) {
                    return false;
                }
            }

            // Filtro por período académico (term)
            if (termFilters.length > 0) {
                if (!caseData.term || !termFilters.includes(caseData.term)) {
                    return false;
                }
            }

            return true;
        });
    }, [textFilteredResults, statusFilters, caseTypeFilters, courtFilters, termFilters]);

    const getFilterValues = (key: string) => {
        const param = searchParams.get(key);
        return param ? param.split(',') : [];
    };

    const handleFilterChange = useCallback((key: string, values: (string | number)[]) => {
        const newParams = new URLSearchParams(searchParams);
        if (values.length === 0) {
            newParams.delete(key);
        } else {
            // Convertir números a strings para consistencia en URL
            const stringValues = values.map(v => v.toString());
            newParams.set(key, stringValues.join(','));
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    // Contador de resultados filtrados
    const totalResults = cases.length;
    const filteredCount = filteredResults.length;

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-headline-medium">Casos</h2>
                    <span className="text-body-medium text-[var(--text-secondary)] bg-[var(--surface-container-low)] px-3 py-1 rounded-full">
                        {filteredCount} de {totalResults} resultados
                    </span>
                </div>
                
                {/* Mostrar filtros activos */}
                {(searchText || statusFilters.length > 0 || caseTypeFilters.length > 0 || courtFilters.length > 0 || termFilters.length > 0) && (
                    <div className="mb-4 p-3 bg-[var(--surface-container)] rounded-lg">
                        <p className="text-body-small text-[var(--text-secondary)] mb-2">Filtros aplicados:</p>
                        <div className="flex flex-wrap gap-2">
                            {searchText && (
                                <span className="inline-flex items-center gap-1 bg-[var(--primary-container)] text-[var(--on-primary-container)] px-3 py-1 rounded-full text-body-small">
                                    🔍 {searchText}
                                </span>
                            )}
                            {statusFilters.map(status => (
                                <span key={status} className="inline-flex items-center gap-1 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] px-3 py-1 rounded-full text-body-small">
                                    📊 {status}
                                </span>
                            ))}
                            {caseTypeFilters.map(type => (
                                <span key={type} className="inline-flex items-center gap-1 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] px-3 py-1 rounded-full text-body-small">
                                    📁 {type}
                                </span>
                            ))}
                            {courtFilters.map(court => {
                                // Mapear ID de tribunal a nombre
                                const courtNames: Record<string, string> = {
                                    "1": "Civil",
                                    "2": "Penal", 
                                    "3": "Agrario",
                                    "4": "Contencioso Administrativo",
                                    "5": "Protección de NNA",
                                    "6": "Laboral"
                                };
                                return (
                                    <span key={court} className="inline-flex items-center gap-1 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] px-3 py-1 rounded-full text-body-small">
                                        ⚖️ {courtNames[court] || `Tribunal ${court}`}
                                    </span>
                                );
                            })}
                            {termFilters.map(term => (
                                <span key={term} className="inline-flex items-center gap-1 bg-[var(--surface-variant)] text-[var(--on-surface-variant)] px-3 py-1 rounded-full text-body-small">
                                    📅 {term}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mb-6">
                <h3 className="text-title-large mb-4 text-[var(--on-surface)]">
                    Filtros
                </h3>
                <div className="flex flex-wrap gap-4">
                    {/* Filtro por Estado */}
                    <div className="min-w-[200px]">
                        <DropdownCheck 
                            label="Estatus" 
                            selectedValues={getFilterValues('status')}
                            onSelectionChange={(values) => handleFilterChange('status', values)}
                        >
                            <DropdownOptionCheck value="Abierto">Abierto</DropdownOptionCheck>
                            <DropdownOptionCheck value="En Espera">En Espera</DropdownOptionCheck>
                            <DropdownOptionCheck value="Pausado">Pausado</DropdownOptionCheck>
                            <DropdownOptionCheck value="Cerrado">Cerrado</DropdownOptionCheck>
                        </DropdownCheck>
                    </div>
                    
                    {/* Filtro por Tipo de Caso */}
                    <div className="min-w-[200px]">
                        <DropdownCheck 
                            label="Tipo de Caso" 
                            selectedValues={getFilterValues('caseType')}
                            onSelectionChange={(values) => handleFilterChange('caseType', values)}
                        >
                            <DropdownOptionCheck value="Tramite">Trámite</DropdownOptionCheck>
                            <DropdownOptionCheck value="Asesoria">Asesoría</DropdownOptionCheck>
                            <DropdownOptionCheck value="Conciliacion y mediacion">Conciliación y Mediación</DropdownOptionCheck>
                            <DropdownOptionCheck value="Redaccion">Redacción</DropdownOptionCheck>
                        </DropdownCheck>
                    </div>
                    
                    {/* Filtro por Tribunal */}
                    <div className="min-w-[200px]">
                        <DropdownCheck 
                            label="Tribunal" 
                            selectedValues={getFilterValues('court')}
                            onSelectionChange={(values) => handleFilterChange('court', values)}
                        >
                            <DropdownOptionCheck value="1">Civil</DropdownOptionCheck>
                            <DropdownOptionCheck value="2">Penal</DropdownOptionCheck>
                            <DropdownOptionCheck value="3">Agrario</DropdownOptionCheck>
                            <DropdownOptionCheck value="4">Contencioso Administrativo</DropdownOptionCheck>
                            <DropdownOptionCheck value="5">Protección de NNA</DropdownOptionCheck>
                            <DropdownOptionCheck value="6">Laboral</DropdownOptionCheck>
                        </DropdownCheck>
                    </div>
                    
                    {/* Filtro por Período Académico */}
                    <div className="min-w-[200px]">
                        <DropdownCheck 
                            label="Período Académico" 
                            selectedValues={getFilterValues('term')}
                            onSelectionChange={(values) => handleFilterChange('term', values)}
                        >
                            {/* NOTA: Necesitas añadir los períodos reales de tu base de datos */}
                            {/* Por ahora dejo un ejemplo, puedes añadirlos después */}
                            <DropdownOptionCheck value="2025-15">2025-15</DropdownOptionCheck>
                            {/* 
                            Ejemplo de cómo añadir más períodos:
                            <DropdownOptionCheck value="2025-25">2025-25</DropdownOptionCheck>
                            <DropdownOptionCheck value="2026-15">2026-15</DropdownOptionCheck>
                            */}
                        </DropdownCheck>
                    </div>
                </div>
            </div>
            
            {/* Lista de resultados */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
                        <p className="mt-4 text-body-large text-[var(--text-secondary)]">Cargando casos...</p>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="bg-[var(--error-container)] text-[var(--on-error-container)] p-4 rounded-lg mb-4">
                    <p className="text-body-large font-medium">Error al cargar los casos</p>
                    <p className="text-body-medium mt-1">{error.message}</p>
                </div>
            )}
            
            {!loading && filteredResults.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-[var(--text-secondary)] text-6xl mb-4">🔍</div>
                    <h3 className="text-headline-small text-[var(--on-surface)] mb-2">
                        No se encontraron casos
                    </h3>
                    <p className="text-body-large text-[var(--text-secondary)]">
                        {searchText || statusFilters.length > 0 || caseTypeFilters.length > 0 || courtFilters.length > 0 || termFilters.length > 0
                            ? "No hay casos que coincidan con los filtros aplicados"
                            : "No hay casos registrados en el sistema"}
                    </p>
                </div>
            )}
            
            {!loading && filteredResults.length > 0 && (
                <ul className="grid grid-cols-1 gap-4">
                    {filteredResults.map(({ caseData, matches }) => (
                        <li key={caseData.compoundKey}>
                            <CaseCard caseData={caseData} matches={matches} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default SearchCases;