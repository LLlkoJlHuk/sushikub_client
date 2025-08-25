import { makeAutoObservable } from "mobx"
import { bannerApi } from "../http/bannerApi"

export default class BannerStore {
	constructor() {
		this._banners = []
		this._error = null
		this._loading = false
		this._lastFetchTime = null
		this._cacheExpiry = 10 * 60 * 1000 // 10 минут кэш для баннеров
		makeAutoObservable(this)
	}

	// Геттеры
	get banners() {
		return this._banners
	}

	get error() {
		return this._error
	}

	get loading() {
		return this._loading
	}

	// Проверка актуальности кэша
	get isCacheValid() {
		return this._lastFetchTime && (Date.now() - this._lastFetchTime) < this._cacheExpiry
	}

	// Сеттеры
	setBanners(banners) {
		this._banners = banners
	}

	setError(error) {
		this._error = error
	}

	setLoading(loading) {
		this._loading = loading
	}

	// Actions для работы с API
	async fetchBanners() {
		// Проверяем кэш
		if (this.isCacheValid && this._banners.length > 0) {
			return this._banners
		}

		// Если запрос уже идет, ждем его завершения
		if (this._loading) {
			while (this._loading) {
				await new Promise(resolve => setTimeout(resolve, 50))
			}
			return this._banners
		}
		
		try {
			this.setLoading(true)
			this.setError(null)
			const banners = await bannerApi.getBanners()
			this.setBanners(banners)
			this._lastFetchTime = Date.now()
		} catch (error) {
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError(`Ошибка при загрузке баннеров: ${error.message}`)
			}
			
			this.setBanners([])
		} finally {
			this.setLoading(false)
		}
	}

	async createBanner(banner) {
		try {
			this.setError(null)
			const newBanner = await bannerApi.createBanner(banner)
			// Обновляем список баннеров после создания
			await this.fetchBanners()
			return newBanner
		} catch (error) {
			this.setError('Ошибка при создании баннера')
			throw error
		}
	}

	async updateBanner(id, banner) {
		try {
			this.setError(null)
			const updatedBanner = await bannerApi.updateBanner(id, banner)
			// Обновляем список баннеров после изменения
			await this.fetchBanners()
			return updatedBanner
		} catch (error) {
			this.setError('Ошибка при обновлении баннера')
			throw error
		}
	}

	async deleteBanner(id) {
		try {
			this.setError(null)
			await bannerApi.deleteBanner(id)
			// Обновляем список баннеров после удаления
			await this.fetchBanners()
		} catch (error) {
			this.setError('Ошибка при удалении баннера')
			throw error
		}
	}

	// Инициализация данных при загрузке приложения
	async initializeData() {
		// Проверяем, не загружены ли уже данные
		if (this._banners.length > 0) {
			return
		}
		
		await Promise.all([
			this.fetchBanners(),
		])
	}

	// Принудительное обновление кэша
	async refreshCache() {
		this._lastFetchTime = null
		await this.fetchBanners()
	}
}