import { observer } from 'mobx-react-lite'
import React from 'react'
import { POLICY_ROUTE, USER_AGREEMENT_ROUTE } from '../../../constants'
import Button from '../../Button'
import styles from './index.module.scss'

const Cookie = observer(({
	className,
	isOpen,
	onClose
}) => {

	if (!isOpen) return null

	return (
		<div className={`${styles['cookie']} ${className}`}>
			<div className={styles['cookie__content']}>
                <p className={styles['cookie__content__description']}>
					Мы&nbsp;используем cookie для улучшения работы сайта, анализа посещаемости и&nbsp;персонализации контента. Нажав &laquo;Принимаю&raquo; или оставаясь на&nbsp;сайте, 
					Вы&nbsp;разрешаете использовать файлы cookies на&nbsp;этом сайте. <br />
					
					Подробнее в&nbsp;<a href={POLICY_ROUTE}>Политике конфиденциальности</a> и&nbsp;<a href={USER_AGREEMENT_ROUTE}>Пользовательском соглашении</a>.
                </p>
                <Button className={styles['cookie__content__button']} onClick={onClose}>
                    Принимаю
                </Button>
            </div>
		</div>
	);
})

export default Cookie;