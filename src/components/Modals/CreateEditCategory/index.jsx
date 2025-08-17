import { useContext, useEffect, useState } from 'react'
import Plug from '../../../assets/images/plug.webp'
import { getImageUrl } from '../../../constants'
import { Context } from '../../../main'
import Button from '../../Button'
import Input from '../../Input'
import Modal from '../index'
import styles from './index.module.scss'


function CreateEditCategory({
  className,
  isModalOpen,
  closeModal,
  showNotification,
  type = 'create',
  categoryData = null,
}) {
	const { products } = useContext(Context)
	
	const [category, setCategory] = useState({
		name: '',
		img: '',
		preview: '',
		order: '',
	})
	
	const [imagePreview, setImagePreview] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')

	// Загружаем данные категории при открытии модального окна
	useEffect(() => {
		if (isModalOpen) {
			setCategory({
				name: categoryData?.name || '',
				img: categoryData?.img || '',
				preview: categoryData?.preview || '',
				order: categoryData?.order || '',
			})
			
			if (categoryData?.preview) {
				setImagePreview(getImageUrl(categoryData.preview))
			}
		}
	}, [isModalOpen, categoryData])
	
	// Сброс формы при закрытии модального окна
	useEffect(() => {
		if (!isModalOpen) {
			setCategory({
				name: '',
				img: '',
				preview: '',
				order: '',
			})
			setImagePreview(null)
			setError('')
			setIsSubmitting(false)
		}
	}, [isModalOpen])
	
	const handleInputChange = (e) => {
		const { name, value, files } = e.target
		
		// Очищаем ошибку при изменении полей
		if (error) setError('')
		
		if (name === 'img' && files) {
			const file = files[0]
			setCategory(prev => ({
				...prev,
				[name]: file
			}))
			
			// Создаем URL для предварительного просмотра
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target.result)
			}
			reader.readAsDataURL(file)
		} else {
			setCategory(prev => ({
				...prev,
				[name]: value
			}))
		}
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError('')
		
		try {
			// Проверяем, что название заполнено
			if (!category.name.trim()) {
				setError('Название категории обязательно для заполнения')
				return
			}
			
			// Проверяем порядок (если указан, должен быть положительным числом)
			if (category.order && (isNaN(category.order) || parseInt(category.order) < 1)) {
				setError('Порядок должен быть положительным числом')
				return
			}
			
			// Проверяем, что изображение выбрано (только для создания)
			if (type === 'create' && !category.img) {
				setError('Необходимо выбрать изображение')
				return
			}
			
			// Создаем FormData для отправки файла
			const formData = new FormData()
			formData.append('name', category.name)
			
			// Добавляем порядок (даже если пустой, чтобы можно было сбросить)
			formData.append('order', category.order || '')
			
			// Добавляем изображение только если оно выбрано или это создание новой категории
			if (category.img) {
				formData.append('img', category.img)
			}
			
			if (type === 'create') {
				await products.createCategory(formData)
				if (showNotification) {
					showNotification('Категория успешно добавлена', 'success')
				}
			} else {
				await products.updateCategory(categoryData.id, formData)
				if (showNotification) {
					showNotification('Категория успешно обновлена', 'success')
				}
			}
			
			// Закрываем модальное окно (форма сбросится автоматически через useEffect)
			closeModal()
			
		} catch (error) {
			console.error(`Error ${type === 'create' ? 'creating' : 'updating'} category:`, error)
			const errorMessage = error.message || `Ошибка при ${type === 'create' ? 'создании' : 'обновлении'} категории`
			setError(errorMessage)
			// Показываем уведомление об ошибке
			if (showNotification) {
				showNotification(errorMessage, 'error')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

  return (
    <Modal
		className={className}
		isOpen={isModalOpen}
		onClose={closeModal}
		title={type === 'create' ? 'Добавить категорию' : 'Редактировать категорию'}
		type="white"
		backDropClick={false}
		>
			<form className={styles['admin-page__content-add-category-modal-form']} onSubmit={handleSubmit}>

				<div className={styles['admin-page__content-add-category-modal-form-scroll-wrapper']}>
					{/* Изображение категории */}
					<div className={`${styles['admin-page__content-add-category-modal-form-item']} ${styles['image-input']}`}>

					{/* Предварительный просмотр изображения */}
					<div className={styles['admin-page__content-add-category-modal-form-image-preview']}>
						<img 
							src={imagePreview || Plug} 
							alt="Предварительный просмотр" 
							className={styles['admin-page__content-add-category-modal-form-preview-img']}
						/>
					</div>

					{/* Кастомный интерфейс выбора файла */}
					<div className={styles['admin-page__content-add-category-modal-form-file-input-wrapper']}>
						<Input 
							id="img"
							name="img"
							type="file"
							onChange={handleInputChange}
							accept="image/*"
							className={styles['admin-page__content-add-category-modal-form-hidden-input']}
						/>
						<label 
							htmlFor="img" 
							className={styles['admin-page__content-add-category-modal-form-file-label']}
						>
							{imagePreview ? 'Изменить изображение' : 'Выбрать изображение'}
						</label>
					</div>
					</div>

					{/* Название категории */}
					<div className={styles['admin-page__content-add-category-modal-form-item']}>
					<label htmlFor="name">Название категории</label>
					<Input 
						id="name"
						name="name"
						type="text"
						value={category.name}
						onChange={handleInputChange}
						placeholder="Введите название категории"
					/>
					</div>

					{/* Порядок отображения */}
					<div className={styles['admin-page__content-add-category-modal-form-item']}>
					<label htmlFor="order">Порядок отображения</label>
					<Input 
						id="order"
						name="order"
						type="number"
						value={category.order}
						onChange={handleInputChange}
						placeholder="Введите порядок"
						min="1"
					/>
					</div>
				</div>

				{/* Отображение ошибки */}
				{error && (
					<div className={styles['admin-page__content-add-category-modal-form-error']}>
						{error}
					</div>
				)}

				{/* Кнопка добавить/обновить */}
				<div className={styles['admin-page__content-add-category-modal-form-button']}>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting 
							? (type === 'create' ? 'Добавление...' : 'Обновление...') 
							: (type === 'create' ? 'Добавить' : 'Обновить')
						}
					</Button>
				</div>	

			</form>

		</Modal>
  )
}

export default CreateEditCategory