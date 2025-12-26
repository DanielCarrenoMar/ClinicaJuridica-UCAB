-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('E', 'P', 'C');

-- CreateEnum
CREATE TYPE "TeacherType" AS ENUM ('R', 'V');

-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('R', 'V', 'E', 'S');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('V', 'E', 'J');

-- CreateEnum
CREATE TYPE "BeneficiaryType" AS ENUM ('B', 'S');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('S', 'C', 'D', 'V');

-- CreateEnum
CREATE TYPE "ProcessType" AS ENUM ('T', 'A', 'CM', 'R');

-- CreateEnum
CREATE TYPE "CaseBeneficiaryType" AS ENUM ('D', 'I');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('C', 'P', 'R');

-- CreateEnum
CREATE TYPE "CaseStatusEnum" AS ENUM ('A', 'T', 'P', 'C');

-- CreateTable
CREATE TABLE "HousingCharacteristic" (
    "idCharacteristic" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "HousingCharacteristic_pkey" PRIMARY KEY ("idCharacteristic")
);

-- CreateTable
CREATE TABLE "EducationLevel" (
    "idLevel" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EducationLevel_pkey" PRIMARY KEY ("idLevel")
);

-- CreateTable
CREATE TABLE "State" (
    "idState" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("idState")
);

-- CreateTable
CREATE TABLE "WorkCondition" (
    "idCondition" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkCondition_pkey" PRIMARY KEY ("idCondition")
);

-- CreateTable
CREATE TABLE "ActivityCondition" (
    "idActivity" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ActivityCondition_pkey" PRIMARY KEY ("idActivity")
);

-- CreateTable
CREATE TABLE "Court" (
    "idCourt" SERIAL NOT NULL,
    "subject" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("idCourt")
);

-- CreateTable
CREATE TABLE "Semester" (
    "term" VARCHAR(10) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("term")
);

-- CreateTable
CREATE TABLE "Subject" (
    "idSubject" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("idSubject")
);

-- CreateTable
CREATE TABLE "User" (
    "identityCard" VARCHAR(20) NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "gender" "Gender",
    "email" VARCHAR(35) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("identityCard")
);

-- CreateTable
CREATE TABLE "Coordinator" (
    "identityCard" VARCHAR(20) NOT NULL,

    CONSTRAINT "Coordinator_pkey" PRIMARY KEY ("identityCard")
);

-- CreateTable
CREATE TABLE "CharacteristicDetail" (
    "idCharacteristic" INTEGER NOT NULL,
    "detailNumber" INTEGER NOT NULL,
    "option" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CharacteristicDetail_pkey" PRIMARY KEY ("idCharacteristic","detailNumber")
);

-- CreateTable
CREATE TABLE "Municipality" (
    "idState" INTEGER NOT NULL,
    "municipalityNumber" INTEGER NOT NULL,
    "name" VARCHAR(63) NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("idState","municipalityNumber")
);

-- CreateTable
CREATE TABLE "Parish" (
    "idState" INTEGER NOT NULL,
    "municipalityNumber" INTEGER NOT NULL,
    "parishNumber" INTEGER NOT NULL,
    "name" VARCHAR(63) NOT NULL,

    CONSTRAINT "Parish_pkey" PRIMARY KEY ("idState","municipalityNumber","parishNumber")
);

-- CreateTable
CREATE TABLE "Nucleus" (
    "idNucleus" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "idState" INTEGER NOT NULL,
    "municipalityNumber" INTEGER NOT NULL,
    "parishNumber" INTEGER NOT NULL,

    CONSTRAINT "Nucleus_pkey" PRIMARY KEY ("idNucleus")
);

-- CreateTable
CREATE TABLE "SubjectCategory" (
    "idSubject" INTEGER NOT NULL,
    "categoryNumber" INTEGER NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubjectCategory_pkey" PRIMARY KEY ("idSubject","categoryNumber")
);

-- CreateTable
CREATE TABLE "LegalArea" (
    "idLegalArea" SERIAL NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "idSubject" INTEGER NOT NULL,
    "categoryNumber" INTEGER NOT NULL,

    CONSTRAINT "LegalArea_pkey" PRIMARY KEY ("idLegalArea")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "identityCard" VARCHAR(20) NOT NULL,
    "term" VARCHAR(10) NOT NULL,
    "type" "TeacherType" NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("identityCard","term")
);

