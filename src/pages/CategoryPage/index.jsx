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
	const [waitingForCategories, setWaitingForCategories] = useState(true)

	const [settingsData, setSettingsData] = useState({
		globalMessage: ''
	})

	// Эффект для мониторинга состояния данных - моментально реагирует на появление категорий
	useEffect(() => {
		const timestamp = new Date().toISOString()
		console.log(`📄 CategoryPage data check at ${timestamp}:`, {
			initialized: products.initialized,
			categoriesLength: products.categories.length,
			categoriesLoading: products.categoriesLoading,
			waitingForCategories
		})

		if (products.initialized || products.categories.length > 0) {
			// Данные есть - моментально показываем
			console.log('✅ CategoryPage: Data available, showing immediately')
			setWaitingForCategories(false)
		}
	}, [products.initialized, products.categories.length, products.categoriesLoading, waitingForCategories])

	// Эффект для запуска загрузки если данных нет
	useEffect(() => {
		if (!products.initialized && products.categories.length === 0 && !products.categoriesLoading && waitingForCategories) {
			// Данных нет и загрузка не идет - запускаем загрузку принудительно
			console.log('🔄 CategoryPage: No data and not loading, forcing fetch')
			const fetchStart = performance.now()
			
			products.fetchCategories().then(() => {
				const fetchEnd = performance.now()
				console.log(`⚡ CategoryPage fetch completed in ${(fetchEnd - fetchStart).toFixed(2)}ms`)
			}).catch(error => {
				console.error('❌ CategoryPage fetch failed:', error)
			})
		}
	}, [products.initialized, products.categories.length, products.categoriesLoading, waitingForCategories, products])

	// Эффект для таймаута как fallback
	useEffect(() => {
		if (waitingForCategories && !products.initialized && products.categories.length === 0) {
			console.log('⏰ CategoryPage: Setting fallback timeout')
			const timeout = setTimeout(() => {
				console.log('⏰ CategoryPage: Fallback timeout reached, stopping wait')
				setWaitingForCategories(false)
			}, 2000) // 2 секунды fallback
			
			return () => clearTimeout(timeout)
		}
	}, [waitingForCategories, products.initialized, products.categories.length])

	useEffect(() => {
		// Настройки уже загружены в App.jsx при старте приложения
		// Получаем значения напрямую из store
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		
		setSettingsData({ 
			globalMessage: globalMessage
		})
	}, [settings.settingsObject, settings]) // Реагируем на изменения в настройках

	const { globalMessage } = settingsData

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');

	// Мемоизируем поиск информации о категории
	const category = useMemo(() => {
		return products.categories.find(cat => cat.id === parseInt(categoryId))
	}, [products.categories, categoryId]);



	// Показываем загрузку если категории загружаются или ждем их инициализации
	if (products.categoriesLoading || waitingForCategories) {
		return <Loading />
	}

	// Если завершили ожидание, но категории не загрузились - показываем ошибку
	if (!waitingForCategories && !products.categoriesLoading && products.categories.length === 0) {
		return (
			<div className={`page ${styles['category-page']}`}>
				<section className={`section section-with-header custom-bg border-bottom`}>
					<Header />
				</section>
				<section className={`section ${styles['section-products']}`}>
					<div className='container'>
						<div className={styles['error-message']}>Не удалось загрузить категории</div>
						<button 
							onClick={() => {
								setWaitingForCategories(true)
								products.fetchCategories()
							}}
							style={{marginTop: '10px', padding: '10px 20px', cursor: 'pointer'}}
						>
							Попробовать снова
						</button>
					</div>
				</section>
			</div>
		)
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

					{/* Категория не найдена - показываем только если категории загружены */}
					{!products.categoriesLoading && products.categories.length > 0 && !category && (
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
							{loading ? (
								<Loading />
							) : categoryProducts.length > 0 ? (
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