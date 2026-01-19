import { useState, useEffect } from 'react';
import { STATS_URL } from '../data/database/repositoryImp/apiUrl';

interface CaseTypeData {
  label: string;
  value: number;
  color: string;
}

interface CaseTypeStatsResponse {
  success: boolean;
  data?: CaseTypeData[];
  error?: string;
}

export function useCaseTypeStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<CaseTypeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaseTypeStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${STATS_URL}/cases/by-type?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: CaseTypeStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos de casos por tipo');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching case type stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseTypeStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchCaseTypeStats
  };
}
