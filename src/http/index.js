import axios from "axios"
import { API_BASE_URL } from "../constants"

// Безопасное хранение токенов в localStorage
const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  } catch (error) {
    console.error('Error setting token:', error)
  }
}

const removeToken = () => {
  try {
    localStorage.removeItem('token')
  } catch (error) {
    console.error('Error removing token:', error)
  }
}

const $host = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  }
})

const $authHost = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  }
})

// Интерцептор для добавления токена
const authInterceptor = config => {
  const token = getToken()
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  
  // Для FormData не устанавливаем Content-Type, браузер сам установит правильный
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  return config
}

// Интерцептор для обработки ответов
const responseInterceptor = response => {
  return response
}

// Интерцептор для обработки ошибок
const errorInterceptor = error => {
  if (error.response) {
    // Сервер ответил с ошибкой
    switch (error.response.status) {
      case 401:
        // Неавторизован - удаляем токен, но НЕ перенаправляем автоматически
        // Это позволит компонентам самим решать, как обрабатывать ошибку авторизации
        removeToken()
        console.warn('Authentication failed - token removed')
        break
      case 403:
        // Доступ запрещен
        console.error('Access forbidden')
        break
      case 429:
        // Слишком много запросов
        console.error('Too many requests')
        break
      case 500:
        // Внутренняя ошибка сервера
        console.error('Internal server error')
        break
      default:
        console.error('Request failed:', error.response.status, error.response.data)
    }
  } else if (error.request) {
    // Запрос был отправлен, но ответ не получен
    console.error('Network error:', error.request)
  } else {
    // Ошибка при настройке запроса
    console.error('Request setup error:', error.message)
  }
  
  return Promise.reject(error)
}

$authHost.interceptors.request.use(authInterceptor)
$authHost.interceptors.response.use(responseInterceptor, errorInterceptor)
$host.interceptors.response.use(responseInterceptor, errorInterceptor)

// Экспортируем функции для работы с токенами
export const tokenService = {
  getToken,
  setToken,
  removeToken
}

export {
  $authHost,
  $host
}



