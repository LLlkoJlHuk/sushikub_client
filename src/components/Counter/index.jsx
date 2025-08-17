import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import MinusIcon from '../../assets/images/icon-minus.webp'
import PlusIcon from '../../assets/images/icon-plus.webp'
import styles from './index.module.scss'

const Counter = observer(({ 
  quantity = 0, 
  onIncrease, 
  onDecrease, 
  min = 0,
  max = 99,
  className = '',
  typeDark = false
}) => {
  
  const handleDecrease = useCallback(() => {
    if (quantity > min) {
      onDecrease()
    }
  }, [quantity, min, onDecrease])

  const handleIncrease = useCallback(() => {
    if (quantity < max) {
      onIncrease()
    }
  }, [quantity, max, onIncrease])

  return (
    <div className={`${styles['counter']} ${className} ${typeDark ? styles['dark'] : ''}`}>
      <div className={styles['counter__button']} onClick={handleDecrease}>
        <img src={MinusIcon} alt="minus" />
      </div>
      <span className={styles['counter__count']}>{quantity}</span>
      <div className={styles['counter__button']} onClick={handleIncrease}>
        <img src={PlusIcon} alt="plus" />
      </div>
    </div>
  )
})

export default Counter