import type { ApplicantRepository } from "../domain/repositories";

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