import { observer } from 'mobx-react-lite'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import Basket from '../../assets/images/icon-basket.webp'
import logoGif from '../../assets/images/logo.mp4'
import logo from '../../assets/images/logo.webp'
import {
	CART_ROUTE,
	CATEGORY_ROUTE,
	MAIN_ROUTE,
} from '../../constants'
import { formatPrice } from '../../hooks/formatPrice'
import { useLazyImage } from '../../hooks/useLazyImage'
import { useLazyVideo } from '../../hooks/useLazyVideo'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Context } from '../../main'
import Button from '../Button'
import MobileMenu from '../MobileMenu'
import Search from '../Search'
import styles from './index.module.scss'

const Header = observer(({ isScrolled, isTimedOut, isScrolledBack, isTimedOutBack }) => {
	const { products, basket } = useContext(Context);
	const categories = products.categories;
	const loading = products.loading;
	const nodeRefLogo = useRef(null);
	const nodeRefBasket = useRef(null);
	const nodeRefBasketSecondary = useRef(null);
	const nodeRefPlug = useRef(null);
	const nodeRefMobileMenu = useRef(null);
	const { width } = useWindowSize();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const { settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		phoneNumberCode: '+7',
		phoneNumber: '',
		phoneNumberFormatted: '',
		workingTimeStart: '',
		workingTimeEnd: ''
	})

	useEffect(() => {
		const code = settings.getSettingValue('PHONE_NUMBER_CODE', '')
		const number = settings.getSettingValue('PHONE_NUMBER', '')
		const formatted = settings.getSettingValue('PHONE_NUMBER_FORMATTED', '')
		const workingTimeStart = settings.getSettingValue('WORKING_TIME_START', '')
		const workingTimeEnd = settings.getSettingValue('WORKING_TIME_END', '')
		
		setSettingsData({ 
			phoneNumberCode: code, 
			phoneNumber: number, 
			phoneNumberFormatted: formatted,
			workingTimeStart: workingTimeStart,
			workingTimeEnd: workingTimeEnd
		})
	}, [settings, settings.settingsObject])

	// Lazy loading для видео логотипа
	const { videoSrc, placeholderSrc, showPlaceholder } = useLazyVideo(logoGif, logo)

	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add('modal-open')
		} else {
			document.body.classList.remove('modal-open')
		}
	}, [isMenuOpen])

	const { phoneNumberCode, phoneNumber, phoneNumberFormatted, workingTimeStart, workingTimeEnd } = settingsData

	const handleMenuToggle = useCallback(() => {
		setIsMenuOpen(!isMenuOpen);
	}, [isMenuOpen]);

	const sortedCategories = useMemo(() => {
		if (!categories || categories.length === 0) return [];
		return categories.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
	}, [categories]);

	const phoneHref = useMemo(() => {
		return `tel:${phoneNumberCode}${phoneNumber}`;
	}, [phoneNumberCode, phoneNumber]);

	const workingTimeText = useMemo(() => {
		return `Работаем с ${workingTimeStart} до ${workingTimeEnd}`;
	}, [workingTimeStart, workingTimeEnd]);

	// Адаптивный логотип
	const { imageSrc: logoSrc } = useLazyImage(
		'logo.webp',
		logo,
		{ 
			enableCache: true,
			imageType: 'LOGO'
		}
	);

  return (
    <>
		{ width > 1024 ? (
			<div className={`${styles['header']} ${isScrolled ? styles['scrolled'] : ''}`}>
				<div className='container'>
		
					{/* Верхняя часть хэдера */}
					{!isScrolled && (
						<div className={styles['upper-header']}>
		
							{/* Левая сторона хэдера */}
							<div className={styles['left-side']}>
		
								{/* Логотип */}
								<Button type='link' href={MAIN_ROUTE} className={styles['logo']}>
									<div className={styles['logo-gif']}>
										{showPlaceholder && (
											<img 
												src={placeholderSrc} 
												alt="logo" 
												className={`${styles['logo-img']} ${styles['logo-img--placeholder']}`} 
											/>
										)}
										{videoSrc && (
											<video 
												src={videoSrc} 
												autoPlay 
												loop 
												muted 
												playsInline 
												className={`${styles['logo-img']} ${showPlaceholder ? styles['logo-img--hidden'] : ''}`} 
											/>
										)}
									</div>
									<h1 className={styles['logo-text']}>Куб</h1>
								</Button>
							</div>
		
							{/* Правая сторона хэдера */}
							<div className={`${styles['right-side']} ${basket.totalItems > 0 ? styles['basket-visible'] : ''}`}>
		
								{/* Информация о телефоне и времени работы */}
								<div className={styles['info']}>
		
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
		
								{/* Корзина */}
								<CSSTransition
									in={basket.totalItems > 0}
									timeout={300}
									classNames='alert'
									unmountOnExit
									appear
									nodeRef={nodeRefBasket}
								>
									<div className={`${styles['basket']}`} ref={nodeRefBasket}>
										<Button type='link' href={CART_ROUTE} className={styles['basket-button']}>
											<div className={styles['basket-img-container']}>
												<img src={Basket} alt="basket" className={styles['basket-img']} />
												<div className={styles['basket-counter']}>
													<p>{basket.totalItems}</p>
												</div>
											</div>
		
											<p className={styles['basket-total-price']}>
												{formatPrice(basket.totalPrice)}&nbsp;<span>₽</span> 
											</p>
										</Button>
									</div>
								</CSSTransition>
							</div>
						</div>	
					)}
		
					{/* Нижняя часть хэдера */}
					<div className={`${styles['lower-header']} ${isScrolled ? styles['scrolled-padding'] : ''} ${isScrolled && isTimedOut ? styles['scrolled'] : ''} ${isScrolledBack && isTimedOutBack ? styles['scrolled-back'] : ''}`}>
		
						{/* Логотип */}
						<CSSTransition
							in={isScrolledBack && isTimedOutBack}
							timeout={300}
							classNames='logo'
							unmountOnExit
							appear
							nodeRef={nodeRefLogo}
						>
							<div ref={nodeRefLogo}>
								<Button type='link' href={MAIN_ROUTE} className={styles['logo']}>
									<img src={logoSrc} alt="logo" className={styles['logo-img']} />
								</Button>
							</div>
						</CSSTransition>
		
						<div className={styles['content']}>
							{/* Категории товаров */}
							<div className={styles['categories']}>
								{loading ? (
									<div>Загрузка категорий...</div>
								) : sortedCategories.length > 0 ? (
									sortedCategories.map((category) => (
										<Button 
											key={category.id} 
											type='link' 
											href={`${CATEGORY_ROUTE}/${category.id}`} 
											className={styles['category-button']}
										>
											{category.name}
										</Button>
									))
								) : (
									<div>Категории не найдены</div>
								)}
							</div>
		
							{/* Поиск */}
							<Search />
						</div>

						{ basket.totalItems > 0 ? (
							<CSSTransition
								in={isScrolledBack && isTimedOutBack}
								timeout={300}
								classNames='logo'
								unmountOnExit
								appear
								nodeRef={nodeRefBasketSecondary}
							>
								<div className={`${styles['basket']}`} ref={nodeRefBasketSecondary}>
									<Button type='link' href={CART_ROUTE} className={styles['basket-button']}>
										<div className={styles['basket-img-container']}>
											<img src={Basket} alt="basket" className={styles['basket-img']} />
											<div className={styles['basket-counter']}>
												<p>{basket.totalItems}</p>
											</div>
										</div>

										<p className={styles['basket-total-price']}>
											{formatPrice(basket.totalPrice)}&nbsp;<span>₽</span> 
										</p>
									</Button>
								</div>
							</CSSTransition>
						) : (
							<CSSTransition
								in={isScrolledBack && isTimedOutBack}
								timeout={300}
								classNames='logo'
								unmountOnExit
								appear
								nodeRef={nodeRefPlug}
							>
								<div className={styles['plug']} ref={nodeRefPlug}></div>
							</CSSTransition>
						)}
					</div>
				</div>
			</div>
		) : (
			<div className={`${styles['mobile-header']}`}>
				{/* Левая сторона хэдера */}
				<div className={styles['left-side']}>
	
					{/* Логотип */}
					<Button type='link' href={MAIN_ROUTE} className={styles['logo']}>
						<img src={logoSrc} alt="logo" className={styles['logo-img']} />
						
						<h1 className={styles['logo-text']}>Куб</h1>
					</Button>
				</div>

				{/* Правая сторона хэдера */}
				<div className={styles['right-side']}>
					{/* Корзина */}
					<CSSTransition
						in={basket.totalItems > 0}
						timeout={300}
						classNames='logo'
						unmountOnExit
						appear
						nodeRef={nodeRefBasketSecondary}
					>
						<div className={`${styles['basket']}`} ref={nodeRefBasketSecondary}>
							<Button type='link' href={CART_ROUTE} className={styles['basket-button']}>
								<div className={styles['basket-img-container']}>
									<img src={Basket} alt="basket" className={styles['basket-img']} />
									<div className={styles['basket-counter']}>
										<p>{basket.totalItems}</p>
									</div>
								</div>
							</Button>
						</div>
					</CSSTransition>

					{/* Меню */}
					<div className={`${styles['menu-icon']} ${isMenuOpen ? styles['open'] : ''}`} onClick={handleMenuToggle}>
						<div className={`${styles['line']} ${styles['line-first']}`}></div>
						<div className={`${styles['line']} ${styles['line-second']}`}></div>
						<div className={`${styles['line']} ${styles['line-third']}`}></div>
					</div>
				</div>

				<CSSTransition
					in={isMenuOpen}
					timeout={500}
					classNames='mobile-menu'
					unmountOnExit
					appear
					nodeRef={nodeRefMobileMenu}
				>
					<MobileMenu 
						sortedCategories={sortedCategories} 
						loading={loading} 
						phoneHref={phoneHref} 
						workingTimeText={workingTimeText} 
						phoneNumberFormatted={phoneNumberFormatted} 
						onClose={() => setIsMenuOpen(false)}
						ref={nodeRefMobileMenu}
					/>	
				</CSSTransition>
			</div>
		)}
	</>
  )
})

export default Header