import type { Beneficiary } from "../domain/models/beneficiary";
import type { ApplicantRepository, BeneficiaryRepository } from "../domain/repositories";

// Simulación de base de datos en memoria
let mockBeneficiaries: Beneficiary[] = [
    {
        idBeneficiary: "V12345678",
        name: "Pedro",
        lastName: "Perez",
        sex: "M"
    },
    {
        idBeneficiary: "V87654321",
        name: "Maria",
        lastName: "Gomez",
        sex: "F"
    },
    {
        idBeneficiary: "V32415172",
        name: "Pedro",
        lastName: "Carvajal",
        sex: "M"
    }
];

export function getBeneficiaryRepository(): BeneficiaryRepository {
    const API_URL = "http://localhost:4000/api/v1/applicants";

    return {
    findAllBeneficiaries: async () => {
        const response = await fetch(API_URL);
        return await response.json();
    },
    findBeneficiaryById: async (id) => {
        const response = await fetch(`${API_URL}/${id}`);
        return await response.json();
    },
    createBeneficiary: async (data) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return await response.json();
    },
    updateBeneficiary: async (id, data) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
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

export function useApplicantRepository(): ApplicantRepository {
    return {
        findAll: async () => {
            /* ... */ return null as any;
        },
        create: async (data) => {
            /* ... */ return null as any;
        },
        // ... implementar findById, update, delete
        findById: async (id) => { /* ... */ return null as any; },
        update: async (id, data) => { /* ... */ return null as any; },
        delete: async (id) => { /* ... */ },
    }
}