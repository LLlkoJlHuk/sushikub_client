import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Notification from '../../components/Notification'
import { ADMIN_ROUTE } from '../../constants'
import { Context } from '../../main'
import styles from './index.module.scss'

const Auth = observer(() => {
  const navigate = useNavigate()
  const { users } = useContext(Context)
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  
  // Состояние для уведомлений
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })

  const showNotification = (message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  const signIn = async (loginValue, password) => {
    try {
      // Валидация
      if (!loginValue.trim()) {
        showNotification('Введите логин', 'error')
        return
      }
      
      if (!password.trim()) {
        showNotification('Введите пароль', 'error')
        return
      }

      await users.login(loginValue, password, remember)
      
      // Немедленный переход на страницу админки
      navigate(ADMIN_ROUTE)
      
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message)
      
      // Обработка различных типов ошибок
      let errorMessage = 'Ошибка при авторизации'
      
      if (error.response?.data?.message) {
        // Если есть сообщение от сервера, используем его
        errorMessage = error.response.data.message
      } else if (error.response?.status === 401) {
        errorMessage = 'Неверный логин или пароль'
      } else if (error.response?.status === 400) {
        errorMessage = 'Неверные данные для входа'
      } else if (error.response?.status === 500) {
        errorMessage = 'Ошибка сервера. Попробуйте позже'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showNotification(errorMessage, 'error')
    }
  }

  return (
    <>
      <div className={styles['auth']}>
        <div className={styles['auth__content']}>
          <Input 
            id="login" 
            placeholder="Введите логин" 
            type='text' 
            isRequired 
            className={styles['auth__input']} 
            value={loginValue} 
            onChange={e => {
              setLoginValue(e.target.value)
            }} 
          />
          <Input 
            id="password" 
            placeholder="Введите пароль" 
            type='password' 
            isRequired 
            className={styles['auth__input']} 
            value={password} 
            onChange={e => {
              setPassword(e.target.value)
            }} 
          />
          
          <div className={styles['auth__buttons']}>
            <div className={styles['auth__remember']}>
              <Input id="remember" type='checkbox' checked={remember} onChange={e => setRemember(e.target.checked)}/>
              <label htmlFor="remember">Запомнить меня</label>
            </div>
            <Button type='submit' onClick={() => signIn(loginValue, password)} disabled={users.isLoading}>
              {users.isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </div>
        </div>
      </div>

      {/* Уведомления */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        autoClose={notification.type === 'success'}
        duration={3000}
      />
    </>
  )
})

export default Auth;