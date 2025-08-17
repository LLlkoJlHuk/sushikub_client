import React, { useMemo } from 'react'
import { useWindowSize } from '../../hooks/useWindowSize'
import ProductCard from '../ProductCard'
import './index.scss'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'

// import required modules
import { Navigation } from 'swiper/modules'

const ProductCarousel = React.memo(function ProductCarousel({
	filteredAndSortedProducts,
}) {
	const { width } = useWindowSize()

	// Мемоизируем вычисление slidesPerView для избежания пересчетов
	const slidesPerView = useMemo(() => {
		if (width > 1500) return 5
		if (width > 1200) return 4
		if (width > 940) return 3
		return 2
	}, [width])

	// Мемоизируем настройки Swiper для избежания пересоздания объекта
	const swiperSettings = useMemo(() => ({
		slidesPerView,
		spaceBetween: 40,
		navigation: true,
		modules: [Navigation],
		className: 'product-carousel__swiper'
	}), [slidesPerView])

	return (
		<div className='product-carousel'>
			{width > 768 ? (
			<Swiper {...swiperSettings}>
				{filteredAndSortedProducts.map((product) => (
					<SwiperSlide key={product.id}>
						<ProductCard
							product={product}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		) : (
			<>
				{filteredAndSortedProducts.map((product) => (
					<ProductCard 
						key={product.id} 
						product={product}
					/>
				))}
			</>
		)}
		</div>
	)
})

export default ProductCarousel;