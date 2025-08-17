import { $authHost, $host } from "."

export const getSettings = async () => {
	const { data } = await $host.get('/settings')
	return data
}

export const getSettingsObject = async () => {
	const { data } = await $host.get('/settings/object')
	return data
}

export const getSettingByKey = async (key) => {
	const { data } = await $host.get(`/settings/key/${key}`)
	return data
}

export const createSetting = async (setting) => {
	const { data } = await $authHost.post('/settings', setting)
	return data
}

export const updateSetting = async (id, setting) => {
	const { data } = await $authHost.put(`/settings/${id}`, setting)
	return data
}

export const deleteSetting = async (id) => {
	const { data } = await $authHost.delete(`/settings/${id}`)
	return data
}

export const settingsApi = {
	getSettings,
	getSettingsObject,
	getSettingByKey,
	createSetting,
	updateSetting,
	deleteSetting
}
