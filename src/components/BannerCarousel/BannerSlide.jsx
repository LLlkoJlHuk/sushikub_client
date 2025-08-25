import React from 'react'
import desktopBannerPlug from '../../assets/images/desktop_banner--plug.webp'
import mobileBannerPlug from '../../assets/images/mobile_banner--plug.webp'
import { getImageUrl } from '../../constants'
import { useLazyImage } from '../../hooks/useLazyImage'
import { useWindowSize } from '../../hooks/useWindowSize'

const BannerSlide = ({ banner }) => {
  const { width } = useWindowSize()

  // Lazy loading для десктопного изображения
  const { imageSrc: desktopImageSrc } = useLazyImage(
    getImageUrl(banner.imgDesktop),
    desktopBannerPlug
  )

  // Lazy loading для мобильного изображения
  const { imageSrc: mobileImageSrc } = useLazyImage(
    getImageUrl(banner.imgMobile),
    mobileBannerPlug
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
