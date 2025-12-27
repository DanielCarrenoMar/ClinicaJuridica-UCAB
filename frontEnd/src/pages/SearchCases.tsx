import CaseCard from "#components/CaseCard.tsx";
import DropDownCheck from "#components/DropDownCheck/DropDownCheck.tsx";
import DropDownOptionCheck from "#components/DropDownCheck/DropDownOptionCheck.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import { useSearchParams } from "react-router";
import { useCallback } from "react";

function SearchCases() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchText = searchParams.get('q') || '';
    const statusFilters = searchParams.getAll('status');
    const caseTypeFilters = searchParams.getAll('caseType');
    const courtFilters = searchParams.getAll('court');
    const termFilters = searchParams.getAll('term');

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
        <LateralMenuLayer locationId='none' alwaysShowSearch={true} defaultSearchText={searchText}>
            <span className="flex text-body-small gap-4">
                <div>{searchText}</div>
                <p>{statusFilters.join(', ')}</p>
                <p>{caseTypeFilters.join(', ')}</p>
                <p>{courtFilters.join(', ')}</p>
                <p>{termFilters.join(', ')}</p>
            </span>
            <div className="mb-3 ms-3">
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
                <li>
                    <CaseCard caseData={{
                        compoundKey: "CASE-12345",
                        applicantId: "1",
                        id: 12345,
                        idLegalArea: 2,
                        idNucleus: 3,
                        processType: "IN_PROGRESS",
                        teacherId: "4",
                        teacherName: "Dr. Gómez",
                        teacherTerm: "2023-1",
                        term: "2023-1",
                        idCourt: 5,
                        createAt: new Date(),
                        applicantName: "Juan Pérez",
                        legalAreaName: "Derecho Civil",
                        problemSummary: "Disputa contractual entre dos partes.",
                        CasesStatus: "CLOSED",
                        lastAction: {
                            idCase: 12345,
                            caseCompoundKey: "CASE-12345",
                            userNacionality: "V",
                            userName: "María López",
                            actionNumber: 1,
                            description: "Revisión inicial del caso.",
                            notes: null,
                            userId: "user-001",
                            registryDate: new Date(),
                        },
                    }} />
                </li>
                <li>
                    <CaseCard caseData={{
                        compoundKey: "CASE-12345",
                        applicantId: "1",
                        id: 12345,
                        idLegalArea: 2,
                        idNucleus: 3,
                        processType: "IN_PROGRESS",
                        teacherId: "4",
                        teacherName: "Dr. Gómez",
                        teacherTerm: "2023-1",
                        term: "2023-1",
                        idCourt: 5,
                        createAt: new Date(),
                        applicantName: "Juan Pérez",
                        legalAreaName: "Derecho Civil",
                        problemSummary: "Disputa contractual entre dos partes.",
                        CasesStatus: "OPEN",
                        lastAction: {
                            idCase: 12345,
                            caseCompoundKey: "CASE-12345",
                            userNacionality: "V",
                            userName: "María López",
                            actionNumber: 1,
                            description: "Revisión inicial del caso.",
                            notes: null,
                            userId: "user-001",
                            registryDate: new Date(),
                        },
                    }} />
                </li>
            </ul>
        </LateralMenuLayer>
    );
}
export default SearchCases;
