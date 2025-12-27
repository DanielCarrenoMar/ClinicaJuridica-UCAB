import { useState, useEffect } from 'react';
import type { Beneficiary } from '../models/beneficiary';
import { getBeneficiaryRepository } from '#database/databaseRepositories';

export function useBeneficiary() {
    const {createBeneficiary, deleteBeneficiary, findAllBeneficiaries, updateBeneficiary} = getBeneficiaryRepository();
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
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

    const addBeneficiary = async (beneficiary: Beneficiary) => {
        try {
            const newBeneficiary = await createBeneficiary(beneficiary);
            setBeneficiaries(prev => [...prev, newBeneficiary]);
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const editBeneficiary = async (id: string, data: Partial<Beneficiary>) => {
        try {
            const updatedBeneficiary = await updateBeneficiary(id, data);
            setBeneficiaries(prev => prev.map(b => b.idBeneficiary === id ? updatedBeneficiary : b));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const removeBeneficiary = async (id: string) => {
        try {
            await deleteBeneficiary(id);
            setBeneficiaries(prev => prev.filter(b => b.idBeneficiary !== id));
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
