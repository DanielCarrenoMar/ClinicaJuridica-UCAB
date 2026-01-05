import { useState, useEffect, useCallback } from 'react';
import { modelToCaseDao, type CaseModel } from '../models/case';
import { getCaseRepository } from '#database/repositoryImp/CaseRepositoryImp.ts';
import type { CaseDAO } from '#database/daos/caseDAO.ts';
import type { StatusCaseAmountModel } from '#domain/models/statusCaseAmount.ts';
import type { StudentModel } from '../models/student';
import type { BeneficiaryModel } from '../models/beneficiary';
import type { CaseStatusDAO } from '#database/daos/caseStatusDAO.ts';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts'
export function useGetCases() {
    const { findAllCases } = getCaseRepository();
    const [cases, setCases] = useState<CaseModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCases = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findAllCases();
            setCases(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCases();
    }, [loadCases]);

    return {
        cases,
        loading,
        error,
        refresh: loadCases
    };
}

export function useGetCaseById(id: number) {
    const { findCaseById } = getCaseRepository();
    const [caseData, setCaseData] = useState<CaseModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCase = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findCaseById(id);
            setCaseData(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCase(id);
    }, [loadCase]);

    return {
        caseData,
        loading,
        error,
        loadCase
    };
}

export function useCreateCase() {
    const { createCase } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createCaseData = async (caseData: CaseDAO) => {
        setLoading(true);
        try {
            const newCase = await createCase(caseData);
            setError(null);
            return newCase;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createCase: createCaseData,
        loading,
        error
    };
}

export function useUpdateCaseWithCaseModel(userId: string) {
    const { updateCase: updateCaseData } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateCase = async (id: number, data: CaseModel) => {
        setLoading(true);
        const caseDao: CaseDAO = modelToCaseDao(data, userId);

        try {
            const updatedCase = await updateCaseData(id, caseDao);
            setError(null);
            return updatedCase;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateCase,
        loading,
        error
    };
}

export function useDeleteCase() {
    const { deleteCase } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const removeCase = async (id: number) => {
        setLoading(true);
        try {
            await deleteCase(id);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        removeCase,
        loading,
        error
    };
}

export function useGetStatusCaseAmounts() {
    const { findStatusCaseAmounts } = getCaseRepository();
    const [statusAmounts, setStatusAmounts] = useState<StatusCaseAmountModel>({
        closedAmount: 1,
        inProgressAmount: 1,
        openAmount: 1,
        pausedAmount: 1
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadStatusAmounts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findStatusCaseAmounts();
            setStatusAmounts(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStatusAmounts();
    }, [loadStatusAmounts]);
    return {
        statusAmounts,
        loading,
        error,
        refresh: loadStatusAmounts
    };
}

export function useGetStudentsByCaseId(id: number) {
    const { findStudentsByCaseId } = getCaseRepository();
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadStudents = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findStudentsByCaseId(id);
            setStudents(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) loadStudents(id);
    }, [id, loadStudents]);

    return {
        students,
        loading,
        error,
        loadStudents
    };
}

export function useGetBeneficiariesByCaseId(id: number) {
    const { findBeneficiariesByCaseId } = getCaseRepository();
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadBeneficiaries = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findBeneficiariesByCaseId(id);
            setBeneficiaries(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) loadBeneficiaries(id);
    }, [id, loadBeneficiaries]);

    return {
        beneficiaries,
        loading,
        error,
        loadBeneficiaries
    };
}

export function useCreateCaseStatus() {
    const { createCaseStatusFromCaseId } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createStatus = async (data: CaseStatusDAO) => {
        setLoading(true);
        try {
            const newStatus = await createCaseStatusFromCaseId(data);
            setError(null);
            return newStatus;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createStatus,
        loading,
        error
    };
}

export function useGetCaseActionsByCaseId(id: number) {
    const { findCaseActionsByCaseId } = getCaseRepository();
    const [caseActions, setCaseActions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCaseActions = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findCaseActionsByCaseId(id);
            setCaseActions(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) loadCaseActions(id);
    }, [id, loadCaseActions]);

    return {
        caseActions,
        loading,
        error,
        loadCaseActions
    };
}

export function useGetAppointmentByCaseId(id: number) {
    const { findAppointmentByCaseId } = getCaseRepository();
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadAppointments = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findAppointmentByCaseId(id);
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) loadAppointments(id);
    }, [id, loadAppointments]);

    return {
        appointments,
        loading,
        error,
        loadAppointments
    };
}

export function useGetSupportDocumentByCaseId(id: number) {
    const { findSupportDocumentByCaseId } = getCaseRepository();
    const [supportDocument, setSupportDocuments] = useState<SupportDocumentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadSupportDocuments = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findSupportDocumentByCaseId(id);
            setSupportDocuments(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) loadSupportDocuments(id);
    }, [id, loadSupportDocuments]);

    return {
        supportDocument,
        loading,
        error,
        loadSupportDocuments
    };
}
