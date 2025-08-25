import { useEffect, useState, useRef } from 'react'

export const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    if (!ref?.current) return

    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, defaultOptions)

    observer.observe(ref.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [ref, options.root, options.rootMargin, options.threshold])

  return isInView
}
