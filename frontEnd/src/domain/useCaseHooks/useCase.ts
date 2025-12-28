import { useState, useEffect } from 'react';
import type { CaseModel } from '../models/case';
import { getCaseRepository } from '../../data/database/databaseRepositories';

export function useCase() {
    const { createCase, deleteCase, findAllCases, updateCase } = getCaseRepository();
    const [cases, setCases] = useState<CaseModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = async () => {
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
    };

    const addCase = async (caseData: CaseModel) => {
        try {
            const newCase = await createCase(caseData);
            setCases(prev => [...prev, newCase]);
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const editCase = async (id: string, data: Partial<CaseModel>) => {
        try {
            const updatedCase = await updateCase(id, data);
            setCases(prev => prev.map(c => c.id.toString() === id ? updatedCase : c));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const removeCase = async (id: string) => {
        try {
            await deleteCase(id);
            setCases(prev => prev.filter(c => c.id.toString() !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        cases,
        loading,
        error,
        refresh: loadCases,
        addCase,
        editCase,
        removeCase
    };
}
