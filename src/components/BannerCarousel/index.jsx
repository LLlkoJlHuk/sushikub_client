import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getImageUrl } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'
import { Context } from '../../main'
import './index.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

const BannerCarousel = observer(() => {
	const { banners, settings } = useContext(Context);
	const { width } = useWindowSize();

	const [settingsData, setSettingsData] = useState({
		bannerCarouselInterval: null
	})

	useEffect(() => {
		// Настройки уже загружены в App.jsx при старте приложения
		// Получаем значения напрямую из store
		const bannerCarouselInterval = settings.getSettingValue('BANNER_CAROUSEL_INTERVAL', '')
		
		setSettingsData({ 
			bannerCarouselInterval: bannerCarouselInterval
		})
	}, [settings.settingsObject]) // Реагируем на изменения в настройках

	const { bannerCarouselInterval } = settingsData

	// Мемоизируем настройки пагинации
	const pagination = useMemo(() => ({
		clickable: true,
		renderBullet: function (index, className) {
		  return '<div class="' + className + '">' + '<span>' + (index + 1) + '</span>' + '</div>';
		},
	}), []);

	// Мемоизируем настройки автопрокрутки
	const autoplaySettings = useMemo(() => ({
		delay: bannerCarouselInterval * 1000,
		disableOnInteraction: true,
	}), [bannerCarouselInterval]);

	// Мемоизируем отсортированные баннеры
	const sortedBanners = useMemo(() => {
		return banners.banners
			.slice()
			.sort((a, b) => (a.order || 0) - (b.order || 0))
	}, [banners.banners]);

	return (
		<>
		  <Swiper
			key={banners.banners.length}
			slidesPerView={'auto'}
			centeredSlides={true}
			spaceBetween={30}
			pagination={pagination}
			loop={true}
			autoplay={autoplaySettings}
			modules={[Pagination, Autoplay]}
			className="banner-carousel"
		  >
			{sortedBanners.map((banner) => (
				<SwiperSlide key={banner.id}>
					<a href={banner.link}>
						{width > 768 ? (
							<img 
								src={getImageUrl(banner.imgDesktop)} 
								alt={`Баннер ${banner.order || 'без порядка'}`}
								className="banner-desktop"
							/>
						) : (
							<img 
								src={getImageUrl(banner.imgMobile)} 
								alt={`Баннер ${banner.order || 'без порядка'}`}
								className="banner-mobile"
							/>
						)}
					</a>
				</SwiperSlide>
			))}
		  </Swiper>
		</>
	  );
})

export default BannerCarousel

