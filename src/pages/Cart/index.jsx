import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import emptyCartImage from '../../assets/images/empty_order.webp'
import BasketItem from '../../components/BasketItem'
import Button from '../../components/Button'
import Counter from '../../components/Counter'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ProductInfo from '../../components/Modals/ProductInfo'
import Notice from '../../components/Notice'
import { MAIN_ROUTE, ORDER_ROUTE } from '../../constants'
import { formatPrice } from '../../hooks/formatPrice'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'

const Cart = observer(() => {
	const { basket, products, settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		globalMessage: '',
		maxQuantityForOneProduct: null,
		maxQuantityPersons: null,
	})

	useEffect(() => {
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		const maxQuantityForOneProduct = settings.getSettingValue('MAX_QUANTITY_FOR_ONE_PRODUCT', '')
		const maxQuantityPersons = settings.getSettingValue('MAX_QUANTITY_PERSONS', '')

		setSettingsData({ 
			globalMessage: globalMessage,
			maxQuantityForOneProduct: maxQuantityForOneProduct,
			maxQuantityPersons: maxQuantityPersons
		})
	}, [settings.settingsObject]) 

	const { globalMessage, maxQuantityPersons, maxQuantityForOneProduct } = settingsData

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');
  
  	// Состояние видимости модального окна
	const [selectedProduct, setSelectedProduct] = useState(null)

	const handleRestore = () => {
		basket.restoreLastRemovedItem();
	};

	return (
		<div className={`page ${styles['basket-page']}`}>

			{/* Секция с хедером */}
			<section className={`section section-with-header custom-bg border-bottom ${isScrolled ? 'header-visible' : ''}`}>
        
				{/* Header */}
				<Header isScrolled={isScrolled} isTimedOut={isTimedOut} isScrolledBack={isScrolledBack} isTimedOutBack={isTimedOutBack} />
			</section>

			{/* Уведомления */}
			{globalMessage && (
			<section className={`section ${styles['section-notice']}`}>
				<div className={`${styles['container']} container`}>
					{/* Уведомление о возможности расчета наличными, онлайн на сайте и бонусами */}
					<Notice type='info'>
						{globalMessage}
					</Notice>
					</div>
				</section>
			)}

			{basket.items.length > 0 ? (
				<section className={`section ${styles['section-basket']}`}>

					{/* Корзина не пуста */}
					<div className={`${styles['container']} container`}>
						{/* Заголовок страницы */}
						<div className='section__title'>
							Корзина
						</div>

						{/* Список товаров в корзине */}
						<div className={styles['basket-list']}>

							{/* Список товаров в корзине */}
							{basket.items.slice().sort((a, b) => a.name.localeCompare(b.name)).map(item => (
								<BasketItem
									key={item.id}
									item={item}
									maxQuantityForOneProduct={maxQuantityForOneProduct}
									onRemove={() => basket.removeItem(item.id)}
									onClick={() => setSelectedProduct(products.products.find(p => p.id === item.id))}
								/>
							))}
						</div>

						{/* Количество персон */}
						<div className={styles['persons']}>
							<div className={styles['basket-item']}>
								<div className={styles['basket-item__name']}>
									Количество персон <br />
									<span>
										Соевый соус, имбирь и васаби прилагаются
									</span>
								</div>

								{/* Счетчик количества */}
								<div className={styles['basket-item__counter']}>
									<Counter quantity={basket.getPersons()} onIncrease={basket.increasePersons} onDecrease={basket.decreasePersons} typeDark={true} max={maxQuantityPersons} />
								</div>
							</div>
						</div>

						{/* Восстановление удаленного товара */}
						{basket.lastRemovedItem && (
							<div className={styles['restore-container']}>
								Нечаянно удалили "{basket.lastRemovedItem.name}"? &nbsp;

								<span onClick={handleRestore}>
									Восстановить
								</span>
							</div>
						)}

						{/* Итоговая стоимость заказа */}
						<div className={styles['basket-total']}>
							Сумма вашего заказа: {formatPrice(basket.totalPrice)}&nbsp;₽ <br />
							<span>Минимальная сумма заказа зависит от адреса доставки.</span>
						</div>

						{/* Кнопки */}
						<div className={styles['basket-buttons']}>
							{/* Кнопка вернуться в меню */}
							<Button type='btnLink' href={MAIN_ROUTE} className={styles['basket-return']}>
								Вернуться в меню
							</Button>

							{/* Кнопка оформления заказа */}
							<Button type='btnLink' href={ORDER_ROUTE} className={styles['basket-order']}>
								Оформить заказ
							</Button>
						</div>
					</div>
				</section>
			) : (
				<section className={`section`}>

					{/* Корзина пуста */}
					<div className='container'>
						
						<div className={styles['empty-image']}>
							<img src={emptyCartImage} alt="Корзина пуста" />
						</div>

						<div className={`${styles['basket-buttons']} ${styles['basket-empty']}`}>
							{/* Кнопка вернуться в меню */}
							<Button type='btnLink' href={MAIN_ROUTE} className={styles['basket-return']}>
								Вернуться в меню
							</Button>
						</div>
					</div>
				</section>
			)}

			{/* Модальное окно с информацией о товаре */}	
			{selectedProduct && createPortal(
				<ProductInfo 
					className='product-info'
					isOpen={!!selectedProduct} 
					onClose={() => setSelectedProduct(null)} 
					product={selectedProduct} 
				/>,
				document.body
			)}

			<section className={`section custom-bg border-top`}>

				{/* Контейнер - ограничение ширины */}
				<div className='container'>
					{/* Footer */}
					<Footer />
				</div>
			</section>
		</div>
	)
})

export default Cart;