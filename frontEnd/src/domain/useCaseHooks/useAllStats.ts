import { useCallback, useEffect } from 'react';
import {
  useGetCasesBySubject,
  useGetCasesBySubjectScope,
  useGetGenderDistribution,
  useGetStateDistribution,
  useGetParishDistribution,
  useGetCasesByType,
  useGetBeneficiariesByParish,
  useGetStudentInvolvement,
  useGetCasesByServiceType,
  useGetProfessorInvolvement,
  useGetBeneficiaryTypeDistribution,
} from './useStats';

interface AllStatsData {
  casesBySubject: any[];
  casesBySubjectScope: any[];
  genderDistribution: any[];
  stateDistribution: any[];
  parishDistribution: any[];
  casesByType: any[];
  beneficiariesByParish: any[];
  studentInvolvement: any[];
  casesByServiceType: any[];
  professorInvolvement: any[];
  beneficiaryTypeDistribution: any[];
}

interface AllStatsLoading {
  casesBySubject: boolean;
  casesBySubjectScope: boolean;
  genderDistribution: boolean;
  stateDistribution: boolean;
  parishDistribution: boolean;
  casesByType: boolean;
  beneficiariesByParish: boolean;
  studentInvolvement: boolean;
  casesByServiceType: boolean;
  professorInvolvement: boolean;
  beneficiaryTypeDistribution: boolean;
}

interface AllStatsErrors {
  casesBySubject: Error | null;
  casesBySubjectScope: Error | null;
  genderDistribution: Error | null;
  stateDistribution: Error | null;
  parishDistribution: Error | null;
  casesByType: Error | null;
  beneficiariesByParish: Error | null;
  studentInvolvement: Error | null;
  casesByServiceType: Error | null;
  professorInvolvement: Error | null;
  beneficiaryTypeDistribution: Error | null;
}

