import { useState, useEffect } from 'react';
import { STATS_URL } from '../data/database/repositoryImp/apiUrl';

interface GenderData {
  label: string;
  value: number;
  color: string;
}

interface GenderStatsResponse {
  success: boolean;
  data?: GenderData[];
  error?: string;
}

export function useGenderStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<GenderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenderStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${STATS_URL}/applicants/by-gender?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: GenderStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos de género');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching gender stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenderStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchGenderStats
  };
}
