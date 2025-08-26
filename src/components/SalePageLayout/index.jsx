import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'


const SalePageLayout = observer(({ children }) => {
	const { settings } = useContext(Context)
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
					<div className={styles['sale-content']}>
						{children}
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

export default SalePageLayout 	