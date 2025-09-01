import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Context } from '../../main'
import Loading from '../Loading'
import BannerSlide from './BannerSlide'
import './index.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

const BannerCarousel = observer(() => {
	const { banners, settings } = useContext(Context);

	const [settingsData, setSettingsData] = useState({
		bannerCarouselInterval: null
	})

	useEffect(() => {
		const bannerCarouselInterval = settings.getSettingValue('BANNER_CAROUSEL_INTERVAL', '')
		
		setSettingsData({ 
			bannerCarouselInterval: bannerCarouselInterval
		})
	}, [settings, settings.settingsObject])

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

	// Показываем Loading если данные загружаются
	if (banners.isLoading) {
		return <Loading />
	}

	// Показываем пустое состояние если нет баннеров
	if (sortedBanners.length === 0) {
		return null
	}

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
					<BannerSlide banner={banner} />
				</SwiperSlide>
			))}
		  </Swiper>
		</>
	  );
})

export default BannerCarousel

