import ExclamationBlue from '../../assets/images/icon-exclamation-blue.webp'
import ExclamationRed from '../../assets/images/icon-exclamation-red.webp'
import styles from './index.module.scss'

function Notice({ 
	type = 'info',
	children,
	className,
}) {
	return (
		<div className={`${styles['notice']} ${styles[`notice__${type}`]} ${className}`}>
			<img src={type === 'info' ? ExclamationBlue : ExclamationRed} alt='Exclamation' />
			<p>
				{children}
			</p>
		</div>
	)
}

export default Notice