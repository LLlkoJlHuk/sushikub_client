import React from 'react'
import desktopBannerPlug from '../../assets/images/desktop_banner--plug.webp'
import mobileBannerPlug from '../../assets/images/mobile_banner--plug.webp'
import { getImageUrl } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'
import OptimizedImage from '../OptimizedImage'

const BannerSlide = ({ banner }) => {
  const { width } = useWindowSize()

  return (
    <a href={banner.link} style={{ display: 'block', width: '100%' }}>
      {width > 768 ? (
        <div style={{ 
          width: '100%', 
          height: '400px', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <OptimizedImage 
            src={getImageUrl(banner.imgDesktop)}
            placeholder={desktopBannerPlug}
            alt={`Баннер ${banner.order || 'без порядка'}`}
            className="banner-desktop"
            priority={true}
            sizes="(max-width: 768px) 100vw, 80vw"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '200px', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <OptimizedImage 
            src={getImageUrl(banner.imgMobile)}
            placeholder={mobileBannerPlug}
            alt={`Баннер ${banner.order || 'без порядка'}`}
            className="banner-mobile"
            priority={true}
            sizes="100vw"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      )}
    </a>
  )
}

export default BannerSlide
