import { useContext, useEffect, useState } from 'react'
import Plug from '../../../assets/images/plug.webp'
import { getImageUrl } from '../../../constants'
import { Context } from '../../../main'
import Button from '../../Button'
import Input from '../../Input'
import Modal from '../index'
import styles from './index.module.scss'


function CreateBanner({
  className,
  isModalOpen,
  closeModal,
  showNotification,
  type = 'create',
  bannerData = null,
}) {
	const { banners } = useContext(Context)

	{/* Создание баннера */}
	const [banner, setBanner] = useState({
		imgDesktop: '',
		imgMobile: '',
		link: '',
		order: 0,
	})
	
	const [imagePreviewDesktop, setImagePreviewDesktop] = useState(null)
	const [imagePreviewMobile, setImagePreviewMobile] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')

	// Загружаем данные баннера при открытии модального окна
	useEffect(() => {
		if (isModalOpen) {
			setBanner({
				imgDesktop: bannerData?.imgDesktop || '',
				imgMobile: bannerData?.imgMobile || '',
				link: bannerData?.link || '',
				order: bannerData?.order || 0,
			})
			
			if (bannerData?.imgDesktop) {
				setImagePreviewDesktop(getImageUrl(bannerData.imgDesktop))
			}
			if (bannerData?.imgMobile) {
				setImagePreviewMobile(getImageUrl(bannerData.imgMobile))
			}
		}
	}, [isModalOpen, bannerData])
	
	// Сброс формы при закрытии модального окна
	useEffect(() => {
		if (!isModalOpen) {
			setBanner({
				imgDesktop: '',
				imgMobile: '',
				link: '',
				order: 0,
			})
			setImagePreviewDesktop(null)
			setImagePreviewMobile(null)
			setError('')
			setIsSubmitting(false)
		}
	}, [isModalOpen])
	
	const handleInputChange = (e) => {
		const { name, value, files } = e.target
		
		// Очищаем ошибку при изменении полей
		if (error) setError('')
		
		if (name === 'imgDesktop' && files) {
			const file = files[0]
			setBanner(prev => ({
				...prev,
				[name]: file
			}))
			
			// Создаем URL для предварительного просмотра
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreviewDesktop(e.target.result)
			}
			reader.readAsDataURL(file)
		} else if (name === 'imgMobile' && files) {
			const file = files[0]
			setBanner(prev => ({
				...prev,
				[name]: file
			}))

			// Создаем URL для предварительного просмотра
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreviewMobile(e.target.result)
			}
			reader.readAsDataURL(file)
		} else {
			setBanner(prev => ({
				...prev,
				[name]: value
			}))
		}
	}
	
	const addBanner = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError('')
		
		try {
			// Проверяем, что изображение выбрано
			if (!banner.imgDesktop && !banner.imgMobile) {
				setError('Необходимо выбрать изображение для десктопа и мобильного устройства')
				return
			}
			
			// Создаем FormData для отправки файла
			const formData = new FormData()
			formData.append('imgDesktop', banner.imgDesktop)
			formData.append('imgMobile', banner.imgMobile)
			formData.append('link', banner.link)
			formData.append('order', banner.order)
			
			if (type === 'edit' && bannerData?.id) {
				// Редактирование существующего баннера
				await banners.updateBanner(bannerData.id, formData)
				showNotification('Баннер успешно обновлен', 'success')
			} else {
				// Создание нового баннера
				await banners.createBanner(formData)
				showNotification('Баннер успешно добавлен', 'success')
			}
			
			// Закрываем модальное окно (форма сбросится автоматически через useEffect)
			closeModal()
			
		} catch (error) {
			console.error('Error creating banner:', error)
			const errorMessage = error.message || 'Ошибка при создании баннера'
			setError(errorMessage)
			// Показываем уведомление об ошибке
			showNotification(errorMessage, 'error')
		} finally {
			setIsSubmitting(false)
		}
	}

  return (
    <Modal
		className={className}
		isOpen={isModalOpen}
		onClose={closeModal}
		title={type === 'create' ? 'Добавить баннер' : 'Редактировать баннер'}
		type="white"
		backDropClick={false}
		>
			<form className={styles['admin-page__content-add-banner-modal-form']} onSubmit={addBanner}>

				<div className={styles['admin-page__content-add-banner-modal-form-scroll-wrapper']}>
					<div className={styles['admin-page__content-add-banner-modal-form-images']}>
						{/* Изображение баннера для десктопа */}
						<div className={`${styles['admin-page__content-add-banner-modal-form-item']} ${styles['image-input']}`}>

							<label htmlFor="imgDesktop">Изображение для десктопа</label>
							{/* Предварительный просмотр изображения */}
							<div className={styles['admin-page__content-add-banner-modal-form-image-preview']}>
								<img 
									src={imagePreviewDesktop || Plug} 
									alt="Предварительный просмотр" 
									className={styles['admin-page__content-add-banner-modal-form-preview-img']}
								/>
							</div>

							{/* Кастомный интерфейс выбора файла */}
							<div className={styles['admin-page__content-add-banner-modal-form-file-input-wrapper']}>
								<Input 
									id="imgDesktop"
									name="imgDesktop"
									type="file"
									onChange={handleInputChange}
									accept="image/*"
									className={styles['admin-page__content-add-banner-modal-form-hidden-input']}
								/>
								<label 
									htmlFor="imgDesktop" 
									className={styles['admin-page__content-add-banner-modal-form-file-label']}
								>
									{imagePreviewDesktop ? 'Изменить изображение' : 'Выбрать изображение'}
								</label>
							</div>
						</div>

						{/* Изображение баннера для мобильного устройства */}
						<div className={`${styles['admin-page__content-add-banner-modal-form-item']} ${styles['image-input']}`}>

							<label htmlFor="imgMobile">Изображение для мобильных устройств</label>
							{/* Предварительный просмотр изображения */}
							<div className={styles['admin-page__content-add-banner-modal-form-image-preview']}>
								<img 
									src={imagePreviewMobile || Plug} 
									alt="Предварительный просмотр" 
									className={styles['admin-page__content-add-banner-modal-form-preview-img']}
								/>
							</div>

							{/* Кастомный интерфейс выбора файла */}
							<div className={styles['admin-page__content-add-banner-modal-form-file-input-wrapper']}>
								<Input 
									id="imgMobile"
									name="imgMobile"
									type="file"
									onChange={handleInputChange}
									accept="image/*"
									className={styles['admin-page__content-add-banner-modal-form-hidden-input']}
								/>
								<label 
									htmlFor="imgMobile" 
									className={styles['admin-page__content-add-banner-modal-form-file-label']}
								>
									{imagePreviewMobile ? 'Изменить изображение' : 'Выбрать изображение'}
								</label>
							</div>
						</div>
					</div>

					{/* Ссылка на баннер */}
					<div className={styles['admin-page__content-add-banner-modal-form-item']}>
						<label htmlFor="link">Ссылка с баннера</label>
						<Input 
							id="link"
							name="link"
							type="text"	
							value={banner.link}
							onChange={handleInputChange}
							placeholder="Введите ссылку на баннер"
						/>
					</div>
					

					{/* Порядок отображения баннера */}
					<div className={styles['admin-page__content-add-banner-modal-form-item']}>
						<label htmlFor="order">Порядок отображения баннера</label>
						<Input 
							id="order"
							name="order"
							type="number"	
							value={banner.order}
							onChange={handleInputChange}
							placeholder="Введите порядок отображения баннера"
						/>
					</div>
				</div>


				{/* Отображение ошибки */}
				{error && (
					<div className={styles['admin-page__content-add-banner-modal-form-error']}>
						{error}
					</div>
				)}

				{/* Кнопка добавить */}
				<div className={styles['admin-page__content-add-banner-modal-form-button']}>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting 
							? (type === 'create' ? 'Добавление...' : 'Изменение...') 
							: (type === 'create' ? 'Добавить' : 'Изменить')
						}
					</Button>
				</div>	

			</form>

		</Modal>
  )
}

export default CreateBanner