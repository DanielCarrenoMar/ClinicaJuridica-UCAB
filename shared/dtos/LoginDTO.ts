export interface LoginResDTO {
    fullName: string;
    token?: string;
}

export interface LoginReqDTO {
    email: string;
    password: string;
}