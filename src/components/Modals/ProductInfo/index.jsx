import { observer } from 'mobx-react-lite'
import React from 'react'
import rollPlugImage from '../../../assets/images/roll-plug.webp'
import { getImageUrl } from '../../../constants'
import { formatPrice } from '../../../hooks/formatPrice'
import { useBasketItem } from '../../../hooks/useBasketItem'
import { useLazyImage } from '../../../hooks/useLazyImage'
import Button from '../../Button'
import Counter from '../../Counter'
import Modal from '../../Modals'
import styles from './index.module.scss'

const ProductInfo = observer(({
	className,
	isOpen,
	onClose,
	product
}) => {
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

	return (
		<Modal className={`${styles['product-info']} ${className}`} isOpen={isOpen} onClose={onClose} type="dark">
			<div className={styles['product-info__content']}>

				{/* Изображение продукта */}
				<div className={styles['product-info__content__img']}>
					<img src={imageSrc} alt={product.name} />
				</div>

				<div className={styles['product-info__content__wrapper']}>
					{/* Название продукта */}
					<h2 className={styles['product-info__content__title']}>{product.name}</h2>

					{/* Описание продукта */}
					<p className={styles['product-info__content__description']}>{product.description}</p>

					{/* Информация о продукте */}
					<div className={styles['product-info__content__info-wrapper']}>

						{/* Вес и цена продукта */}
						<div className={styles['product-info__content__info']}>
							{product.weight && (<span>{product.weight} г /</span>)} {formatPrice(product.price)}&nbsp;₽
						</div>

						{isInBasket && getItemQuantity() > 0 ? (
							<Counter 
								quantity={getItemQuantity()}
								onIncrease={handleIncreaseQuantity}
								onDecrease={handleDecreaseQuantity}
								className={styles['product-info__content__counter']}
							/>
						) : (
							<Button 
								className={styles['product-info__content__button']} 
								onClick={handleAddToBasket}
							>
								Заказать
							</Button>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
})

export default ProductInfo;