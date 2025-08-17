import { useContext, useEffect, useState } from 'react'
import Plug from '../../../assets/images/plug.webp'
import { getImageUrl } from '../../../constants'
import { Context } from '../../../main'
import Button from '../../Button'
import Dropdown from '../../Dropdown'
import Input, { Textarea } from '../../Input'
import Modal from '../index'
import styles from './index.module.scss'


function CreateEditProduct({
  className,
  isModalOpen,
  closeModal,
  categories = [],
  types = [],
  showNotification,
  type = 'create',
  productData = null
}) {

	const { products } = useContext(Context)

	const [product, setProduct] = useState({
		name: '',
		description: '',
		price: 0,
		weight: 0,
		img: '',
		article: 0,
		category: '',
		type: '',
		inStock: true,
		order: 0,
	})
	
	const [imagePreview, setImagePreview] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	
	// Загружаем данные товара при редактировании
	useEffect(() => {
		if (type === 'edit' && productData && isModalOpen) {
			setProduct({
				name: productData.name || '',
				description: productData.description || '',
				price: productData.price || 0,
				weight: productData.weight || 0,
				img: '',
				article: productData.article || 0,
				category: productData.categoryId || '',
				type: productData.typeId || '',
				inStock: productData.inStock !== undefined ? productData.inStock : true,
				order: productData.order || 0,
			})
			// Устанавливаем предварительный просмотр изображения
			if (productData.img) {
				setImagePreview(getImageUrl(productData.img))
			}
		}
	}, [type, productData, isModalOpen])
	
	// Сброс формы при закрытии модального окна
	useEffect(() => {
		if (!isModalOpen) {
			setProduct({
				name: '',
				description: '',
				price: 0,
				weight: 0,
				img: '',
				article: 0,
				category: '',
				type: '',
				inStock: true,
				order: 0,
			})
			setImagePreview(null)
			setIsSubmitting(false)
			setError('')
		}
	}, [isModalOpen])
	
	// Устанавливаем первый тип по умолчанию при открытии модального окна (только для создания)
	useEffect(() => {
		if (isModalOpen && types.length > 0 && !product.type && type === 'create') {
			setProduct(prev => ({
				...prev,
				type: types[0].id
			}))
		}
	}, [isModalOpen, types, product.type, type])
	
	const handleInputChange = (e) => {
		const { name, value, files } = e.target
		
		// Очищаем ошибку при изменении полей
		if (error) setError('')
		
		if (name === 'img' && files) {
			const file = files[0]
			setProduct(prev => ({
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
			setProduct(prev => ({
				...prev,
				[name]: value
			}))
		}
	}
	
	const handleDropdownChange = (name, value) => {
		// Очищаем ошибку при изменении полей
		if (error) setError('')
		
		setProduct(prev => ({
			...prev,
			[name]: value
		}))
	}
	
	// Преобразуем категории и типы в формат для dropdown
	const categoryOptions = categories.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((category => ({
		value: category.id,
		label: category.name
	})))
	
	// Преобразуем типы в формат для dropdown
	const typeOptions = types.map(type => ({
		value: type.id,
		label: type.name
	}))
	
	// Обработчик отправки формы
	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError('')
		
		try {
			// Проверяем токен авторизации
			const token = localStorage.getItem('token')
			if (!token) {
				setError('Сессия истекла. Пожалуйста, войдите в систему заново.')
				if (showNotification) {
					showNotification('Сессия истекла. Пожалуйста, войдите в систему заново.', 'error')
				}
				return
			}
			
			// Валидация
			if (!product.name.trim()) {
				setError('Название товара обязательно для заполнения')
				return
			}
			
			if (!product.category) {
				setError('Необходимо выбрать категорию')
				return
			}

			if (!product.price) {
				setError('Цена обязательна для заполнения')
				return
			}
			
			if (!product.type) {
				setError('Необходимо выбрать тип')
				return
			}
			
			// Изображение обязательно только при создании
			if (type === 'create' && !product.img) {
				setError('Необходимо выбрать изображение')
				return
			}
			
			// Создаем FormData для отправки файла
			const formData = new FormData()
			formData.append('name', product.name)
			formData.append('description', product.description)
			formData.append('price', product.price)
			formData.append('weight', product.weight)
			formData.append('article', product.article)
			formData.append('categoryId', product.category)
			formData.append('typeId', product.type)
			formData.append('inStock', product.inStock.toString())
			formData.append('order', product.order)
			
			// Добавляем изображение только если оно выбрано
			if (product.img) {
				formData.append('img', product.img)
			}
			
			// Отправляем запрос в зависимости от типа операции
			if (type === 'create') {
				await products.createProduct(formData)
				if (showNotification) {
					showNotification('Товар успешно добавлен', 'success')
				}
			} else if (type === 'edit') {
				await products.updateProduct(productData.id, formData)
				if (showNotification) {
					showNotification('Товар успешно обновлен', 'success')
				}
			}
			
			closeModal()
		} catch (error) {
			console.error(`Error ${type === 'create' ? 'creating' : 'updating'} product:`, error)
			
			// Детальная обработка ошибок
			let errorMessage = ''
			
			if (error.response?.status === 401) {
				errorMessage = 'Сессия истекла. Пожалуйста, войдите в систему заново.'
			} else if (error.response?.status === 403) {
				errorMessage = 'Недостаточно прав для выполнения операции'
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message
			} else if (error.message) {
				errorMessage = error.message
			} else {
				errorMessage = `Ошибка при ${type === 'create' ? 'создании' : 'обновлении'} товара`
			}
			
			setError(errorMessage)
			
			// Показываем уведомление об ошибке
			if (showNotification) {
				showNotification(errorMessage, 'error')
			}
			
			// НЕ закрываем модальное окно при ошибке, чтобы пользователь мог исправить данные
			// closeModal()
		} finally {
			setIsSubmitting(false)
		}
	}

  return (
    <Modal
	className={className}
	isOpen={isModalOpen}
	onClose={closeModal}
	title={type === 'create' ? 'Добавить товар' : 'Редактировать товар'}
	type="white"
	backDropClick={false}
	>
		<form className={styles['admin-page__content-add-product-modal-form']} onSubmit={handleSubmit}>

			<div className={styles['admin-page__content-add-product-modal-form-scroll-wrapper']}>
				<div className={styles['admin-page__content-add-product-modal-form-left-side']}>
					{/* Название товара */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label htmlFor="name">Название товара</label>
						<Input 
							id="name"
							name="name"
							type="text"
							value={product.name}
							onChange={handleInputChange}
							placeholder="Введите название товара"
						/>
					</div>

					{/* Описание */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label htmlFor="description">Описание</label>
						<Textarea 
							id="description"
							name="description"
							value={product.description}
							onChange={handleInputChange}
							placeholder="Введите описание товара"
							rows={4}
							maxLength={100}
						/>
					</div>

					{/* Цена */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label htmlFor="price">Цена</label>
						<Input 
							id="price"
							name="price"
							type="number"
							value={product.price}
							onChange={handleInputChange}
							placeholder="Введите цену товара"
						/>
					</div>

					{/* Вес */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label htmlFor="weight">Вес</label>
						<Input 
							id="weight"
							name="weight"
							type="number"
							value={product.weight}
							onChange={handleInputChange}
							placeholder="Введите вес товара"
						/>
					</div>

					{/* Артикул для Frontpad */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label htmlFor="article">Артикул для Frontpad</label>
						<Input 
							id="article"
							name="article"
							type="number"
							value={product.article}
							onChange={handleInputChange}
							placeholder="Введите артикул товара"
						/>
					</div>

					{/* Категория */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label>Категория</label>
						<Dropdown 
							options={categoryOptions}
							value={product.category}
							onChange={(value) => handleDropdownChange('category', value)}
							placeholder="Выберите категорию"
							disabled={categoryOptions.length === 0}
						/>
					</div>

					{/* Тип */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label>Тип</label>
						<Dropdown 
							options={typeOptions}
							value={product.type}
							onChange={(value) => handleDropdownChange('type', value)}
							placeholder="Выберите тип"
							disabled={typeOptions.length === 0}
						/>
					</div>

					{/* Порядок сортировки в "Рекомендуемые" */}
					<div className={styles['admin-page__content-add-product-modal-form-item']}>
						<label htmlFor="order">Порядок сортировки в "Рекомендуемые"</label>
						<Input 
							id="order"
							name="order"
							type="number"
							value={product.order}
							onChange={handleInputChange}
							placeholder="Введите порядок товара"
						/>
					</div>

					{/* В наличии */}
					<div className={`${styles['admin-page__content-add-product-modal-form-item']} ${styles['in-stock-input']}`}>
						<label htmlFor="inStock">В наличии</label>
						<Input 
							id="inStock"
							name="inStock"
							type="checkbox"
							checked={product.inStock}
							onChange={(e) => setProduct(prev => ({
								...prev,
								inStock: e.target.checked
							}))}
						/>
					</div>
				</div>

				<div className={styles['admin-page__content-add-product-modal-form-right-side']}>
					{/* Изображение */}
					<div className={`${styles['admin-page__content-add-product-modal-form-item']} ${styles['image-input']}`}>
						<label htmlFor="img">Изображение</label>

						{/* Предварительный просмотр изображения */}
						<div className={styles['admin-page__content-add-product-modal-form-image-preview']}>
							<img 
								src={imagePreview || Plug} 
								alt="Предварительный просмотр" 
								className={styles['admin-page__content-add-product-modal-form-preview-img']}
							/>
						</div>

						{/* Кастомный интерфейс выбора файла */}
						<div className={styles['admin-page__content-add-product-modal-form-file-input-wrapper']}>
							<Input 
								id="img"
								name="img"
								type="file"
								onChange={handleInputChange}
								accept="image/*"
								className={styles['admin-page__content-add-product-modal-form-hidden-input']}
							/>
							<label 
								htmlFor="img" 
								className={styles['admin-page__content-add-product-modal-form-file-label']}
							>
								{imagePreview ? 'Изменить изображение' : 'Выбрать изображение'}
							</label>
						</div>
					</div>
				</div>
			</div>

			{/* Отображение ошибки */}
			{error && (
				<div className={styles['admin-page__content-add-product-modal-form-error']}>
					{error}
				</div>
			)}

			{/* Кнопка добавить/изменить */}
			<div className={styles['admin-page__content-add-product-modal-form-button']}>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting 
						? (type === 'create' ? 'Добавление...' : 'Обновление...') 
						: (type === 'create' ? 'Добавить' : 'Изменить')
					}
				</Button>
			</div>

		</form>

	</Modal>
  )
}

export default CreateEditProduct