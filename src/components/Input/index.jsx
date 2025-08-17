import React from 'react'
import { Controller } from 'react-hook-form'
import { IMaskInput } from 'react-imask'
import styles from './index.module.scss'

const Input = React.memo(function Input({ 
	id,
	placeholder,
	type = 'text',
	isRequired = false,
	className,
	value,
	onChange,
	onFocus,
	onBlur,
	name,
	accept,
	checked,
	// React Hook Form props
	control,
	rules,
	// Mask props
	mask,
	// Error display
	error,
	errorMessage
}) {
  // Если используется React Hook Form
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error: fieldError } }) => {
          const hasError = fieldError || error
          const errorMsg = fieldError?.message || errorMessage
          
          if (mask) {
            return (
              <>
                <IMaskInput
                  {...field}
                  mask={mask}
                  placeholder={placeholder}
                  unmask={false}
                  lazy={false}
                  onAccept={field.onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className={`${className || ''} ${hasError ? styles.error : ''}`}
                  id={id}
                  type={type}
                  accept={accept}
                  checked={checked}
                />
                {hasError && (
                  <span className={styles['error-message']}>{errorMsg}</span>
                )}
              </>
            )
          }
          
          return (
            <>
              <input
                {...field}
                id={id}
                type={type}
                placeholder={placeholder}
                className={`${className || ''} ${hasError ? styles.error : ''}`}
                onFocus={onFocus}
                onBlur={onBlur}
                accept={accept}
                checked={checked}
                onChange={field.onChange}
              />
              {hasError && (
                <span className={styles['error-message']}>{errorMsg}</span>
              )}
            </>
          )
        }}
      />
    )
  }

  // Обычный input без React Hook Form
  return (
    <div className={styles['input-wrapper']}>
      <input 
        id={id}
        name={name}
        type={type} 
        placeholder={placeholder} 
        value={value || ''} 
        onChange={onChange} 
        required={isRequired} 
        className={`${className || ''} ${error ? styles.error : ''}`}
        onFocus={onFocus} 
        onBlur={onBlur} 
        accept={accept}
        checked={checked}
      />
      {error && errorMessage && (
        <span className={styles['error-message']}>{errorMessage}</span>
      )}
    </div>
  )
})

const Textarea = React.memo(function Textarea({ 
	id,
	placeholder,
	isRequired = false,
	className,
	value,
	onChange,
	onFocus,
	onBlur,
	name,
	rows = 4,
	maxLength = 100,
	// React Hook Form props
	control,
	rules,
	// Error display
	error,
	errorMessage
}) {
  // Если используется React Hook Form
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error: fieldError } }) => {
          const hasError = fieldError || error
          const errorMsg = fieldError?.message || errorMessage
          const currentLength = field.value ? field.value.length : 0
          
          return (
            <div className={styles['textarea-wrapper']}>
              <div className={styles['char-counter']}>
                {currentLength}/{maxLength}
              </div>
              <textarea 
                {...field}
                id={id}
                placeholder={placeholder} 
                className={`${className || ''} ${hasError ? styles.error : ''}`}
                onFocus={onFocus} 
                onBlur={onBlur} 
                rows={rows}
                maxLength={maxLength}
                style={{ maxHeight: '100px' }}
                onChange={field.onChange}
              />
              {hasError && (
                <span className={styles['error-message']}>{errorMsg}</span>
              )}
            </div>
          )
        }}
      />
    )
  }

  // Обычный textarea без React Hook Form
  const currentLength = value ? value.length : 0
  
  return (
    <div className={styles['textarea-wrapper']}>
      <div className={styles['char-counter']}>
        {currentLength}/{maxLength}
      </div>
      <textarea 
        id={id}
        name={name}
        placeholder={placeholder} 
        value={value || ''} 
        onChange={onChange} 
        required={isRequired} 
        className={`${className || ''} ${error ? styles.error : ''}`}
        onFocus={onFocus} 
        onBlur={onBlur} 
        rows={rows}
        maxLength={maxLength}
        style={{ maxHeight: '100px' }}
      />
      {error && errorMessage && (
        <span className={styles['error-message']}>{errorMessage}</span>
      )}
    </div>
  )
})

export default Input;
export { Textarea }

