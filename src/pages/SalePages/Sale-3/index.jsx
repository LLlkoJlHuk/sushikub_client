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
	const banner = banners.banners && banners.banners.length > 3 ? banners.banners[3] : null

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
					<h1 className="page-sale__content-title">Роллы на пробу</h1>
					<p className="page-sale__content-description">
						<span>Скидка&nbsp;15% на&nbsp;первый заказ</span>
					</p>
					<p className="page-sale__content-description">
						Появление каждого нового клиента мотивирует наших сотрудников быть еще лучше!? <br />
						Cообщите оператору контрольную фразу <span>&laquo;Роллы на&nbsp;пробу&raquo;</span> и&nbsp;то, что вы&nbsp;заказываете в&nbsp;первый раз. <br />
						Акция распространяется только на&nbsp;роллы и&nbsp;наборы. <br />
						Предложение не&nbsp;суммируется с&nbsp;другими акциями и&nbsp;скидками. <br />
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
