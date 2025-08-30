import React from 'react'
import rollPlugImage from '../../assets/images/roll-plug.webp'
import { CATEGORY_ROUTE } from '../../constants'
import { useLazyImage } from '../../hooks/useLazyImage'
import Button from '../Button'
import styles from './index.module.scss'

const MenuCard = React.memo(function MenuCard({
	id,
	img,
	name,
}) {
	// Lazy loading для изображения категории с адаптивными размерами
	const { imageSrc, isLoading } = useLazyImage(
		img,
		rollPlugImage,
		{ 
			enableCache: true,
			imageType: 'MENU_CARD'
		}
	)

	return (
		<Button 
			type='link' 
			href={`${CATEGORY_ROUTE}/${id}`} 
			className={`${styles['menu-card']} ${styles[`menu-card--${id}`]} ${isLoading ? styles['menu-card--loading'] : ''}`}
		>
			<div className={styles['menu-card__img']}>
				<img 
					src={imageSrc} 
					alt={name}
				/>
			</div>

			<div className={styles['menu-card__name']}>
				{name}
			</div>
		</Button>
	)
})	

export default MenuCard;