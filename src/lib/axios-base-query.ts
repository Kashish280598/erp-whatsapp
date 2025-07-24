import axios, { type AxiosRequestConfig } from 'axios'

const axiosBaseQuery = async (config: AxiosRequestConfig) => {
	try {
		const response = await axios(config)
		if (axios.isAxiosError(response)) {
			throw new Error(response?.response?.data?.message)
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
