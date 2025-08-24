import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import BannerCarousel from '../../components/BannerCarousel'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import MenuCard from '../../components/MenuCard'
import Notice from '../../components/Notice'
import ProductCarousel from '../../components/ProductCarousel'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'

const Main = observer(() => {
  const { products, settings } = useContext(Context);
  const categories = products.categories;
  const productsList = products.products;

	const [settingsData, setSettingsData] = useState({
		globalMessage: ''
	})

	useEffect(() => {
		// Настройки уже загружены в App.jsx при старте приложения
		// Получаем значения напрямую из store
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		
		setSettingsData({ 
			globalMessage: globalMessage
		})
	}, [settings, settings.settingsObject]) // Реагируем на изменения в настройках

	const { globalMessage } = settingsData

  // Состояние видимости хедера
  const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
  const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');

	// Мемоизируем фильтрацию и сортировку продуктов
	const filteredAndSortedProducts = useMemo(() => {
		return productsList
			.filter(product => product.typeId === 2 && product.inStock === true)
			.sort((a, b) => (b.order || 0) - (a.order || 0))
	}, [productsList]);

	// Мемоизируем отсортированные категории
	const sortedCategories = useMemo(() => {
		if (!categories || categories.length === 0) return [];
		return categories.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
	}, [categories]);

  return (
    <>
      {/* Главная страница */}
      <div className={`page ${styles['main-page']}`}>

        {/* Секция с хедером и каруселью */}
        <section 
          className={`section section-with-header custom-bg border-bottom ${isScrolled ? 'header-visible' : ''} ${styles['section__1']}`}
        >
          {/* Header */}
          <Header isScrolled={isScrolled} isTimedOut={isTimedOut} isScrolledBack={isScrolledBack} isTimedOutBack={isTimedOutBack} />

          {/* Banner Carousel */}
          <BannerCarousel />
        </section>


        {/* Уведомления */}
        {globalMessage && (
          <section className={`section ${styles['section-notice']}`}>
            <div className={`${styles['container']} container`}>
              {/* Уведомление о возможности расчета наличными, онлайн на сайте и бонусами */}
                <Notice type='info'>
                  {globalMessage}
                </Notice>
            </div>
          </section>
        )}


        {/* Секция с продуктами */}
        {filteredAndSortedProducts.length > 0 && (
          <section className={`section`}>

            {/* Контейнер - ограничение ширины */}
            <div className='container'>
              
              {/* Рекомендуемые продукты */}
              <h2 className='section__title'>Рекомендуем</h2>
              <ProductCarousel filteredAndSortedProducts={filteredAndSortedProducts} />
            </div>
          </section>
        )}



        {/* Секция с меню */}
        <section className={`section ${styles['section__3']}`}>
          <div className='container'>
            <h2 className='section__title'>Меню</h2>

            {/* Меню */}
            <div className={styles['menu-cards']}>
              {sortedCategories.map((category => (
                  <MenuCard 
                    key={category.id} 
                    id={category.id} 
                    img={category.preview} 
                    name={category.name}
                  />
              )))}
            </div>
          </div>
        </section>



        <section className={`section custom-bg border-top`}>

          {/* Контейнер - ограничение ширины */}
          <div className='container'>
            {/* Footer */}
            <Footer />
          </div>
        </section>
      </div>
    </>
  )
})

export default Main;