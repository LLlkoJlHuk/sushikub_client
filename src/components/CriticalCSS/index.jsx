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
        
        /* Анимации для плавного появления */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `
    }} />
  )
}

export default CriticalCSS
