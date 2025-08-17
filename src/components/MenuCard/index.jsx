import React from 'react'
import { CATEGORY_ROUTE } from '../../constants'
import Button from '../Button'
import styles from './index.module.scss'

const MenuCard = React.memo(function MenuCard({
	id,
	img,
	name,
}) {

	return (
		<Button 
			type='link' 
			href={`${CATEGORY_ROUTE}/${id}`} 
			className={`${styles['menu-card']} ${styles[`menu-card--${id}`]}`}
		>
			<div className={styles['menu-card__img']}>
				<img src={img} alt={name} />
			</div>

			<div className={styles['menu-card__name']}>
				{name}
			</div>
		</Button>
	)
})	

export default MenuCard;