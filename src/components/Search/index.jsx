import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { SEARCH_RESULTS_ROUTE } from '../../constants'
import useDebounce from '../../hooks/useDebounce'
import { searchProducts } from '../../http/productApi'
import Input from '../Input'
import ProductInfo from '../Modals/ProductInfo'
import styles from './index.module.scss'

const Search = observer(({ isMobile = false, onMobileMenuClose }) => {
	const navigate = useNavigate()
	const [isActiveSearch, setIsActiveSearch] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)

	// Дебаунс поискового запроса (500мс)
	const debouncedSearchValue = useDebounce(searchValue, 300);

	const handleSearchChange = useCallback((e) => {
		setSearchValue(e.target.value);
		if (e.target.value.trim() === '') {
			setSearchResults([]);
			setShowResults(false);
		}
	}, []);

	// Функция для выполнения поиска
	const performSearch = useCallback(async (query) => {
		if (query.trim() === '') {
			setSearchResults([]);
			setShowResults(false);
			return;
		}

		setIsLoading(true);
		try {
			const results = await searchProducts(query);
			setSearchResults(results);
			setShowResults(true);
		} catch (error) {
			console.error('Ошибка поиска:', error);
			setSearchResults([]);
			setShowResults(false);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handleFocus = useCallback(() => {
		setIsActiveSearch(true);
		
		// Если в поле уже есть текст, выполняем поиск сразу
		if (searchValue.trim() !== '') {
			performSearch(searchValue);
		}
	}, [searchValue, performSearch]);

	const handleBlur = useCallback(() => {
		// Небольшая задержка для обработки кликов по результатам
		setTimeout(() => {
			setIsActiveSearch(false);
			setShowResults(false);
		}, 200);
	}, []);

	const handleSearchItemClick = useCallback((product) => {
		setIsModalOpen(true)
		setSelectedProduct(product)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false)
	}, [])

	// Функция для перехода к результатам поиска
	const navigateToSearchResults = useCallback(() => {
		if (searchValue.trim() === '') return

		// Переходим на страницу результатов, передавая query 
		// Результаты передаем только если они есть и соответствуют текущему поисковому запросу
		const hasValidResults = searchResults.length > 0 && debouncedSearchValue === searchValue.trim()
		
		navigate(SEARCH_RESULTS_ROUTE + '?q=' + encodeURIComponent(searchValue), {
			state: hasValidResults ? { 
				products: searchResults,
				query: searchValue
			} : { query: searchValue }
		})

		// Скрываем выпадающий список и сбрасываем фокус
		setShowResults(false)
		setIsActiveSearch(false)

		// Закрываем мобильное меню если мы в мобильной версии
		if (isMobile && onMobileMenuClose) {
			onMobileMenuClose()
		}
	}, [navigate, searchValue, searchResults, debouncedSearchValue, isMobile, onMobileMenuClose])

	// Обработчик Enter
	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Enter') {
			navigateToSearchResults()
		}
	}, [navigateToSearchResults])

	// Обработчик клика на кнопку поиска
	const handleSearchButtonClick = useCallback(() => {
		navigateToSearchResults()
	}, [navigateToSearchResults])

	// Выполняем поиск при изменении дебаунсированного значения
	useEffect(() => {
		performSearch(debouncedSearchValue);
	}, [debouncedSearchValue, performSearch]);

	return (
		<div className={`${styles['search']} ${isActiveSearch ? styles['active'] : ''} ${isMobile ? styles['mobile'] : ''}`}>
			<Input 
				type="text" 
				placeholder='Поиск' 
				className={styles['search-input']} 
				id='search-input' 
				name='search-input' 
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyPress={handleKeyPress}
				value={searchValue}
				onChange={handleSearchChange}
			/>
			<div 
				className={styles['search-button']} 
				onClick={handleSearchButtonClick}
			></div>
			
			{/* Результаты поиска */}
			{showResults && (
				<div className={styles['search-results']}>
					{isLoading ? (
						<div className={styles['search-loading']}>Поиск...</div>
					) : searchResults.length > 0 ? (
						<ul className={styles['search-list']}>
							{searchResults.map((product) => (
								<li 
									key={product.id} 
									className={styles['search-item']}
									onClick={() => handleSearchItemClick(product)}
								>
									<div className={styles['search-item-info']}>
										<span className={styles['search-item-name']}>{product.name}</span>
									</div>
								</li>
							))}
						</ul>
					) : (
						<div className={styles['search-empty']}>Ничего не найдено</div>
					)}
				</div>
			)}

			{isModalOpen && createPortal(
				<ProductInfo 
					className='product-info'
					isOpen={isModalOpen} 
					onClose={handleCloseModal} 
					product={selectedProduct} 
				/>,
				document.body
			)}
		</div>
	)
})

export default Search;