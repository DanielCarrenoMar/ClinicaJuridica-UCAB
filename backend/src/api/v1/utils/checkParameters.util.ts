// backend/src/api/v1/utils/checkParameters.util.ts

/**
 * Verifica si un objeto contiene todas las llaves requeridas.
 * Si faltan llaves, retorna un mensaje de error indicando cuáles faltan.
 * Si todo está bien, retorna null.
 * 
 * @param data - El objeto a validar (ej. req.body)
 * @param requiredKeys - Array de strings con los nombres de las propiedades requeridas
 */
export function validateRequiredParams<T>(data: any, requiredKeys: (keyof T)[]): string | null {
    if (!data) return "No se enviaron datos";

    const missingFields: string[] = [];

    for (const key of requiredKeys) {
        const value = data[key];
        // Verificamos si es undefined, null o string vacío
        if (value === undefined || value === null || value === '') {
            missingFields.push(String(key));
        }
    }

    if (missingFields.length > 0) {
        return `Faltan los siguientes parámetros requeridos: ${missingFields.join(', ')}`;
    }

    return null;
}
