import { makeAutoObservable } from "mobx"
import { bannerApi } from "../http/bannerApi"

export default class BannerStore {
	constructor() {
		this._banners = []
		this._error = null
		makeAutoObservable(this)
	}

	// Геттеры
	get banners() {
		return this._banners
	}

	get error() {
		return this._error
	}

	// Сеттеры
	setBanners(banners) {
		this._banners = banners
	}

	setError(error) {
		this._error = error
	}

	// Actions для работы с API
	async fetchBanners() {
		try {
			this.setError(null)
			const banners = await bannerApi.getBanners()
			this.setBanners(banners)
		} catch (error) {
			console.error('Error fetching banners:', error)
			this.setError(`Ошибка при загрузке баннеров: ${error.message}`)
			// Устанавливаем пустой массив в случае ошибки
			this.setBanners([])
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
}