-- CreateTable
CREATE TABLE "Student" (
    "identityCard" VARCHAR(20) NOT NULL,
    "term" VARCHAR(10) NOT NULL,
    "nrc" VARCHAR(12),
    "type" "StudentType" NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("identityCard","term")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "identityCard" VARCHAR(20) NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" DATE NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "idType" "IdType" NOT NULL,
    "hasId" BOOLEAN NOT NULL,
    "type" "BeneficiaryType" NOT NULL,
    "idState" INTEGER,
    "municipalityNumber" INTEGER,
    "parishNumber" INTEGER,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("identityCard")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "identityCard" VARCHAR(20) NOT NULL,
    "email" VARCHAR(35),
    "cellPhone" VARCHAR(20),
    "homePhone" VARCHAR(20),
    "maritalStatus" "MaritalStatus",
    "isConcubine" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isHeadOfHousehold" BOOLEAN,
    "headEducationLevelId" INTEGER,
    "headStudyTime" VARCHAR(35),
    "applicantEducationLevelId" INTEGER,
    "applicantStudyTime" VARCHAR(35),
    "workConditionId" INTEGER,
    "activityConditionId" INTEGER,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("identityCard")
);

-- CreateTable
CREATE TABLE "Housing" (
    "applicantId" VARCHAR(20) NOT NULL,
    "bathroomCount" INTEGER,
    "bedroomCount" INTEGER,

    CONSTRAINT "Housing_pkey" PRIMARY KEY ("applicantId")
);

-- CreateTable
CREATE TABLE "HousingDetail" (
    "idCharacteristic" INTEGER NOT NULL,
    "detailNumber" INTEGER NOT NULL,
    "applicantId" VARCHAR(20) NOT NULL,

    CONSTRAINT "HousingDetail_pkey" PRIMARY KEY ("idCharacteristic","detailNumber","applicantId")
);

-- CreateTable
CREATE TABLE "FamilyHome" (
    "applicantId" VARCHAR(20) NOT NULL,
    "memberCount" INTEGER,
    "workingMemberCount" INTEGER,
    "children7to12Count" INTEGER,
    "studentChildrenCount" INTEGER,
    "monthlyIncome" DECIMAL(12,2),

    CONSTRAINT "FamilyHome_pkey" PRIMARY KEY ("applicantId")
);

-- CreateTable
CREATE TABLE "Case" (
    "idCase" SERIAL NOT NULL,
    "problemSummary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processType" "ProcessType" NOT NULL,
    "applicantId" VARCHAR(20) NOT NULL,
    "idNucleus" INTEGER NOT NULL,
    "term" VARCHAR(10) NOT NULL,
    "idLegalArea" INTEGER NOT NULL,
    "teacherId" VARCHAR(20) NOT NULL,
    "teacherTerm" VARCHAR(10) NOT NULL,
    "idCourt" INTEGER,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("idCase")
);

-- CreateTable
CREATE TABLE "CaseBeneficiary" (
    "idCase" INTEGER NOT NULL,
    "beneficiaryId" VARCHAR(20) NOT NULL,
    "relationship" VARCHAR(200) NOT NULL,
    "type" "CaseBeneficiaryType" NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "CaseBeneficiary_pkey" PRIMARY KEY ("idCase","beneficiaryId")
);

-- CreateTable
CREATE TABLE "SupportDocument" (
    "idCase" INTEGER NOT NULL,
    "supportNumber" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT,

    CONSTRAINT "SupportDocument_pkey" PRIMARY KEY ("idCase","supportNumber")
);

-- CreateTable
CREATE TABLE "CaseAction" (
    "idCase" INTEGER NOT NULL,
    "actionNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "userId" VARCHAR(20) NOT NULL,
    "registryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseAction_pkey" PRIMARY KEY ("idCase","actionNumber")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "idCase" INTEGER NOT NULL,
    "appointmentNumber" INTEGER NOT NULL,
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "executionDate" TIMESTAMP(3),
    "status" "AppointmentStatus" NOT NULL,
    "guidance" TEXT,
    "userId" VARCHAR(20) NOT NULL,
    "registryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("idCase","appointmentNumber")
);

-- CreateTable
CREATE TABLE "CaseStatus" (
    "idCase" INTEGER NOT NULL,
    "statusNumber" INTEGER NOT NULL,
    "status" "CaseStatusEnum" NOT NULL,
    "reason" TEXT,
    "userId" VARCHAR(20) NOT NULL,
    "registryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStatus_pkey" PRIMARY KEY ("idCase","statusNumber")
);

-- CreateTable
CREATE TABLE "AssignedStudent" (
    "idCase" INTEGER NOT NULL,
    "studentId" VARCHAR(20) NOT NULL,
    "term" VARCHAR(10) NOT NULL,

    CONSTRAINT "AssignedStudent_pkey" PRIMARY KEY ("idCase","studentId","term")
);

