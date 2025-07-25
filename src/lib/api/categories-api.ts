import { createApi } from '@reduxjs/toolkit/query/react'

import { API_ENDPOINTS } from '@/lib/api/config'
import axiosBaseQuery from '@/lib/axios-base-query'

const API_URL = API_ENDPOINTS.categories

export const categoriesApi = createApi({
	reducerPath: 'Categories',
	keepUnusedDataFor: 0,
	refetchOnFocus: true,
	refetchOnReconnect: true,
	refetchOnMountOrArgChange: true,
	baseQuery: axiosBaseQuery,
	tagTypes: ['Category'],
	endpoints: (builder) => ({
		getCategories: builder.query({
			keepUnusedDataFor: 0,
			query: (params) => ({
				url: API_URL,
				method: 'GET',
				params: params,
			}),
			providesTags: ['Category'],
		}),
		getCategory: builder.query({
			keepUnusedDataFor: 0,
			query: (id) => ({
				url: `${API_URL}/${id}`,
				method: 'GET',
			}),
			providesTags: ['Category'],
		}),
		createCategory: builder.mutation({
			query: (payload) => ({
				url: API_URL,
				method: 'POST',
				data: payload,
			}),
			invalidatesTags: ['Category'],
		}),
		updateCategory: builder.mutation({
			query: ({ payload, id }) => ({
				url: `${API_URL}/${id}`,
				method: 'PATCH',
				data: payload,
			}),
			invalidatesTags: ['Category'],
		}),
		deleteCategory: builder.mutation({
			query: (id) => ({
				url: `${API_URL}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Category'],
		}),
	}),
})

export const {
	useLazyGetCategoriesQuery,
	useLazyGetCategoryQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
} = categoriesApi
