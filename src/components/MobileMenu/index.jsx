import { useCallback, useState } from 'react'
import logoGif from '../../assets/images/logo.mp4'
import { CATEGORY_ROUTE, DELIVERY_ROUTE, MAIN_ROUTE, POLICY_ROUTE, SALES_ROUTE } from '../../constants'
import Button from '../Button'
import Input from '../Input'
import styles from './index.module.scss'

function MobileMenu({ sortedCategories, loading, phoneHref, workingTimeText, phoneNumberFormatted, ref }) {
	const [isActiveSearch, setIsActiveSearch] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const handleSearch = useCallback(() => {
		setIsActiveSearch(!isActiveSearch);
	}, [isActiveSearch]);

	const handleSearchChange = useCallback((e) => {
		setSearchValue(e.target.value);
	}, []);	

    return (
        <div className={styles['mobile-menu']} ref={ref}>

			<div className={styles['mobile-menu__wrapper']}>
				{/* Логотип */}
				<div className={styles['mobile-menu__logo']}>
					<Button type='link' href={MAIN_ROUTE} className={styles['logo']}>
						<div className={styles['logo-gif']}>
							<video src={logoGif} autoPlay loop muted playsInline className={styles['logo-img']} />
						</div>
						<h1 className={styles['logo-text']}>Куб</h1>
					</Button>
				</div>

				{/* Поиск */}
				<div className={`${styles['mobile-menu__search']} ${isActiveSearch ? styles['active'] : ''}`}>
					<Input 
						type="text" 
						placeholder='Поиск' 
						className={styles['search-input']} 
						id='search-input' 
						name='search-input' 
						onFocus={handleSearch}
						onBlur={handleSearch}
						value={searchValue}
						onChange={handleSearchChange}
					/>
					<div className={styles['search-button']}></div>
				</div>

				<div className={styles['mobile-menu__categories']}>
					{loading ? (
						<div>Загрузка категорий...</div>
					) : sortedCategories && sortedCategories.length > 0 ? (
						sortedCategories.map((category) => (
							<Button 
								key={category.id} 
								type='link' 
								href={`${CATEGORY_ROUTE}/${category.id}`} 
								className={styles['category']}
							>
								{category.name}
							</Button>
						))
					) : (
						<div>Категории не найдены</div>
					)}
				</div>

				<div className={styles['mobile-menu__info']}>
					{/* Телефон */}
					<Button 
						type='link' 
						href={phoneHref} 
						className={styles['phone']}		
					>
						{phoneNumberFormatted}
					</Button>

					{/* Время работы */}
					<p className={styles['time']}>	
						{workingTimeText}
					</p>
				</div>

				<div className={styles['mobile-menu__pages']}>
					{/* Страница акций */}
					<Button type='link' href={SALES_ROUTE} className={styles['sales']}>
						Акции и скидки
					</Button>

					{/* Страница доставки */}
					<Button type='link' href={DELIVERY_ROUTE} className={styles['delivery']}>
						Условия доставки
					</Button>

					{/* Страница политики обработки данных */}
					<Button type='link' href={POLICY_ROUTE} className={styles['policy']}>
						Политика обработки данных
					</Button>
				</div>
			</div>
        </div>
    )
}

export default MobileMenu;