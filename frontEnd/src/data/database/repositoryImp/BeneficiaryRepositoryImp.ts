import type { BeneficiaryInfoDAO } from "#database/daos/beneficiaryInfoDAO.ts";
import { daoToBeneficiaryModel } from "#domain/models/beneficiary.ts";
import type { BeneficiaryRepository } from "../../../domain/repositories";

export function getBeneficiaryRepository(): BeneficiaryRepository {
    const API_URL = "http://localhost:3000/api/v1/applicants";

    return {
        findAllBeneficiaries: async () => {
            const response = await fetch(API_URL);
            return await response.json();
        },
        findBeneficiaryById: async (id) => {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) return null;
            const beneficiaryData = await response.json();
            const beneficiaryDao: BeneficiaryInfoDAO = beneficiaryData.data;
            return daoToBeneficiaryModel(beneficiaryDao);
        },
        createBeneficiary: async (data) => {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        updateBeneficiary: async (id, data) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        deleteBeneficiary: async (id) => {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
        }
    }
}
