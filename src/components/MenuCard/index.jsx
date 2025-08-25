import React from 'react'
import rollPlugImage from '../../assets/images/roll-plug.webp'
import { CATEGORY_ROUTE, getImageUrl } from '../../constants'
import { useLazyImage } from '../../hooks/useLazyImage'
import Button from '../Button'
import styles from './index.module.scss'

const MenuCard = React.memo(function MenuCard({
	id,
	img,
	name,
}) {
	// Lazy loading для изображения категории с Intersection Observer
	const { imageSrc, isLoading, imgRef } = useLazyImage(
		getImageUrl(img),
		rollPlugImage
	)

	return (
		<Button 
			type='link' 
			href={`${CATEGORY_ROUTE}/${id}`} 
			className={`${styles['menu-card']} ${styles[`menu-card--${id}`]} ${isLoading ? styles['menu-card--loading'] : ''}`}
		>
			<div className={styles['menu-card__img']} ref={imgRef}>
				<img 
					src={imageSrc} 
					alt={name}
					loading="lazy"
				/>
			</div>

			<div className={styles['menu-card__name']}>
				{name}
			</div>
		</Button>
	)
})	

export default MenuCard;