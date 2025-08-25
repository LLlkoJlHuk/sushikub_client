import { StrictMode, createContext } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './assets/css/index.scss'
import BannerStore from './store/BannerStore'
import BasketStore from './store/BasketStore'
import ProductStore from './store/ProductStore'
import SettingsStore from './store/SettingsStore'
import UserStore from './store/UserStore'

export const Context = createContext(null)
const users = new UserStore()  
const products = new ProductStore()
const banners = new BannerStore()
const basket = new BasketStore()
const settings = new SettingsStore()

// Инициализируем настройки сразу при создании store
settings.initializeData()

// Регистрируем Service Worker для кэширования
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration);
      })
      .catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Context.Provider value={{ users, products, banners, basket, settings }}>
        <App />
      </Context.Provider>
    </BrowserRouter>
  </StrictMode>,
)
