import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import logo from '../../assets/images/logo.webp'
import {
	DELIVERY_ROUTE,
	MAIN_ROUTE,
	POLICY_ROUTE,
	SALES_ROUTE,
} from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Context } from '../../main'
import Button from '../Button'
import styles from './index.module.scss'

const Footer = observer(() => {
	const { settings } = useContext(Context)
	const { width } = useWindowSize()
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
	}, [settings.settingsObject])

	const { phoneNumberCode, phoneNumber, phoneNumberFormatted, workingTimeStart, workingTimeEnd } = settingsData
	
	// Мемоизируем телефонный номер
	const phoneHref = useMemo(() => {
		return `tel:${phoneNumberCode}${phoneNumber}`;
	}, [phoneNumberCode, phoneNumber]);

	// Мемоизируем время работы
	const workingTimeText = useMemo(() => {
		return `Работаем с ${workingTimeStart} до ${workingTimeEnd}`;
	}, [workingTimeStart, workingTimeEnd]);

  return (
    <div className={styles['footer']}>

		{/* Левая сторона футера */}
		<div className={styles['left-side']}>

			{/* Логотип */}
			<Button type='link' href={MAIN_ROUTE} className={styles['logo']}>
				<img src={logo} alt="logo" className={styles['logo-img']} />
				<h1 className={styles['logo-text']}>Куб</h1>
			</Button>
		</div>

		{width > 1024 && (
			<>
				{/* Середина футера */}
				<div className={styles['middle-side']}>

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
			</>
		)}

		{/* Правая сторона футера */}
		<div className={styles['right-side']}>

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
		</div>
	</div>
  )
})	

export default Footer