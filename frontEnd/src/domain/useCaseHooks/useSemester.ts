import { useState, useEffect, useCallback } from 'react';
import { getSemesterRepository } from '#database/repositoryImp/SemesterRepositoryImp.ts';
import type { SemesterModel } from '../models/semester';

export function useGetAllSemesters() {
    const repository = getSemesterRepository();
    const [semesters, setSemesters] = useState<SemesterModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadSemesters = useCallback(async () => {
        setLoading(true);
        try {
            const data = await repository.findAllSemesters();
            setSemesters(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSemesters();
    }, [loadSemesters]);

    return {
        semesters,
        loading,
        error,
        refresh: loadSemesters
    };
}

export function useGetCurrentSemester() {
    const repository = getSemesterRepository();
    const [currentSemester, setCurrentSemester] = useState<SemesterModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCurrentSemester = useCallback(async () => {
        setLoading(true);
        try {
            const data = await repository.findCurrentSemester();
            setCurrentSemester(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCurrentSemester();
    }, [loadCurrentSemester]);

    return {
        currentSemester,
        loading,
        error,
        refresh: loadCurrentSemester
    };
}
