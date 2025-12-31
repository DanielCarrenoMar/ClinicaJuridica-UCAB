import { getCaseActionRepository } from "#database/repositoryImp/caseActionRepositoryImp.ts";
import type { CaseActionModel } from "#domain/models/caseAction.ts";
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