import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { InviteUserRequestPayload, ResetPasswordForUserPayload, UpdateUserByIdRequestPayload, User } from '@/types/user.type';
import { API_ENDPOINTS } from '@/lib/api/config';
import { setLoading } from '../app/appSlice';
import userService from '@/lib/api/services/userService';
import { toast } from 'sonner';
import { parseFullName, pluralize } from '@/lib/utils';
import type { TableMetadata, TableQueryParams } from '@/types/table.types';
import { getTableState } from '@/lib/table-storage';
import { InvitesSentTabelId, UserDirectoryTabelId } from '@/utils/constant';
import type { store } from '@/lib/store';


// Types
export interface UserInvite {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface SettingsState {
    userInvites: {
        list: UserInvite[];
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
    };
    inviteUser: {
        isOpen: boolean;
    };
    userActivation: {
        isOpen: boolean;
        selectedUser: User | null;
        isLoading: boolean;
        error: string | null;
    };
    reconnectMFADialog: {
        isOpen: boolean;
        isLoading: boolean;
        error: string | null;
    };
    editUser: {
        isOpen: boolean;
        selectedUser: User | null;
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
        isDelete: boolean;
    };
    confirmPasswordModal: {
        isOpen: boolean;
        isLoading: boolean;
        error: string | null;
    };
    setPasswordModal: {
        isOpen: boolean;
        isLoading: boolean;
        error: string | null;
        isOpenSuccessModal: boolean;
    };
    users: {
        metadata: TableMetadata;
        data: User[]
    },
    invitations: {
        metadata: TableMetadata;
        data: User[]
    },
    alreadyInvitedUsers: User[]

}

const initialState: SettingsState = {
    userInvites: {
        list: [],
        status: 'idle',
        error: null
    },
    inviteUser: {
        isOpen: false,
    },
    userActivation: {
        isOpen: false,
        selectedUser: null,
        isLoading: false,
        error: null
    },
    editUser: {
        isOpen: false,
        selectedUser: null,
        status: 'idle',
        error: null,
        isDelete: false
    },
    confirmPasswordModal: {
        isOpen: false,
        isLoading: false,
        error: null
    },
    setPasswordModal: {
        isOpen: false,
        isLoading: false,
        error: null,
        isOpenSuccessModal: false
    },
    reconnectMFADialog: {
        isOpen: false,
        isLoading: false,
        error: null
    },
    users: {
        metadata: {
            page: 1,
            limit: 10,
            results: 0,
            total: 0
        },
        data: []
    },
    invitations: {
        metadata: {
            page: 1,
            limit: 10,
            results: 0,
            total: 0
        },
        data: []
    },
    alreadyInvitedUsers: []
};

// Async Thunks


// API
export const inviteUsers = createAsyncThunk(API_ENDPOINTS.users.inviteUsers,
    async ({ payload, callback }: { payload: InviteUserRequestPayload, callback: () => void }, { dispatch, getState }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.inviteUsers, isLoading: true }));
            const res = await userService.inviteUsers(payload);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.inviteUsers, isLoading: false }));
                const alreadyInvitedUsers = res.data.results?.filter((a: User) => a.status === "failed")
                const invitedUsers = res.data.results?.filter((a: User) => a.status === "success");
                if (invitedUsers.length) {
                    const activeTab = new URLSearchParams(window.location.search).get('tab');
                    if (activeTab === 'invites-sent') {
                        // Optionally, you can update the user in the invites list or user directory
                        const state = getState() as { auth: { user: User } };
                        const usersParams: TableQueryParams = getTableState(`${state?.auth?.user?.id}-${InvitesSentTabelId}`);
                        dispatch(allInvitations(usersParams));
                    } else
                        callback();
                    alreadyInvitedUsers?.length && dispatch(setAlreadyInvitedUsers(invitedUsers))
                };
                if (alreadyInvitedUsers?.length) {
                    throw new Error(invitedUsers?.length ? `Some users were already invited and could not be re-invited. The others have been successfully invited.` : `${pluralize('User', alreadyInvitedUsers.length)} have already been invited!`)
                };
                dispatch(closeInviteUserDrawer());
                toast.success(`${payload.invitations.length} ${pluralize('user', payload.invitations.length)} has been invited via email!`);
            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.inviteUsers, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        };
    }
);

export const resendInvitation = createAsyncThunk(API_ENDPOINTS.users.resendInvitation,
    async (userId: string, { dispatch }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.resendInvitation, isLoading: true }));
            const res = await userService.resendInvitation(userId);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.resendInvitation, isLoading: false }));
                toast.success(`Invitation sent successfully!`);
            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.resendInvitation, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        };
    }
);

