export type TUserRoles = 'user' | 'admin';

export type TPreviousPassword = {
    password: string;
    timestamp: Date;
};
export interface TUser {
    username: string;
    email: string;
    password?: string;
    role: TUserRoles;
    previousPasswords?: TPreviousPassword[];
    passwordChangedAt?: Date;
    createdAt: Date;
}
