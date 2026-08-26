import 'dotenv/config';

export const { PORT = 3000, DATABASE_URL } = process.env;

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
export const JWT_SECRET: string = jwtSecret;