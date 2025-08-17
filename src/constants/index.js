// API и базовые URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Маршруты приложения
export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const MAIN_ROUTE = '/'
export const CATEGORY_ROUTE = '/category'
export const CART_ROUTE = '/cart'
export const ORDER_ROUTE = '/order'
export const SALES_ROUTE = '/sales'
export const DELIVERY_ROUTE = '/delivery'
export const POLICY_ROUTE = '/policy'

// Массив филиалов для выпадающего списка
export const BRANCHES = [
  {
    value: 'Ул. Батурина, дом 30',
    label: 'Ул. Батурина, дом 30'
  },
  {
    value: 'Ул. Лесопарковая, дом 27', 
    label: 'Ул. Лесопарковая, дом 27'
  }
]

// Функция для получения полного URL изображения
export const getImageUrl = (imagePath) => {
	if (!imagePath) return null
	return `${API_BASE_URL}/${imagePath}`
}

// Все в комментах ниже настраивается через админку

// // Контактная информация
// export const PHONE_NUMBER_CODE = '8391'  // Код города
// export const PHONE_NUMBER = '2949454' // Номер телефона
// export const PHONE_NUMBER_FORMATTED = '2-94-94-54' // Форматированный номер телефона

// // Время работы ресторана
// export const WORKING_TIME_START = '10:00'
// export const WORKING_TIME_END = '23:00'

// // Настройки интерфейса
// export const BANNER_CAROUSEL_INTERVAL = 4 // Интервал смены баннеров в секундах

// export const GLOBAL_MESSAGE = '' // Уведомление для всего сайта

// // Ограничения заказов
// export const MAX_QUANTITY_FOR_ONE_PRODUCT = 99 // Максимальное количество одного товара в заказе
// export const MAX_QUANTITY_PERSONS = 20 // Максимальное количество персон в заказе

// // Условия доставки
// export const MIN_ORDER_PRICE_FOR_DELIVERY = 500 // Минимальная сумма заказа для доставки (в рублях)
// export const MAX_ORDER_PRICE = 100000 // Максимальная сумма заказа (в рублях)
// export const DELIVERY_DISCOUNT = 15 // Скидка на доставку в процентах

// // Константы для DeliveryTimePicker
// export const MIN_DELIVERY_DELAY_MINUTES = 90 // Минимальное время доставки в минутах (время на приготовление и доставку)
// export const MAX_DELIVERY_DAYS = 10 // Максимальное количество дней для заказа (на сколько дней вперед можно заказать)

// // Максимальная длина комментария
// export const MAX_COMMENT_LENGTH = 100
