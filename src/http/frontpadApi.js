import { $host } from './index'

// Отправка заказа в Frontpad
export const sendOrderToFrontpad = async (orderData) => {
  try {
    const { data } = await $host.post('frontpad/send-order', orderData)
    return data
  } catch (error) {
    console.error('Ошибка отправки заказа в Frontpad:', error)
    throw error.response?.data || { success: false, message: 'Ошибка сети' }
  }
}



// Получение списка товаров из Frontpad
export const getFrontpadProducts = async () => {
  try {
    const { data } = await $host.get('frontpad/products')
    return data
  } catch (error) {
    console.error('Ошибка получения товаров из Frontpad:', error)
    throw error.response?.data || { success: false, message: 'Ошибка сети' }
  }
}

// Получение стоп-листа из Frontpad
export const getFrontpadStops = async () => {
  try {
    const { data } = await $host.get('frontpad/stops')
    return data
  } catch (error) {
    console.error('Ошибка получения стоп-листа из Frontpad:', error)
    throw error.response?.data || { success: false, message: 'Ошибка сети' }
  }
}

