import React, { useEffect, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'

const OptimizedImage = ({ 
  src, 
  alt, 
  placeholder, 
  className = '', 
  priority = false,
  sizes = '100vw',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)
  const isInView = useInView(imgRef, { threshold: 0.1 })

  useEffect(() => {
    if (!src || !isInView) return

    setIsLoading(true)
    setHasError(false)

    const img = new Image()
    
    const handleLoad = () => {
      setImageSrc(src)
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = () => {
      setImageSrc(placeholder || '')
      setIsLoading(false)
      setHasError(true)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    
    img.src = src

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src, placeholder, isInView])

  // Предзагрузка для приоритетных изображений
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [priority, src])

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      {...props}
    />
  )
}

export default OptimizedImage
