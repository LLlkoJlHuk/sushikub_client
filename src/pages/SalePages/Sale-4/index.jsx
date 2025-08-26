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
	const banner = banners.banners && banners.banners.length > 4 ? banners.banners[4] : null

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
					<h1 className="page-sale__content-title">Скидка на самовывоз</h1>
					<p className="page-sale__content-description">
						<span>Скидка&nbsp;15% на&nbsp;самовывоз.</span>
					</p>
					<p className="page-sale__content-description">
						Живете рядом с&nbsp;нами? <br />
						Большая загруженность на&nbsp;дорогах? <br />
						Не&nbsp;хотите ждать доставку? <br />
						Есть выход&nbsp;&mdash; заберите свой заказ с&nbsp;одного из&nbsp;наших филиалов и&nbsp;получите скидку! <br />
					</p>
					<p className="page-sale__content-bonus">
						Предложение не&nbsp;суммируется с&nbsp;другими акциями и&nbsp;скидками, а&nbsp;также не&nbsp;распространяется на&nbsp;горячие блюда, салаты, десерты и&nbsp;напитки.
						+{bonusPercentage}% баллами на&nbsp;личный счет
					</p>
				</div>
			</div>
		</SalePageLayout>
	)
})

export default Sale4
