import type { Beneficiary } from "../domain/models/beneficiary";
import type { ApplicantRepository, BeneficiaryRepository } from "../domain/repositories";

// Simulación de base de datos en memoria
let mockBeneficiaries: Beneficiary[] = [
    {
        idBeneficiary: "V12345678",
        name: "Juan",
        lastName: "Perez",
        sex: "M"
    },
    {
        idBeneficiary: "V87654321",
        name: "Maria",
        lastName: "Gomez",
        sex: "F"
    }
];

export function  getBeneficiaryRepository(): BeneficiaryRepository {
    return {
        findAllBeneficiaries: async () => {
            return [...mockBeneficiaries];
        },
        findBeneficiaryById: async (id) => {
            return mockBeneficiaries.find(b => b.idBeneficiary === id) || null;
        },
        createBeneficiary: async (data) => {
            mockBeneficiaries.push(data);
            return data;
        },
        updateBeneficiary: async (id, data) => {
            const index = mockBeneficiaries.findIndex(b => b.idBeneficiary === id);
            if (index !== -1) {
                mockBeneficiaries[index] = { ...mockBeneficiaries[index], ...data };
                return mockBeneficiaries[index];
            }
            throw new Error("Beneficiary not found");
        },
        deleteBeneficiary: async (id) => {
            mockBeneficiaries = mockBeneficiaries.filter(b => b.idBeneficiary !== id);
        }
    }
}

export function  useApplicantRepository(): ApplicantRepository {
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