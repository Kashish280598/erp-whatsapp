import { createApi } from '@reduxjs/toolkit/query/react'

import { API_ENDPOINTS } from '@/lib/api/config'
import axiosBaseQuery from '@/lib/axios-base-query'

const API_URL = API_ENDPOINTS.users.all

export const usersApi = createApi({
	reducerPath: 'Users',
	keepUnusedDataFor: 0,
	refetchOnFocus: true,
	refetchOnReconnect: true,
	refetchOnMountOrArgChange: true,
	baseQuery: axiosBaseQuery,
	tagTypes: ['User'],
	endpoints: (builder) => ({
		getUsers: builder.query({
			keepUnusedDataFor: 0,
			query: (params) => ({
				url: API_URL,
				method: 'GET',
				params: params,
			}),
			providesTags: ['User'],
		}),
		getUser: builder.query({
			keepUnusedDataFor: 0,
			query: (id) => ({
				url: `${API_URL}/${id}`,
				method: 'GET',
			}),
			providesTags: ['User'],
		}),
		createUser: builder.mutation({
			query: (payload) => ({
				url: API_URL,
				method: 'POST',
				data: payload,
			}),
			invalidatesTags: ['User'],
		}),
		updateUser: builder.mutation({
			query: ({ payload, id }) => ({
				url: `${API_URL}/${id}`,
				method: 'PATCH',
				data: payload,
			}),
			invalidatesTags: ['User'],
		}),
		deleteUser: builder.mutation({
			query: (id) => ({
				url: `${API_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
		}),
	}),
})

export const {
	useLazyGetUsersQuery,
	useLazyGetUserQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = usersApi
