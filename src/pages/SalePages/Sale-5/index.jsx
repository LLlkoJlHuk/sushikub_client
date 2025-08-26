import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import SalePageLayout from '../../../components/SalePageLayout'
import { getImageUrl } from '../../../constants'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { Context } from '../../../main'

const Sale4 = observer(() => {
	const { banners, settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		bonusPercentage: null
	})
	const banner = banners.banners && banners.banners.length > 5 ? banners.banners[5] : null

	useEffect(() => {
		const bonusPercentage = settings.getSettingValue('BONUS_PERCENTAGE', '')
		
		setSettingsData({ 
			bonusPercentage: bonusPercentage
		})
	}, [settings, settings.settingsObject]) 

	const { bonusPercentage } = settingsData
	const { width } = useWindowSize()

	return (
		<SalePageLayout>
			<div className="page-sale">
				{banner && (
					<div className="page-sale__banner">
						{width > 768 ? (
							<img src={getImageUrl(banner.imgDesktop)} alt="Ролл в подарок" />
						) : (
							<img src={getImageUrl(banner.imgMobile)} alt="Ролл в подарок" />
						)}
					</div>
				)}
				<div className="page-sale__content">
					<h1 className="page-sale__content-title">Счастливые часы</h1>
					<p className="page-sale__content-description">
						<span>Скидка&nbsp;10% при заказе с&nbsp;11:00 до&nbsp;15:00&nbsp;с доставкой на&nbsp;ближайшее время</span>
					</p>
					<p className="page-sale__content-description">
						Теперь ты&nbsp;знаешь, что делать в&nbsp;обед&nbsp;&mdash; конечно&nbsp;же заказывать роллы и&nbsp;суши в&nbsp;Суши Кубе? <br />
						Cообщите оператору контрольную фразу <span>&laquo;Счастливые часы&raquo;</span> <br />
						Акция действует ежедневно, кроме выходных и&nbsp;праздничных дней. <br />
						Предложение не&nbsp;суммируется с&nbsp;другими акциями и&nbsp;скидками, а&nbsp;также не&nbsp;распространяется на&nbsp;горячие блюда, салаты, десерты и&nbsp;напитки.
					</p>
					<p className="page-sale__content-bonus">
						+{bonusPercentage}% баллами на&nbsp;личный счет
					</p>
				</div>
			</div>
		</SalePageLayout>
	)
})

export default Sale4
