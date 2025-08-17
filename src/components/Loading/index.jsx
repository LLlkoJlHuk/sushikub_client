import React from 'react'
import styles from './index.module.scss'

const Loading = () => {
  return (
    <div className={styles['loading']}>
      <div className={styles['loading__spinner']}></div>
      <div className={styles['loading__text']}>Загрузка...</div>
    </div>
  )
}

export default Loading 