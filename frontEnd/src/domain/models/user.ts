import type { GenderType } from "#domain/mtypes.ts";
type UserType = "COORDINATOR" | "TEACHER" | "STUDENT";
export interface UserModel {
    identityCard: string;
    name: string;
    gender?: GenderType;
    email: string;
    password: string;
    isActive: boolean;
    type: UserType;
}