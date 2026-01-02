export interface ApplicantResponse {
  // Campos heredados de Beneficiary
  identityCard: string;
  fullName: string;
  gender: string;
  birthDate: Date | string;
  idNationality: string;
  idState: number;
  municipalityNumber: number;
  parishNumber: number;

  // Campos de Applicant
  email?: string;
  cellPhone?: string;
  homePhone?: string;
  maritalStatus?: any;
  isConcubine?: boolean;
  isHeadOfHousehold?: boolean;
  headEducationLevelId?: number;
  headStudyTime?: string;
  
  // Mapeo especial: DAO espera string, pero aceptamos number (ID) del back
  applicantEducationLevel?: string | number;
  applicantStudyTime?: string;
  workConditionId?: number;
  activityConditionId?: number;

  // Campos de FamilyHome y Housing
  memberCount?: number;
  workingMemberCount?: number;
  children7to12Count?: number;
  studentChildrenCount?: number;
  monthlyIncome?: string | number;
  bathroomCount?: number;
  bedroomCount?: number;
  
  createdAt?: Date;
  
  // Extra: Servicios (opcional, solo funcionará si la tabla existe en BD)
  servicesIdAvailable?: number[];
  
  [key: string]: any; 
}

export interface RawApplicantDB {
  identityCard: string;
  applicantEducationLevelId: number;
  [key: string]: any;
}