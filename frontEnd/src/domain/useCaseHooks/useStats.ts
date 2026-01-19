import { useState, useEffect, useCallback } from 'react';
import { getStatsRepository } from '#database/repositoryImp/StatsRepositoryImp.ts';

export function useGetCasesBySubject(startDate?: Date, endDate?: Date) {
    const { getCasesBySubject } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getCasesBySubject(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getCasesBySubject]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetCasesBySubjectScope(startDate?: Date, endDate?: Date) {
    const { getCasesBySubjectScope } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getCasesBySubjectScope(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getCasesBySubjectScope]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetGenderDistribution(startDate?: Date, endDate?: Date) {
    const { getGenderDistribution } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getGenderDistribution(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getGenderDistribution]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetStateDistribution(startDate?: Date, endDate?: Date) {
    const { getStateDistribution } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getStateDistribution(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getStateDistribution]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetParishDistribution(startDate?: Date, endDate?: Date) {
    const { getParishDistribution } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getParishDistribution(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getParishDistribution]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetCasesByType(startDate?: Date, endDate?: Date) {
    const { getCasesByType } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getCasesByType(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getCasesByType]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetBeneficiariesByParish(startDate?: Date, endDate?: Date) {
    const { getBeneficiariesByParish } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getBeneficiariesByParish(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getBeneficiariesByParish]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetStudentInvolvement(startDate?: Date, endDate?: Date) {
    const { getStudentInvolvement } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getStudentInvolvement(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getStudentInvolvement]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetCasesByServiceType(startDate?: Date, endDate?: Date) {
    const { getCasesByServiceType } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getCasesByServiceType(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getCasesByServiceType]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetProfessorInvolvement(startDate?: Date, endDate?: Date) {
    const { getProfessorInvolvement } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getProfessorInvolvement(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getProfessorInvolvement]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}

export function useGetBeneficiaryTypeDistribution(startDate?: Date, endDate?: Date) {
    const { getBeneficiaryTypeDistribution } = getStatsRepository();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        if (!startDate || !endDate) {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const result = await getBeneficiaryTypeDistribution(startDate, endDate);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, getBeneficiaryTypeDistribution]);

    useEffect(() => {
        loadData();
    }, []);

    return { data, loading, error, refresh: loadData };
}
