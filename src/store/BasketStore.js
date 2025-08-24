import { makeAutoObservable } from 'mobx'

class BasketStore {
  items = [] // массив товаров в корзине
  persons = 1 // количество персон
  lastRemovedItem = null
  loading = false
  error = null

  constructor() {
    makeAutoObservable(this)
    this.loadFromLocalStorage()
    // Дополнительная защита для persons
    if (typeof this.persons !== 'number') {
      this.persons = 1
    }
  }

  // Загрузить корзину из localStorage
  loadFromLocalStorage() {
    try {
      const savedBasket = localStorage.getItem('basket')
      if (savedBasket) {
        const basketData = JSON.parse(savedBasket)
        
        // Проверяем, является ли basketData массивом (старый формат)
        if (Array.isArray(basketData)) {
          // Миграция со старого формата
          this.items = basketData
          this.persons = 1
        } else {
          // Новый формат
          this.items = basketData.items || []
          this.persons = basketData.persons || 1
        }
      }
	  this.lastRemovedItem = null
    } catch (error) {
      console.error('Ошибка при загрузке корзины из localStorage:', error)
      this.items = []
      this.persons = 1
    }
    
    // Защита для persons после загрузки
    if (typeof this.persons !== 'number') {
      this.persons = 1
    }
  }

  // Сохранить корзину в localStorage
  saveToLocalStorage() {
    try {
      const basketData = {
        items: this.items,
        persons: this.persons
      }
      localStorage.setItem('basket', JSON.stringify(basketData))
    } catch (error) {
      console.error('Ошибка при сохранении корзины в localStorage:', error)
    }
  }

  // Добавить товар в корзину
  addItem(product, quantity = 1) {
	if (this.lastRemovedItem && this.lastRemovedItem.id === product.id) {
		this.lastRemovedItem = null;
	}

    const existingItem = this.items.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.items.push({
        ...product,
        quantity: quantity
      })
    }
    this.saveToLocalStorage()
  }

  // Удалить товар из корзины
  removeItem(productId) {
	const itemToRemove = this.items.find(item => item.id === productId);
    if (itemToRemove) {
        this.lastRemovedItem = { ...itemToRemove };
    }
    this.items = this.items.filter(item => item.id !== productId)
    
    // Если корзина опустела, сбрасываем количество персон
    if (this.items.length === 0) {
      this.persons = 1
    }
    
    this.saveToLocalStorage()
  }

  restoreLastRemovedItem() {
	if (!this.lastRemovedItem) return;

	this.addItem(this.lastRemovedItem, this.lastRemovedItem.quantity);
	this.lastRemovedItem = null;
  }

  // Изменить количество товара
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
        this.saveToLocalStorage()
      }
    }
  }

  // Увеличить количество товара
  increaseQuantity(productId) {
    const item = this.items.find(item => item.id === productId)
    if (item) {
      item.quantity += 1
      this.saveToLocalStorage()
    }
  }

  // Уменьшить количество товара
  decreaseQuantity(productId) {
    const item = this.items.find(item => item.id === productId)
    if (item) {
      if (item.quantity <= 1) {
        this.removeItem(productId)
      } else {
        item.quantity -= 1
        this.saveToLocalStorage()
      }
    }
  }

  // Получить количество конкретного товара
  getItemQuantity(productId) {
    const item = this.items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  // Получить общее количество товаров в корзине
  get totalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  // Получить общую стоимость корзины
  get totalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Очистить корзину
  clearBasket() {
    this.items = []
    this.persons = 1
    this.saveToLocalStorage()
  }

  // Проверить, есть ли товар в корзине
  isInBasket(productId) {
    return this.items.some(item => item.id === productId)
  }

  // Установить количество персон
  setPersons = (persons) => {
    this.persons = persons || 1
    this.saveToLocalStorage()
  }

  // Получить количество персон
  getPersons = () => {
    return this.persons || 1
  }

  // Увеличить количество персон
  increasePersons = () => {
    this.persons += 1
    this.saveToLocalStorage()
  }

  // Уменьшить количество персон
  decreasePersons = () => {
    if (this.persons > 1) {
      this.persons -= 1
      this.saveToLocalStorage()
    }
  }
}

export default BasketStore
