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
            const response = await fetch(url);
            if (!response.ok) return [];
            const result = await response.json();
            const daos: BeneficiaryInfoDAO[] = result.data ?? [];
            return daos.map(daoToBeneficiaryModel);
        },
        findBeneficiaryById: async (id) => {
            const response = await fetch(`${BENEFICIARY_URL}/${id}`);
            if (!response.ok) return null;
            const beneficiaryData = await response.json();
            const beneficiaryDao: BeneficiaryInfoDAO = beneficiaryData.data;
            return daoToBeneficiaryModel(beneficiaryDao);
        },
        createBeneficiary: async (data) => {
            const response = await fetch(BENEFICIARY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return daoToBeneficiaryModel(result.data as BeneficiaryInfoDAO);
        },
        updateBeneficiary: async (id, data) => {
            const response = await fetch(`${BENEFICIARY_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return daoToBeneficiaryModel(result.data as BeneficiaryInfoDAO);
        },
        deleteBeneficiary: async (id) => {
            await fetch(`${BENEFICIARY_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}
