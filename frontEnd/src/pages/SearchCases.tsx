import CaseCard from "#components/CaseCard.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import { useSearchParams } from "react-router";

function SearchCases() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';

    return (
        <LateralMenuLayer locationId='none' alwaysShowSearch={true} defaultSearchText={q}>
            <div>{q}</div>
            <CaseCard caseData={{
                compoundKey: "CASE-12345",
                applicantId: 1,
                id: 12345,
                idLegalArea: 2,
                idNucleus: 3,
                processType: "IN_PROGRESS",
                teacherId: 4,
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
                    actionNumber: 1,
                    description: "Revisión inicial del caso.",
                    notes: null,
                    userId: "user-001",
                    registryDate: new Date(),
                },
            }} />
            <CaseCard caseData={{
                compoundKey: "CASE-12345",
                applicantId: 1,
                id: 12345,
                idLegalArea: 2,
                idNucleus: 3,
                processType: "IN_PROGRESS",
                teacherId: 4,
                teacherName: "Dr. Gómez",
                teacherTerm: "2023-1",
                term: "2023-1",
                idCourt: 5,
                createAt: new Date(),
                applicantName: "Juan Pérez",
                legalAreaName: "Derecho Civil",
                problemSummary: "Disputa contractual entre dos partes.",
                CasesStatus: "PAUSED",
                lastAction: {
                    idCase: 12345,
                    actionNumber: 1,
                    description: "Revisión inicial del caso.",
                    notes: null,
                    userId: "user-001",
                    registryDate: new Date(),
                },
            }} />
            <CaseCard caseData={{
                compoundKey: "CASE-12345",
                applicantId: 1,
                id: 12345,
                idLegalArea: 2,
                idNucleus: 3,
                processType: "IN_PROGRESS",
                teacherId: 4,
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
                    actionNumber: 1,
                    description: "Revisión inicial del caso.",
                    notes: null,
                    userId: "user-001",
                    registryDate: new Date(),
                },
            }} />
            <CaseCard caseData={{
                compoundKey: "CASE-12345",
                applicantId: 1,
                id: 12345,
                idLegalArea: 2,
                idNucleus: 3,
                processType: "IN_PROGRESS",
                teacherId: 4,
                teacherName: "Dr. Gómez",
                teacherTerm: "2023-1",
                term: "2023-1",
                idCourt: 5,
                createAt: new Date(),
                applicantName: "Juan Pérez",
                legalAreaName: "Derecho Civil",
                problemSummary: "Disputa contractual entre dos partes.",
                CasesStatus: "IN_PROGRESS",
                lastAction: {
                    idCase: 12345,
                    actionNumber: 1,
                    description: "Revisión inicial del caso.",
                    notes: null,
                    userId: "user-001",
                    registryDate: new Date(),
                },
            }} />
        </LateralMenuLayer>
    );
}
export default SearchCases;
