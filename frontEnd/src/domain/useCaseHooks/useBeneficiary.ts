import { useState, useEffect } from 'react';
import type { BeneficiaryModel } from '../models/beneficiary';
import type { BeneficiaryDAO } from '#database/daos/beneficiaryDAO.ts';
import { getBeneficiaryRepository } from '#database/repositoryImp/BeneficiaryRepositoryImp.ts';

export function useGetBeneficiaryById() {
    const { findBeneficiaryById } = getBeneficiaryRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getBeneficiaryById = async (id: string): Promise<BeneficiaryModel | null> => {
        setLoading(true);
        try {
            const beneficiary = await findBeneficiaryById(id);
            return beneficiary;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        getBeneficiaryById,
        loading,
        error
    };
}

export function useGetAllBeneficiaries() {
    const { findAllBeneficiaries } = getBeneficiaryRepository();
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const loadBeneficiaries = async (params?: { page?: number; limit?: number }) => {
        setLoading(true);
        try {
            const data = await findAllBeneficiaries(params);
            setBeneficiaries(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        beneficiaries,
        loading,
        error,
        refresh: loadBeneficiaries
    };
}

export function useCreateBeneficiary() {
    const { createBeneficiary: createBeneficiaryRepo } = getBeneficiaryRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createBeneficiary = async (data: BeneficiaryDAO): Promise<BeneficiaryModel | null> => {
        setLoading(true);
        try {
            const created = await createBeneficiaryRepo(data);
            setError(null);
            return created;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        createBeneficiary,
        loading,
        error,
    };
}

export function useUpdateBeneficiary() {
    const { updateBeneficiary } = getBeneficiaryRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateBeneficiaryData = async (id: string, data: any): Promise<BeneficiaryModel | null> => {
        setLoading(true);
        setError(null);
        try {
            const updated = await updateBeneficiary(id, data);
            return updated;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateBeneficiary: updateBeneficiaryData,
        loading,
        error,
    };
}