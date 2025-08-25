import { $authHost, $host } from "."

export const getBanners = async (params = {}) => {
	try {
		const response = await $host.get('/banner', { params })
		const { data } = response
		return data
	} catch (error) {
		console.error('bannerApi: getBanners error:', error)
		throw error
	}
}

export const createBanner = async (banner) => {
	const { data } = await $authHost.post('/banner', banner)
	return data
}

export const updateBanner = async (id, banner) => {
	const { data } = await $authHost.put(`/banner/${id}`, banner)
	return data
}

export const deleteBanner = async (id) => {
	const { data } = await $authHost.delete(`/banner/${id}`)
	return data
}

export const bannerApi = {
	getBanners,
	createBanner,
	updateBanner,
	deleteBanner
}
