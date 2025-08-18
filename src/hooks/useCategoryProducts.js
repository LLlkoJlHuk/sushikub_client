import { useEffect, useState } from 'react'
import { productApi } from '../http/productApi'

export const useCategoryProducts = (categoryId) => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchCategoryProducts = async () => {
			if (!categoryId) {
				setProducts([])
				setLoading(false)
				setError(null)
				return
			}

			try {
				setLoading(true)
				setError(null)
				setProducts([]) // Очищаем предыдущие продукты
				
				const response = await productApi.getProducts({ categoryId: parseInt(categoryId) })
				
				// Фильтруем продукты по inStock === true и сортируем по алфавиту
				const filteredAndSortedProducts = (response || [])
					.filter(product => product.inStock === true)
					.sort((a, b) => a.name.localeCompare(b.name))
				
				setProducts(filteredAndSortedProducts)
			} catch (err) {
				setError('Ошибка при загрузке товаров категории')
				setProducts([]) // Очищаем продукты при ошибке
				console.error('Error fetching category products:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchCategoryProducts()
	}, [categoryId])

	return { products, loading, error }
} 