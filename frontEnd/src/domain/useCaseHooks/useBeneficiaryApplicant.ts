import { useState } from "react";
import { useGetApplicantById } from "./useApplicant";
import { useGetBeneficiaryById } from "./useBeneficiary";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import type { BeneficiaryModel } from "#domain/models/beneficiary.ts";

/**
 * Busca un solicitante, si no lo encuentra, busca un beneficiario y rellena la información de ahi.
 */
export function useGetApplicantOrBeneficiaryById() {
    const {getApplicantById} = useGetApplicantById();
    const {getBeneficiaryById, error: beneficiaryError} = useGetBeneficiaryById();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    interface ApplicantModelType extends ApplicantModel, Pick<BeneficiaryModel, "type" | "hasId"> {

    }
    

    const getApplicantOrBeneficiaryById = async (id: string): Promise<ApplicantModelType | null> => {
        setLoading(true);
        setError(null);
        try {
            let applicant = await getApplicantById(id);
            if (applicant) {
                return {...applicant, type: "Solicitante", hasId: true};
            }
            
            const beneficiary = await getBeneficiaryById(id);
            if (beneficiaryError) {
                throw beneficiaryError;
            }
            if (beneficiary){
                const { type, hasId, ...rest } = beneficiary
                applicant = {createdAt: new Date(), ...rest}
                return {...applicant, type: "Beneficiario", hasId: beneficiary.hasId};
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