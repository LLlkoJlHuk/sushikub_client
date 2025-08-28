import React, { useEffect } from 'react'
import CloseIcon from '../../assets/images/icon-close.webp'
import Button from '../Button'
import styles from './index.module.scss'

const Modal = ({ 
	isOpen, 
	onClose, 
	children, 
	className,
	title = '',
	type = 'dark',
	backDropClick = true
}) => {

	useEffect(() => {
		// Закрытие по Escape
		const handleEscape = (e) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.body.classList.add('modal-open')
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.classList.remove('modal-open')
		}
	}, [isOpen, onClose])

	// Закрытие по клику вне попапа
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget && backDropClick) {
			e.preventDefault()
			e.stopPropagation()
			onClose()
		}
	}

	// Обработчик клика для кнопки закрытия
	const handleCloseClick = (e) => {
		e.preventDefault()
		e.stopPropagation()
		onClose()
	}

	if (!isOpen) return null

	return (
		<div className={`${styles['overlay']} overlay`} onClick={handleBackdropClick}>
			<div className={`${styles['modal']} modal ${className} ${styles[type]}`}>
				<Button 
					type='custom'
					className={styles['close-button']}
					onClick={handleCloseClick}
					aria-label="Закрыть"
				>
					<img src={CloseIcon} alt="close" />
				</Button>

				<div className={styles['content']}>
					{title && (
						<div className={styles['content-header']}>
							{title}
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	)
}

export default Modal 