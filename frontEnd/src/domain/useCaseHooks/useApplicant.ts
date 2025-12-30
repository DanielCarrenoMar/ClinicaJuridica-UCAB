import { getApplicantRepository } from "#database/repositoryImp/ApplicantRepositoryImp.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import { useState } from "react";

export function useGetApplicantById() {
    const { findApplicantById } = getApplicantRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getApplicantById = async (id: string): Promise<ApplicantModel | null> => {
        setLoading(true);
        try {
            const applicant =  await findApplicantById(id);
            return applicant;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        getApplicantById,
        loading,
        error
    };
}