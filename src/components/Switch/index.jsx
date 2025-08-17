import React from 'react'
import styles from './index.module.scss'

const Switch = ({
	isOn,
	handleToggle,
	className,
	option1,
	option2
}) => {
	return (
		<div className={`${styles['switch__container']} ${className}`}>
			<div 
				className={`${styles['switch']} ${!isOn ? styles['switch__on'] : ''}`}
			>
				<div className={styles['switch__button']}></div>
				<div className={styles['switch__text']}>
					<div 
						className={`${styles['switch__text__option']} ${isOn ? styles['switch__text__active'] : ''}`}
						onClick={() => !isOn && handleToggle()}
					>
						<div className={styles['switch__text__wrapper']}>{option1}</div>
					</div>
					<div 
						className={`${styles['switch__text__option']} ${!isOn ? styles['switch__text__active'] : ''}`}
						onClick={() => isOn && handleToggle()}
					>
						<div className={styles['switch__text__wrapper']}>{option2}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Switch;
