import { observer } from 'mobx-react-lite'
import React from 'react'
import weAreClosedImage from '../../../assets/images/we-are-closed.webp'
import { getImageUrl } from '../../../constants'
import { useLazyImage } from '../../../hooks/useLazyImage'
import Button from '../../Button'
import Modal from '../../Modals'
import styles from './index.module.scss'

const WeAreClosed = observer(({
	className,
	isOpen,
	onClose
}) => {

	// Lazy loading для изображений
	const { imageSrc } = useLazyImage(
		getImageUrl(weAreClosedImage),
		weAreClosedImage
	)

	return (
		<Modal className={`${styles['we-are-closed']} ${className}`} isOpen={isOpen} onClose={onClose} type="white">
			<div className={styles['we-are-closed__content']}>
				<img src={imageSrc} alt="We are closed" />
				<h2 className={styles['we-are-closed__content__title']}>
					Лучшим тоже нужно отдыхать
				</h2>
				<p className={styles['we-are-closed__content__sub-title']}>
					Мы принимаем заказы, с <b>10:00</b> до <b>22:30</b>
				</p>
				<p className={styles['we-are-closed__content__description']}>
					Но вы можете оформить предзаказ
				</p>
				<Button className={styles['we-are-closed__content__button']}>
					Продолжить
				</Button>
			</div>
		</Modal>
	);
})

export default WeAreClosed;