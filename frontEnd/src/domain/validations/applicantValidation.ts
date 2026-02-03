import type { ApplicantModel } from "#domain/models/applicant.ts";
import { calculateAge } from "../../utils/dateUtils";

export type ValidationErrors = Record<string, string>;

export function validateApplicant(applicantModel: Partial<ApplicantModel>): ValidationErrors {
    const errors: ValidationErrors = {};
    const { memberCount, workingMemberCount, children7to12Count, studentChildrenCount } = applicantModel;

    if (memberCount !== undefined && memberCount !== null) {
        if (workingMemberCount !== undefined && workingMemberCount !== null && workingMemberCount > memberCount) {
            errors.workingMemberCount = "No pueden trabajar más personas de las que viven en casa";
        }
        if (children7to12Count !== undefined && children7to12Count !== null && children7to12Count > memberCount) {
            errors.children7to12Count = "No puede haber más niños de los que viven en casa";
        }
        if (studentChildrenCount !== undefined && studentChildrenCount !== null && studentChildrenCount > memberCount) {
            errors.studentChildrenCount = "No puede haber más niños de los que viven en casa";
        }
    }

    // Validate identity card contains only numbers
    if (applicantModel.identityCard && /[^0-9]/.test(applicantModel.identityCard)) {
        errors.identityCard = "La cédula solo debe contener números";
    }

    // Validate age (must be 18+)
    if (applicantModel.birthDate) {
        const age = calculateAge(applicantModel.birthDate);
        if (age < 18) {
            errors.birthDate = "El solicitante debe ser mayor de edad (18 años o más)";
        }
    }

    return errors;
}
