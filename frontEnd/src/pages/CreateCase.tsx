import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router";
import Box from "#components/Box.tsx";


import { defaultCaseDAO, type CaseDAO } from "#database/daos/caseDAO.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";
import type { CaseBeneficiaryModel } from "#domain/models/caseBeneficiary.ts";
import { caseBeneficiaryModelToDao } from "#domain/models/caseBeneficiary.ts";
import { useCreateCase, useSetBeneficiariesToCase } from "#domain/useCaseHooks/useCase.ts";
import { useCreateApplicant, useUpdateApplicant } from "#domain/useCaseHooks/useApplicant.ts";
import { useAuth } from "../context/AuthContext.tsx";

export type CaseOutletContext = {
    caseDAO: CaseDAO;
    setCaseDAO: Dispatch<SetStateAction<CaseDAO>>;
    updateCaseDAO: (updatedFields: Partial<CaseDAO>) => void;
    caseBeneficiaries: CaseBeneficiaryModel[];
    setCaseBeneficiaries: Dispatch<SetStateAction<CaseBeneficiaryModel[]>>;
    applicantModel: ApplicantModel;
    setApplicantModel: Dispatch<SetStateAction<ApplicantModel>>;
    updateApplicantModel: (updatedFields: Partial<ApplicantModel>) => void;
    isApplicantExisting: boolean;
    setIsApplicantExisting: Dispatch<SetStateAction<boolean>>;
    dbOriginalData: Partial<ApplicantModel> | null;
    setDbOriginalData: Dispatch<SetStateAction<Partial<ApplicantModel> | null>>;

    submitCreateCase: () => Promise<void>;
    isSubmittingCreateCase: boolean;
};

export function useCaseOutletContext() {
    return useOutletContext<CaseOutletContext>();
}

function CreateCase() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [caseDAO, setCaseDAO] = useState<CaseDAO>(defaultCaseDAO);
    const [caseBeneficiaries, setCaseBeneficiaries] = useState<CaseBeneficiaryModel[]>([]);
    const [applicantModel, setApplicantModel] = useState<Partial<ApplicantModel>>({ identityCard: '' } as ApplicantModel);
    const [isApplicantExisting, setIsApplicantExisting] = useState<boolean>(false);
    const [dbOriginalData, setDbOriginalData] = useState<Partial<ApplicantModel> | null>(null);

    const { createCase, loading: createCaseLoading } = useCreateCase();
    const { createApplicant, loading: createApplicantLoading } = useCreateApplicant();
    const { updateApplicant, loading: updateApplicantLoading } = useUpdateApplicant();
    const { setBeneficiariesToCase, loading: setBeneficiariesLoading } = useSetBeneficiariesToCase();

    const isSubmittingCreateCase = createCaseLoading || createApplicantLoading || updateApplicantLoading || setBeneficiariesLoading;

    useEffect(() => {
        console.log("applicantModel updated:", applicantModel);
    }, [applicantModel]);
    useEffect(() => {
        console.log("caseDAO updated:", caseDAO);
    }, [caseDAO]);

    function updateCaseDAO(updatedFields: Partial<CaseDAO>) {
        setCaseDAO((prev) => ({
            ...prev,
            ...updatedFields,
        } as CaseDAO));
    }

    function updateApplicantModel(updatedFields: Partial<ApplicantModel>) {
        setApplicantModel((prev) => ({
            ...prev,
            ...updatedFields,
        } as ApplicantModel));
    }

    async function submitCreateCase() {
        try {
            const applicantId = (applicantModel as ApplicantModel).identityCard?.trim?.() ?? "";
            if (!applicantId) {
                navigate("/crearCaso/solicitante");
                return;
            }

            if (isApplicantExisting) {
                await updateApplicant(applicantId, applicantModel as ApplicantModel);
            } else {
                const created = await createApplicant(applicantModel as any);
                if (!created) {
                    throw new Error("Applicant creation failed.");
                }
            }

            const caseToCreate: CaseDAO = {
                ...caseDAO,
                applicantId,
                userId: user?.identityCard || "",
            };

            const createdCase = await createCase(caseToCreate);
            if (!createdCase) {
                throw new Error("Case creation failed. Case is null.");
            }

            if (caseBeneficiaries.length > 0) {
                await setBeneficiariesToCase(
                    createdCase.idCase,
                    caseBeneficiaries.map((b) => caseBeneficiaryModelToDao({ ...b, idCase: createdCase.idCase }))
                );
            }

            navigate(`/caso/${createdCase.idCase}`);
        } catch (error) {
            console.error("Error en el flujo de creación de caso:", error);
        }
    }

    return (
        <Box className="p-0! h-full min-h-0 flex flex-col">
            <Outlet context={{
                caseDAO, setCaseDAO, updateCaseDAO,
                caseBeneficiaries, setCaseBeneficiaries,
                applicantModel, setApplicantModel, updateApplicantModel,
                isApplicantExisting, setIsApplicantExisting,
                dbOriginalData, setDbOriginalData,
                submitCreateCase,
                isSubmittingCreateCase,
            }} />
        </Box>
    );
}
export default CreateCase;
