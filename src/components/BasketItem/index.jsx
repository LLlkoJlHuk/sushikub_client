import { observer } from 'mobx-react-lite'
import React from 'react'
import DeleteIcon from '../../assets/images/icon-close.webp'
import rollPlugImage from '../../assets/images/roll-plug.webp'
import { formatPrice } from '../../hooks/formatPrice'
import { useBasketItem } from '../../hooks/useBasketItem'
import { useLazyImage } from '../../hooks/useLazyImage'
import Counter from '../Counter'
import styles from './index.module.scss'

const BasketItem = observer(({ 
  item, 
  maxQuantityForOneProduct, 
  onRemove, 
  onClick,
  className = ''
}) => {
  const {
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    getItemQuantity
  } = useBasketItem(item)

  // Lazy loading для изображений с адаптивными размерами
  const { imageSrc } = useLazyImage(
    item.img,
    rollPlugImage,
    { 
      enableCache: true,
      imageType: 'BASKET_ITEM'
    }
  )

  return (
    <div className={`${styles['basket-item']} ${className}`}>
      {/* Информация о товаре */}
      <div 
        className={styles['basket-item__wrapper']} 
        onClick={onClick}
      >
        {/* Картинка */}
        <div className={styles['basket-item__image']}>
          <img src={imageSrc} alt={item.name} title={item.name} />
        </div>

        {/* Название */}
        <div className={styles['basket-item__name']}>
          {item.name}
        </div>
      </div>

      {/* Информация о товаре */}
      <div className={styles['basket-item__wrapper']}>
        {/* Счетчик количества */}
        <div className={styles['basket-item__counter']}>
          <Counter 
            quantity={getItemQuantity(item.id)} 
            onIncrease={handleIncreaseQuantity} 
            onDecrease={handleDecreaseQuantity} 
            max={maxQuantityForOneProduct} 
          />
        </div>

        {/* Стоимость товара */}
        <div className={styles['basket-item__price']}>
          {formatPrice(item.price * getItemQuantity(item.id))}&nbsp;₽
        </div>

        {/* Удалить товар */}
        <div className={styles['basket-item__remove']} onClick={onRemove}>
          <img src={DeleteIcon} alt="Удалить" />
        </div>
      </div>
    </div>
  )
})

export default BasketItem
