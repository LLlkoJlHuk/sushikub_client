import React from 'react'

const CriticalCSS = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Критические стили для FCP */
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .section {
          width: 100%;
        }
        
        .section-with-header {
          position: relative;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .custom-bg {
          background-color: #f8f9fa;
        }
        
        .border-bottom {
          border-bottom: 1px solid #e9ecef;
        }
        
        .border-top {
          border-top: 1px solid #e9ecef;
        }
        
        .section__title {
          font-size: 2rem;
          font-weight: 600;
          text-align: center;
          margin: 2rem 0;
          color: #333;
        }
        
        .menu-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }
        
        .loading-placeholder {
          text-align: center;
          padding: 2rem;
          color: #666;
          font-size: 1.1rem;
        }
        
        /* Fallback для баннеров */
        .banner-carousel-fallback {
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          border-radius: 12px;
          margin: 2rem 0;
        }
        
        .banner-carousel-fallback__content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .banner-carousel-fallback__content p {
          font-size: 1.2rem;
          margin: 0;
          opacity: 0.9;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
      `
    }} />
  )
}

export default CriticalCSS
