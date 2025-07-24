import { API_ENDPOINTS } from '../config';
import apiService from '../apiService';
import type { CreateUserDTO, VerifyMFAPayload, ForgotPasswordRequestPayload, LoginPayload, Verify2MFAPayload, ResetPasswordPayload, InviteUserRequestPayload, UpdateUserByIdRequestPayload, VerifyPasswordPaylod, ChangePasswordPayload, ResetPasswordForUserPayload } from '@/types/user.type';
import type { RequestConfig } from '@/types/api.types';
import type { TableQueryParams } from '@/types/table.types';



// Extend with custom methods
export const enhancedUserService = {

  // Authentications Methods
  async signup(payload: CreateUserDTO, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.register, payload, config);
    return data;
  },

  async initiateSSO(tenantId: string, provider: string, token?: string, config?: RequestConfig) {
    const params = [];
    if (token) params.push(`invitationToken=${encodeURIComponent(token)}`);
    if (tenantId) params.push(`tenantId=${encodeURIComponent(tenantId)}`);
    if (provider) params.push(`provider=${encodeURIComponent(provider)}`);
    const queryString = params.length ? `?${params.join('&')}` : '';
    const { data } = await apiService.get(API_ENDPOINTS.auth.initiateSSO + queryString, config);
    return data;
  },

  async callbackSSO(code: string, state: string, config?: RequestConfig) {
    const params = [];
    if (code) params.push(`code=${encodeURIComponent(code)}`);
    if (state) params.push(`state=${encodeURIComponent(state)}`);
    const queryString = params.length ? `?${params.join('&')}` : '';
    const { data } = await apiService.get(API_ENDPOINTS.auth.callbackSSO + queryString, config);
    return data;
  },

  async verifyMFASetup(payload: VerifyMFAPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.verifyMFASetup, payload, config);
    return data;
  },

  async reInitiateMFASetup(payload: { email: string, password: string, tenantId: string }, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.reInitiateMFASetup, payload, config);
    return data;
  },

  async validateInvitationToken(token: string, config?: RequestConfig) {
    const { data } = await apiService.get(API_ENDPOINTS.auth.validateInvitationToken + token, config);
    return data;
  },

  async forgotPasswordRequest(payload: ForgotPasswordRequestPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.forgotPasswordRequest, payload, config);
    return data;
  },

  async verifyEmailForSSO_OR_PasswordLogin(email: string, config?: RequestConfig) {
    const { data } = await apiService.get(API_ENDPOINTS.auth.verifyEmailForSSO_OR_PasswordLogin + email, config);
    return data;
  },

  async login(payload: LoginPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.login, payload, config);
    return data;
  },

  async verify2MFASetup(payload: Verify2MFAPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.verify2MFASetup, payload, config);
    return data;
  },

  async validateResetPasswordToken(token: string, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.validateResetPasswordToken, { token }, config);
    return data;
  },

  async resetPassword(payload: ResetPasswordPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.resetPassword, payload, config);
    return data;
  },

  async getUsers(params: TableQueryParams, config?: RequestConfig) {
    const query = [];
    if (params.page) query.push(`page=${encodeURIComponent(params.page)}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params?.search_text) query.push(`search=${params.search_text}`);
    if (params?.sort_column) query.push(`sortBy=${params.sort_column}:${params.sort_order}`);
    if (params?.filters?.length) {
      params.filters.map((filter: any) => {
        const values: any[] = [];
        filter.value.map((filterValue: any) => {
          if (typeof filterValue === "boolean") values.push(+filterValue);
          else values.push(filterValue)
        });
        query.push(`${filter.id}=${values.join(',')}`);
      });
    }
    const queryString = query.length ? `?${query.join('&')}` : '';
    const { data } = await apiService.get(API_ENDPOINTS.users.all + queryString, config);
    return data;
  },

  async allInvitations(params: TableQueryParams, config?: RequestConfig) {
    const query = ['isUsed=0'];
    if (params.page) query.push(`page=${encodeURIComponent(params.page)}`);
    if (params.limit) query.push(`limit=${params.limit}`);
    if (params?.search_text) query.push(`search=${params.search_text}`);
    if (params?.sort_column) query.push(`sortBy=${params.sort_column}:${params.sort_order}`);
    if (params?.filters?.length) {
      params.filters.map((filter: any) => {
        const values: any[] = [];
        filter.value.map((filterValue: any) => {
          if (typeof filterValue === "boolean") values.push(+filterValue);
          else values.push(filterValue)
        });
        query.push(`${filter.id}=${values.join(',')}`);
      });
    }
    const queryString = query.length ? `?${query.join('&')}` : '';
    const { data } = await apiService.get(API_ENDPOINTS.users.allInvitations + queryString, config);
    return data;
  },

  async refreshToken(config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.refresh, {}, config);
    return data;
  },

  async getProfile(config?: RequestConfig) {
    const { data } = await apiService.get(API_ENDPOINTS.users.profile, config);
    return data;
  },

  async verifyPassword(payload: VerifyPasswordPaylod, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.verifyPassword, payload, config);
    return data;
  },

  async changePassword(payload: ChangePasswordPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.auth.changePassword, payload, config);
    return data;
  },


  // User Managements Methods

  async inviteUsers(payload: InviteUserRequestPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.users.inviteUsers, payload, config);
    return data;
  },

  async resendInvitation(userId: string, config?: RequestConfig) {
    const { data } = await apiService.post(`${API_ENDPOINTS.users.resendInvitation}/${encodeURIComponent(userId)}`, {}, config);
    return data;
  },

  async updateUserById(userId: string, payload: UpdateUserByIdRequestPayload, config?: RequestConfig) {
    const { data } = await apiService.patch(`${API_ENDPOINTS.users.editUserById}/${encodeURIComponent(userId)}`, payload, config);
    return data;
  },

  async updateInvitationById(userId: string, payload: UpdateUserByIdRequestPayload, config?: RequestConfig) {
    const { data } = await apiService.patch(`${API_ENDPOINTS.users.updateInvitationById}/${encodeURIComponent(userId)}`, payload, config);
    return data;
  },

  async toggleActiveUser(userId: string, config?: RequestConfig) {
    const { data } = await apiService.patch(`${API_ENDPOINTS.users.toggleActiveUser}/${encodeURIComponent(userId)}`, config);
    return data;
  },

  async deleteUser(userId: string, config?: RequestConfig) {
    const { data } = await apiService.delete(`${API_ENDPOINTS.users.deleteUser}/${encodeURIComponent(userId)}`, config);
    return data;
  },

  async resetPasswordForUser(payload: ResetPasswordForUserPayload, config?: RequestConfig) {
    const { data } = await apiService.post(API_ENDPOINTS.users.resetPasswordForUser, payload, config);
    return data;
  },

  async toggleDiscoveryAllSet(payload: { showGuide: boolean; }, config?: RequestConfig) {
    const { data } = await apiService.patch(API_ENDPOINTS.auth.toggleDiscoveryAllSet, payload, config);
    return data;
  },

  // async updateProfile(updateData: UpdateUserDTO) {
  //   const { data } = await apiService.put<User>(
  //     API_ENDPOINTS.users.update,
  //     updateData
  //   );
  //   return data;
  // },

  // async changePassword(oldPassword: string, newPassword: string) {
  //   const { data } = await apiService.post('/users/change-password', {
  //     oldPassword,
  //     newPassword,
  //   });
  //   return data;
  // },
};

export default enhancedUserService; 