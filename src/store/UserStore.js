import { jwtDecode } from "jwt-decode"
import { makeAutoObservable } from "mobx"
import { check, login } from "../http/userApi"

export default class UserStore {
	constructor() {
		// Инициализируем состояние из localStorage
		const token = localStorage.getItem('token')
		if (token) {
			try {
				const decoded = jwtDecode(token)
				// Проверяем, не истек ли токен
				const currentTime = Date.now() / 1000
				if (decoded.exp && decoded.exp < currentTime) {
					// Токен истек
					localStorage.removeItem('token')
					this._isAuth = false
					this._user = {}
				} else {
					this._user = decoded
					this._isAuth = true
				}
			} catch { // eslint-disable-line no-unused-vars
				// Если токен невалидный, удаляем его
				localStorage.removeItem('token')
				this._isAuth = false
				this._user = {}
			}
		} else {
			this._isAuth = false
			this._user = {}
		}
		this._isLoading = false
		this._error = null
		makeAutoObservable(this)
	}

	setIsAuth(bool) {
		this._isAuth = bool
	}

	setUser(user) {
		this._user = user
	}

	setIsLoading(bool) {
		this._isLoading = bool
	}

	setError(error) {
		this._error = error
	}

	async login(loginValue, password, rememberMe = false) {
		try {
			this.setIsLoading(true)
			this.setError(null)
			
			const response = await login(loginValue, password)
			// API уже возвращает декодированный токен, не нужно декодировать снова
			this.setUser(response)
			this.setIsAuth(true)
			
			// Если "Запомнить меня" не отмечен, удаляем токен из localStorage
			if (!rememberMe) {
				localStorage.removeItem('token')
			}
			// Если отмечен, токен уже сохранен в API
			
			return response
		} catch (error) {
			console.error('Login error:', error)
			const errorMessage = error.response?.data?.message || error.message || 'Ошибка при авторизации'
			this.setError(errorMessage)
			throw error
		} finally {
			this.setIsLoading(false)
		}
	}

	async checkAuth() {
		// Если уже авторизованы и не загружаемся, не делаем повторный запрос
		if (this._isAuth && !this._isLoading) {
			return
		}

		// Устанавливаем загрузку только если нужно проверить токен
		const token = localStorage.getItem('token')
		if (token) {
			// Проверяем, не истек ли токен локально перед запросом
			let decoded
			try {
				decoded = jwtDecode(token)
				const currentTime = Date.now() / 1000
				if (decoded.exp && decoded.exp < currentTime) {
					// Токен истек локально, очищаем состояние
					localStorage.removeItem('token')
					this.setIsAuth(false)
					this.setUser({})
					return
				}
			} catch {
				// Токен невалидный, очищаем состояние
				localStorage.removeItem('token')
				this.setIsAuth(false)
				this.setUser({})
				return
			}

			// Токен валидный локально, устанавливаем состояние без запроса к серверу
			// Это предотвращает лишние Loading состояния
			this.setUser(decoded)
			this.setIsAuth(true)
			
			// Проверяем на сервере в фоне без установки Loading
			try {
				const data = await check()
				this.setUser(data)
				this.setIsAuth(true)
			} catch (error) {
				console.error('Check auth error:', error)
				// При ошибке очищаем токен и состояние
				localStorage.removeItem('token')
				this.setIsAuth(false)
				this.setUser({})
			}
		} else {
			// Если токена нет, просто устанавливаем состояние
			this.setIsAuth(false)
			this.setUser({})
		}
	}

	logout() {
		localStorage.removeItem('token')
		this.setIsAuth(false)
		this.setUser({})
		this.setError(null)
	}
	
	get isAuth() {
		return this._isAuth
	}

	get user() {
		return this._user
	}

	get isLoading() {
		return this._isLoading
	}

	get error() {
		return this._error
	}
}