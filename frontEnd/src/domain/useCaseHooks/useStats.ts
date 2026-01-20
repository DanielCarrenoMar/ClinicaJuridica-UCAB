import { useState, useEffect, useCallback } from 'react';
import { getStatsRepository } from '#database/repositoryImp/StatsRepositoryImp.ts';

// Interfaz para los datos de casos por materia
interface CaseBySubject {
  materia: string;
  cantidad: number;
}

// Hook personalizado para obtener casos por materia
export function useGetCasesBySubject(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<CaseBySubject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de casos por materia:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getCasesBySubject(startDate, endDate);
      console.log('✅ [STATS] Casos por materia cargados exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando casos por materia:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener casos por materia y ambito
export function useGetCasesBySubjectScope(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de casos por materia y ambito:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getCasesBySubjectScope(startDate, endDate);
      console.log('✅ [STATS] Casos por materia y ambito cargados exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando casos por materia y ambito:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Interfaz para los datos de distribución por género
interface GenderDistributionItem {
  tipo: string;
  genero: string;
  cantidad: number;
}

// Hook personalizado para obtener distribución por género
export function useGetGenderDistribution(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<GenderDistributionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de distribución por género:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getGenderDistribution(startDate, endDate);
      console.log('✅ [STATS] Distribución por género cargada exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando distribución por género:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener distribución por estado
export function useGetStateDistribution(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de distribución por estado:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getStateDistribution(startDate, endDate);
      console.log('✅ [STATS] Distribución por estado cargada exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando distribución por estado:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener distribución por parroquia
export function useGetParishDistribution(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de distribución por parroquia:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getParishDistribution(startDate, endDate);
      console.log('✅ [STATS] Distribución por parroquia cargada exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando distribución por parroquia:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener casos por tipo
export function useGetCasesByType(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de casos por tipo:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getCasesByType(startDate, endDate);
      console.log('✅ [STATS] Casos por tipo cargados exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando casos por tipo:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener beneficiarios por parroquia
export function useGetBeneficiariesByParish(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de beneficiarios por parroquia:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getBeneficiariesByParish(startDate, endDate);
      console.log('✅ [STATS] Beneficiarios por parroquia cargados exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando beneficiarios por parroquia:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener participación de estudiantes
export function useGetStudentInvolvement(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de participación de estudiantes:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getStudentInvolvement(startDate, endDate);
      console.log('✅ [STATS] Participación de estudiantes cargada exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando participación de estudiantes:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener casos por tipo de servicio
export function useGetCasesByServiceType(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de casos por tipo de servicio:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getCasesByServiceType(startDate, endDate);
      console.log('✅ [STATS] Casos por tipo de servicio cargados exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando casos por tipo de servicio:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener participación de profesores
export function useGetProfessorInvolvement(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de participación de profesores:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getProfessorInvolvement(startDate, endDate);
      console.log('✅ [STATS] Participación de profesores cargada exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando participación de profesores:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}

// Hook personalizado para obtener distribución de tipos de beneficiarios
export function useGetBeneficiaryTypeDistribution(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const statsRepository = getStatsRepository();

  const loadData = useCallback(async () => {
    console.log('🔄 [STATS] Iniciando carga de distribución de tipos de beneficiarios:', { startDate, endDate });
    setLoading(true);
    setError(null);
    
    try {
      const result = await statsRepository.getBeneficiaryTypeDistribution(startDate, endDate);
      console.log('✅ [STATS] Distribución de tipos de beneficiarios cargada exitosamente:', {
        count: result.length,
        data: result,
        startDate,
        endDate
      });
      setData(result);
    } catch (err) {
      console.error('❌ [STATS] Error cargando distribución de tipos de beneficiarios:', {
        error: err,
        startDate,
        endDate
      });
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refresh: loadData };
}
