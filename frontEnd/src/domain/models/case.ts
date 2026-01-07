import type { CaseDAO } from "#database/daos/caseDAO.ts";
import type { CaseInfoDAO } from "#database/daos/caseInfoDAO.ts";
import { typeDaoToCaseStatusTypeModel, typeDaoToProcessTypeModel, typeModelToProcessTypeDao, type CaseStatusTypeModel, type ProcessTypeModel } from "#domain/typesModel.ts";

export interface CaseModel {
    idCase: number;
    compoundKey: string;
    problemSummary: string;
    createdAt: Date;
    caseStatus: CaseStatusTypeModel;
    processType: ProcessTypeModel;
    applicantId: string;
    idNucleus: string;
    term: string;
    idLegalArea: number;
    teacherId?: string;
    teacherTerm?: string;
    idCourt?: number;
    applicantName: string;
    legalAreaName: string;
    teacherName: string;
    courtName?: string;
    lastActionDate?: Date;
    lastActionDescription?: string;
    subjectName: string;
    subjectCategoryName: string;
}

export function daoToCaseModel(dao: CaseInfoDAO): CaseModel {
    return {
        ...dao,
        processType: typeDaoToProcessTypeModel(dao.processType),
        caseStatus: typeDaoToCaseStatusTypeModel(dao.caseStatus),
        lastActionDate: dao.lastActionDate ? new Date(dao.lastActionDate) : undefined,
        createdAt: new Date(dao.createdAt),
    }
}

export function modelToCaseDao(model: CaseModel, userId: string): CaseDAO {
    return {
        problemSummary: model.problemSummary,
        processType: typeModelToProcessTypeDao(model.processType),
        applicantId: model.applicantId,
        idNucleus: model.idNucleus,
        idLegalArea: model.idLegalArea,
        teacherId: model.teacherId,
        teacherTerm: model.teacherTerm,
        idCourt: model.idCourt,
        userId,
    };
}