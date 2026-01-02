import { useState, useEffect, useCallback } from 'react';
import type { CaseModel } from '../models/case';
import { getCaseRepository } from '#database/repositoryImp/CaseRepositoryImp.ts';
import type { CaseDAO } from '#database/daos/caseDAO.ts';
import type { StatusCaseAmountModel } from '#domain/models/statusCaseAmount.ts';

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

export function useUpdateCase() {
    const { updateCase } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const editCase = async (id: string, data: Partial<CaseModel>) => {
        setLoading(true);
        try {
            const updatedCase = await updateCase(id, data);
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
        editCase,
        loading,
        error
    };
}

export function useDeleteCase() {
    const { deleteCase } = getCaseRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const removeCase = async (id: string) => {
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