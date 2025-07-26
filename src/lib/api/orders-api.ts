import { createApi } from '@reduxjs/toolkit/query/react'

import { API_ENDPOINTS } from '@/lib/api/config'
import axiosBaseQuery from '@/lib/axios-base-query'

const API_URL = API_ENDPOINTS.orders
const CUSTOMER_API_URL = API_ENDPOINTS.customers.all

export const ordersApi = createApi({
    reducerPath: 'Orders',
    keepUnusedDataFor: 0,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    baseQuery: axiosBaseQuery,
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getOrders: builder.query({
            keepUnusedDataFor: 0,
            query: (params) => ({
                url: API_URL,
                method: 'GET',
                params: params,
            }),
            providesTags: ['Order'],
        }),
        getOrder: builder.query({
            keepUnusedDataFor: 0,
            query: (id) => ({
                url: `${API_URL}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Order'],
        }),
        createOrder: builder.mutation({
            query: (payload) => ({
                url: API_URL,
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: ['Order'],
        }),
        updateOrder: builder.mutation({
            query: ({ payload, id }) => ({
                url: `${API_URL}/${id}`,
                method: 'PATCH',
                data: payload,
            }),
            invalidatesTags: ['Order'],
        }),

        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `${API_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order'],
        }),

        deleteOrderItem: builder.mutation({
            query: (id) => ({
                url: `${API_URL}/items/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order'],
        }),

        getCustomers: builder.query({
            query: (params) => ({
                url: CUSTOMER_API_URL,
                method: 'GET',
                params: params,
            }),
        }),

        getCustomerPOCs: builder.query({
            query: ({ params, id }) => ({
                url: `${CUSTOMER_API_URL}/${id}/users`,
                method: 'GET',
                params: params,
            }),
        }),


        getProducts: builder.query({
            query: (params) => ({
                url: API_ENDPOINTS.products,
                method: 'GET',
                params: params,
            }),
        }),
    }),
})

export const {
    useLazyGetOrdersQuery,
    useLazyGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useLazyGetCustomersQuery,
    useLazyGetProductsQuery,
    useDeleteOrderItemMutation,
    useLazyGetCustomerPOCsQuery,
} = ordersApi 