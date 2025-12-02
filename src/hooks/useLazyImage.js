import { useEffect, useState } from 'react'

/**
 * Хук для lazy loading изображений с заглушкой
 * @param {string} src - URL изображения для загрузки
 * @param {string} placeholder - URL заглушки
 * @returns {Object} - объект с состояниями загрузки
 */
export const useLazyImage = (src, placeholder) => {
	const [imageSrc, setImageSrc] = useState(placeholder)
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		if (!src) {
			setImageSrc(placeholder)
			setIsLoading(false)
			setHasError(false)
			return
		}

		// Сбрасываем состояние при изменении src
		setImageSrc(placeholder)
		setIsLoading(true)
		setHasError(false)

		const maxRetries = 2
		let timeoutId = null
		let currentImg = null
		let currentHandlers = null
		let isMounted = true

		const cleanupImage = () => {
			if (currentImg && currentHandlers) {
				currentImg.removeEventListener('load', currentHandlers.handleLoad)
				currentImg.removeEventListener('error', currentHandlers.handleError)
				currentImg.src = ''
				currentImg = null
				currentHandlers = null
			}
		}

		const loadImage = (imageSrc, retry = 0) => {
			if (!isMounted) return

			// Очищаем предыдущее изображение перед созданием нового
			cleanupImage()

			currentImg = new Image()

			const handleLoad = () => {
				if (!isMounted || !currentImg) return
				setImageSrc(imageSrc)
				setIsLoading(false)
				setHasError(false)
				if (timeoutId) {
					clearTimeout(timeoutId)
					timeoutId = null
				}
			}

			const handleError = () => {
				if (!isMounted) return
				// Повторяем попытку загрузки на проде, если изображение еще не доступно
				if (retry < maxRetries) {
					timeoutId = setTimeout(() => {
						if (isMounted) {
							loadImage(imageSrc, retry + 1)
						}
					}, 500 * (retry + 1)) // Увеличиваем задержку с каждой попыткой
				} else {
					setImageSrc(placeholder)
					setIsLoading(false)
					setHasError(true)
				}
			}

			// Сохраняем ссылки на обработчики для правильной очистки
			currentHandlers = { handleLoad, handleError }

			currentImg.addEventListener('load', handleLoad)
			currentImg.addEventListener('error', handleError)

			// Добавляем timestamp для обхода кэша при повторной попытке
			const urlWithCacheBust =
				retry > 0
					? `${imageSrc}${
							imageSrc.includes('?') ? '&' : '?'
					  }_retry=${retry}_${Date.now()}`
					: imageSrc

			currentImg.src = urlWithCacheBust
		}

		loadImage(src)

		return () => {
			isMounted = false
			if (timeoutId) {
				clearTimeout(timeoutId)
				timeoutId = null
			}
			cleanupImage()
		}
	}, [src, placeholder])

	return {
		imageSrc,
		isLoading,
		hasError,
	}
}
