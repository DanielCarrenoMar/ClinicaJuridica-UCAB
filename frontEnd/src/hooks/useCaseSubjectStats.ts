import { useState, useEffect } from 'react';
import { STATS_URL } from '../data/database/repositoryImp/apiUrl';

interface CaseSubjectData {
  label: string;
  value: number;
  color: string;
}

interface CaseSubjectStatsResponse {
  success: boolean;
  data?: CaseSubjectData[];
  error?: string;
}

export function useCaseSubjectStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<CaseSubjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaseSubjectStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${STATS_URL}/cases/by-subject?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: CaseSubjectStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos de casos por materia');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching case subject stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseSubjectStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchCaseSubjectStats
  };
}