export function useAllStats(startDate?: Date, endDate?: Date) {
  console.log('🚀 [ALL_STATS] Iniciando carga de TODAS las estadísticas:', { startDate, endDate });
  
  // Usar todos los hooks individuales
  const casesBySubject = useGetCasesBySubject(startDate, endDate);
  const casesBySubjectScope = useGetCasesBySubjectScope(startDate, endDate);
  const genderDistribution = useGetGenderDistribution(startDate, endDate);
  const stateDistribution = useGetStateDistribution(startDate, endDate);
  const parishDistribution = useGetParishDistribution(startDate, endDate);
  const casesByType = useGetCasesByType(startDate, endDate);
  const beneficiariesByParish = useGetBeneficiariesByParish(startDate, endDate);
  const studentInvolvement = useGetStudentInvolvement(startDate, endDate);
  const casesByServiceType = useGetCasesByServiceType(startDate, endDate);
  const professorInvolvement = useGetProfessorInvolvement(startDate, endDate);
  const beneficiaryTypeDistribution = useGetBeneficiaryTypeDistribution(startDate, endDate);

  // Combinar todos los datos
  const data: AllStatsData = {
    casesBySubject: casesBySubject.data,
    casesBySubjectScope: casesBySubjectScope.data,
    genderDistribution: genderDistribution.data,
    stateDistribution: stateDistribution.data,
    parishDistribution: parishDistribution.data,
    casesByType: casesByType.data,
    beneficiariesByParish: beneficiariesByParish.data,
    studentInvolvement: studentInvolvement.data,
    casesByServiceType: casesByServiceType.data,
    professorInvolvement: professorInvolvement.data,
    beneficiaryTypeDistribution: beneficiaryTypeDistribution.data,
  };

  // Combinar todos los estados de carga
  const loading: AllStatsLoading = {
    casesBySubject: casesBySubject.loading,
    casesBySubjectScope: casesBySubjectScope.loading,
    genderDistribution: genderDistribution.loading,
    stateDistribution: stateDistribution.loading,
    parishDistribution: parishDistribution.loading,
    casesByType: casesByType.loading,
    beneficiariesByParish: beneficiariesByParish.loading,
    studentInvolvement: studentInvolvement.loading,
    casesByServiceType: casesByServiceType.loading,
    professorInvolvement: professorInvolvement.loading,
    beneficiaryTypeDistribution: beneficiaryTypeDistribution.loading,
  };

  // Combinar todos los errores
  const errors: AllStatsErrors = {
    casesBySubject: casesBySubject.error,
    casesBySubjectScope: casesBySubjectScope.error,
    genderDistribution: genderDistribution.error,
    stateDistribution: stateDistribution.error,
    parishDistribution: parishDistribution.error,
    casesByType: casesByType.error,
    beneficiariesByParish: beneficiariesByParish.error,
    studentInvolvement: studentInvolvement.error,
    casesByServiceType: casesByServiceType.error,
    professorInvolvement: professorInvolvement.error,
    beneficiaryTypeDistribution: beneficiaryTypeDistribution.error,
  };

  // Calcular estado general
  const isAnyLoading = Object.values(loading).some(Boolean);
  const hasAnyError = Object.values(errors).some(Boolean);
  const allLoaded = !isAnyLoading && !hasAnyError;

  // Log del estado general solo cuando cambia el estado
  useEffect(() => {
    console.log('📊 [ALL_STATS] Estado general de carga:', {
      isAnyLoading,
      hasAnyError,
      allLoaded,
      loadingStats: Object.entries(loading).filter(([_, loading]) => loading).map(([name]) => name),
      errorStats: Object.entries(errors).filter(([_, error]) => error).map(([name, error]) => ({ name, error: error?.message })),
      dataCounts: Object.entries(data).reduce((acc, [name, items]) => {
        acc[name] = items.length;
        return acc;
      }, {} as Record<string, number>)
    });
  }, [isAnyLoading, hasAnyError, data]);

  // Log cuando todo se ha cargado exitosamente
  useEffect(() => {
    if (allLoaded) {
      console.log('🎉 [ALL_STATS] ¡TODAS las estadísticas se han cargado exitosamente!', {
        totalDataPoints: Object.values(data).reduce((sum, items) => sum + items.length, 0),
        startDate,
        endDate
      });
    }
  }, [allLoaded, data, startDate, endDate]);

  // Función para refrescar todos los datos
  const refreshAll = useCallback(() => {
    console.log('🔄 [ALL_STATS] Refrescando TODAS las estadísticas...');
    casesBySubject.refresh();
    casesBySubjectScope.refresh();
    genderDistribution.refresh();
    stateDistribution.refresh();
    parishDistribution.refresh();
    casesByType.refresh();
    beneficiariesByParish.refresh();
    studentInvolvement.refresh();
    casesByServiceType.refresh();
    professorInvolvement.refresh();
    beneficiaryTypeDistribution.refresh();
  }, [
    casesBySubject.refresh,
    casesBySubjectScope.refresh,
    genderDistribution.refresh,
    stateDistribution.refresh,
    parishDistribution.refresh,
    casesByType.refresh,
    beneficiariesByParish.refresh,
    studentInvolvement.refresh,
    casesByServiceType.refresh,
    professorInvolvement.refresh,
    beneficiaryTypeDistribution.refresh,
  ]);

  // Obtener datos para un reporte específico
  const getReportData = useCallback((reportId: number) => {
    switch (reportId) {
      case 1:
        return {
          data: data.casesBySubject,
          loading: loading.casesBySubject,
          error: errors.casesBySubject,
        };
      case 2:
        return {
          data: data.casesBySubjectScope,
          loading: loading.casesBySubjectScope,
          error: errors.casesBySubjectScope,
        };
      case 3:
        return {
          data: data.genderDistribution,
          loading: loading.genderDistribution,
          error: errors.genderDistribution,
        };
      case 4:
        return {
          data: data.stateDistribution,
          loading: loading.stateDistribution,
          error: errors.stateDistribution,
        };
      case 5:
        return {
          data: data.parishDistribution,
          loading: loading.parishDistribution,
          error: errors.parishDistribution,
        };
      case 6:
        return {
          data: data.casesByType,
          loading: loading.casesByType,
          error: errors.casesByType,
        };
      case 7:
        return {
          data: data.beneficiariesByParish,
          loading: loading.beneficiariesByParish,
          error: errors.beneficiariesByParish,
        };
      case 8:
        return {
          data: data.studentInvolvement,
          loading: loading.studentInvolvement,
          error: errors.studentInvolvement,
        };
      case 9:
        return {
          data: data.casesByServiceType,
          loading: loading.casesByServiceType,
          error: errors.casesByServiceType,
        };
      case 10:
        return {
          data: data.professorInvolvement,
          loading: loading.professorInvolvement,
          error: errors.professorInvolvement,
        };
      case 11:
        return {
          data: data.beneficiaryTypeDistribution,
          loading: loading.beneficiaryTypeDistribution,
          error: errors.beneficiaryTypeDistribution,
        };
      default:
        return {
          data: [],
          loading: false,
          error: null,
        };
    }
  }, [data, loading, errors]);

  return {
    data,
    loading,
    errors,
    isAnyLoading,
    hasAnyError,
    allLoaded,
    refreshAll,
    getReportData,
  };
}
