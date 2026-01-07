import { getStudentRepository } from "#database/repositoryImp/StudentRepositoryImp.ts";
import type { StudentModel } from "#domain/models/student.ts";
import type { CaseModel } from "#domain/models/case.ts";
import { useCallback, useEffect, useState } from "react";

export function useGetAllStudents() {
    const { findAllStudents } = getStudentRepository();
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findAllStudents();
            setStudents(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    return {
        students,
        loading,
        error,
        refresh: loadStudents,
    };
}

export function useGetStudentById(id: string) {
    const { findStudentById } = getStudentRepository();
    const [student, setStudent] = useState<StudentModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadStudent = useCallback(async (studentId: string) => {
        setLoading(true);
        try {
            const data = await findStudentById(studentId);
            setStudent(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!id) {
            setStudent(null);
            setLoading(false);
            return;
        }

        loadStudent(id);
    }, [id, loadStudent]);

    return {
        student,
        loading,
        error,
        loadStudent,
    };
}

export function useGetCasesByStudentId(id: string) {
    const { getCasesByStudentId } = getStudentRepository();
    const [cases, setCases] = useState<CaseModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCases = useCallback(async (studentId: string) => {
        setLoading(true);
        try {
            const data = await getCasesByStudentId(studentId);
            setCases(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!id) {
            setCases([]);
            setLoading(false);
            return;
        }

        loadCases(id);
    }, [id, loadCases]);

    return {
        cases,
        loading,
        error,
        loadCases,
    };
}
