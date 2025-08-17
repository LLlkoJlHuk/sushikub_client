import React from 'react'
import styles from './index.module.scss'

const Button = React.memo(function Button({ 
	type,  
	href,
	children, 
	onClick, 
	className, 
	target,
	disabled = false 
}) {
	const Component = type === 'link' ? 'a' : type === 'btnLink' ? 'a' : type === 'submit' ? 'button' : type === 'custom' ? 'div' : 'div';
	
  return (
    <Component 
		onClick={onClick} 
		className={`${styles['button']} ${className} ${type === 'link' ? styles['link'] : type === 'btnLink' ? styles['btn-link'] : type === 'custom' ? styles['custom'] : styles['not-link']} ${disabled ? styles['disabled'] : ''}`} 
		type={type} 
		href={href} 
		target={target}
		disabled={disabled}
	>
      {children}
    </Component>
  )
})

export default Button;