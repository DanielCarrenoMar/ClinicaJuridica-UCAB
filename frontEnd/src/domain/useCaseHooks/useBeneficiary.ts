import { useState, useEffect } from 'react';
import type { BeneficiaryModel } from '../models/beneficiary';
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

    return {
        beneficiaries,
        loading,
        error,
        refresh: loadBeneficiaries
    };
}