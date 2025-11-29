-- CreateEnum
CREATE TYPE "CaseStatusType" AS ENUM ('OPEN', 'IN_PROGRESS', 'ON_PAUSE', 'CLOSED');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('M', 'F', 'O');

-- CreateEnum
CREATE TYPE "ColaboratorType" AS ENUM ('STUDENT', 'GRADUATE', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "IDType" AS ENUM ('V', 'E', 'J');

-- CreateEnum
CREATE TYPE "WorkConditionType" AS ENUM ('EMPLOYER', 'EMPLOYEE', 'WORKER', 'SELF_EMPLOYED');

-- CreateEnum
CREATE TYPE "ActivityConditionType" AS ENUM ('HOUSEWIFE', 'STUDENT', 'RETIRED', 'OTHER');

-- CreateEnum
CREATE TYPE "WasteCollectionType" AS ENUM ('HOME_COLLECTION', 'PUBLIC_CONTAINER', 'NONE');

-- CreateEnum
CREATE TYPE "WastewaterType" AS ENUM ('SEWER_OR_SEPTIC', 'UNCONNECTED_TOILET', 'LATRINE', 'NONE');

-- CreateEnum
CREATE TYPE "WaterServiceType" AS ENUM ('INDOOR', 'OUTDOOR', 'NONE');

-- CreateEnum
CREATE TYPE "RoofMaterialType" AS ENUM ('WOOD_PALM_CARDBOARD', 'ZINC_SHEET', 'CONCRETE_OR_TILES');

-- CreateEnum
CREATE TYPE "WallMaterialType" AS ENUM ('WASTE_MATERIALS', 'BAHAREQUE', 'UNPLASTERED_BLOCK', 'PLASTERED_BLOCK');

-- CreateEnum
CREATE TYPE "FloorMaterialType" AS ENUM ('DIRT', 'CEMENT', 'CERAMIC', 'GRANITE_PARQUET_MARBLE');

-- CreateEnum
CREATE TYPE "LegalAreaType" AS ENUM ('PERSONS', 'GOODS', 'CONTRACTS', 'ORDINARY_COURTS', 'CHILD_PROTECTION_COURTS', 'SUCCESSIONS', 'CRIMINAL_MATERIAL', 'LABOR_MATERIAL', 'COMMERCIAL_MATERIAL', 'ADMINISTRATIVE_MATERIAL', 'OTHERS');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BeneficiaryType" AS ENUM ('DIRECT', 'INDIRECT');

-- CreateTable
CREATE TABLE "Users" (
    "idUser" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Colaborators" (
    "idUser" INTEGER NOT NULL,
    "typeColaborator" "ColaboratorType" NOT NULL,
    "idSubject" INTEGER,
    "section" TEXT,

    CONSTRAINT "Colaborators_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Teachers" (
    "idUser" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Teachers_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Subject" (
    "idSubject" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idTeacher" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("idSubject","section")
);

-- CreateTable
CREATE TABLE "CaseStatuses" (
    "idCaseStatus" SERIAL NOT NULL,
    "idUser" INTEGER NOT NULL,
    "idCase" INTEGER NOT NULL,
    "statusCase" "CaseStatusType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseStatuses_pkey" PRIMARY KEY ("idCaseStatus","idUser","idCase")
);

-- CreateTable
CREATE TABLE "Beneficiaries" (
    "idBeneficiary" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "idType" "IDType" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "GenderType" NOT NULL,
    "idParish" INTEGER NOT NULL,

    CONSTRAINT "Beneficiaries_pkey" PRIMARY KEY ("idBeneficiary")
);

-- CreateTable
CREATE TABLE "Applicants" (
    "idApplicant" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneCell" TEXT NOT NULL,
    "phoneHome" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "concubinage" BOOLEAN NOT NULL,
    "isWorking" BOOLEAN NOT NULL,
    "workCondition" "WorkConditionType",
    "isLookingJob" BOOLEAN NOT NULL,
    "activityCondition" "ActivityConditionType",
    "isHouseHoldHead" BOOLEAN NOT NULL,
    "educationLevel" INTEGER NOT NULL,
    "educationMonths" INTEGER NOT NULL,
    "educationLevelHousehold" INTEGER,
    "educationMonthsHousehold" INTEGER,
    "typeResidence" TEXT,
    "roomsAmount" INTEGER,
    "bathroomsAmount" INTEGER,
    "roofMaterial" "RoofMaterialType",
    "wallMaterial" "WallMaterialType",
    "floorMaterial" "FloorMaterialType",
    "waterService" "WaterServiceType",
    "wastewaterService" "WastewaterType",
    "wasteCollection" "WasteCollectionType",
    "idFamilyHouse" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicants_pkey" PRIMARY KEY ("idApplicant")
);

-- CreateTable
CREATE TABLE "Parishes" (
    "idParish" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "idMunicipality" INTEGER NOT NULL,

    CONSTRAINT "Parishes_pkey" PRIMARY KEY ("idParish")
);

-- CreateTable
CREATE TABLE "Municipalities" (
    "idMunicipality" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "idRegion" INTEGER NOT NULL,

    CONSTRAINT "Municipalities_pkey" PRIMARY KEY ("idMunicipality")
);

-- CreateTable
CREATE TABLE "Regions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyHouses" (
    "idFamilyHouse" SERIAL NOT NULL,
    "memberWorkingCount" INTEGER NOT NULL,
    "membersNonWorkingCount" INTEGER NOT NULL,
    "childrens7to12Count" INTEGER NOT NULL,
    "childrensStudentCount" INTEGER NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FamilyHouses_pkey" PRIMARY KEY ("idFamilyHouse")
);

-- CreateTable
CREATE TABLE "Cases" (
    "idCase" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "observations" TEXT,
    "tramitType" INTEGER NOT NULL,
    "idLegalArea" INTEGER NOT NULL,
    "idCourt" INTEGER,
    "idApplicant" INTEGER NOT NULL,
    "idNucleus" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "semesterIdSemester" INTEGER,

    CONSTRAINT "Cases_pkey" PRIMARY KEY ("idCase")
);

-- CreateTable
CREATE TABLE "SuportDocuments" (
    "idCase" INTEGER NOT NULL,
    "idSuportDocument" SERIAL NOT NULL,
    "typeDocument" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuportDocuments_pkey" PRIMARY KEY ("idCase","idSuportDocument")
);

-- CreateTable
CREATE TABLE "Nucleus" (
    "idNucleus" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "idParish" INTEGER NOT NULL,

    CONSTRAINT "Nucleus_pkey" PRIMARY KEY ("idNucleus")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "idCase" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statusAppointment" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "observations" TEXT,
    "idUser" INTEGER NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("idCase","date")
);

-- CreateTable
CREATE TABLE "LegalAreas" (
    "idLegalArea" SERIAL NOT NULL,
    "typeLegalArea" "LegalAreaType" NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "LegalAreas_pkey" PRIMARY KEY ("idLegalArea")
);

-- CreateTable
CREATE TABLE "CaseAssignments" (
    "idUser" INTEGER NOT NULL,
    "idCase" INTEGER NOT NULL,
    "idSemester" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "CaseAssignments_pkey" PRIMARY KEY ("idUser","idCase","idSemester")
);

-- CreateTable
CREATE TABLE "Semesters" (
    "idSemester" SERIAL NOT NULL,
    "term" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semesters_pkey" PRIMARY KEY ("idSemester")
);

-- CreateTable
CREATE TABLE "Courts" (
    "idCourt" SERIAL NOT NULL,
    "typeCourt" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Courts_pkey" PRIMARY KEY ("idCourt")
);

-- CreateTable
CREATE TABLE "RecordCourts" (
    "idRecordCourt" SERIAL NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "observations" TEXT,
    "idCourt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordCourts_pkey" PRIMARY KEY ("idRecordCourt")
);

-- CreateTable
CREATE TABLE "DocumentRecordCourts" (
    "idRecordCourt" INTEGER NOT NULL,
    "idDocumentRecordCourt" SERIAL NOT NULL,
    "typeDocument" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRecordCourts_pkey" PRIMARY KEY ("idRecordCourt","idDocumentRecordCourt")
);

-- CreateTable
CREATE TABLE "CaseActions" (
    "idCase" INTEGER NOT NULL,
    "idCaseAction" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "idUser" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseActions_pkey" PRIMARY KEY ("idCaseAction","idCase")
);

-- CreateTable
CREATE TABLE "ExecuteActions" (
    "idUser" INTEGER NOT NULL,
    "idCaseAction" INTEGER NOT NULL,
    "idCase" INTEGER NOT NULL,
    "dateExecuted" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecuteActions_pkey" PRIMARY KEY ("idUser","idCaseAction")
);

-- CreateTable
CREATE TABLE "IsBeneficiaryOf" (
    "idBeneficiary" INTEGER NOT NULL,
    "idCase" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "typeBeneficiary" "BeneficiaryType" NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "IsBeneficiaryOf_pkey" PRIMARY KEY ("idBeneficiary","idCase")
);

-- CreateTable
CREATE TABLE "AttendAppointments" (
    "idUser" INTEGER NOT NULL,
    "idCase" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendAppointments_pkey" PRIMARY KEY ("idUser","idCase","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Colaborators" ADD CONSTRAINT "Colaborators_idSubject_section_fkey" FOREIGN KEY ("idSubject", "section") REFERENCES "Subject"("idSubject", "section") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborators" ADD CONSTRAINT "Colaborators_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_idTeacher_fkey" FOREIGN KEY ("idTeacher") REFERENCES "Teachers"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStatuses" ADD CONSTRAINT "CaseStatuses_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiaries" ADD CONSTRAINT "Beneficiaries_idParish_fkey" FOREIGN KEY ("idParish") REFERENCES "Parishes"("idParish") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicants" ADD CONSTRAINT "Applicants_idFamilyHouse_fkey" FOREIGN KEY ("idFamilyHouse") REFERENCES "FamilyHouses"("idFamilyHouse") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parishes" ADD CONSTRAINT "Parishes_idMunicipality_fkey" FOREIGN KEY ("idMunicipality") REFERENCES "Municipalities"("idMunicipality") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipalities" ADD CONSTRAINT "Municipalities_idRegion_fkey" FOREIGN KEY ("idRegion") REFERENCES "Regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cases" ADD CONSTRAINT "Cases_idLegalArea_fkey" FOREIGN KEY ("idLegalArea") REFERENCES "LegalAreas"("idLegalArea") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cases" ADD CONSTRAINT "Cases_idCourt_fkey" FOREIGN KEY ("idCourt") REFERENCES "Courts"("idCourt") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cases" ADD CONSTRAINT "Cases_idApplicant_fkey" FOREIGN KEY ("idApplicant") REFERENCES "Applicants"("idApplicant") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cases" ADD CONSTRAINT "Cases_idNucleus_fkey" FOREIGN KEY ("idNucleus") REFERENCES "Nucleus"("idNucleus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cases" ADD CONSTRAINT "Cases_semesterIdSemester_fkey" FOREIGN KEY ("semesterIdSemester") REFERENCES "Semesters"("idSemester") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuportDocuments" ADD CONSTRAINT "SuportDocuments_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Cases"("idCase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nucleus" ADD CONSTRAINT "Nucleus_idParish_fkey" FOREIGN KEY ("idParish") REFERENCES "Parishes"("idParish") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Cases"("idCase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignments" ADD CONSTRAINT "CaseAssignments_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignments" ADD CONSTRAINT "CaseAssignments_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Cases"("idCase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignments" ADD CONSTRAINT "CaseAssignments_idSemester_fkey" FOREIGN KEY ("idSemester") REFERENCES "Semesters"("idSemester") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordCourts" ADD CONSTRAINT "RecordCourts_idCourt_fkey" FOREIGN KEY ("idCourt") REFERENCES "Courts"("idCourt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRecordCourts" ADD CONSTRAINT "DocumentRecordCourts_idRecordCourt_fkey" FOREIGN KEY ("idRecordCourt") REFERENCES "RecordCourts"("idRecordCourt") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseActions" ADD CONSTRAINT "CaseActions_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Cases"("idCase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseActions" ADD CONSTRAINT "CaseActions_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecuteActions" ADD CONSTRAINT "ExecuteActions_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecuteActions" ADD CONSTRAINT "ExecuteActions_idCaseAction_idCase_fkey" FOREIGN KEY ("idCaseAction", "idCase") REFERENCES "CaseActions"("idCaseAction", "idCase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsBeneficiaryOf" ADD CONSTRAINT "IsBeneficiaryOf_idBeneficiary_fkey" FOREIGN KEY ("idBeneficiary") REFERENCES "Beneficiaries"("idBeneficiary") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsBeneficiaryOf" ADD CONSTRAINT "IsBeneficiaryOf_idCase_fkey" FOREIGN KEY ("idCase") REFERENCES "Cases"("idCase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendAppointments" ADD CONSTRAINT "AttendAppointments_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendAppointments" ADD CONSTRAINT "AttendAppointments_idCase_date_fkey" FOREIGN KEY ("idCase", "date") REFERENCES "Appointments"("idCase", "date") ON DELETE RESTRICT ON UPDATE CASCADE;
