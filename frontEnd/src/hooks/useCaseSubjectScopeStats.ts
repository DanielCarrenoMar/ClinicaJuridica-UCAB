import { useState, useEffect } from 'react';
import { STATS_URL } from '../data/database/repositoryImp/apiUrl';

interface CaseSubjectScopeData {
  subject: string;
  scope: string;
  legal_area: string;
  value: number;
  color: string;
}

interface CaseSubjectScopeStatsResponse {
  success: boolean;
  data?: CaseSubjectScopeData[];
  error?: string;
}

export function useCaseSubjectScopeStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<CaseSubjectScopeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaseSubjectScopeStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${STATS_URL}/cases/by-subject-scope?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: CaseSubjectScopeStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos de casos por materia y ámbito');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching case subject scope stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseSubjectScopeStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchCaseSubjectScopeStats
  };
}
