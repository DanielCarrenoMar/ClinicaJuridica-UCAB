import { useState, useEffect, useCallback } from 'react';

// Interfaz para los datos de casos por materia
interface CaseBySubject {
  materia: string;
  cantidad: number;
}

// Interfaz para la respuesta del API
interface StatsResponse {
  success: boolean;
  data?: CaseBySubject[];
  error?: string;
}

// Hook personalizado para obtener casos por materia
export function useGetCasesBySubject(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<CaseBySubject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    // Permitir carga sin fechas para mostrar todos los datos
    setLoading(true);
    setError(null);
    
    try {
      const query = new URLSearchParams();
      if (startDate) query.set('startDate', startDate.toISOString());
      if (endDate) query.set('endDate', endDate.toISOString());
      
      const url = query.toString() 
        ? `http://localhost:3000/api/v1/stats/cases/by-subject?${query.toString()}`
        : `http://localhost:3000/api/v1/stats/cases/by-subject`;
      
      console.log('Haciendo petición a:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result: StatsResponse = await response.json();
      console.log('Respuesta del API:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Error del servidor');
      }
      
      setData(result.data || []);
    } catch (err) {
      console.error('Error cargando casos por materia:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Funciones placeholder para los otros hooks (para no romper la importación)
export function useGetCasesBySubjectScope(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetGenderDistribution(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetStateDistribution(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetParishDistribution(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetCasesByType(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetBeneficiariesByParish(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetStudentInvolvement(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetCasesByServiceType(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetProfessorInvolvement(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}

export function useGetBeneficiaryTypeDistribution(_startDate?: Date, _endDate?: Date) {
  return { data: [], loading: false, error: null, refresh: () => {} };
}
