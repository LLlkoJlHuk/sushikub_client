import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import Notice from '../../components/Notice'
import ProductCard from '../../components/ProductCard'
import { useCategoryProducts } from '../../hooks/useCategoryProducts'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'

const CategoryPage = () => {
	const { products, settings } = useContext(Context)
	const { categoryId } = useParams()
	const { products: categoryProducts, loading, error } = useCategoryProducts(categoryId)

	const [settingsData, setSettingsData] = useState({
		globalMessage: ''
	})

	useEffect(() => {
		// Настройки уже загружены в App.jsx при старте приложения
		// Получаем значения напрямую из store
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		
		setSettingsData({ 
			globalMessage: globalMessage
		})
	}, [settings.settingsObject]) // Реагируем на изменения в настройках

	const { globalMessage } = settingsData

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');

	// Мемоизируем поиск информации о категории
	const category = useMemo(() => {
		return products.categories.find(cat => cat.id === parseInt(categoryId))
	}, [products.categories, categoryId]);



	if (loading || products.categoriesLoading) {
		return <Loading />
	}

	return (
		<div className={`page ${styles['category-page']}`}>

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

			{/* Секция с продуктами */}
			<section className={`section ${styles['section-products']}`}>
				<div className='container'>


					{/* Ошибка запроса */}
					{error && (
						<div className={styles['error-message']}>{error}</div>
					)}

					{/* Категория не найдена */}
					{!products.categoriesLoading && !category && (
						<div className={styles['category-page']}>

							{/* Секция с ошибкой (категория не найдена) */}
							<section className={styles['section']}>
								<div className="container">
									<div className={styles['error-message']}>Категория не найдена</div>
								</div>
							</section>
						</div>
					)}

					{/* Категория найдена */}
					{!products.categoriesLoading && category && (
						<>
							{/* Заголовок категории */}
							<div className='section__title'>
								{category.name}
							</div>

							{/* Список продуктов */}
							{categoryProducts.length > 0 ? (
								<div className={styles['products']}>
									{categoryProducts.map(product => (
										<ProductCard 
											key={product.id} 
											product={product}
										/>
									))}
								</div>
							) : (
								<div className={styles['empty-state']}>
									<p>В данной категории пока нет товаров</p>
								</div>
							)}
						</>
					)}
				</div>
			</section>

			<section className={`section custom-bg border-top`}>

				{/* Контейнер - ограничение ширины */}
				<div className='container'>
					{/* Footer */}
					<Footer />
				</div>
			</section>
		</div>
	)
}

export default CategoryPage 