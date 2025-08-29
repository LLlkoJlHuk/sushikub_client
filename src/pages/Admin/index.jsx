import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import Plug from '../../assets/images/plug.webp'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import Banners from '../../components/Modals/Banners'
import Categories from '../../components/Modals/Categories'
import CreateEditProduct from '../../components/Modals/CreateEditProduct'
import Settings from '../../components/Modals/Settings'
import Notification from '../../components/Notification'
import { getImageUrl } from '../../constants'
import { Context } from '../../main'
import styles from './index.module.scss'

const Admin = observer(() => {
  const { users, products, banners } = useContext(Context)
  
  const logout = () => {
    users.logout()
  }

  // Модальное окно добавления баннера
  const [isBannersModalOpen, setIsBannersModalOpen] = useState(false)
  const openBannersModal = () => setIsBannersModalOpen(true)
  const closeBannersModal = () => setIsBannersModalOpen(false)

  // Модальное окно добавления категории
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
	const openCategoryModal = () => setIsCategoryModalOpen(true)
	const closeCategoryModal = () => setIsCategoryModalOpen(false)
	
  // Модальное окно добавления/редактирования товара
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalType, setProductModalType] = useState('create')
  const [editingProduct, setEditingProduct] = useState(null)

  // Модальное окно добавления/редактирования настроек
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const openSettingsModal = () => setIsSettingsModalOpen(true)
  const closeSettingsModal = () => setIsSettingsModalOpen(false)

  const isDevMode = false;
	
	const openProductModal = (type = 'create', product = null) => {
		setProductModalType(type)
		setEditingProduct(product)
		setIsProductModalOpen(true)
	}
	
	const closeProductModal = () => {
		setIsProductModalOpen(false)
		setProductModalType('create')
		setEditingProduct(null)
	}

  // Уведомления
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })

  const showNotification = (message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  // Обработчик удаления товара
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await products.deleteProduct(productId)
        showNotification('Товар успешно удален', 'success')
      } catch (error) {
        console.error('Error deleting product:', error)
        showNotification('Ошибка при удалении товара', 'error')
      }
    }
  }

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        await products.fetchProducts()
        await products.fetchCategories()
        await products.fetchTypes()
        await banners.fetchBanners()
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    // Загружаем данные только один раз при монтировании
    loadData()
  }, []) // Пустой массив зависимостей

  if (!products?.products || !products?.categories || !products?.types || !banners?.banners) {
    return <Loading />
  }

  // Отображаем ошибки из store
  if (products?.error) {
    return (
      <div className={styles['admin-page__error']}>
        <h2>Ошибка</h2>
        <p>{products.error}</p>
      </div>
    )
  }

  return (
    <>
      <div className={styles['admin-page']}>

        <div className='container'>
          {/* Хэдер */}
          <div className={styles['admin-page__header']}>
            <Button 
              onClick={() => {
                logout()
              }}
              type='link'
              href='/'
            >
              Выйти
            </Button>
          </div>

          {/* Контент */}
          <div className={styles['admin-page__content']}>
            <div className={styles['admin-page__content-add-product-container']}>
              <h2>Товары</h2>

              <div className={styles['admin-page__content-add-product-buttons']}>

                {/* Добавить товар */}
                <div className={styles['admin-page__content-add-product']}>
                  <Button onClick={() => openProductModal('create')} className={styles['add-product']}>
                    Добавить товар
                  </Button>

                  {/* Модальное окно добавления/редактирования товара */}
                  <CreateEditProduct
                    className='add-product'
                    isModalOpen={isProductModalOpen}
                    closeModal={closeProductModal}
                    categories={products.categories || []}
                    types={products.types || []}
                    showNotification={showNotification}
                    type={productModalType}
                    productData={editingProduct}
                  />
                </div>

                {/* Редактировать баннер */}
                {isDevMode && (
                  <div className={styles['admin-page__content-add-product-category']}>
                    <Button onClick={openBannersModal} className={styles['banners']}>
                      Баннеры
                    </Button>

                    {/* Модальное окно редактирования баннеров */}
                    <Banners
                      className='banners'
                      isModalOpen={isBannersModalOpen}
                      closeModal={closeBannersModal}
                      showNotification={showNotification}
                    />
                  </div>
                )}

                {/* Категории */}
                {isDevMode && (
                  <div className={styles['admin-page__content-add-product-category']}>
                    <Button onClick={openCategoryModal} className={styles['categories']}>
                      Категории
                    </Button>

                    {/* Модальное окно добавления категории */}
                    <Categories
                      className='categories'
                      isModalOpen={isCategoryModalOpen}
                      closeModal={closeCategoryModal}
                      showNotification={showNotification}
                    />
                  </div>
                )}

                {/* Настройки */}
                <div className={styles['admin-page__content-add-product-category']}>
                  <Button onClick={openSettingsModal} className={styles['settings']}>
                    Настройки
                  </Button>

                  {/* Модальное окно настроек */}
                  <Settings
                    className='settings'
                    isModalOpen={isSettingsModalOpen}
                    closeModal={closeSettingsModal}
                    showNotification={showNotification}
                  />
                </div>
              </div>
            </div>

            {/* Товары */}
            <div className={styles['admin-page__content-products']}>

              <table className={styles['admin-page__content-products-table']}>
                <thead className={styles['admin-page__content-products-header']}>

                  {/* Шапка таблицы */}
                  <tr>
                    <td className={styles['image']} width='80'></td>
                    <td className={styles['name']} width='120'><span>Название</span></td>
                    <td className={styles['description']} width='300'><span>Описание</span></td>
                    <td className={styles['price']} width='100'><span>Цена</span></td>
                    <td className={styles['article']} width='100'><span>Артикул</span></td>
                    <td className={styles['weight']} width='100'><span>Вес</span></td>
                    <td className={styles['inStock']} width='100'><span>В наличии</span></td>
                    <td className={styles['order']} width='100'><span>Порядок</span></td>
                    <td className={styles['category']} width='120'><span>Категория</span></td>
                    <td className={styles['type']} width='100'><span>Тип</span></td>
                    <td className={styles['actions']} width='120'></td>
                  </tr>
                </thead>
                <tbody>

                  {/* Список товаров */}
                  {products.products && products.products.length > 0 ? (
                    products.products.slice().sort((a, b) => a.name.localeCompare(b.name, 'ru')).map((product) => (
                      <tr key={product.id}>
                        <td><img className={styles['image']} src={getImageUrl(product.img) || Plug} alt={product.name} /></td>
                        <td className={styles['name']}><span>{product.name}</span></td>
                        <td className={styles['description']}><span>{product.description}</span></td>
                        <td className={styles['price']}><span>{product.price}</span></td>
                        <td className={styles['article']}><span>{product.article}</span></td>
                        <td className={styles['weight']}><span>{product.weight}</span></td>
                        <td className={styles['inStock']}><span>{product.inStock ? 'Да' : 'Нет'}</span></td>
                        <td className={styles['order']}><span>{product.order ? product.order : '-'}</span></td>
                        <td className={styles['category']}><span>{product.category?.name}</span></td>
                        <td className={styles['type']}><span>{product.type?.name}</span></td>
                        <td className={styles['actions']}>

                          {/* Изменить товар */}
                          <Button 
                            type='link' 
                            className={styles['edit-button']}
                            onClick={() => openProductModal('edit', product)}
                          >
                            Изменить
                          </Button>

                          {/* Удалить товар */}
                          <Button 
                            type='link' 
                            className={styles['delete-button']}
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                        Нет товаров для отображения
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        autoClose={notification.type === 'success'}
        duration={2000}
      />
    </>
  )
})

export default Admin;