import React from 'react'
import desktopBannerPlug from '../../assets/images/desktop_banner--plug.webp'
import mobileBannerPlug from '../../assets/images/mobile_banner--plug.webp'
import { getImageUrl } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'

const BannerSlide = ({ banner }) => {
  const { width } = useWindowSize()

  // Для баннеров используем прямую загрузку без lazy loading
  const desktopImageSrc = getImageUrl(banner.imgDesktop) || desktopBannerPlug
  const mobileImageSrc = getImageUrl(banner.imgMobile) || mobileBannerPlug

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