export const editUserById = createAsyncThunk(API_ENDPOINTS.users.editUserById,
    async ({ userId, payload }: { userId: string; payload: UpdateUserByIdRequestPayload }, { dispatch, getState }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.editUserById, isLoading: true }));
            const res = await userService.updateUserById(userId, payload);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.editUserById, isLoading: false }));
                dispatch(closeEditDrawer())
                // Optionally, you can update the user in the invites list or user directory
                const state = getState() as { auth: { user: User } };
                const usersParams: TableQueryParams = getTableState(`${state?.auth?.user?.id}-${UserDirectoryTabelId}`);
                dispatch(getAllUser(usersParams));
                toast.success(`User information has been updated`);
            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.editUserById, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        };
    }
);

export const getAllUser = createAsyncThunk(API_ENDPOINTS.users.all,
    async (params: TableQueryParams, { dispatch }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.all, isLoading: true }));
            const res = await userService.getUsers(params);
            if (res.status === "success") {
                dispatch(setUsers(res));
                dispatch(setLoading({ key: API_ENDPOINTS.users.all, isLoading: false }));
            } else {
                throw new Error(res.statusText);
            }
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.all, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        }
    }
);

export const allInvitations = createAsyncThunk(API_ENDPOINTS.users.allInvitations,
    async (params: TableQueryParams, { dispatch }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.allInvitations, isLoading: true }));
            const res = await userService.allInvitations(params);
            if (res.status === "success") {
                dispatch(setAllInvitations(res));
                dispatch(setLoading({ key: API_ENDPOINTS.users.allInvitations, isLoading: false }));
            } else {
                throw new Error(res.statusText);
            }
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.allInvitations, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        }
    }
);

export const toggleActiveUser = createAsyncThunk(API_ENDPOINTS.users.toggleActiveUser,
    async (userId: string, { dispatch, getState }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.toggleActiveUser, isLoading: true }));
            const res = await userService.toggleActiveUser(userId);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.toggleActiveUser, isLoading: false }));

                const state = getState() as ReturnType<typeof store.getState>;
                const selected = state.settings.userActivation.selectedUser;
                const { isOpen, selectedUser } = state.settings.editUser;

                if (isOpen) dispatch(openEditDrawer({ ...selectedUser, active: !selected?.active }))

                const usersParams: TableQueryParams = getTableState(`${state?.auth?.user?.id}-${UserDirectoryTabelId}`);
                dispatch(getAllUser(usersParams));

                toast.success(`1 user has been successfully ${selected?.active ? 'deactivated' : 'activated'}!`);

                dispatch(closeUserActivationModal());
            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.toggleActiveUser, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        };
    }
);

export const deleteUser = createAsyncThunk(API_ENDPOINTS.users.deleteUser,
    async (userId: string, { dispatch, getState }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.deleteUser, isLoading: true }));
            const res = await userService.deleteUser(userId);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.deleteUser, isLoading: false }));

                const state = getState() as ReturnType<typeof store.getState>;
                const { isOpen } = state.settings.editUser;

                if (isOpen) dispatch(closeEditDrawer())

                const usersParams: TableQueryParams = getTableState(`${state?.auth?.user?.id}-${UserDirectoryTabelId}`);
                dispatch(getAllUser(usersParams));

                toast.success(`1 user has been successfully deleted!`);

            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.deleteUser, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        };
    }
);

export const updateInvitationById = createAsyncThunk(API_ENDPOINTS.users.updateInvitationById,
    async ({ userId, payload }: { userId: string; payload: UpdateUserByIdRequestPayload }, { dispatch, getState }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.updateInvitationById, isLoading: true }));
            const res = await userService.updateInvitationById(userId, payload);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.updateInvitationById, isLoading: false }));
                dispatch(closeEditDrawer())
                // Optionally, you can update the user in the invites list or user directory
                const state = getState() as { auth: { user: User } };
                const usersParams: TableQueryParams = getTableState(`${state?.auth?.user?.id}-${InvitesSentTabelId}`);
                dispatch(allInvitations(usersParams));
                toast.success(`User information has been updated`);
            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.updateInvitationById, isLoading: false }));
            toast.error(err?.data?.message || err?.message);
        };
    }
);


