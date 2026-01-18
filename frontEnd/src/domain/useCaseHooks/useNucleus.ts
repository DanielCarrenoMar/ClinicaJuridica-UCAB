import { useState, useEffect, useCallback } from 'react';
import { getNucleusRepository } from '#database/repositoryImp/NucleusRepositoryImp.ts';
import type { NucleusModel } from '../models/nucleus';
import type { NucleusDAO } from '#database/daos/nucleusDAO.ts';

export function useFindAllNuclei() {
    const repository = getNucleusRepository();
    const [nuclei, setNuclei] = useState<NucleusModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadNuclei = useCallback(async () => {
        setLoading(true);
        try {
            const data = await repository.findAllNuclei();
            setNuclei(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNuclei();
    }, [loadNuclei]);

    return {
        nuclei,
        loading,
        error,
        refresh: loadNuclei
    };
}

export function useCreateNucleus() {
    const repository = getNucleusRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createNucleus = useCallback(async (data: NucleusDAO) => {
        setLoading(true);
        try {
            const newNucleus = await repository.createNucleus(data);
            setError(null);
            return newNucleus;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createNucleus,
        loading,
        error
    };
}

export function useUpdateNucleus() {
    const repository = getNucleusRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateNucleus = useCallback(async (id: string, data: Partial<NucleusDAO>) => {
        setLoading(true);
        try {
            const updatedNucleus = await repository.updateNucleus(id, data);
            setError(null);
            return updatedNucleus;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateNucleus,
        loading,
        error
    };
}

export function useDeleteNucleus() {
    const repository = getNucleusRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteNucleus = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await repository.deleteNucleus(id);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteNucleus,
        loading,
        error
    };
}
