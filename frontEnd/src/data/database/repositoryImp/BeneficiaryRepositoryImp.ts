import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import { daoToBeneficiaryModel } from "#domain/models/beneficiary.ts";
import type { BeneficiaryRepository } from "../../../domain/repositories";
import { BENEFICIARY_URL } from "./apiUrl";

export function getBeneficiaryRepository(): BeneficiaryRepository {
    return {
        findAllBeneficiaries: async (params) => {
            const query = new URLSearchParams();
            if (params?.page !== undefined) query.set('page', String(params.page));
            if (params?.limit !== undefined) query.set('limit', String(params.limit));
            const url = query.toString() ? `${BENEFICIARY_URL}?${query.toString()}` : BENEFICIARY_URL;
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching beneficiaries');
            const daos: BeneficiaryInfoDAO[] = result.data ?? [];
            return daos.map(daoToBeneficiaryModel);
        },
        findBeneficiaryById: async (id) => {
            const response = await fetch(`${BENEFICIARY_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const beneficiaryData = await response.json();
            if (!response.ok) throw new Error(beneficiaryData.message || 'Error fetching beneficiary');
            const beneficiaryDao: BeneficiaryInfoDAO = beneficiaryData.data;
            return daoToBeneficiaryModel(beneficiaryDao);
        },
        createBeneficiary: async (data) => {
            const response = await fetch(BENEFICIARY_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error creating beneficiary');
            return daoToBeneficiaryModel(result.data as BeneficiaryInfoDAO);
        },
        updateBeneficiary: async (id, data) => {
            const response = await fetch(`${BENEFICIARY_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error updating beneficiary');
            return daoToBeneficiaryModel(result.data as BeneficiaryInfoDAO);
        },
        deleteBeneficiary: async (id) => {
            const response = await fetch(`${BENEFICIARY_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.message || 'Error deleting beneficiary');
        }
    }
}
