import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'

const DeliveryCard = observer(({ 
	title, 
	icon,
	iconWidth = 'auto',
	description 
}) => {

	return (
		<div className={styles['delivery-card']}>
			<div className={styles['delivery-card__icon']}>
				<img src={icon} alt={title} width={iconWidth} />
			</div>
			<div className={styles['delivery-card__title']}>
				{title}
			</div>
			<div className={styles['delivery-card__description']}>
				{description}
			</div>
		</div>
	)
})

export default DeliveryCard 	