import { useState } from "react";
import { useGetApplicantById } from "./useApplicant";
import { useGetBeneficiaryById } from "./useBeneficiary";
import type { ApplicantModel } from "#domain/models/applicant.ts";

/**
 * Busca un solicitante, si no lo encuentra, busca un beneficiario y rellena la información de ahi.
 */
export function useGetApplicantOrBeneficiaryById() {
    const {getApplicantById} = useGetApplicantById();
    const {getBeneficiaryById} = useGetBeneficiaryById();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getApplicantOrBeneficiaryById = async (id: string): Promise<ApplicantModel | null> => {
        setLoading(true);
        setError(null);
        try {
            let applicant = await getApplicantById(id);
            if (applicant) {
                return applicant;
            }
            
            const beneficiary = await getBeneficiaryById(id);
            if (beneficiary){
                const { type, hasId, ...rest } = beneficiary
                applicant = {createdAt: new Date(), ...rest}
                return applicant
            }

            return null;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        getApplicantOrBeneficiaryById,
        loading,
        error
    };
}