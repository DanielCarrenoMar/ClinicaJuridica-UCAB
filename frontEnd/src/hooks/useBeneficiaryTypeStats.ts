import { useState, useEffect } from 'react';
import { BENEFICIARY_URL } from '../data/database/repositoryImp/apiUrl';

interface BeneficiaryData {
  label: string;
  value: number;
  color: string;
}

interface BeneficiaryStatsResponse {
  success: boolean;
  data?: BeneficiaryData[];
  error?: string;
}

export function useBeneficiaryTypeStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<BeneficiaryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBeneficiaryStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${BENEFICIARY_URL}/stats/type-distribution?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: BeneficiaryStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos de beneficiarios');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching beneficiary type stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaryStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchBeneficiaryStats
  };
}
