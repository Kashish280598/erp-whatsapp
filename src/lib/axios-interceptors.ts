import type { AxiosInstance } from "axios"
import { toast } from "sonner"
import { store } from "./store"

function setupAxios(axios: AxiosInstance) {
	const jwtToken = localStorage.getItem('auth_token') || null

	const { auth } = store.getState()

	console.log('auth', auth?.token)


	axios.interceptors.request.use(
		(config) => {
			if (jwtToken) {
				config.headers.Authorization = `Bearer ${auth?.token}`
			}

			config.headers['Content-Type'] = 'application/json'
			config.headers.Accept = 'application/json'

			return config
		},
		(err) => Promise.reject(err),
	)

	axios.interceptors.response.use(
		(response) => response,
		(error) => {


			const statusCode = error?.response?.status

			if ([404, 400].includes(statusCode)) {
				const message =
					error?.response?.data?.message.toString() || error?.response?.statusText
				toast.error(message)
			}

			if (statusCode === 403) {
				toast.error('You do not have permission to access this resource.')
			}

			if (statusCode >= 500) {
				toast.error('The server is currently unavailable. Please try again later.')
			}

			return Promise.reject(error)
		},
	)
}

export default setupAxios
