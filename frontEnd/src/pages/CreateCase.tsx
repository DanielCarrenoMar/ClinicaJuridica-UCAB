import type { Dispatch, SetStateAction } from "react";
import {  useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router";
import Box from "#components/Box.tsx";


import { defaultCaseDAO, type CaseDAO } from "#database/daos/caseDAO.ts";
import type { ApplicantModel } from "#domain/models/applicant.ts";

export type CaseOutletContext = {
    caseDAO: CaseDAO;
    setCaseDAO: Dispatch<SetStateAction<CaseDAO>>;
    updateCaseDAO: (updatedFields: Partial<CaseDAO>) => void;
    applicantModel: ApplicantModel;
    setApplicantModel: Dispatch<SetStateAction<ApplicantModel>>;
    updateApplicantModel: (updatedFields: Partial<ApplicantModel>) => void;
    isApplicantExisting: boolean;
    setIsApplicantExisting: Dispatch<SetStateAction<boolean>>;
};

export function useCaseOutletContext() {
    return useOutletContext<CaseOutletContext>();
}

function CreateCase() {
    const [caseDAO, setCaseDAO] = useState<CaseDAO>(defaultCaseDAO);
    const [applicantModel, setApplicantModel] = useState<Partial<ApplicantModel>>({identityCard: ''} as ApplicantModel);
    const [isApplicantExisting, setIsApplicantExisting] = useState<boolean>(false);

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

    return (
        <Box className="p-0!">
            <Outlet context={{ caseDAO, setCaseDAO, updateCaseDAO, applicantModel, setApplicantModel, updateApplicantModel, isApplicantExisting, setIsApplicantExisting }} />
        </Box>
    );
}
export default CreateCase;
