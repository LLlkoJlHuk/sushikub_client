import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import ProductCard from '../../components/ProductCard'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { searchProducts } from '../../http/productApi'
import { Context } from '../../main'
import styles from './index.module.scss'


const SearchResults = observer(() => {
	const { settings } = useContext(Context)
	const location = useLocation()
	const [searchParams] = useSearchParams()
	const [products, setProducts] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	const [settingsData, setSettingsData] = useState({
		globalMessage: ''
	})

	useEffect(() => {
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		
		setSettingsData({ 
			globalMessage: globalMessage
		})
	}, [settings.settingsObject, settings])

	const { globalMessage } = settingsData

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');

	// Получаем результаты поиска из state или выполняем новый поиск
	useEffect(() => {
		const query = searchParams.get('q') || ''
		setSearchQuery(query)

		// Если есть переданные продукты через location.state, используем их
		if (location.state?.products && location.state.products.length > 0) {
			setProducts(location.state.products)
		} else if (query.trim()) {
			// Иначе выполняем поиск по query параметру
			const performSearch = async () => {
				setIsLoading(true)
				try {
					const results = await searchProducts(query)
					setProducts(results)
				} catch (error) {
					console.error('Ошибка поиска:', error)
					setProducts([])
				} finally {
					setIsLoading(false)
				}
			}
			performSearch()
		} else {
			// Если нет query, очищаем продукты
			setProducts([])
		}
	}, [location.state, searchParams])

	return (
		<div className={`page ${styles['search-results']}`}>

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

					<h1 className='section__title'>
						Результаты поиска {searchQuery && `"${searchQuery}"`}
					</h1>
					
					{isLoading && (
						<Loading />
					)}

					{products.length > 0 ? (
						<div className={styles['products']}>
							{products.map((product) => (
								<ProductCard 
									key={product.id} 
									product={product} 
								/>
							))}
						</div>
					) : (
						<div className={styles['empty-state']}>
							<p>Ничего не найдено</p>
						</div>
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
})

export default SearchResults 	