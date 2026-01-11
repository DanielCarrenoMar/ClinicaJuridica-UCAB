import { getCaseActionRepository } from "#database/repositoryImp/caseActionRepositoryImp.ts";
import type { CaseActionModel } from "#domain/models/caseAction.ts";
import type { CaseActionInfoDAO } from "#database/daos/caseActionInfoDAO.ts";
import { useCallback, useEffect, useState } from "react";

export function useGetAllCaseActions() {
    const { findAllCaseActions } = getCaseActionRepository();

    const [caseActions, setCaseActions] = useState<CaseActionModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCaseActions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findAllCaseActions();
            setCaseActions(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCaseActions();
    }, [loadCaseActions]);

    return {
        caseActions,
        loading,
        error,
        refresh: loadCaseActions
    };
}

export function useCreateCaseAction() {
    const { createCaseAction } = getCaseActionRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createAction = useCallback(async (data: CaseActionInfoDAO) => {
        setLoading(true);
        try {
            const newAction = await createCaseAction(data);
            setError(null);
            return newAction;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createCaseAction: createAction,
        loading,
        error
    };
}

export function useGetActionsByUserId(userId: string) {
    const { findActionsByUserId } = getCaseActionRepository();
    const [actions, setActions] = useState<CaseActionModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadActions = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const data = await findActionsByUserId(userId);
            setActions(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadActions();
    }, [loadActions]);

    return {
        actions,
        loading,
        error,
        refresh: loadActions
    };
}