export const resetPasswordForUser = createAsyncThunk(API_ENDPOINTS.users.resetPasswordForUser,
    async (payload: ResetPasswordForUserPayload, { dispatch }) => {
        try {
            dispatch(setLoading({ key: API_ENDPOINTS.users.resetPasswordForUser, isLoading: true }));
            const res = await userService.resetPasswordForUser(payload);
            if (res.status === "success") {
                dispatch(setLoading({ key: API_ENDPOINTS.users.resetPasswordForUser, isLoading: false }));
                toast.success(`Password reset email sent successfully.`);
            } else {
                throw new Error(res.statusText);
            };
        } catch (err: any) {
            dispatch(setLoading({ key: API_ENDPOINTS.users.resetPasswordForUser, isLoading: false }));
            toast.error(err?.data?.message || err?.message || 'Something went wrong. Please try later.');
        };
    }
);

// Slice
const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        clearInvitesList: (state) => {
            state.userInvites.list = [];
            state.userInvites.status = 'idle';
            state.userInvites.error = null;
        },
        openInviteUserDrawer: (state) => {
            state.inviteUser.isOpen = true;
        },
        closeInviteUserDrawer: (state) => {
            state.inviteUser.isOpen = false;
        },
        openEditDrawer: (state, action) => {
            const { firstName, lastName } = parseFullName(action.payload.name);
            state.editUser.isOpen = true;
            state.editUser.selectedUser = {
                ...action.payload,
                firstName,
                lastName
            }
        },
        closeEditDrawer: (state) => {
            state.editUser.isOpen = false;
            state.editUser.selectedUser = null;
            state.editUser.status = 'idle';
            state.editUser.error = null;
            state.editUser.isDelete = false;
        },
        openConfirmPasswordModal: (state) => {
            state.confirmPasswordModal.isOpen = true;
            state.confirmPasswordModal.isLoading = false;
            state.confirmPasswordModal.error = null;
        },
        closeConfirmPasswordModal: (state) => {
            state.confirmPasswordModal.isOpen = false;
            state.confirmPasswordModal.isLoading = false;
            state.confirmPasswordModal.error = null;
        },
        openSetPasswordModal: (state) => {
            state.setPasswordModal.isOpen = true;
            state.setPasswordModal.isLoading = false;
            state.setPasswordModal.error = null;
        },
        closeSetPasswordModal: (state) => {
            state.setPasswordModal.isOpen = false;
            state.setPasswordModal.isLoading = false;
            state.setPasswordModal.error = null;
        },
        openSuccessModal: (state) => {
            state.setPasswordModal.isOpenSuccessModal = true;
        },
        closeSuccessModal: (state) => {
            state.setPasswordModal.isOpenSuccessModal = false;
        },
        openDeleteUserModal: (state) => {
            state.editUser.isDelete = true;
        },
        closeDeleteUserModal: (state) => {
            state.editUser.isDelete = false;
        },
        openUserActivationModal: (state, action) => {
            state.userActivation.isOpen = true;
            state.userActivation.selectedUser = action.payload;
            state.userActivation.isLoading = false;
            state.userActivation.error = null;
        },
        closeUserActivationModal: (state) => {
            state.userActivation.isOpen = false;
            state.userActivation.selectedUser = null;
            state.userActivation.isLoading = false;
            state.userActivation.error = null;
        },
        openReconnectMFADialog: (state) => {
            state.reconnectMFADialog.isOpen = true;
            state.reconnectMFADialog.isLoading = false;
            state.reconnectMFADialog.error = null;
        },
        closeReconnectMFADialog: (state) => {
            state.reconnectMFADialog.isOpen = false;
            state.reconnectMFADialog.isLoading = false;
            state.reconnectMFADialog.error = null;
        },
        setUsers: (state, action) => {
            state.users.data = action.payload.data;
            state.users.metadata = {
                ...state.users.metadata,
                ...action.payload.metadata
            };
        },
        setAllInvitations: (state, action) => {
            state.invitations.data = action.payload.data;
            state.invitations.metadata = {
                ...state.invitations.metadata,
                ...action.payload.metadata
            };
        },
        setAlreadyInvitedUsers: (state, action) => {
            state.alreadyInvitedUsers = action.payload
        }
    },

});

export const {
    clearInvitesList,
    openInviteUserDrawer,
    closeInviteUserDrawer,
    openEditDrawer,
    closeEditDrawer,
    openConfirmPasswordModal,
    closeConfirmPasswordModal,
    openSetPasswordModal,
    closeSetPasswordModal,
    openSuccessModal,
    closeSuccessModal,
    openDeleteUserModal,
    closeDeleteUserModal,
    openUserActivationModal,
    closeUserActivationModal,
    openReconnectMFADialog,
    closeReconnectMFADialog,
    setUsers,
    setAllInvitations,
    setAlreadyInvitedUsers
} = settingsSlice.actions;
export default settingsSlice.reducer; 