-- CreateIndex
CREATE UNIQUE INDEX "HousingCharacteristic_name_key" ON "HousingCharacteristic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationLevel_name_key" ON "EducationLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCondition_name_key" ON "WorkCondition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityCondition_name_key" ON "ActivityCondition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CharacteristicDetail_idCharacteristic_option_key" ON "CharacteristicDetail"("idCharacteristic", "option");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_idState_name_key" ON "Municipality"("idState", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Parish_idState_municipalityNumber_name_key" ON "Parish"("idState", "municipalityNumber", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Nucleus_name_key" ON "Nucleus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectCategory_idSubject_name_key" ON "SubjectCategory"("idSubject", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LegalArea_idSubject_categoryNumber_name_key" ON "LegalArea"("idSubject", "categoryNumber", "name");

-- AddForeignKey
ALTER TABLE "Coordinator" ADD CONSTRAINT "Coordinator_identityCard_fkey" FOREIGN KEY ("identityCard") REFERENCES "User"("identityCard") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacteristicDetail" ADD CONSTRAINT "CharacteristicDetail_idCharacteristic_fkey" FOREIGN KEY ("idCharacteristic") REFERENCES "HousingCharacteristic"("idCharacteristic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_idState_fkey" FOREIGN KEY ("idState") REFERENCES "State"("idState") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parish" ADD CONSTRAINT "Parish_idState_municipalityNumber_fkey" FOREIGN KEY ("idState", "municipalityNumber") REFERENCES "Municipality"("idState", "municipalityNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nucleus" ADD CONSTRAINT "Nucleus_idState_municipalityNumber_parishNumber_fkey" FOREIGN KEY ("idState", "municipalityNumber", "parishNumber") REFERENCES "Parish"("idState", "municipalityNumber", "parishNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectCategory" ADD CONSTRAINT "SubjectCategory_idSubject_fkey" FOREIGN KEY ("idSubject") REFERENCES "Subject"("idSubject") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalArea" ADD CONSTRAINT "LegalArea_idSubject_categoryNumber_fkey" FOREIGN KEY ("idSubject", "categoryNumber") REFERENCES "SubjectCategory"("idSubject", "categoryNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_identityCard_fkey" FOREIGN KEY ("identityCard") REFERENCES "User"("identityCard") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_term_fkey" FOREIGN KEY ("term") REFERENCES "Semester"("term") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_identityCard_fkey" FOREIGN KEY ("identityCard") REFERENCES "User"("identityCard") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_term_fkey" FOREIGN KEY ("term") REFERENCES "Semester"("term") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_idState_municipalityNumber_parishNumber_fkey" FOREIGN KEY ("idState", "municipalityNumber", "parishNumber") REFERENCES "Parish"("idState", "municipalityNumber", "parishNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_identityCard_fkey" FOREIGN KEY ("identityCard") REFERENCES "Beneficiary"("identityCard") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_headEducationLevelId_fkey" FOREIGN KEY ("headEducationLevelId") REFERENCES "EducationLevel"("idLevel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_applicantEducationLevelId_fkey" FOREIGN KEY ("applicantEducationLevelId") REFERENCES "EducationLevel"("idLevel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_workConditionId_fkey" FOREIGN KEY ("workConditionId") REFERENCES "WorkCondition"("idCondition") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_activityConditionId_fkey" FOREIGN KEY ("activityConditionId") REFERENCES "ActivityCondition"("idActivity") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Housing" ADD CONSTRAINT "Housing_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("identityCard") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousingDetail" ADD CONSTRAINT "HousingDetail_idCharacteristic_detailNumber_fkey" FOREIGN KEY ("idCharacteristic", "detailNumber") REFERENCES "CharacteristicDetail"("idCharacteristic", "detailNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HousingDetail" ADD CONSTRAINT "HousingDetail_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Housing"("applicantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyHome" ADD CONSTRAINT "FamilyHome_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("identityCard") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("identityCard") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_idNucleus_fkey" FOREIGN KEY ("idNucleus") REFERENCES "Nucleus"("idNucleus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_term_fkey" FOREIGN KEY ("term") REFERENCES "Semester"("term") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_idLegalArea_fkey" FOREIGN KEY ("idLegalArea") REFERENCES "LegalArea"("idLegalArea") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_teacherId_teacherTerm_fkey" FOREIGN KEY ("teacherId", "teacherTerm") REFERENCES "Teacher"("identityCard", "term") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_idCourt_fkey" FOREIGN KEY ("idCourt") REFERENCES "Court"("idCourt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseBeneficiary" ADD CONSTRAINT "CaseBeneficiary_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Case"("idCase") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseBeneficiary" ADD CONSTRAINT "CaseBeneficiary_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("identityCard") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportDocument" ADD CONSTRAINT "SupportDocument_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Case"("idCase") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAction" ADD CONSTRAINT "CaseAction_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Case"("idCase") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAction" ADD CONSTRAINT "CaseAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("identityCard") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Case"("idCase") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("identityCard") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Case"("idCase") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatus" ADD CONSTRAINT "CaseStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("identityCard") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedStudent" ADD CONSTRAINT "AssignedStudent_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Case"("idCase") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedStudent" ADD CONSTRAINT "AssignedStudent_studentId_term_fkey" FOREIGN KEY ("studentId", "term") REFERENCES "Student"("identityCard", "term") ON DELETE RESTRICT ON UPDATE CASCADE;
