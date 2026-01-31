import { UserTypeDTO } from '@app/shared/typesDTO';
import { Request, Response, NextFunction } from 'express';

function unauthorized(res: Response) {
    return res.status(401).json({ message: 'No autenticado' });
}

function forbidden(res: Response, roleName: string) {
    return res.status(403).json({ message: `Acceso restringido: requiere rol ${roleName}` });
}

function getRoleLevel(role: UserTypeDTO): number {
    const up = role;
    if (up === 'COORDINATOR') return 0;
    if (up === 'TEACHER') return 1;
    if (up === 'STUDENT') return 2;
    return 2;
}

function requireMaxLevel(maxLevel: number, roleName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return unauthorized(res);
        const level = getRoleLevel(req.user.role as UserTypeDTO);
        if (level > maxLevel) return forbidden(res, roleName);
        return next();
    };
}

export const isCoordinator = requireMaxLevel(0, 'COORDINATOR');
export const isTeacher = requireMaxLevel(1, 'TEACHER');
export const isStudent = requireMaxLevel(2, 'STUDENT');
