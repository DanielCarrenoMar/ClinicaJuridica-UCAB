import type { SexType } from "#domain/mtypes.ts";
type UserType = "COORDINATOR" | "TEACHER" | "STUDENT";
export interface UserModel {
    identityCard: string;
    name: string;
    gender?: SexType;
    email: string;
    password: string;
    isActive: boolean;
    type: UserType;
}