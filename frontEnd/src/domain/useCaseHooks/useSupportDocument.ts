import { getSupportDocumentRepository } from "#database/repositoryImp/SupportDocumentImp.ts";
import { useState, useEffect, useCallback } from "react";
import type { SupportDocumentModel } from "#domain/models/supportDocument.ts";
import type { SupportDocumentDAO } from "#database/daos/supportDocumentDAO.ts";
export function useFindAllSupportDocuments() {
    const { findAllSupportDocuments } = getSupportDocumentRepository();
    const [supportDocuments, setSupportDocuments] = useState<SupportDocumentModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadSupportDocuments = useCallback(async (params?: { page?: number; limit?: number }) => {
        setLoading(true);
        try {
            const data = await findAllSupportDocuments(params);
            setSupportDocuments(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSupportDocuments();
    }, [loadSupportDocuments]);

    return {
        supportDocuments,
        loading,
        error,
        refresh: loadSupportDocuments
    };
}

export function useFindSupportDocumentById(id: number) {
    const { findSupportDocumentById } = getSupportDocumentRepository();
    const [supportDocument, setSupportDocument] = useState<SupportDocumentModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadSupportDocument = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await findSupportDocumentById(id);
            setSupportDocument(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSupportDocument(id);
    }, [id, loadSupportDocument]);

    return {
        supportDocument,
        loading,
        error,
        loadSupportDocument
    };
}

export function useCreateSupportDocument() {
    const { createSupportDocument } = getSupportDocumentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createSupportDocumentData = useCallback(async (supportDocumentData: SupportDocumentDAO) => {
        setLoading(true);
        try {
            const newSupportDocument = await createSupportDocument(supportDocumentData);
            setError(null);
            return newSupportDocument;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createSupportDocument: createSupportDocumentData,
        loading,
        error
    };
}

export function useUpdateSupportDocument() {
    const { updateSupportDocument } = getSupportDocumentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateSupportDocumentData = useCallback(async (id: number, supportDocumentData: Partial<SupportDocumentModel>) => {
        setLoading(true);
        try {
            const updatedSupportDocument = await updateSupportDocument(id, supportDocumentData);
            setError(null);
            return updatedSupportDocument;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateSupportDocument: updateSupportDocumentData,
        loading,
        error
    };
}

export function useDeleteSupportDocument() {
    const { deleteSupportDocument } = getSupportDocumentRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteSupportDocumentData = useCallback(async (idCase: number, supportNumber: number) => {
        setLoading(true);
        try {
            await deleteSupportDocument(idCase, supportNumber);
            setError(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteSupportDocument: deleteSupportDocumentData,
        loading,
        error
    };
}