import { useState, useEffect, useCallback } from 'react';
import { getSemesterRepository } from '#database/repositoryImp/SemesterRepositoryImp.ts';
import type { SemesterModel } from '../models/semester';
import type { SemesterDAO } from '#database/daos/semesterDAO.ts';

export function useFindAllSemesters() {
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

export function useCreateSemester() {
    const repository = getSemesterRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createSemester = useCallback(async (data: SemesterDAO) => {
        setLoading(true);
        try {
            const newSemester = await repository.createSemester(data);
            setError(null);
            return newSemester;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createSemester,
        loading,
        error
    };
}

export function useUpdateSemester() {
    const repository = getSemesterRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateSemester = useCallback(async (term: string, data: Partial<SemesterDAO>) => {
        setLoading(true);
        try {
            const updatedSemester = await repository.updateSemester(term, data);
            setError(null);
            return updatedSemester;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateSemester,
        loading,
        error
    };
}

export function useDeleteSemester() {
    const repository = getSemesterRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteSemester = useCallback(async (term: string) => {
        setLoading(true);
        try {
            await repository.deleteSemester(term);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteSemester,
        loading,
        error
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
