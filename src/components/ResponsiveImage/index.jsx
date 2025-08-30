import React, { forwardRef, useMemo } from 'react'
import { createResponsiveImage } from '../../utils/imageUtils'

/**
 * Компонент адаптивного изображения с поддержкой srcset и sizes
 * @param {Object} props - пропсы компонента
 * @param {string} props.src - путь к изображению
 * @param {string} props.type - тип изображения (PRODUCT_CARD, MENU_CARD, etc.)
 * @param {string} props.alt - альтернативный текст
 * @param {string} props.title - заголовок для SEO
 * @param {string} props.placeholder - заглушка при загрузке
 * @param {string} props.className - CSS класс
 * @param {boolean} props.lazy - включить lazy loading
 * @param {Object} props.style - inline стили
 * @param {Function} props.onLoad - обработчик загрузки
 * @param {Function} props.onError - обработчик ошибки
 * @returns {JSX.Element}
 */
const ResponsiveImage = forwardRef(({
  src,
  type,
  alt = '',
  title = '',
  placeholder,
  className = '',
  lazy = true,
  style = {},
  onLoad,
  onError,
  ...otherProps
}, ref) => {
  // Создаем адаптивные параметры изображения
  const responsiveProps = useMemo(() => {
    if (!src || !type) {
      return {
        src: placeholder || src,
        srcSet: '',
        sizes: ''
      }
    }
    
    return createResponsiveImage(src, type)
  }, [src, type, placeholder])

  // Обработчик ошибки загрузки
  const handleError = (e) => {
    if (placeholder && e.target.src !== placeholder) {
      e.target.src = placeholder
    }
    if (onError) {
      onError(e)
    }
  }

  return (
    <img
      ref={ref}
      src={responsiveProps.src}
      srcSet={responsiveProps.srcset}
      sizes={responsiveProps.sizes}
      alt={alt}
      title={title}
      className={className}
      style={style}
      loading={lazy ? 'lazy' : 'eager'}
      onLoad={onLoad}
      onError={handleError}
      {...otherProps}
    />
  )
})

ResponsiveImage.displayName = 'ResponsiveImage'

export default ResponsiveImage
