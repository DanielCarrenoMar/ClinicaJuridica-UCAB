import { Request, Response, NextFunction } from 'express';
import prisma from '#src/config/database.js';

async function hasAccessToCase(caseId: number, user: { identityCard: string; role: string }): Promise<boolean> {
  if (user.role === 'COORDINATOR') return true;

  if (user.role === 'TEACHER') {
    const caseRow = await prisma.case.findUnique({
      where: { idCase: caseId },
      select: { teacherId: true }
    });
    return caseRow?.teacherId === user.identityCard;
  }

  const assignment = await prisma.assignedStudent.findFirst({
    where: { idCase: caseId, studentId: user.identityCard }
  });
  return assignment !== null;
}

export async function verifyCaseAccess(req: Request, res: Response, next: NextFunction, id: string) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'No autenticado' });
    return;
  }

  const caseId = parseInt(id);
  if (isNaN(caseId)) {
    return next();
  }

  try {
    const allowed = await hasAccessToCase(caseId, req.user as { identityCard: string; role: string });
    if (!allowed) {
      res.status(403).json({ success: false, message: 'No tienes acceso a este caso' });
      return;
    }
    next();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    res.status(500).json({ success: false, error: msg });
  }
}
