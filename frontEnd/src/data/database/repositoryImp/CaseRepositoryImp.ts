import { daoToCaseModel } from "#domain/models/case.ts";
import type { CaseRepository } from "../../../domain/repositories";
import { CASE_URL } from "./apiUrl";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import type { CaseStatusDAO } from "#database/daos/caseStatusDAO.ts";
import type { StatusCaseAmountDAO } from "#database/daos/statusCaseAmountDAO.ts";
import type { CaseDAO } from "#database/daos/caseDAO.ts";
import { daoToBeneficiaryModel } from "#domain/models/beneficiary.ts";
import { caseStatusDAOEnumToModel } from "#domain/models/caseStatus.ts";
import { daoToStatusCaseAmountModel } from "#domain/models/statusCaseAmount.ts";

export function getCaseRepository(): CaseRepository {
    return {
        findAllCases: async () => {
            const responseCase = await fetch(CASE_URL);
            const casesData = await responseCase.json();
            const caseDAOs: CaseInfoDAO[] = casesData.data;

            return caseDAOs.map(daoToCaseModel);
        },
        findCaseById: async (id) => {
            const responseCase = await fetch(`${CASE_URL}/${id}`);
            if (!responseCase.ok) return null;
            const casesData = await responseCase.json();
            const caseDAO: CaseInfoDAO = casesData.data;

            return daoToCaseModel(caseDAO);
        },
        findBeneficiariesByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/beneficiaries`);
            if (!response.ok) return [];
            const result = await response.json();
            const rows: any[] = result.data ?? [];
            const daos: BeneficiaryInfoDAO[] = rows.map((r) => ({
                identityCard: r.identityCard,
                gender: r.gender,
                birthDate: r.birthDate,
                fullName: r.fullName,
                idNacionality: r.idNacionality,
                hasId: r.hasId,
                type: r.type,
                idState: r.idState,
                municipalityNumber: r.municipalityNumber,
                parishNumber: r.parishNumber,
                stateName: r.stateName,
                municipalityName: r.municipalityName,
                parishName: r.parishName,
            }));
            return daos.map(daoToBeneficiaryModel);
        },
        findCaseStatusByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/status`);
            if (!response.ok) return [];
            const result = await response.json();
            const daos: Array<CaseStatusDAO & { userName?: string }> = result.data ?? [];
            return daos.map((dao) => ({
                idCase: dao.idCase,
                caseCompoundKey: String(dao.idCase),
                statusNumber: dao.statusNumber,
                status: caseStatusDAOEnumToModel(dao.status),
                reason: (dao as any).reason ?? null,
                userId: dao.userId,
                registryDate: new Date(dao.registryDate as any),
            }));
        },
        findStudentsByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}`);
            if (!response.ok) return [];
            const result = await response.json();
            const students: any[] = result.data?.assignedStudents ?? [];
            return students.map((s) => ({
                user: {
                    identityCard: s.identityCard,
                    name: s.fullName ?? s.fullname ?? '',
                    gender: s.gender,
                    email: s.email ?? '',
                    password: s.password ?? '',
                    isActive: s.isActive ?? true,
                    type: 'STUDENT',
                },
                term: s.term,
                nrc: s.nrc ?? undefined,
                type: 'REGULAR',
            }));
        },
        getStatusCaseAmount: async () => {
            const response = await fetch(`${CASE_URL}/status/amount`);
            if (!response.ok) return [];
            const result = await response.json();
            const dao: StatusCaseAmountDAO = result.data;
            return [daoToStatusCaseAmountModel(dao)];
        },
        createCase: async (data) => {
            const response = await fetch(CASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result.data as CaseDAO;
        },
        createCaseStatusFromCaseId: async (data) => {
            const response = await fetch(`${CASE_URL}/${data.idCase}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    statusEnum: data.status,
                    reason: (data as any).reason,
                    userId: data.userId,
                })
            });
            const result = await response.json();
            return result.data as CaseStatusDAO;
        },
        updateCase: async (id, data) => {
            const response = await fetch(`${CASE_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result.data;
        },
        deleteCase: async (id) => {
            await fetch(`${CASE_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}
