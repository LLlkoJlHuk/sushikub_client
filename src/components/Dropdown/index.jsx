import { useEffect, useRef, useState } from 'react'
import Arrow from '../../assets/images/icon-arrow.webp'
import styles from './index.module.scss'

function Dropdown({
  options = [],
  value = '',
  onChange,
  placeholder = 'Выберите опцию',
  disabled = false,
  className = '',
  type = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const selectedOption = options.find(option => option.value === value)

  return (
    <div 
      ref={dropdownRef}
      className={`${styles.dropdown} ${className} ${disabled ? styles.disabled : ''} ${type ? styles[type] : ''} ${isOpen ? styles['open'] : ''}`}
    >
      <div 
        className={styles.dropdownHeader}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={styles.dropdownValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`${styles.dropdownArrow} ${isOpen ? styles.open : ''}`}>
          <img src={Arrow} alt="arrow" />
        </span>
      </div>
      
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map((option, index) => (
            <div
              key={index}
              className={`${styles.dropdownItem} ${value === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
