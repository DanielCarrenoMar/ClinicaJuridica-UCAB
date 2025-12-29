import { useState, useEffect } from 'react';
import type { BeneficiaryModel } from '../models/beneficiary';
import { getBeneficiaryRepository } from '#database/repositoryImp/BeneficiaryRepositoryImp.ts';

export function useGetBeneficiaryById() {
    const { findAllBeneficiaries } = getBeneficiaryRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getBeneficiaryById = async (id: string): Promise<BeneficiaryModel | null> => {
        setLoading(true);
        try {
            const beneficiaries = await findAllBeneficiaries();
            return beneficiaries.find(b => b.identityCard === id) || null;
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

export function useBeneficiary() {
    const { createBeneficiary, deleteBeneficiary, findAllBeneficiaries, updateBeneficiary } = getBeneficiaryRepository();
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const loadBeneficiaries = async () => {
        setLoading(true);
        try {
            const data = await findAllBeneficiaries();
            setBeneficiaries(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const addBeneficiary = async (beneficiary: BeneficiaryModel) => {
        try {
            const newBeneficiary = await createBeneficiary(beneficiary);
            setBeneficiaries(prev => [...prev, newBeneficiary]);
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const editBeneficiary = async (id: string, data: Partial<BeneficiaryModel>) => {
        try {
            const updatedBeneficiary = await updateBeneficiary(id, data);
            setBeneficiaries(prev => prev.map(b => b.identityCard === id ? updatedBeneficiary : b));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const removeBeneficiary = async (id: string) => {
        try {
            await deleteBeneficiary(id);
            setBeneficiaries(prev => prev.filter(b => b.identityCard !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        beneficiaries,
        loading,
        error,
        refresh: loadBeneficiaries,
        addBeneficiary,
        editBeneficiary,
        removeBeneficiary
    };
}
