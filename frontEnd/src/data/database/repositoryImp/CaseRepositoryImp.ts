import { daoToCaseModel } from "#domain/models/case.ts";
import type { CaseRepository } from "../../../domain/repositories";
import { CASE_URL } from "./apiUrl";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import type { StatusCaseAmountDAO } from "#database/daos/statusCaseAmountDAO.ts";
import { daoToBeneficiaryModel } from "#domain/models/beneficiary.ts";
import { daoToStatusCaseAmountModel } from "#domain/models/statusCaseAmount.ts";
import { daoToCaseStatusModel } from "#domain/models/caseStatus.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { daoToStudentModel } from "#domain/models/student.ts";
import type { CaseStatusInfoDAO } from "#database/daos/caseStatusInfoDAO.ts";
import { daoToAppointmentModel } from "#domain/models/appointment.ts";
import type { AppointmentInfoDAO } from "#database/daos/appointmentInfoDAO.ts";
import { daoToSupportDocumentModel } from "#domain/models/supportDocument.ts";
import type { SupportDocumentDAO } from "#database/daos/supportDocumentDAO.ts";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";
import { daoToCaseActionModel } from "#domain/models/caseAction.ts";

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
            const daoList: BeneficiaryInfoDAO[] = result.data;
            return daoList.map(daoToBeneficiaryModel);
        },
        findCaseStatusByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/status`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: CaseStatusInfoDAO[] = result.data;
            return daoList.map(daoToCaseStatusModel);
        },
        findStudentsByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/students`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: StudentDAO[] = result.data;
            return daoList.map(daoToStudentModel);
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
            const caseDAO: CaseInfoDAO = result.data;
            return daoToCaseModel(caseDAO);
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
            const caseStatusDAO: CaseStatusInfoDAO = result.data;
            return daoToCaseStatusModel(caseStatusDAO);
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
        },
        findStatusCaseAmounts: async () => {
            const response = await fetch(`${CASE_URL}/status/amount`);
            if (!response.ok) throw new Error('Error fetching status case amounts');
            const result = await response.json();
            const dao: StatusCaseAmountDAO = result.data;
            return daoToStatusCaseAmountModel(dao);
        },
        findCaseActionsByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/actions`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: CaseActionInfoDAO[] = result.data;
            return daoList.map(daoToCaseActionModel);
        },
        findAppointmentByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/appointments`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: AppointmentInfoDAO[] = result.data;
            return daoList.map(daoToAppointmentModel);
        },
        findSupportDocumentByCaseId: async (idCase) => {
            const response = await fetch(`${CASE_URL}/${idCase}/support-documents`);
            if (!response.ok) return [];
            const result = await response.json();
            const daoList: SupportDocumentDAO[] = result.data;
            return daoList.map(daoToSupportDocumentModel);
        }
    }
}
