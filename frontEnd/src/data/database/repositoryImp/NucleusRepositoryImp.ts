import { daoToNucleusModel } from "#domain/models/nucleus.ts";
import type { NucleusRepository } from "#domain/repositories.ts";
import { NUCLEUS_URL } from "./apiUrl";
import type { NucleusInfoDAO } from "#database/daos/nucleusInfoDAO.ts";

export function getNucleusRepository(): NucleusRepository {
    return {
        findAllNuclei: async () => {
            const response = await fetch(NUCLEUS_URL, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching nuclei');
            const nuclei: NucleusInfoDAO[] = result.data || [];
            return nuclei.map(daoToNucleusModel);
        },
        findNucleusById: async (id: string) => {
            const response = await fetch(`${NUCLEUS_URL}/${id}`, { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error fetching nucleus');
            const nucleus: NucleusInfoDAO = result.data;
            return nucleus ? daoToNucleusModel(nucleus) : null;
        },
        createNucleus: async (data) => {
            const response = await fetch(NUCLEUS_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || 'Error creating nucleus');
            const nucleus: NucleusInfoDAO = result.data;
            return daoToNucleusModel(nucleus);
        },
        updateNucleus: async (id, data) => {
            const response = await fetch(`${NUCLEUS_URL}/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || 'Error updating nucleus');
            const nucleus: NucleusInfoDAO = result.data;
            return daoToNucleusModel(nucleus);
        },
        deleteNucleus: async (id: string) => {
            const response = await fetch(`${NUCLEUS_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) throw new Error(result?.error || result?.message || 'Error deleting nucleus');
        }
    };
}
