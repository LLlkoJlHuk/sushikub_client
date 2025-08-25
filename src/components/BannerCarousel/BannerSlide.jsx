import React from 'react'
import desktopBannerPlug from '../../assets/images/desktop_banner--plug.webp'
import mobileBannerPlug from '../../assets/images/mobile_banner--plug.webp'
import { getImageUrl } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'
import OptimizedImage from '../OptimizedImage'

const BannerSlide = ({ banner }) => {
  const { width } = useWindowSize()

  return (
    <a href={banner.link}>
      {width > 768 ? (
        <OptimizedImage 
          src={getImageUrl(banner.imgDesktop)}
          placeholder={desktopBannerPlug}
          alt={`Баннер ${banner.order || 'без порядка'}`}
          className="banner-desktop"
          priority={true}
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      ) : (
        <OptimizedImage 
          src={getImageUrl(banner.imgMobile)}
          placeholder={mobileBannerPlug}
          alt={`Баннер ${banner.order || 'без порядка'}`}
          className="banner-mobile"
          priority={true}
          sizes="100vw"
        />
      )}
    </a>
  )
}

export default BannerSlide
