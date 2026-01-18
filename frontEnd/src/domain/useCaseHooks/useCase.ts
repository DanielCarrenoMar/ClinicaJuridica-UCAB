import { useState, useEffect, useCallback } from 'react';
import { modelToCaseDao, type CaseModel } from '../models/case';
import { getCaseRepository } from '#database/repositoryImp/CaseRepositoryImp.ts';
import type { CaseDAO } from '#database/daos/caseDAO.ts';
import type { StatusCaseAmountModel } from '#domain/models/statusCaseAmount.ts';
import type { StudentModel } from '../models/student';
import type { CaseStatusDAO } from '#database/daos/caseStatusDAO.ts';
import type { AppointmentModel } from '#domain/models/appointment.ts';
import type { SupportDocumentModel } from '#domain/models/supportDocument.ts'
import { typeModelToCaseStatusTypeDao } from '#domain/typesModel.ts';
import type { CaseActionModel } from '#domain/models/caseAction.ts';
import type { CaseBeneficiaryDAO } from '#database/daos/caseBeneficiaryDAO.ts';
import type { CaseBeneficiaryModel } from '#domain/models/caseBeneficiary.ts';
export function useGetCases() {
    const { findAllCases } = getCaseRepository();
    const [cases, setCases] = useState<CaseModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCases = useCallback(async (params?: { page?: number; limit?: number }) => {
        setLoading(true);
        try {
            const data = await findAllCases(params);
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
    const { updateCase: updateCaseData, createCaseStatusFromCaseId } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateCase = async (id: number, data: CaseModel) => {
        setLoading(true);
        const caseStatusDao: CaseStatusDAO = {
            status: typeModelToCaseStatusTypeDao(data.caseStatus),
            userId: userId
        }
        const caseDao: CaseDAO = modelToCaseDao(data, userId);

        try {
            await updateCaseData(id, caseDao);
            await createCaseStatusFromCaseId(id, caseStatusDao);
            setError(null);
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
    const [beneficiaries, setBeneficiaries] = useState<CaseBeneficiaryModel[]>([]);
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

export function useGetCaseActionsByCaseId(id: number) {
    const { findCaseActionsByCaseId } = getCaseRepository();
    const [caseActions, setCaseActions] = useState<CaseActionModel[]>([]);
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

export function useSetStudentsToCase() {
    const { addStudentToCase, removeStudentFromCase, findStudentsByCaseId } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function setStudentsToCase(idCase: number, studentIds: string[]) {
        setLoading(true);
        try {
            const currentStudents = await findStudentsByCaseId(idCase);
            const currentStudentIds = currentStudents.map(s => s.identityCard);

            const toAdd = studentIds.filter(id => !currentStudentIds.includes(id));
            const toRemove = currentStudentIds.filter(id => !studentIds.includes(id));

            await Promise.all([
                ...toAdd.map(id => addStudentToCase(idCase, id)),
                ...toRemove.map(id => removeStudentFromCase(idCase, id))
            ]);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        setStudentsToCase,
        loading,
        error
    };
}

export function useSetBeneficiariesToCase() {
    const { addBeneficiaryToCase, removeBeneficiaryFromCase, findBeneficiariesByCaseId } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function setBeneficiariesToCase(idCase: number, caseBene: CaseBeneficiaryDAO[]) {
        setLoading(true);
        try {
            const currentBeneficiaries = await findBeneficiariesByCaseId(idCase);
            const currentBeneficiaryIds = currentBeneficiaries.map(b => b.identityCard);

            const toAdd = caseBene.filter(id => !currentBeneficiaryIds.includes(id.identityCard));
            const toRemove = currentBeneficiaryIds.filter(id => !caseBene.map(b => b.identityCard).includes(id));

            await Promise.all([
                ...toAdd.map(b => addBeneficiaryToCase(idCase, b.identityCard, b.caseType, b.relationship, b.description)),
                ...toRemove.map(id => removeBeneficiaryFromCase(idCase, id))
            ]);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        setBeneficiariesToCase,
        loading,
        error
    };
}