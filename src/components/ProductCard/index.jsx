import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import rollPlugImage from '../../assets/images/roll-plug.webp'
import { getImageUrl } from '../../constants'
import { formatPrice } from '../../hooks/formatPrice'
import { useBasketItem } from '../../hooks/useBasketItem'
import { useLazyImage } from '../../hooks/useLazyImage'
import Button from '../Button'
import Counter from '../Counter'
import ProductInfo from '../Modals/ProductInfo'
import styles from './index.module.scss'

const ProductCard = observer(({
	product
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const {
		isInBasket,
		handleAddToBasket,
		handleIncreaseQuantity,
		handleDecreaseQuantity,
		getItemQuantity
	} = useBasketItem(product)

	// Lazy loading для изображений
	const { imageSrc } = useLazyImage(
		getImageUrl(product.img),
		rollPlugImage
	)

	const handleCardClick = useCallback(() => {
		setIsModalOpen(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	const handleAddToBasketClick = useCallback((e) => {
		e.stopPropagation()
		handleAddToBasket()
	}, [handleAddToBasket])

	const handleCounterClick = useCallback((e) => {
		e.stopPropagation()
	}, [])

	return (
		<div className={styles['product-card']} onClick={handleCardClick}>
			{/* Картинка продукта */}
			<div className={styles['product-card__img']}>
				<img 
					src={imageSrc} 
					alt={product.name}
				/>
			</div>

			<div className={styles['product-card__content']}>
				{/* Заголовок продукта */}
				<h3 className={styles['product-card__title']}>
					{product.name}
				</h3>

				{/* Описание продукта */}
				<div className={styles['product-card__description']}>
					{product.description}
				</div>

				{/* Доп. информация о продукте */}
				<div className={styles['product-card__info-wrapper']}>
					<div className={styles['product-card__info']}>

						{/* Вес продукта */}
						<div className={styles['product-card__info__weight']}>
							{product.weight && (<span>{product.weight} г /&nbsp;</span>)}
						</div>

						{/* Цена продукта */}
						<div className={styles['product-card__info__price']}>
							{formatPrice(product.price)}&nbsp;₽
						</div>
					</div>

					{/* Кнопка заказа */}
					{isInBasket && getItemQuantity() > 0 ? (
						<div onClick={handleCounterClick}>
							<Counter 
								className={styles['product-card__counter']}
								quantity={getItemQuantity()}
								onIncrease={handleIncreaseQuantity}
								onDecrease={handleDecreaseQuantity}
							/>
						</div>
					) : (
						<Button 
							className={styles['product-card__button']} 
							onClick={handleAddToBasketClick}
						>
							Заказать
						</Button>
					)}
				</div>
			</div>

			{isModalOpen && createPortal(
				<ProductInfo 
					className='product-info'
					isOpen={isModalOpen} 
					onClose={handleCloseModal} 
					product={product} 
				/>,
				document.body
			)}
		</div>
	)
})

export default ProductCard
