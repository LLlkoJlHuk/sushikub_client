import { makeAutoObservable } from "mobx"
import { productApi } from "../http/productApi"

export default class ProductStore {
	constructor() {
		this._types = []
		this._categories = []
		this._products = []
		this._error = null
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
		try {
			this.setError(null)
			const categories = await productApi.getCategories()
			this.setCategories(categories)
		} catch (error) {
			console.error('Error fetching categories:', error)
			
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
		}
	}

	async fetchTypes() {
		try {
			this.setError(null)
			const types = await productApi.getTypes()
			this.setTypes(types)
		} catch (error) {
			console.error('Error fetching types:', error)
			
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
		}
	}

	async fetchProducts(params = {}) {
		try {
			this.setError(null)
			const response = await productApi.getProducts(params)
			this.setProducts(response || [])
		} catch (error) {
			console.error('Error fetching products:', error)
			
			// Специальная обработка ошибок авторизации
			if (error.response?.status === 401) {
				this.setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
			} else if (error.response?.data?.message) {
				this.setError(error.response.data.message)
			} else {
				this.setError(`Ошибка при загрузке товаров: ${error.message}`)
			}
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
		// Проверяем, не загружены ли уже данные
		if (this._categories.length > 0 && this._types.length > 0 && this._products.length > 0) {
			return
		}
		
		await Promise.all([
			this.fetchCategories(),
			this.fetchTypes(),
			this.fetchProducts()
		])
	}
}