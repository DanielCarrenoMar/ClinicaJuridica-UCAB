import { getTeacherRepository } from "#database/repositoryImp/TeacherRepositoryImp.ts";
import type { TeacherModel } from "#domain/models/teacher.ts";
import type { CaseModel } from "#domain/models/case.ts";
import { useCallback, useEffect, useState } from "react";

export function useGetAllTeachers() {
    const { findAllTeachers } = getTeacherRepository();
    const [teachers, setTeachers] = useState<TeacherModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadTeachers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await findAllTeachers();
            setTeachers(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTeachers();
    }, [loadTeachers]);

    return {
        teachers,
        loading,
        error,
        refresh: loadTeachers,
    };
}

export function useGetTeacherById(id?: string) {
    const { findTeacherById } = getTeacherRepository();
    const [teacher, setTeacher] = useState<TeacherModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadTeacher = useCallback(async (teacherId: string) => {
        setLoading(true);
        try {
            const data = await findTeacherById(teacherId);
            setTeacher(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!id) {
            setTeacher(null);
            setLoading(false);
            return;
        }

        loadTeacher(id);
    }, [id, loadTeacher]);

    return {
        teacher,
        loading,
        error,
        loadTeacher,
    };
}

export function useGetCasesByTeacherId(id?: string) {
    const { getCasesByTeacherId } = getTeacherRepository();
    const [cases, setCases] = useState<CaseModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadCases = useCallback(async (teacherId: string) => {
        setLoading(true);
        try {
            const data = await getCasesByTeacherId(teacherId);
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
