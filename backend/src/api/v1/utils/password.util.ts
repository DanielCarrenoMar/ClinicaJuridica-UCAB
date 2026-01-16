import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Utility for password security operations.
 */
export class PasswordUtil {
    /**
     * Hashes a plain text password.
     * @param password Plain text password to hash.
     * @returns A promise that resolves to the hashed password.
     */
    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    /**
     * Compares a plain text password with a hashed password.
     * @param password Plain text password.
     * @param hash Hashed password to compare against.
     * @returns A promise that resolves to a boolean indicating if the passwords match.
     */
    static async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    /**
     * Validates if a password meets the requirements (e.g., max length).
     * @param password Plain text password to validate.
     * @returns An object with success and message.
     */
    static validate(password: string): { success: boolean; message?: string } {
        if (!password || password.length === 0) {
            return { success: false, message: 'La contraseña es obligatoria' };
        }
        if (password.length > 60) {
            return { success: false, message: 'La contraseña no puede exceder los 60 caracteres' };
        }
        return { success: true };
    }
}
