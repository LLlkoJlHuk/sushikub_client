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
	const banner = banners.banners && banners.banners.length > 1 ? banners.banners[1] : null

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
					<h1 className="page-sale__content-title">Годовщина с Кубом</h1>
					<p className="page-sale__content-description">
						<span>Скидка&nbsp;20% на&nbsp;самовывоз.</span> <br />
						<span>Скидка&nbsp;15% на&nbsp;доставку.</span>
					</p>
					<p className="page-sale__content-description">
						Мы&nbsp;уверены вы&nbsp;знаете что делать&nbsp;&mdash; конечно&nbsp;же брать и&nbsp;заказывать вкусные блюда по&nbsp;очень сочным скидкам! <br />
						Предложение не&nbsp;суммируется с&nbsp;другими акциями и&nbsp;скидками. <br />
						Предложение действует в&nbsp;день праздника и&nbsp;три дня после (количество заказов по&nbsp;акции&nbsp;НЕ ограничено). <br />
						Нужен оригинал документа для подтверждения скидки.
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
