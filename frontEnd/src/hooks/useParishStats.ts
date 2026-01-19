import { useState, useEffect } from 'react';
import { STATS_URL } from '../data/database/repositoryImp/apiUrl';

interface ParishData {
  label: string;
  value: number;
  color: string;
}

interface ParishStatsResponse {
  success: boolean;
  data?: ParishData[];
  error?: string;
}

export function useParishStats(startDate?: string, endDate?: string) {
  const [data, setData] = useState<ParishData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParishStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${STATS_URL}/applicants/by-parish?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ParishStatsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al obtener datos por parroquia');
      }

      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching parish stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParishStats();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchParishStats
  };
}
