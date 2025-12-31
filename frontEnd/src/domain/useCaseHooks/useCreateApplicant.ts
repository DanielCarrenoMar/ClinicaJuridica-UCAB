import { getApplicantRepository } from "#database/repositoryImp/ApplicantRepositoryImp.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import { useState } from "react";

export function useCreateApplicant() {
    const { createApplicant } = getApplicantRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createApplicantData = async (data: Omit<ApplicantModel, 'identityCard'> & { identityCard: string }): Promise<ApplicantModel | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const applicant = await createApplicant(data);
            return applicant;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        createApplicant: createApplicantData,
        loading,
        error
    };
}
