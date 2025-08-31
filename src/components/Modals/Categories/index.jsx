import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import Plug from '../../../assets/images/plug.webp'
import { getImageUrl } from '../../../constants'
import { Context } from '../../../main'
import Button from '../../Button'
import CreateEditCategory from '../CreateEditCategory'
import Modal from '../index'
import styles from './index.module.scss'

const Categories = observer(({ isModalOpen, closeModal, showNotification }) => {
	const { products } = useContext(Context)

	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
	const [categoryModalType, setCategoryModalType] = useState('create')
	const [editingCategory, setEditingCategory] = useState(null)

	const handleDeleteCategory = async (categoryId) => {
		if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
			try {
				await products.deleteCategory(categoryId)
				if (showNotification) {
					showNotification('Категория успешно удалена', 'success')
				}
			} catch (error) {
				console.error('Error deleting category:', error)
				if (showNotification) {
					showNotification('Ошибка при удалении категории', 'error')
				}
			}
		}
	}

	const openCategoryModal = (type = 'create', category = null) => {
		setCategoryModalType(type)
		setEditingCategory(category)
		setIsCategoryModalOpen(true)
	}

	const closeCategoryModal = () => {
		setIsCategoryModalOpen(false)
	}

	return (
		<Modal
			className='categories'
			isOpen={isModalOpen}
			onClose={closeModal}
			title='Категории'
			type='white'
		>
			<div className={styles['admin-page__content-categories']}>

				<div className={styles['admin-page__content-categories-scroll-wrapper']}>
					{/* Список категорий */}
					{products.categories && products.categories.length > 0 ? (
						<table className={styles['admin-page__content-categories-table']}>
							<thead className={styles['admin-page__content-categories-header']}>

								{/* Шапка таблицы */}
								<tr>
									<td className={styles['img']} width='120'>Изображение</td>
									<td className={styles['name']} width='200'><span>Название</span></td>
									<td className={styles['order']} width='100'><span>Порядок</span></td>
									<td className={styles['actions']} width='200'></td>
								</tr>
							</thead>
							<tbody>

								{/* Список категорий */}
								{products.categories && products.categories.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((category) => (
									<tr key={category.id}>
										<td><img className={styles['image']} src={getImageUrl(category.preview) || Plug} /></td>
										<td className={styles['name']}><span>{category.name}</span></td>
										<td className={styles['order']}><span>{category.order ? category.order : '-'}</span></td>
										<td className={styles['actions']}>

										{/* Изменить категорию */}
										<Button 
											type='link' 
											className={styles['edit-button']}
											onClick={() => openCategoryModal('edit', category)}
										>
											Изменить
										</Button>

										{/* Удалить категорию */}
										<Button 
											type='link' 
											className={styles['delete-button']}
											onClick={() => handleDeleteCategory(category.id)}
										>
											Удалить
										</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : products.categories ? (
						<div className={styles['admin-page__content-categories-empty']}>
							<p>Загрузка категорий...</p>
						</div>
					) : (
						<div className={styles['admin-page__content-categories-empty']}>
							<p>Загрузка категорий...</p>
						</div>
					)}
				</div>

				<div className={styles['admin-page__content-categories-add']}>
					<Button onClick={() => openCategoryModal('create')}>
						Добавить категорию
					</Button>
				</div>
			</div>

			{isCategoryModalOpen && (
				<CreateEditCategory
					className='add-category'
					isModalOpen={isCategoryModalOpen}
					closeModal={closeCategoryModal}
					showNotification={showNotification}
					type={categoryModalType}
					categoryData={editingCategory}
				/>
			)}
		</Modal>
	)
})

export default Categories