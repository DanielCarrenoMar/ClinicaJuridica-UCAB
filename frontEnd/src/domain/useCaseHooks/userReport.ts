import { useState, useEffect } from "react";
import { getReportRepository } from "#database/repositoryImp/ReportRepositoryImp.ts";
import type { CasesBySubjectModel } from "#domain/models/reports/casesBySubject.ts";
import type { CasesBySubjectScopeModel } from "#domain/models/reports/casesBySubjectScope.ts";
import type { GenderDistributionModel } from "#domain/models/reports/genderDistribution.ts";
import type { StateDistributionModel } from "#domain/models/reports/stateDistribution.ts";
import type { ParishDistributionModel } from "#domain/models/reports/parishDistribution.ts";
import type { CasesByTypeModel } from "#domain/models/reports/casesByType.ts";
import type { BeneficiariesByParishModel } from "#domain/models/reports/beneficiariesByParish.ts";
import type { StudentInvolvementModel } from "#domain/models/reports/studentInvolvement.ts";
import type { CasesByServiceTypeModel } from "#domain/models/reports/casesByServiceType.ts";
import type { ProfessorInvolvementModel } from "#domain/models/reports/professorInvolvement.ts";
import type { BeneficiaryTypeDistributionModel } from "#domain/models/reports/beneficiaryTypeDistribution.ts";

export const useGetCasesBySubject = (startDate?: Date, endDate?: Date) => {
    const { getCasesBySubject } = getReportRepository();
    const [casesBySubject, setCasesBySubject] = useState<CasesBySubjectModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadCasesBySubject = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getCasesBySubject(start ?? startDate, end ?? endDate);
            setCasesBySubject(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCasesBySubject();
    }, [startDate, endDate]);

    return {
        casesBySubject,
        loading,
        error,
        refresh: loadCasesBySubject
    };
};

export const useGetCasesBySubjectScope = (startDate?: Date, endDate?: Date) => {
    const { getCasesBySubjectScope } = getReportRepository();
    const [casesBySubjectScope, setCasesBySubjectScope] = useState<CasesBySubjectScopeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadCasesBySubjectScope = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getCasesBySubjectScope(start ?? startDate, end ?? endDate);
            setCasesBySubjectScope(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCasesBySubjectScope();
    }, [startDate, endDate]);

    return {
        casesBySubjectScope,
        loading,
        error,
        refresh: loadCasesBySubjectScope
    };
};

export const useGetGenderDistribution = (startDate?: Date, endDate?: Date) => {
    const { getGenderDistribution } = getReportRepository();
    const [genderDistribution, setGenderDistribution] = useState<GenderDistributionModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadGenderDistribution = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getGenderDistribution(start ?? startDate, end ?? endDate);
            setGenderDistribution(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGenderDistribution();
    }, [startDate, endDate]);

    return {
        genderDistribution,
        loading,
        error,
        refresh: loadGenderDistribution
    };
};

export const useGetStateDistribution = (startDate?: Date, endDate?: Date) => {
    const { getStateDistribution } = getReportRepository();
    const [stateDistribution, setStateDistribution] = useState<StateDistributionModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadStateDistribution = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getStateDistribution(start ?? startDate, end ?? endDate);
            setStateDistribution(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStateDistribution();
    }, [startDate, endDate]);

    return {
        stateDistribution,
        loading,
        error,
        refresh: loadStateDistribution
    };
};

export const useGetParishDistribution = (startDate?: Date, endDate?: Date) => {
    const { getParishDistribution } = getReportRepository();
    const [parishDistribution, setParishDistribution] = useState<ParishDistributionModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadParishDistribution = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getParishDistribution(start ?? startDate, end ?? endDate);
            setParishDistribution(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadParishDistribution();
    }, [startDate, endDate]);

    return {
        parishDistribution,
        loading,
        error,
        refresh: loadParishDistribution
    };
};

export const useGetCasesByType = (startDate?: Date, endDate?: Date) => {
    const { getCasesByType } = getReportRepository();
    const [casesByType, setCasesByType] = useState<CasesByTypeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadCasesByType = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getCasesByType(start ?? startDate, end ?? endDate);
            setCasesByType(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCasesByType();
    }, [startDate, endDate]);

    return {
        casesByType,
        loading,
        error,
        refresh: loadCasesByType
    };
};

export const useGetBeneficiariesByParish = (startDate?: Date, endDate?: Date) => {
    const { getBeneficiariesByParish } = getReportRepository();
    const [beneficiariesByParish, setBeneficiariesByParish] = useState<BeneficiariesByParishModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadBeneficiariesByParish = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getBeneficiariesByParish(start ?? startDate, end ?? endDate);
            setBeneficiariesByParish(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBeneficiariesByParish();
    }, [startDate, endDate]);

    return {
        beneficiariesByParish,
        loading,
        error,
        refresh: loadBeneficiariesByParish
    };
};

export const useGetStudentInvolvement = (startDate?: Date, endDate?: Date) => {
    const { getStudentInvolvement } = getReportRepository();
    const [studentInvolvement, setStudentInvolvement] = useState<StudentInvolvementModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadStudentInvolvement = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getStudentInvolvement(start ?? startDate, end ?? endDate);
            setStudentInvolvement(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudentInvolvement();
    }, [startDate, endDate]);

    return {
        studentInvolvement,
        loading,
        error,
        refresh: loadStudentInvolvement
    };
};

export const useGetCasesByServiceType = (startDate?: Date, endDate?: Date) => {
    const { getCasesByServiceType } = getReportRepository();
    const [casesByServiceType, setCasesByServiceType] = useState<CasesByServiceTypeModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadCasesByServiceType = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getCasesByServiceType(start ?? startDate, end ?? endDate);
            setCasesByServiceType(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCasesByServiceType();
    }, [startDate, endDate]);

    return {
        casesByServiceType,
        loading,
        error,
        refresh: loadCasesByServiceType
    };
};

export const useGetProfessorInvolvement = (startDate?: Date, endDate?: Date) => {
    const { getProfessorInvolvement } = getReportRepository();
    const [professorInvolvement, setProfessorInvolvement] = useState<ProfessorInvolvementModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadProfessorInvolvement = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getProfessorInvolvement(start ?? startDate, end ?? endDate);
            setProfessorInvolvement(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfessorInvolvement();
    }, [startDate, endDate]);

    return {
        professorInvolvement,
        loading,
        error,
        refresh: loadProfessorInvolvement
    };
};

export const useGetBeneficiaryTypeDistribution = (startDate?: Date, endDate?: Date) => {
    const { getBeneficiaryTypeDistribution } = getReportRepository();
    const [beneficiaryTypeDistribution, setBeneficiaryTypeDistribution] = useState<BeneficiaryTypeDistributionModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadBeneficiaryTypeDistribution = async (start?: Date, end?: Date) => {
        setLoading(true);
        try {
            const data = await getBeneficiaryTypeDistribution(start ?? startDate, end ?? endDate);
            setBeneficiaryTypeDistribution(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBeneficiaryTypeDistribution();
    }, [startDate, endDate]);

    return {
        beneficiaryTypeDistribution,
        loading,
        error,
        refresh: loadBeneficiaryTypeDistribution
    };
};
