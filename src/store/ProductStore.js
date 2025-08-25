import { makeAutoObservable } from "mobx"
import { productApi } from "../http/productApi"

export default class ProductStore {
	constructor() {
		this._types = []
		this._categories = []
		this._products = []
		this._error = null
		this._categoriesLoading = false
		this._productsLoading = false
		this._typesLoading = false
		this._initialized = false
		this._lastFetchTime = null
		this._cacheExpiry = 5 * 60 * 1000 // 5 минут кэш
		makeAutoObservable(this)
	}

	// Геттеры
	get types() {
		return this._types
	}

	get categories() {
		return this._categories
	}

	get products() {
		return this._products
	}

	get error() {
		return this._error
	}

	get categoriesLoading() {
		return this._categoriesLoading
	}

	get productsLoading() {
		return this._productsLoading
	}

	get typesLoading() {
		return this._typesLoading
	}

	get initialized() {
		return this._initialized
	}

	// Проверка актуальности кэша
	get isCacheValid() {
		return this._lastFetchTime && (Date.now() - this._lastFetchTime) < this._cacheExpiry
	}

	// Сеттеры
	setTypes(types) {
		this._types = types
	}

	setCategories(categories) {
		this._categories = categories
	}

	setProducts(products) {
		this._products = products
	}

	setError(error) {
		this._error = error
	}

	// Actions для работы с API
	async fetchCategories() {
		// Проверяем кэш
		if (this.isCacheValid && this._categories.length > 0) {
			return this._categories
		}

		// Если запрос уже идет, ждем его завершения
		if (this._categoriesLoading) {
			while (this._categoriesLoading) {
				await new Promise(resolve => setTimeout(resolve, 50))
			}
			return this._categories
		}
		
		try {
			this._categoriesLoading = true
			this.setError(null)
			const categories = await productApi.getCategories()
			this.setCategories(categories)
			this._lastFetchTime = Date.now()
		} catch (error) {
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError(`Ошибка при загрузке категорий: ${error.message}`)
			}
			
			// Устанавливаем пустой массив в случае ошибки
			this.setCategories([])
		} finally {
			this._categoriesLoading = false
		}
	}

	async fetchTypes() {
		// Проверяем кэш
		if (this.isCacheValid && this._types.length > 0) {
			return this._types
		}

		// Если запрос уже идет, ждем его завершения
		if (this._typesLoading) {
			while (this._typesLoading) {
				await new Promise(resolve => setTimeout(resolve, 50))
			}
			return this._types
		}
		
		try {
			this._typesLoading = true
			this.setError(null)
			const types = await productApi.getTypes()
			this.setTypes(types)
			this._lastFetchTime = Date.now()
		} catch (error) {
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError(`Ошибка при загрузке типов: ${error.message}`)
			}
			
			// Устанавливаем пустой массив в случае ошибки
			this.setTypes([])
		} finally {
			this._typesLoading = false
		}
	}

	async fetchProducts() {
		// Проверяем кэш
		if (this.isCacheValid && this._products.length > 0) {
			return this._products
		}

		// Если запрос уже идет, ждем его завершения
		if (this._productsLoading) {
			while (this._productsLoading) {
				await new Promise(resolve => setTimeout(resolve, 50))
			}
			return this._products
		}
		
		try {
			this._productsLoading = true
			this.setError(null)
			const products = await productApi.getProducts()
			this.setProducts(products)
			this._lastFetchTime = Date.now()
		} catch (error) {
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError(`Ошибка при загрузке продуктов: ${error.message}`)
			}
			
			// Устанавливаем пустой массив в случае ошибки
			this.setProducts([])
		} finally {
			this._productsLoading = false
		}
	}

	async createProduct(product) {
		try {
			this.setError(null)
			const newProduct = await productApi.createProduct(product)
			
			// Обновляем список товаров синхронно
			await this.fetchProducts()
			
			return newProduct
		} catch (error) {
			console.error('Error creating product:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для создания товара')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при создании товара')
			}
			
			throw error
		}
	}

	async updateProduct(id, product) {
		try {
			this.setError(null)
			const updatedProduct = await productApi.updateProduct(id, product)
			
			// Обновляем список товаров синхронно
			await this.fetchProducts()
			
			return updatedProduct
		} catch (error) {
			console.error('Error updating product:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для обновления товара')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при обновлении товара')
			}
			
			throw error
		}
	}

	async deleteProduct(id) {
		try {
			this.setError(null)
			await productApi.deleteProduct(id)
			
			// Обновляем список товаров синхронно
			await this.fetchProducts()
		} catch (error) {
			console.error('Error deleting product:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для удаления товара')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при удалении товара')
			}
			
			throw error
		}
	}

	async createCategory(category) {
		try {
			this.setError(null)
			const newCategory = await productApi.createCategory(category)
			
			// Обновляем список категорий синхронно
			await this.fetchCategories()
			
			return newCategory
		} catch (error) {
			console.error('Error creating category:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для создания категории')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при создании категории')
			}
			
			throw error
		}
	}

	async updateCategory(id, category) {
		try {
			this.setError(null)
			const updatedCategory = await productApi.updateCategory(id, category)
			
			// Обновляем список категорий синхронно
			await this.fetchCategories()
			
			return updatedCategory
		} catch (error) {
			console.error('Error updating category:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для обновления категории')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при обновлении категории')
			}
			
			throw error
		}
	}

	async deleteCategory(id) {
		try {
			this.setError(null)
			await productApi.deleteCategory(id)
			
			// Обновляем список категорий синхронно
			await this.fetchCategories()
		} catch (error) {
			console.error('Error deleting category:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для удаления категории')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при удалении категории')
			}
			
			throw error
		}
	}

	async createType(type) {
		try {
			this.setError(null)
			const newType = await productApi.createType(type)
			
			// Обновляем список типов синхронно
			await this.fetchTypes()
			
			return newType
		} catch (error) {
			console.error('Error creating type:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.status === 403) {
				this.setError('Недостаточно прав для создания типа')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError('Ошибка при создании типа')
			}
			
			throw error
		}
	}

	// Инициализация данных при загрузке приложения
	async initializeData() {
		// Проверяем, не инициализированы ли уже данные
		if (this._initialized) {
			return
		}
		
		try {
			// Загружаем только критические данные для первого рендера
			await this.fetchCategories()
			
			// Устанавливаем флаг инициализации после загрузки категорий
			this._initialized = true
			
			// Остальные данные загружаем в фоне
			this.fetchTypes().catch(console.error)
			this.fetchProducts().catch(console.error)
		} catch {
			// Не устанавливаем initialized = true при ошибке
		}
	}

	// Принудительное обновление кэша
	async refreshCache() {
		this._lastFetchTime = null
		await this.initializeData()
	}
}