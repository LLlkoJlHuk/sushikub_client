import { $authHost, $host } from "."

export const getProducts = async (params = {}) => {
	const { data } = await $host.get('/product', { params })
	return data
}

export const createProduct = async (product) => {
	const { data } = await $authHost.post('/product', product)
	return data
}

export const updateProduct = async (id, product) => {
	const { data } = await $authHost.put(`/product/${id}`, product)
	return data
}

export const deleteProduct = async (id) => {
	const { data } = await $authHost.delete(`/product/${id}`)
	return data
}

export const getProductById = async (id) => {
	const { data } = await $host.get(`/product/${id}`)
	return data
}

// API для категорий
export const getCategories = async () => {
	const { data } = await $host.get('/category')
	return data
}

export const createCategory = async (category) => {
	const { data } = await $authHost.post('/category', category)
	return data
}

export const deleteCategory = async (id) => {
	const { data } = await $authHost.delete(`/category/${id}`)
	return data
}

export const updateCategory = async (id, category) => {
	const { data } = await $authHost.put(`/category/${id}`, category)
	return data
}

// API для типов
export const getTypes = async () => {
	const { data } = await $host.get('/type')
	return data
}

export const createType = async (type) => {
	const { data } = await $authHost.post('/type', type)
	return data
}

export const deleteType = async (id) => {
	const { data } = await $authHost.delete(`/type/${id}`)
	return data
}

export const productApi = {
	getProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductById,
	getCategories,
	createCategory,
	deleteCategory,
	updateCategory,
	getTypes,
	createType,
	deleteType
}
