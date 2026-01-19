import { getStudentRepository } from "#database/repositoryImp/StudentRepositoryImp.ts";
import type { StudentModel } from "#domain/models/student.ts";
import type { CaseModel } from "#domain/models/case.ts";
import { useCallback, useEffect, useState } from "react";
import type { StudentDAO } from "#database/daos/studentDAO.ts";

export function useGetAllStudents() {
    const { findAllStudents } = getStudentRepository();
    const [students, setStudents] = useState<StudentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadStudents = useCallback(async (params?: { page?: number; limit?: number }) => {
        setLoading(true);
        try {
            const data = await findAllStudents(params);
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

export function useGetStudentById(id?: string) {
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

export function useGetCasesByStudentId(id?: string) {
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

export function useUpdateStudentById() {
    const { updateStudent } = getStudentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateStudentById = useCallback(async (id: string, data: Partial<StudentDAO>) => {
        setLoading(true);
        try {
            await updateStudent(id, data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateStudentById,
        loading,
        error,
    };
}

export function useImportStudents() {
    const { importStudents: importStudentsRepo } = getStudentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const importStudents = useCallback(async (file: File) => {
        setLoading(true);
        try {
            const result = await importStudentsRepo(file);
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [importStudentsRepo]);

    return {
        importStudents,
        loading,
        error,
    };
}

export function useCreateStudent() {
    const { createStudent: createStudentRepo } = getStudentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createStudent = useCallback(async (data: any) => {
        setLoading(true);
        try {
            const result = await createStudentRepo(data);
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [createStudentRepo]);

    return {
        createStudent,
        loading,
        error,
    };
}