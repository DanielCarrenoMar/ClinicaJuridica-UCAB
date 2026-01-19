import { useState, useEffect } from 'react';
import { STATS_URL } from '../data/database/repositoryImp/apiUrl';

interface StateData {
  label: string;
  value: number;
  color: string;
}

interface StateStatsResponse {
  success: boolean;
  data?: StateData[];
  error?: string;
}

export function useStateStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStateStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${STATS_URL}/applicants/by-state?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: StateStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos por estado');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching state stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStateStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchStateStats
  };
}
