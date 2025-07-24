import axios, { type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from './api/config';
import { store } from './store';

const axiosBaseQuery = async (config: AxiosRequestConfig) => {
	try {
		const { auth } = store.getState()
		if (auth?.token) {
			// @ts-ignore
			config.headers['Authorization'] = `Bearer ${auth?.token}`
		}

		let url = config.url || '';
		// Prepend baseURL if url is relative
		if (url && !url.startsWith('http')) {
			url = API_CONFIG.baseURL + url;
		}
		const response = await axios({ ...config, url });
		// Check for API-level error (even if HTTP status is 200)
		if (response.data && typeof response.data.status !== 'undefined' && response.data.status !== 200) {
			throw {
				response: {
					status: response.data.status,
					data: response.data,
				}
			};
		}
		return { data: response.data }
	} catch (axiosError: any) {
		const e = axiosError
		return {
			error: {
				status: e.response?.status,
				data: e.response?.data || e.message,
			},
		}
	}
}

export default axiosBaseQuery
