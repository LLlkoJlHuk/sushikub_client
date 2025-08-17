import { useContext, useEffect, useRef } from 'react'
import { Context } from '../main'

export const useProducts = (params = {}) => {
	const { products } = useContext(Context)
	const isInitialized = useRef(false)

	useEffect(() => {
		// Загружаем данные только если их нет и еще не инициализировали
		if (products.products.length === 0 && !isInitialized.current && !products.loading) {
			isInitialized.current = true
			products.fetchProducts(params)
		}
	}, []) // Убираем зависимости чтобы избежать бесконечных циклов

	return {
		products: products.products,
		loading: products.loading,
		error: products.error,
		fetchProducts: products.fetchProducts.bind(products)
	}
}

export const useCategories = () => {
	const { products } = useContext(Context)
	const isInitialized = useRef(false)

	useEffect(() => {
		// Загружаем категории только если их нет и еще не инициализировали
		if (products.categories.length === 0 && !isInitialized.current && !products.loading) {
			isInitialized.current = true
			products.fetchCategories()
		}
	}, []) // Убираем зависимости чтобы избежать бесконечных циклов

	return {
		categories: products.categories,
		loading: products.loading,
		error: products.error,
		fetchCategories: products.fetchCategories.bind(products)
	}
}

export const useTypes = () => {
	const { products } = useContext(Context)
	const isInitialized = useRef(false)

	useEffect(() => {
		// Загружаем типы только если их нет и еще не инициализировали
		if (products.types.length === 0 && !isInitialized.current && !products.loading) {
			isInitialized.current = true
			products.fetchTypes()
		}
	}, []) // Убираем зависимости чтобы избежать бесконечных циклов

	return {
		types: products.types,
		loading: products.loading,
		error: products.error,
		fetchTypes: products.fetchTypes.bind(products)
	}
} 