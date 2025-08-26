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
	const banner = banners.banners && banners.banners.length > 0 ? banners.banners[0] : null

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
					<h1 className="page-sale__content-title">Ролл в подарок</h1>
					<p className="page-sale__content-description">
						Ролл в&nbsp;подарок на&nbsp;выбор: Аляска, Бали или Кимоно за&nbsp;каждые 1500&nbsp;₽ в&nbsp;заказе. Теперь заказывать в&nbsp;Суши Кубе еще выгоднее! <br />
						Сообщи оператору кодовую фразу: <span>&laquo;ХОЧУ&nbsp;РОЛЛ&nbsp;В&nbsp;ПОДАРОК&raquo;</span>.
					</p>
					<p className="page-sale__content-bonus">
						Данной акцией можно воспользоваться совместно со&nbsp;скидкой до&nbsp;10%. <br />
						+{bonusPercentage}% баллами на&nbsp;личный счет
					</p>
				</div>
			</div>
		</SalePageLayout>
	)
})

export default Sale4
