import { createApi } from '@reduxjs/toolkit/query/react'

import { API_ENDPOINTS } from '@/lib/api/config'
import axiosBaseQuery from '@/lib/axios-base-query'

// WhatsApp contact type
export interface WhatsAppContact {
  id: number;
  name: string | null;
  email: string;
  mobileNo: string;
  role: string;
  createdAt: string;
}

export const authApi = createApi({
	reducerPath: 'Auth',
	keepUnusedDataFor: 0,
	refetchOnFocus: true,
	refetchOnReconnect: true,
	refetchOnMountOrArgChange: true,
	baseQuery: axiosBaseQuery,
	tagTypes: ['Auth'],
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (payload) => ({
				url: API_ENDPOINTS.auth.login,
				method: 'POST',
				data: payload,
			}),
			invalidatesTags: ['Auth'],
		}),
		logout: builder.mutation({
			query: () => ({
				url: API_ENDPOINTS.auth.logout,
				method: 'POST',
			}),
			invalidatesTags: ['Auth'],
		}),
		getCurrentUser: builder.query({
			query: () => ({
				url: API_ENDPOINTS.users.profile,
				method: 'GET',
			}),
			providesTags: ['Auth'],
		}),
		forgotPassword: builder.mutation({
			query: (payload) => ({
				url: API_ENDPOINTS.auth.forgotPasswordRequest,
				method: 'POST',
				data: payload,
			}),
		}),
		resetPassword: builder.mutation({
			query: (payload) => ({
				url: API_ENDPOINTS.auth.resetPassword,
				method: 'POST',
				data: payload,
			}),
		}),
		getWhatsAppQrImage: builder.query<any, void>({
			query: () => ({
				url: API_ENDPOINTS.whatsapp.qrImage,
				method: 'GET',
			}),
		}),
		getWhatsAppContacts: builder.query<WhatsAppContact[], void>({
			query: () => ({
				url: API_ENDPOINTS.whatsapp.contacts,
				method: 'GET',
			}),
			transformResponse: (response: { status: number; message: string; data: WhatsAppContact[] }) => response.data,
		}),
		getWhatsAppMessagesBetween: builder.query<any[], { toNumber: string }>({
			query: ({ toNumber }) => ({
				url: API_ENDPOINTS.whatsapp.messages,
				method: 'GET',
				params: {
					fromNumber: '919712323801',
					toNumber,
				},
			}),
		}),
	}),
})

export const {
	useLoginMutation,
	useLogoutMutation,
	useLazyGetCurrentUserQuery,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useGetWhatsAppQrImageQuery,
	useGetWhatsAppContactsQuery,
	useGetWhatsAppMessagesBetweenQuery,
	useLazyGetWhatsAppMessagesBetweenQuery,
} = authApi 

// Utility to store token in localStorage
export function storeAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
}
