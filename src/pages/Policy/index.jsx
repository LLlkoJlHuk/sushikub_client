import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import useScrollTimeout from '../../hooks/useScrollTimeout'
import { Context } from '../../main'
import styles from './index.module.scss'


const Sales = observer(() => {
	const { settings } = useContext(Context)
	const [settingsData, setSettingsData] = useState({
		globalMessage: ''
	})

	useEffect(() => {
		const globalMessage = settings.getSettingValue('GLOBAL_MESSAGE', '')
		
		setSettingsData({ 
			globalMessage: globalMessage
		})
	}, [settings.settingsObject, settings])

	const { globalMessage } = settingsData

	// Состояние видимости хедера
	const { isScrolled, isTimedOut } = useScrollTimeout(128, 500, '');
	const { isScrolledBack, isTimedOutBack } = useScrollTimeout(400, 500, 'Back');

	return (
		<div className={`page ${styles['sales']}`}>

			{/* Секция с хедером */}
			<section className={`section section-with-header custom-bg border-bottom ${isScrolled ? 'header-visible' : ''}`}>
				{/* Header */}
				<Header isScrolled={isScrolled} isTimedOut={isTimedOut} isScrolledBack={isScrolledBack} isTimedOutBack={isTimedOutBack} />
			</section>

			{/* Уведомления */}
			{globalMessage && (
				<section className={`section ${styles['section-notice']}`}>
					<div className={`${styles['container']} container`}>
						{/* Уведомление о возможности расчета наличными, онлайн на сайте и бонусами */}
						<Notice type='info'>
							{globalMessage}
						</Notice>
					</div>
				</section>
			)}

			{/* Секция с продуктами */}
			<section className={`section ${styles['policy']}`}>
				<div className='container'>

				<h1 className='section__title'>
						Политика конфиденциальности и&nbsp;согласие на&nbsp;обработку персональных данных
					</h1>

					<p>
						Настоящая Политика конфиденциальности и&nbsp;обработки персональных данных (далее&nbsp;&mdash; &laquo;Политика&raquo;) действует в&nbsp;отношении всей информации, которую ИП&nbsp;Бакач А.М. (далее&nbsp;&mdash; &laquo;Администрация&raquo; или &laquo;Оператор&raquo;) может получить о&nbsp;Пользователе во&nbsp;время использования сайта sushikub.ru (далее&nbsp;&mdash; &laquo;Сайт&raquo;) и&nbsp;заказа услуг доставки суши.
					</p>

					<p>
						Используя Сайт и/или делая заказ, Пользователь дает согласие на&nbsp;обработку своих персональных данных в&nbsp;соответствии с&nbsp;настоящей Политикой и&nbsp;требованиями Федерального закона от&nbsp;27.07.2006 &#8470;&nbsp;152-ФЗ &laquo;О&nbsp;персональных данных&raquo;.
					</p>

					<h3 className={styles['block__title']}>СОГЛАСИЕ НА&nbsp;ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</h3>

					<p>
						Я, субъект персональных данных, в&nbsp;соответствии со&nbsp;ст.&nbsp;9&nbsp;Федерального закона от&nbsp;27.07.2006 &#8470;&nbsp;152-ФЗ &laquo;О&nbsp;персональных данных&raquo;, предоставляю согласие ИП&nbsp;Бакач А.М. (ОГРН 319246800152205, ИНН 246315598410) на&nbsp;обработку моих персональных данных на&nbsp;следующих условиях:
					</p>

					<h3 className={styles['block__title']}>1. ОСНОВНАЯ ИНФОРМАЦИЯ ОБ&nbsp;ОПЕРАТОРЕ</h3>

					<p>
						<b>1.1.</b> Оператор персональных данных: Индивидуальный предприниматель Бакач Антон Михайлович <br />
						<b>1.2.</b> ОГРН: 319246800152205 <br />
						<b>1.3.</b> ИНН: 246315598410 <br />
						<b>1.4.</b> Адреса осуществления деятельности: <br />
						&mdash;&nbsp;г. Красноярск, улица Батурина, дом 30 <br />
						&mdash;&nbsp;г. Красноярск, улица Лесопарковая, дом 27 <br />
						<b>1.5.</b> Контактный email для вопросов по&nbsp;персональным данным: overkot12@gmail.com <br />
						<b>1.6.</b> Сайт: sushikub.ru
					</p>

					<h3 className={styles['block__title']}>2. КАКИЕ ПЕРСОНАЛЬНЫЕ ДАННЫЕ МЫ&nbsp;СОБИРАЕМ</h3>

					<p>
						<b>2.1.</b> При оформлении заказа через сайт или по&nbsp;телефону мы&nbsp;собираем: <br />
						&mdash;&nbsp;Имя (для обращения при доставке) <br />
						&mdash;&nbsp;Номер телефона (для связи по&nbsp;заказу) <br />
						&mdash;&nbsp;Адрес доставки (для доставки заказа) <br /> 
						<b>2.2.</b> Автоматически собираемые данные при использовании сайта: <br />
						&mdash;&nbsp;IP-адрес <br />
						&mdash;&nbsp;Информация о&nbsp;браузере <br />
						&mdash;&nbsp;Данные cookie-файлов <br />
						&mdash;&nbsp;Время посещения сайта <br />
						&mdash;&nbsp;Просматриваемые страницы <br />
						<b>2.3.</b> При подключении Яндекс.Метрики: <br />
						&mdash;&nbsp;Данные о&nbsp;поведении на&nbsp;сайте <br />
						&mdash;&nbsp;Обезличенная статистика посещений
					</p>

					<h3 className={styles['block__title']}>3. ЦЕЛИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</h3>

					<p>
						<b>3.1.</b> Персональные данные обрабатываются для: <br />
						&mdash;&nbsp;Обработки и&nbsp;выполнения заказов на&nbsp;доставку суши <br />
						&mdash;&nbsp;Связи с&nbsp;Пользователем по&nbsp;вопросам заказа <br />
						&mdash;&nbsp;Доставки заказа по&nbsp;указанному адресу <br />
						&mdash;&nbsp;Улучшения качества обслуживания <br />
						&mdash;&nbsp;Анализа посещаемости сайта (обезличенно) <br />

						<b>3.2.</b> Возможные цели в&nbsp;будущем (с&nbsp;дополнительного согласия): <br />
						&mdash;&nbsp;Информирование о&nbsp;новых товарах и&nbsp;акциях <br />
						&mdash;&nbsp;Маркетинговые рассылки
					</p>

					<h3 className={styles['block__title']}>4. СПОСОБЫ И&nbsp;СРОКИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</h3>

					<p>
						<b>4.1.</b> Обработка персональных данных осуществляется с&nbsp;использованием средств автоматизации и&nbsp;без использования таких средств. <br />

						<b>4.2.</b> Персональные данные хранятся в&nbsp;течение: <br />
						&mdash;&nbsp;Данные о&nbsp;заказах: 5&nbsp;лет (для целей налогового и&nbsp;бухгалтерского учета) <br />
						&mdash;&nbsp;Данные cookie: согласно настройкам браузера <br />
						&mdash;&nbsp;Данные аналитики: 2&nbsp;года <br />

						<b>4.3.</b> Обработка персональных данных прекращается по&nbsp;достижении целей обработки или при отзыве согласия.
					</p>

					<h3 className={styles['block__title']}>5. ПЕРЕДАЧА ПЕРСОНАЛЬНЫХ ДАННЫХ ТРЕТЬИМ ЛИЦАМ</h3>

					<p>
						<b>5.1.</b> Персональные данные&nbsp;НЕ передаются третьим лицам, за&nbsp;исключением случаев: <br />
						&mdash;&nbsp;Требований правоохранительных органов в&nbsp;рамках законодательства РФ <br />
						&mdash;&nbsp;Передачи курьерской службе (только имя, телефон, адрес для доставки конкретного заказа) <br />

						<b>5.2.</b> Все лица, получающие доступ к&nbsp;персональным данным, обязуются соблюдать конфиденциальность.
					</p>

					<h3 className={styles['block__title']}>6. ИСПОЛЬЗОВАНИЕ COOKIE-ФАЙЛОВ</h3>

					<p>
						<b>6.1.</b> Сайт sushikub.ru использует cookie-файлы для: <br />
						&mdash;&nbsp;Обеспечения функционирования сайта <br />
						&mdash;&nbsp;Запоминания настроек пользователя <br />
						&mdash;&nbsp;Анализа посещаемости (при подключении Яндекс.Метрики) <br />

						<b>6.2.</b> Пользователь может отключить cookie в&nbsp;настройках браузера, однако это может ограничить функциональность сайта. <br />

						<b>6.3.</b> При первом посещении сайта появится уведомление об&nbsp;использовании cookie с&nbsp;возможностью согласиться или отклонить.
					</p>

					<h3 className={styles['block__title']}>7. ПРАВА СУБЪЕКТА ПЕРСОНАЛЬНЫХ ДАННЫХ</h3>

					<p>
						<b>7.1.</b> Вы&nbsp;имеете право: <br />
						&mdash;&nbsp;Получать информацию об&nbsp;обработке ваших персональных данных <br />
						&mdash;&nbsp;Требовать уточнения, блокирования или уничтожения недостоверных или незаконно обрабатываемых данных <br />
						&mdash;&nbsp;Отзывать согласие на&nbsp;обработку персональных данных <br />
						&mdash;&nbsp;Обжаловать действия или бездействие Оператора в&nbsp;Роскомнадзоре или судебном порядке <br />

						<b>7.2.</b> Для реализации ваших прав направляйте запросы на&nbsp;email: overkot12@gmail.com
					</p>

					<h3 className={styles['block__title']}>8. МЕРЫ ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ</h3>

					<p>
						<b>8.1.</b> Оператор принимает следующие меры для защиты персональных данных: <br />
						&mdash;&nbsp;Ограничение доступа к&nbsp;персональным данным <br />
						&mdash;&nbsp;Использование защищенных соединений при передаче данных <br />
						&mdash;&nbsp;Регулярное обновление средств защиты <br />
						&mdash;&nbsp;Обучение персонала правилам обработки персональных данных
					</p>

					<h3 className={styles['block__title']}>9. СОГЛАСИЕ НА&nbsp;ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</h3>

					<p>
						<b>9.1.</b> Согласие на&nbsp;обработку персональных данных предоставляется путем: <br />
						&mdash;&nbsp;Заполнения формы заказа на&nbsp;сайте <br />
						&mdash;&nbsp;Размещения заказа по&nbsp;телефону <br />
						&mdash;&nbsp;Продолжения использования сайта после ознакомления с&nbsp;настоящей Политикой <br />

						<b>9.2.</b> Согласие предоставляется на&nbsp;весь период ведения деятельности Оператором. <br />

						<b>9.3.</b> Согласие может быть отозвано путем направления письменного уведомления на&nbsp;email: overkot12@gmail.com
					</p>

					<h3 className={styles['block__title']}>10. СОГЛАСИЕ НА&nbsp;ИСПОЛЬЗОВАНИЕ COOKIE И&nbsp;МЕТРИЧЕСКИХ СИСТЕМ</h3>

					<p>
						<b>10.1.</b> Используя сайт sushikub.ru, Пользователь соглашается на&nbsp;использование: <br />
						&mdash;&nbsp;Технических cookie-файлов (необходимы для работы сайта) <br />
						&mdash;&nbsp;Аналитических cookie-файлов (при подключении Яндекс.Метрики) <br />

						<b>10.2.</b> Пользователь может отозвать согласие на&nbsp;использование необязательных cookie через настройки браузера или уведомив Оператора.
					</p>

					<h3 className={styles['block__title']}>11. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h3>

					<p>
						<b>11.1.</b> Настоящая Политика может быть изменена Оператором без специального уведомления. Новая версия вступает в&nbsp;силу с&nbsp;момента размещения на&nbsp;сайте. <br />

						<b>11.2.</b> Актуальная версия Политики размещена по&nbsp;адресу: sushikub.ru/policy <br />

						<b>11.3.</b> При возникновении вопросов по&nbsp;настоящей Политике обращайтесь по&nbsp;email: overkot12@gmail.com <br />

						<b>11.4.</b> К&nbsp;настоящей Политике применяется законодательство Российской Федерации.
					</p>

					<p>
						<b>ПОДТВЕРЖДАЮ</b>, что ознакомлен(а) с&nbsp;положениями Федерального закона от&nbsp;27.07.2006 &#8470;&nbsp;152-ФЗ &laquo;О&nbsp;персональных данных&raquo;, настоящей Политикой конфиденциальности. Права и&nbsp;обязанности в&nbsp;области защиты персональных данных мне понятны.
					</p>

					<p>
						<span><b>Дата последнего обновления: Сентябрь 2025</b></span>
					</p>
				</div>
			</section>

			<section className={`section custom-bg border-top`}>

				{/* Контейнер - ограничение ширины */}
				<div className='container'>
					{/* Footer */}
					<Footer />
				</div>
			</section>
		</div>
	)
})

export default Sales 	