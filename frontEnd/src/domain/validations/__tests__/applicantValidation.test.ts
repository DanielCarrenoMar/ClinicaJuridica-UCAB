import { describe, it, expect } from 'vitest';
import { validateApplicant } from '../applicantValidation';
import type { ApplicantModel } from '#domain/models/applicant.ts';

describe('validateApplicant', () => {
    it('should return error if identityCard contains non-numbers', () => {
        const errors = validateApplicant({ identityCard: 'V-123456' } as ApplicantModel);
        expect(errors.identityCard).toBeDefined();
    });

    it('should not return error for valid identityCard', () => {
        const errors = validateApplicant({ identityCard: '12345678' } as ApplicantModel);
        expect(errors.identityCard).toBeUndefined();
    });

    it('should return error if applicant is under 18', () => {
        const minorDate = new Date();
        minorDate.setFullYear(minorDate.getFullYear() - 17);
        const errors = validateApplicant({ birthDate: minorDate } as ApplicantModel);
        expect(errors.birthDate).toBeDefined();
    });

    it('should validate household members logic', () => {
        const errors = validateApplicant({
            memberCount: 2,
            workingMemberCount: 3
        } as ApplicantModel);
        expect(errors.workingMemberCount).toBeDefined();
    });

    it('should pass if data is consistent', () => {
        const adultDate = new Date();
        adultDate.setFullYear(adultDate.getFullYear() - 20);
        
        const errors = validateApplicant({
            identityCard: '12345678',
            birthDate: adultDate,
            memberCount: 4,
            workingMemberCount: 2
        } as ApplicantModel);
        
        expect(Object.keys(errors)).toHaveLength(0);
    });
});
