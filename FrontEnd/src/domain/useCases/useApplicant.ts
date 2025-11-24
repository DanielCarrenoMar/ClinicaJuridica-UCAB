import { useApplicantRepository } from "../../services/apiRepositories";
import type { Applicant } from "../models/applicant";

export async function useCreateApplicant(data: Applicant): Promise<Applicant> {
    const applicantRepository = useApplicantRepository();
    return applicantRepository.create(data);
}


