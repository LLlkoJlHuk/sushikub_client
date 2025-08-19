import { makeAutoObservable } from "mobx"
import { settingsApi } from "../http/settingsApi"

export default class SettingsStore {
	constructor() {
		this._settings = []
		this._settingsObject = {}
		this._loading = false
		this._error = null
		makeAutoObservable(this)
	}

	// Геттеры
	get settings() {
		return this._settings
	}

	get settingsObject() {
		return this._settingsObject
	}

	get loading() {
		return this._loading
	}

	get error() {
		return this._error
	}

	// Сеттеры
	setSettings(settings) {
		this._settings = settings
	}

	setSettingsObject(settingsObject) {
		this._settingsObject = settingsObject
	}

	setLoading(loading) {
		this._loading = loading
	}

	setError(error) {
		this._error = error
	}

	// Actions для работы с API
	async fetchSettings() {
		try {
			this.setLoading(true)
			this.setError(null)
			const settings = await settingsApi.getSettings()
			this.setSettings(settings)
		} catch (error) {
			console.error('Error fetching settings:', error)
			this.setError(`Ошибка при загрузке настроек: ${error.message}`)
			this.setSettings([])
		} finally {
			this.setLoading(false)
		}
	}

	async fetchSettingsObject() {
		try {
			this.setLoading(true)
			this.setError(null)
			const settingsObject = await settingsApi.getSettingsObject()
			this.setSettingsObject(settingsObject)
		} catch (error) {
			console.error('Error fetching settings object:', error)
			this.setError(`Ошибка при загрузке настроек: ${error.message}`)
			this.setSettingsObject({})
		} finally {
			this.setLoading(false)
		}
	}

	async createSetting(setting) {
		try {
			this.setLoading(true)
			this.setError(null)
			const newSetting = await settingsApi.createSetting(setting)
			// Обновляем список настроек после создания
			await this.fetchSettings()
			await this.fetchSettingsObject()
			return newSetting
		} catch (error) {
			this.setError('Ошибка при создании настройки')
			throw error
		} finally {
			this.setLoading(false)
		}
	}

	async updateSetting(id, setting) {
		try {
			this.setLoading(true)
			this.setError(null)
			const updatedSetting = await settingsApi.updateSetting(id, setting)
			// Обновляем список настроек после изменения
			await this.fetchSettings()
			await this.fetchSettingsObject()
			return updatedSetting
		} catch (error) {
			this.setError('Ошибка при обновлении настройки')
			throw error
		} finally {
			this.setLoading(false)
		}
	}

	async deleteSetting(id) {
		try {
			this.setLoading(true)
			this.setError(null)
			await settingsApi.deleteSetting(id)
			// Обновляем список настроек после удаления
			await this.fetchSettings()
			await this.fetchSettingsObject()
		} catch (error) {
			this.setError('Ошибка при удалении настройки')
			throw error
		} finally {
			this.setLoading(false)
		}
	}

	// Методы для изменения существующих настроек
	updateExistingSetting(id, field, value) {
		const setting = this._settings.find(s => s.id === id)
		if (setting) {
			setting[field] = value
		}
	}

	// Получение значения настройки по ключу
	getSettingValue(key, defaultValue = null) {
		return this._settingsObject[key] !== undefined ? this._settingsObject[key] : defaultValue
	}

	// Инициализация данных при загрузке приложения
	async initializeData() {
		// Проверяем, не загружены ли уже данные
		if (this._settings.length > 0 && Object.keys(this._settingsObject).length > 0) {
			return
		}
		
		try {
			await Promise.all([
				this.fetchSettings(),
				this.fetchSettingsObject()
			])
		} catch (error) {
			console.error('Error initializing settings:', error)
			// Устанавливаем значения по умолчанию при ошибке
			this.setSettings([])
			this.setSettingsObject({})
		}
	}
}
