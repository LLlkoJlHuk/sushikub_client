import React from 'react'
import desktopBannerPlug from '../../assets/images/desktop_banner--plug.webp'
import mobileBannerPlug from '../../assets/images/mobile_banner--plug.webp'
import { useLazyImage } from '../../hooks/useLazyImage'
import { useWindowSize } from '../../hooks/useWindowSize'

const BannerSlide = ({ banner }) => {
  const { width } = useWindowSize()

  // Lazy loading для десктопного изображения с адаптивными размерами
  const { imageSrc: desktopImageSrc } = useLazyImage(
    banner.imgDesktop,
    desktopBannerPlug,
    { 
      enableCache: true,
      imageType: 'BANNER'
    }
  )

  // Lazy loading для мобильного изображения с адаптивными размерами
  const { imageSrc: mobileImageSrc } = useLazyImage(
    banner.imgMobile,
    mobileBannerPlug,
    { 
      enableCache: true,
      imageType: 'BANNER'
    }
  )

  return (
    <a href={banner.link}>
      {width > 768 ? (
        <img 
          src={desktopImageSrc} 
          alt={`Баннер ${banner.order || 'без порядка'}`}
          className="banner-desktop"
        />
      ) : (
        <img 
          src={mobileImageSrc} 
          alt={`Баннер ${banner.order || 'без порядка'}`}
          className="banner-mobile"
        />
      )}
    </a>
  )
}

export default BannerSlide
