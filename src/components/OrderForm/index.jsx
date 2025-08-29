import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CSSTransition } from 'react-transition-group'
import { BRANCHES, CART_ROUTE, POLICY_ROUTE, USER_AGREEMENT_ROUTE } from '../../constants'
import { useDeliveryTimePicker } from '../../hooks/useDeliveryTimePicker'
import { sendOrderToFrontpad } from '../../http/frontpadApi'
import { Context } from '../../main'
import Button from '../Button'
import DeliveryTimePicker from '../DeliveryTimePicker'
import Dropdown from '../Dropdown'
import Input, { Textarea } from '../Input'
import Notification from '../Notification'
import Switch from '../Switch'
import styles from './index.module.scss'

/** 
 * Компонент формы заказа с валидацией и масками
 */
const OrderForm = ({ order, onOrderChange, onSwitchChange, hasOrderAmountErrors = false, onOrderSuccess }) => {
  const { settings, basket } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		minOrderPriceForDelivery: null,
		deliveryDiscount: null,
		maxCommentLength: null
	})

	useEffect(() => {
		const minOrderPriceForDelivery = settings.getSettingValue('MIN_ORDER_PRICE_FOR_DELIVERY', '')
		const deliveryDiscount = settings.getSettingValue('DELIVERY_DISCOUNT', '')
		const maxCommentLength = settings.getSettingValue('MAX_COMMENT_LENGTH', '')
		
		setSettingsData({ 
			minOrderPriceForDelivery: minOrderPriceForDelivery,
			deliveryDiscount: deliveryDiscount,
			maxCommentLength: maxCommentLength
		})
	}, [settings.settingsObject]) 

	const { minOrderPriceForDelivery, deliveryDiscount, maxCommentLength } = settingsData
  const deliveryFieldsRef = useRef(null)
  const pickupFieldsRef = useRef(null)
  
  const {
    selectedDeliveryTime,
    showDeliveryTimePicker,
    pickerPosition,
    calculatePickerPosition,
    handleShowPicker,
    handleDeliveryTimeSelect,
    handleOutsideClick,
    resetPicker,
    setShowDeliveryTimePicker
  } = useDeliveryTimePicker()

  // Инициализация React Hook Form
  const {
    control,
    handleSubmit
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: order.name || '',
      phone: order.phone || '',
      street: order.street || '',
      houseNumber: '',
      entrance: '',
      floor: '',
      apartmentNumber: '',
      deliveryBranch: order.deliveryBranch || '',
      comment: order.comment || '',
      dataConsent: false
    }
  })

  // Функция для обновления родительского состояния
  const updateParentState = useCallback((fieldName, value) => {
    onOrderChange(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }, [onOrderChange])

  // Правила валидации - мемоизируем, чтобы избежать пересоздания
  const validationRules = useMemo(() => ({
    name: {
      required: 'Имя обязательно для заполнения',
      minLength: {
        value: 2,
        message: 'Имя некорректно'
      },
      maxLength: {
        value: 50,
        message: 'Имя некорректно'
      },
      pattern: {
        value: /^[а-яёa-z\s-]+$/i,
        message: 'Имя некорректно'
      }
    },
    phone: {
      required: 'Телефон обязателен для заполнения',
      pattern: {
        value: /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
        message: 'Номер телефона некорректный'
      }
    },
    street: {
      required: order.typeIsDelivery ? 'Улица обязательна для заполнения' : false,
      minLength: {
        value: 3,
        message: 'Название улицы некорректно'
      },
      maxLength: {
        value: 100,
        message: 'Название улицы некорректно'
      }
    },
    comment: {
      maxLength: {
        value: maxCommentLength,
        message: `Комментарий не должен превышать ${maxCommentLength} символов`
      }
    },
    dataConsent: {
      required: 'Необходимо согласие на обработку персональных данных'
    }
  }), [order.typeIsDelivery, maxCommentLength])

  // Состояния для отправки заказа
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleDeliveryNowChange = useCallback(() => {
    const newDeliveryNow = !order.deliveryNow
    
    if (newDeliveryNow) {
      resetPicker()
    } else {
      calculatePickerPosition()
      setShowDeliveryTimePicker(true)
    }
    
    onOrderChange(prev => ({
      ...prev,
      deliveryNow: newDeliveryNow,
      time: newDeliveryNow ? '' : prev.time
    }))
  }, [order.deliveryNow, resetPicker, calculatePickerPosition, setShowDeliveryTimePicker, onOrderChange])

  // Обработчик клика вне пикера
  const handleDocumentClick = useCallback((e) => {
    if (showDeliveryTimePicker && !order.deliveryNow) {
      const shouldSwitchBack = handleOutsideClick(e)
      if (shouldSwitchBack) {
        // Переключаем обратно на "На ближайшее время"
        onOrderChange(prev => ({
          ...prev,
          deliveryNow: true,
          time: ''
        }))
      }
    }
  }, [showDeliveryTimePicker, order.deliveryNow, handleOutsideClick, onOrderChange])

  // Обработчик клавиши Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && showDeliveryTimePicker && !order.deliveryNow) {
      // Переключаем обратно на "На ближайшее время"
      onOrderChange(prev => ({
        ...prev,
        deliveryNow: true,
        time: ''
      }))
    }
  }, [showDeliveryTimePicker, order.deliveryNow, onOrderChange])

  // Добавляем обработчики кликов и клавиш
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleDocumentClick, handleKeyDown])

  const handleDeliveryTimeSelectWrapper = useCallback((timeData) => {
    const dateParts = timeData.date.split('-')
    const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`
    
    onOrderChange(prev => ({
      ...prev,
      time: `${formattedDate} ${timeData.time}`
    }))
    
    handleDeliveryTimeSelect(timeData)
  }, [onOrderChange, handleDeliveryTimeSelect])

  // Функция для показа уведомлений
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }, [])



  // Обработчик отправки формы
  const onSubmit = useCallback(async (data) => {
    
    // Проверяем филиал для самовывоза
    if (!order.typeIsDelivery && !order.deliveryBranch) {
      showNotification('Необходимо выбрать филиал для самовывоза', 'error')
      return
    }
    
    // Сброс предыдущих состояний
    setSubmitSuccess(false)
    setIsSubmitting(true)
    
    try {
      // Подготавливаем данные для отправки
      const orderData = {
        // Личные данные
        name: data.name,
        phone: data.phone,
        email: '', // Можно добавить поле email в форму если нужно
        
        // Тип доставки
        typeIsDelivery: order.typeIsDelivery,
        
        // Адрес доставки (только для доставки)
        street: order.typeIsDelivery ? data.street : '',
        houseNumber: order.typeIsDelivery ? data.houseNumber : '',
        entrance: order.typeIsDelivery ? data.entrance : '',
        floor: order.typeIsDelivery ? data.floor : '',
        apartmentNumber: order.typeIsDelivery ? data.apartmentNumber : '',
        
        // Самовывоз (только для самовывоза)
        deliveryBranch: !order.typeIsDelivery ? order.deliveryBranch : '',
        
        // Время доставки
        deliveryNow: order.deliveryNow,
        time: !order.deliveryNow ? order.time : '',
        
        // Комментарий
        comment: data.comment,
        
        // Товары из корзины
        items: basket.items,
        persons: basket.persons
        
        // totalPrice не передаем - Frontpad сам рассчитает сумму на основе товаров
      }
      
      // Отправляем заказ в Frontpad через наш сервер
      const response = await sendOrderToFrontpad(orderData)
      
      if (response.success) {
        setSubmitSuccess(true)
        showNotification(
          `Заказ успешно отправлен! Номер заказа: ${response.frontpadOrderNumber}`, 
          'success'
        )
        
        // Очищаем корзину после успешной отправки
        basket.clearBasket()
        
        // Уведомляем родительский компонент об успешном заказе
        if (onOrderSuccess) {
          onOrderSuccess()
        }
        
      } else {
        showNotification(response.message || 'Ошибка при отправке заказа', 'error')
      }
      
    } catch (error) {
      const errorMessage = error.message || 'Произошла ошибка при отправке заказа'
      showNotification(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }, [order, basket, showNotification])



  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles['order-form']}>
      <div className={styles['order-form__title']}>
        Личные данные
      </div>

      <div className={styles['order-form__content']}>
        {/* Имя */}
        <Input 
          name='name' 
          placeholder='Имя' 
          type='text' 
          control={control}
          rules={validationRules.name}
          onChange={(e) => updateParentState('name', e.target.value)}
        />

        {/* Телефон */}
        <Input 
          name='phone' 
          placeholder='Телефон' 
          type='tel' 
          control={control}
          rules={validationRules.phone}
          mask="+7 (000) 000-00-00"
          inputmode="numeric"
          onChange={(e) => updateParentState('phone', e.target.value)}

        />

        {/* Тип доставки - самовывоз или доставка курьером */}
        <Switch
          isOn={order.typeIsDelivery}
          handleToggle={onSwitchChange}
          className={styles['order-form__switch']}
          option1={
            <>
              Доставка курьером
              <span>Сумма заказа от {minOrderPriceForDelivery} ₽</span>
            </>
          }
          option2={
            <>
              Самовывоз
              <span>Дополнительная скидка {deliveryDiscount}%</span>
            </>
          }
        />

        <CSSTransition
          in={order.typeIsDelivery}
          timeout={300}
          classNames='delivery-fields'
          unmountOnExit
          appear
          nodeRef={deliveryFieldsRef}
        >
          <div className={styles['delivery-fields']} ref={deliveryFieldsRef}>
            {/* Улица */}
            <Input 
              name='street' 
              placeholder='Название улицы' 
              type='text' 
              control={control}
              rules={validationRules.street}
              onChange={(e) => updateParentState('street', e.target.value)}
            />

            <div className={styles['couples']}>
              {/* Номер дома */}
              <Input 
                name='houseNumber' 
                placeholder='Номер дома' 
                type='text' 
                control={control}
                rules={validationRules.houseNumber}
                onChange={(e) => updateParentState('houseNumber', e.target.value)}
              />

              {/* Номер подъезда */}
              <Input 
                name='entrance' 
                placeholder='Номер подъезда' 
                type='text' 
                control={control}
                rules={validationRules.entrance}
                inputmode="numeric"
                onChange={(e) => updateParentState('entrance', e.target.value)}
              />
            </div>

            <div className={styles['couples']}>
              {/* Этаж */}
              <Input 
                name='floor' 
                placeholder='Этаж' 
                type='text' 
                control={control}
                rules={validationRules.floor}
                inputmode="numeric"
                onChange={(e) => updateParentState('floor', e.target.value)}
              />

              {/* Номер квартиры */}
              <Input 
                name='apartmentNumber' 
                placeholder='Номер квартиры' 
                type='text' 
                control={control}
                rules={validationRules.apartmentNumber}
                inputmode="numeric"
                onChange={(e) => updateParentState('apartmentNumber', e.target.value)}
              />
            </div>
          </div>
        </CSSTransition>

        <CSSTransition
          in={!order.typeIsDelivery}
          timeout={300}
          classNames='pickup-fields'
          unmountOnExit
          appear
          nodeRef={pickupFieldsRef}
        >
          <div className={styles['pickup-fields']} ref={pickupFieldsRef}>
            {/* Филиал для самовывоза */}
            <Dropdown
              options={BRANCHES}
              value={order.deliveryBranch || ''}
              onChange={(value) => {
                updateParentState('deliveryBranch', value)
              }}
              placeholder="Выберите филиал"
              type='order-form'
            />

          </div>
        </CSSTransition>

        {/* Тип доставки - сейчас или когда-нибудь */}
        <div className={`${styles['delivery-time-container']} delivery-time-container`}>
          <Switch
            isOn={order.deliveryNow}
            handleToggle={handleDeliveryNowChange}
            className={styles['order-form__switch']}
            option1={
              <>
                На ближайшее время
              </>
            }
            option2={
              <>
                К определенному времени
                {selectedDeliveryTime && (
                  <span 
                    className={styles['selected-time']}
                    onClick={handleShowPicker}
                    style={{ cursor: 'pointer' }}
                  >
                    {selectedDeliveryTime.date} в {selectedDeliveryTime.time}
                  </span>
                )}
              </>
            }
          />
          
          {/* Время доставки - показывается только когда выбрано "К определенному времени" и не выбрано время */}
            {!order.deliveryNow && (showDeliveryTimePicker || !selectedDeliveryTime) && pickerPosition && (
              <DeliveryTimePicker 
                onSelect={handleDeliveryTimeSelectWrapper}
                onClose={() => setShowDeliveryTimePicker(false)}
                className={`${styles['delivery-time-picker']} ${
                  pickerPosition === 'top' ? styles['position-top'] : 
                  pickerPosition === 'right' ? styles['position-right'] : ''
                }`}
                data-position={pickerPosition}
                isVisible={showDeliveryTimePicker || !selectedDeliveryTime}
              />
            )}
            
                         
        </div>

        {/* Комментарий */}
        <Textarea 
          name='comment' 
          placeholder='Примечание к заказу, например, особые пожелания отделу доставки' 
          type='textarea' 
          control={control}
          rules={validationRules.comment}
          maxLength={maxCommentLength}
          onChange={(e) => updateParentState('comment', e.target.value)}
        />

        {/* Согласие на обработку персональных данных */}
        <div className={styles['consent-container']}>
          <Input 
            name='dataConsent' 
            type='checkbox' 
            control={control}
            rules={validationRules.dataConsent}
            className={styles['consent-checkbox']}
          />
          <label htmlFor="dataConsent" className={styles['consent-label']}>
            Согласен на обработку персональных данных согласно&nbsp;
            <a href={POLICY_ROUTE} rel="noopener noreferrer" className={styles['consent-link']}>
              Политике конфиденциальности
            </a> и&nbsp;
            <a href={USER_AGREEMENT_ROUTE} rel="noopener noreferrer" className={styles['consent-link']}>
              Пользовательскому соглашению
            </a>
          </label>
        </div>

        {/* Уведомления */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}



        {/* Успешная отправка */}
        {submitSuccess && (
          <div className={styles['success-message']}>
            Заказ успешно отправлен в ресторан! Ожидайте звонка оператора.
          </div>
        )}

        {/* Кнопка отправки формы */}
        <div className={styles['order-form__buttons']}>
          <Button 
            type='btnLink'
            className={styles['return-button']}
            href={CART_ROUTE}
            disabled={isSubmitting}
          >
            Вернуться в корзину
          </Button>
          <Button 
            type='submit'
            className={styles['order-button']}
            disabled={hasOrderAmountErrors || isSubmitting}
          >
            {isSubmitting ? 'Отправляем заказ...' : 'Оформить заказ'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default OrderForm 