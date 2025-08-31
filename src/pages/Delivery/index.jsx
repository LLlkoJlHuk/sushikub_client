import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useMemo, useState } from 'react'
import cardIcon from '../../assets/images/card.svg'
import cashIcon from '../../assets/images/cash.svg'
import deliveryIcon from '../../assets/images/delivery.svg'
import storeIcon from '../../assets/images/store.svg'
import timeIcon from '../../assets/images/time.svg'
import Button from '../../components/Button'
import DeliveryCard from '../../components/DeliveryCard'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Notice from '../../components/Notice'
import SEOHead from '../../components/SEOHead'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'


const Sales = observer(() => {
	const { settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		globalMessage: '',
		phoneNumberCode: '',
		phoneNumber: '',
		phoneNumberFormatted: '',
		workingTimeStart: '',
		workingTimeEnd: '',
		minOrderSum: ''
	})

	const { phoneNumberCode, phoneNumber, phoneNumberFormatted, workingTimeStart, workingTimeEnd, minOrderPriceForDelivery } = settingsData

	const phoneHref = useMemo(() => {
		return `tel:${phoneNumberCode}${phoneNumber}`;
	}, [phoneNumberCode, phoneNumber]);	

	const workingTimeText = useMemo(() => {
		return `с ${workingTimeStart} до ${workingTimeEnd}`;
	}, [workingTimeStart, workingTimeEnd]);

	useEffect(() => {
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		const phoneNumberCode = settings.getSettingValue('PHONE_NUMBER_CODE', '')
		const phoneNumber = settings.getSettingValue('PHONE_NUMBER', '')
		const phoneNumberFormatted = settings.getSettingValue('PHONE_NUMBER_FORMATTED', '')
		const workingTimeStart = settings.getSettingValue('WORKING_TIME_START', '')
		const workingTimeEnd = settings.getSettingValue('WORKING_TIME_END', '')
		const minOrderPriceForDelivery = settings.getSettingValue('MIN_ORDER_PRICE_FOR_DELIVERY', '')

		setSettingsData({ 
			globalMessage: globalMessage,
			phoneNumberCode: phoneNumberCode,
			phoneNumber: phoneNumber,
			phoneNumberFormatted: phoneNumberFormatted,
			workingTimeStart: workingTimeStart,
			workingTimeEnd: workingTimeEnd,
			minOrderPriceForDelivery: minOrderPriceForDelivery
		})
	}, [settings.settingsObject, settings])

	const { globalMessage } = settingsData

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');

	return (
		<>
			{/* SEO метаданные для страницы доставки */}
			<SEOHead 
				title="КУБ - Доставка суши и роллов в Красноярске | Условия и оплата"
				description="🚚 Доставка суши и роллов по Красноярску. Минимальная сумма заказа, время доставки, способы оплаты. Филиалы и пункты самовывоза."
				keywords="доставка суши, доставка роллов, Красноярск, условия доставки, оплата, самовывоз, КУБ, Красноярск"
				canonical="https://overkot12.ru/delivery"
				ogTitle="КУБ - Доставка суши и роллов в Красноярске - быстро и удобно"
				ogDescription="🚚 Доставка японской кухни по Красноярску быстро и удобно. Два филиала, удобная оплата, самовывоз."
			/>
			
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
						Доставка и оплата
					</h1>

					<p className={styles['block-text']}>
						Заказы принимаются <span>{workingTimeText}</span> по телефону&nbsp;<Button 
							type='link' 
							href={phoneHref} 
							className={styles['phone']}
						>
							{phoneNumberFormatted}
						</Button>&nbsp;или в режиме онлайн через сайт. Минимальная сумма заказа для доставки <span>{minOrderPriceForDelivery}&nbsp;руб.</span> <br />

						<br className={styles['mobile-only']} />

						Среднее время доставки 57 минут, по возможности ранее. Время доставки может увеличиться в ситуации сильных пробок или другой неблагоприятной обстановки на дорогах. <br />
						<br className={styles['mobile-only']} />

						Условия и срок транспортировки - согласно правилам перевозки скоропортящихся продуктов.
					</p>

					<div className={styles['map']}>
						<iframe 
							src="https://yandex.ru/map-widget/v1/?um=constructor%3Aff1552bb04ec2c5cf1ae590a5c9a8a3dc0bceaaf491d7db53138500272667432&amp;source=constructor" 
							width="100%" 
							height="100%" 
							frameborder="0"
						/>
					</div>

					<h2 className={styles['block-title']}>
						Филиалы и пункты самовывоза
					</h2>

					<div className={styles['delivery-cards']}>
						<DeliveryCard 
							title='Филиал' 
							icon={storeIcon} 
							iconWidth={28}
							description='Красноярск, улица Батурина, дом 30' 
						/>

						<DeliveryCard 
							title='Филиал' 
							icon={storeIcon} 
							iconWidth={28}
							description='Красноярск, улица Лесопарковая, дом 27' 
						/>
					</div>

					<h2 className={styles['block-title']}>
						Как оплатить заказ?
					</h2>

					<div className={styles['delivery-cards']}>
						<DeliveryCard 
							title='Наличными' 
							icon={cashIcon} 
							iconWidth={34}
							description='Оплата наличными курьеру или в ресторане при получении заказа' 
						/>

						<DeliveryCard 
							title='Банковской картой при получении' 
							icon={cardIcon} 
							iconWidth={34}
							description='Оплата заказа банковской картой при получении курьеру или в ресторане' 
						/>
					</div>

					<h2 className={styles['block-title']}>
						Как получить заказ?
					</h2>

					<div className={styles['delivery-cards']}>
						<DeliveryCard 
							title='Доставка' 
							icon={deliveryIcon} 
							iconWidth={24}
							description='Заказывайте любым удобным способом, получайте заказ на указанный вами адрес' 
						/>

						<DeliveryCard 
							title='Забрать из ресторана' 
							icon={storeIcon} 
							iconWidth={28}
							description='Получайте заказ в выбранном ресторане в удобное для вас время' 
						/>

						<DeliveryCard 
							title='Доставка ко времени' 
							icon={timeIcon} 
							iconWidth={28}
							description='Выбирайте к “определенному времени” и получайте заказ в указанное время' 
						/>
					</div>

					<h2 className={styles['block-title']}>
						Реквизиты
					</h2>
					
					<ul className={styles['requisites']}>
						<li><span>ИП</span> Бакач А.М.</li>
						<li><span>ИНН</span> 246315598410</li>
						<li><span>ОГРН</span> 319246800152205</li>
					</ul>
					
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
		</>
	)
})

export default Sales 	