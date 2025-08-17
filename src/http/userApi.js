import { jwtDecode } from "jwt-decode"
import { $authHost, $host } from "."

export const login = async (login, password) => {
	try {
		const requestBody = { login, password }
		const { data } = await $host.post('/auth/login', requestBody)
		// Всегда сохраняем токен в localStorage при успешной авторизации
		if (data.jwtToken) {
			localStorage.setItem('token', data.jwtToken)
			return jwtDecode(data.jwtToken)
		} else {
			throw new Error('Token not received from server')
		}
	} catch (error) {
		console.error('Login error:', error)
		throw error
	}
}

export const check = async () => {
	try {
		const { data } = await $authHost.get('/auth/check')
		if (!data.jwtToken) {
			throw new Error('Token not received from server')
		}
		localStorage.setItem('token', data.jwtToken)
		return jwtDecode(data.jwtToken)
	} catch (error) {
		console.error('Check auth error:', error)
		throw error
	}
}