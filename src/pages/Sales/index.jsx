import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { getImageUrl } from '../../constants'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'


const Sales = observer(() => {
	const { banners, settings } = useContext(Context)
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

	return (
		<div className={`page ${styles['sales']}`}>

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
			<section className={`section ${styles['section-sales']}`}>
				<div className='container'>

					<h1 className='section__title'>
						Акции и скидки
					</h1>

					<div className={styles['sales-list']}>
						{banners.banners && banners.banners.length > 0 && (
							<>
								<a href='/sales/sale-0' className={styles['sales-list__item']}>
									<div className={styles['sales-list__item-banner']}>
										<img src={getImageUrl(banners.banners[0].imgDesktop)} alt='Ролл в подарок' />
									</div>
									<p className={styles['sales-list__item-title']}>
										Ролл в подарок    
									</p>
									<p className={styles['sales-list__item-description']}>
										Дарим ролл за заказ от 1500 ₽
									</p>
								</a>

								<a href='/sales/sale-1' className={styles['sales-list__item']}>
									<div className={styles['sales-list__item-banner']}>
										<img src={getImageUrl(banners.banners[1].imgDesktop)} alt='Годовщина с Кубом' />
									</div>
									<p className={styles['sales-list__item-title']}>
										Годовщина с Кубом
									</p>
									<p className={styles['sales-list__item-description']}>
										Радуем в годовщину вкусными блюдами с хорошими скидками!
									</p>
								</a>

								<a href='/sales/sale-2' className={styles['sales-list__item']}>
									<div className={styles['sales-list__item-banner']}>
										<img src={getImageUrl(banners.banners[2].imgDesktop)} alt='Счастливые часы' />
									</div>
									<p className={styles['sales-list__item-title']}>
										Скидка в день рождения!
									</p>
									<p className={styles['sales-list__item-description']}>
										Скидка всем именинникам 15% на доставку и 20% на самовывоз 
									</p>
								</a>

								<a href='/sales/sale-3' className={styles['sales-list__item']}>
									<div className={styles['sales-list__item-banner']}>
										<img src={getImageUrl(banners.banners[3].imgDesktop)} alt='Роллы на пробу' />
									</div>
									<p className={styles['sales-list__item-title']}>
										Роллы на пробу
									</p>
									<p className={styles['sales-list__item-description']}>
										Дарим всем новым клиентам ролл в подарок
									</p>
								</a>

								<a href='/sales/sale-4' className={styles['sales-list__item']}>
									<div className={styles['sales-list__item-banner']}>
										<img src={getImageUrl(banners.banners[4].imgDesktop)} alt='Скидка на самовывоз' />
									</div>
									<p className={styles['sales-list__item-title']}>
										Скидка на самовывоз
									</p>
									<p className={styles['sales-list__item-description']}>
										Заберите заказ сами и получите скидку 15%
									</p>
								</a>

								<a href='/sales/sale-5' className={styles['sales-list__item']}>
									<div className={styles['sales-list__item-banner']}>
										<img src={getImageUrl(banners.banners[5].imgDesktop)} alt='Скидка в день рождения!' />
									</div>
									<p className={styles['sales-list__item-title']}>
										Счастливые часы
									</p>
									<p className={styles['sales-list__item-description']}>
										Скидка 10% всем с 11:00 до 15:00
									</p>
								</a>
							</>
						)}
					</div>
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

export default Sales 	