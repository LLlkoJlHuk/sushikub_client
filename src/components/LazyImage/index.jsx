import React, { useEffect, useRef, useState } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  placeholder, 
  className = '', 
  threshold = 0.1,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [threshold])

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

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
      loading="lazy"
      {...props}
    />
  )
}

export default LazyImage
