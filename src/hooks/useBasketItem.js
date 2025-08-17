import { useContext } from 'react'
import { Context } from '../main'

export const useBasketItem = (product) => {
  const { basket } = useContext(Context)

  const handleAddToBasket = () => {
    basket.addItem(product, 1)
  }

  const handleIncreaseQuantity = () => {
    basket.increaseQuantity(product.id)
  }

  const handleDecreaseQuantity = () => {
    basket.decreaseQuantity(product.id)
  }

  const getItemQuantity = () => {
    return basket.getItemQuantity(product.id)
  }

  const isInBasket = () => {
    return basket.isInBasket(product.id)
  }

  return {
    isInBasket: isInBasket(),
    handleAddToBasket,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    getItemQuantity
  }
} 