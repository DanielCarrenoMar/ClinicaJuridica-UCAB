import { daoToCaseModel } from "#domain/models/case.ts";
import type { CaseRepository } from "../../../domain/repositories";
import { CASE_URL } from "./apiUrl";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import type { StatusCaseAmountDAO } from "#database/daos/statusCaseAmountDAO.ts";
import { daoToStatusCaseAmountModel } from "#domain/models/statusCaseAmount.ts";
import type { StudentDAO } from "#database/daos/studentDAO.ts";
import { daoToStudentModel } from "#domain/models/student.ts";
import { daoToAppointmentModel } from "#domain/models/appointment.ts";
import type { AppointmentInfoDAO } from "#database/daos/appointmentInfoDAO.ts";
import { daoToSupportDocumentModel } from "#domain/models/supportDocument.ts";
import type { SupportDocumentDAO } from "#database/daos/supportDocumentDAO.ts";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";
import { daoToCaseActionModel } from "#domain/models/caseAction.ts";
import type { CaseBeneficiaryInfoDAO } from "#database/daos/caseBeneficiaryInfoDAO.ts";
import { daoToCaseBeneficiaryModel } from "#domain/models/caseBeneficiary.ts";
import type { CaseStatusInfoDAO } from "#database/daos/caseStatusInfoDAO.ts";
import { daoToCaseStatusModel } from "#domain/models/caseStatus.ts";

export function getCaseRepository(): CaseRepository {
    return {
        findAllCases: async (_params) => {
            const responseCase = await fetch(CASE_URL, { method: 'GET', credentials: 'include' });
            const casesData = await responseCase.json();
            if (!responseCase.ok) throw new Error(casesData.message || 'Error fetching cases');
            const caseDAOs: CaseInfoDAO[] = casesData.data;
            return caseDAOs.map(daoToCaseModel);
        },
        findCaseById: async (id) => {
            const responseCase = await fetch(`${CASE_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const casesData = await responseCase.json();
            if (!responseCase.ok) throw new Error(casesData.message || 'Error fetching case');
            const caseDAO: CaseInfoDAO = casesData.data;
            return daoToCaseModel(caseDAO);
        },
        findBeneficiariesByCaseId: async (idCase, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${CASE_URL}/${idCase}/beneficiaries?${query.toString()}`
                : `${CASE_URL}/${idCase}/beneficiaries`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching beneficiaries for case');
            const daoList: CaseBeneficiaryInfoDAO[] = result.data;
            return daoList.map(daoToCaseBeneficiaryModel);
        },
        findStudentsByCaseId: async (idCase, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${CASE_URL}/${idCase}/students?${query.toString()}`
                : `${CASE_URL}/${idCase}/students`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching students for case');
            const daoList: StudentDAO[] = result.data;
            return daoList.map(daoToStudentModel);
        },
        getStatusCaseAmount: async () => {
            const response = await fetch(`${CASE_URL}/status/amount`, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching status case amount');
            const dao: StatusCaseAmountDAO = result.data;
            return [daoToStatusCaseAmountModel(dao)];
        },
        createCase: async (data) => {
            const response = await fetch(CASE_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || 'Error creating case');
            const caseDAO: CaseInfoDAO = result.data;
            return daoToCaseModel(caseDAO);
        },
        createCaseStatusFromCaseId: async (id, data) => {
            const response = await fetch(`${CASE_URL}/${id}/status`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    statusEnum: data.status,
                    reason: data.reason,
                    userId: data.userId,
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error creating case status');
            const caseStatusDAO: CaseStatusInfoDAO = result.data;
            return daoToCaseStatusModel(caseStatusDAO);
        },
        updateCase: async (id, data) => {
            const response = await fetch(`${CASE_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || 'Error updating case');
            return result.data;
        },
        deleteCase: async (id) => {
            const response = await fetch(`${CASE_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || 'Error deleting case');
        },
        findStatusCaseAmounts: async () => {
            const response = await fetch(`${CASE_URL}/status/amount`, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching status case amounts');
            const dao: StatusCaseAmountDAO = result.data;
            return daoToStatusCaseAmountModel(dao);
        },
        findCaseActionsByCaseId: async (idCase, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${CASE_URL}/${idCase}/actions?${query.toString()}`
                : `${CASE_URL}/${idCase}/actions`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching case actions for case');
            const daoList: CaseActionInfoDAO[] = result.data;
            return daoList.map(daoToCaseActionModel);
        },
        findAppointmentByCaseId: async (idCase, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${CASE_URL}/${idCase}/appointments?${query.toString()}`
                : `${CASE_URL}/${idCase}/appointments`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching appointments for case');
            const daoList: AppointmentInfoDAO[] = result.data;
            return daoList.map(daoToAppointmentModel);
        },
        findSupportDocumentByCaseId: async (idCase, params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString()
                ? `${CASE_URL}/${idCase}/support-documents?${query.toString()}`
                : `${CASE_URL}/${idCase}/support-documents`;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching support documents for case');
            const daoList: SupportDocumentDAO[] = result.data;
            return daoList.map(daoToSupportDocumentModel);
        },

        addStudentToCase: async (idCase, identityCard) => {
            const response = await fetch(`${CASE_URL}/${idCase}/students`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: identityCard })
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || result?.error || 'Error adding student to case');
        },

        removeStudentFromCase: async (idCase, identityCard) => {
            const response = await fetch(`${CASE_URL}/${idCase}/students/${identityCard}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || result?.error || 'Error removing student from case');
        },

        addBeneficiaryToCase: async (idCase, idBeneficiary, caseType, relationship, description) => {
            console.log("Adding beneficiary to case:", { idCase, idBeneficiary, caseType, relationship, description });
            const response = await fetch(`${CASE_URL}/${idCase}/beneficiaries`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    beneficiaryId: idBeneficiary,
                    relationship: relationship,
                    type: caseType,
                    description: description
                })
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || result?.error || 'Error adding beneficiary to case');
        },

        removeBeneficiaryFromCase: async (idCase, idBeneficiary) => {
            const response = await fetch(`${CASE_URL}/${idCase}/beneficiaries/${idBeneficiary}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || result?.error || 'Error removing beneficiary from case');
        },
    }
}
