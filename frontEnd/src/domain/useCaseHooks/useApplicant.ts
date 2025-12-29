import type { ApplicantModel } from "#domain/models/applicant.ts";
import { useState } from "react";

export function useGetApplicantById() {
    //const { findAllBeneficiaries } = getApp();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getApplicantById = async (id: string): Promise<ApplicantModel | null> => {
        setLoading(true);
        try {
            if (id !== "12345678") return null;
            return {
                identityCard: "12345678",
                gender: 'M',
                birthDate: new Date('1990-01-01'),
                fullName: "John Doe",
                idNationality: "V",
                idState: undefined,
                stateName: "Some State",
                municipalityNumber: undefined,
                municipalityName: "Some Municipality",
                parishNumber: undefined,
                parishName: "Some Parish",
                email: "",
                cellPhone: "123-456-7890",
                homePhone: "098-765-4321",
                maritalStatus: 'married',
                isConcubine: false,
                createdAt: new Date(),
                isHeadOfHousehold: false,
                headEducationLevelId: undefined,
                headEducationLevel: "",
                headStudyTime: "",
                applicantEducationLevel: "Bachelor's Degree",
                applicantStudyTime: "Full-time",
                workCondition: "Employed",
                activityCondition: "Active",
                neighborhood: "Some Neighborhood",
                address: "123 Main St",
                housingCondition: "Owned",
                housingType: "Apartment",
                tenureType: "Owned",
                servicesAvailable: ["Electricity", "Water"],
                householdSize: 4,
                minorsCount: 1,
                seniorsCount: 0,
                disabledCount: 0,
                pregnantCount: 0,
                householdIncome: "2000-3000 USD"
            }
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