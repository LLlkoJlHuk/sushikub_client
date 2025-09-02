import { useEffect } from 'react'

/**
 * Компонент для управления SEO метаданными страниц
 */
const SEOHead = ({ 
  title = "КУБ - Доставка суши и роллов в Красноярске",
  description = "🍣 Вкусные роллы и суши в Красноярске! Заказать еду с доставкой с Суши КУБ. Доставка роллов, суши, салатов и горячих блюд японской кухни.",
  keywords = "суши, роллы, доставка суши, заказать суши, японская кухня, КУБ, Красноярск",
  ogTitle,
  ogDescription,
  ogImage = "https://sushikub.ru/logo.webp",
  canonical,
  noindex = false
}) => {
  useEffect(() => {
    // Обновляем title страницы
    document.title = title

    // Обновляем мета-теги
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name'
      let tag = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (tag) {
        tag.setAttribute('content', content)
      } else {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, name)
        tag.setAttribute('content', content)
        document.head.appendChild(tag)
      }
    }

    // Основные SEO теги
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // Canonical URL
    if (canonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]')
      if (canonicalTag) {
        canonicalTag.setAttribute('href', canonical)
      } else {
        canonicalTag = document.createElement('link')
        canonicalTag.setAttribute('rel', 'canonical')
        canonicalTag.setAttribute('href', canonical)
        document.head.appendChild(canonicalTag)
      }
    }

  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, noindex])

  return null
}

export default SEOHead
