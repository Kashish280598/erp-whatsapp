export type User = {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
    invitedBy: {
        id: string;
        name: string;
    };
    lastActivity?: string;
    status: string;
    authMethod?: string;
    sentOn?: string;
    createdAt?: string;
    updatedAt?: string;
    active?: boolean;
    inviterName?: string;
    isInviteTab?: boolean;
    showGuide?:boolean;
};

export interface CreateUserDTO {
    password: string;
    invitationToken: string;
}

export interface VerifyMFAPayload {
    email: string;
    totpCode: string;
    session: string;
};

export interface Verify2MFAPayload {
    email: string;
    totpCode: string;
    session: string;
    tenantId: string;
};

export interface ForgotPasswordRequestPayload {
    email: string;
    tenantId?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
    tenantId: string;
}

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
    tenantId: string;
};

export interface Invitation {
    email: string;
    name: string;
    role: string;
};

export interface InviteUserRequestPayload {
    tenantId: string;
    invitations: Invitation[];
};

export interface UpdateUserByIdRequestPayload {
    name: string;
    role: string;
    email?: string;
};

export interface VerifyPasswordPaylod {
    email: string;
    password: string;
};

export interface ChangePasswordPayload {
    email: string;
    currentPassword: string;
    newPassword: string;
};

export interface ResetPasswordForUserPayload {
    userId: string;
    tenantId: string;
}