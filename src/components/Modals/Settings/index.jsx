import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../main'
import Button from '../../Button'
import Dropdown from '../../Dropdown'
import Modal from '../index'
import styles from './index.module.scss'

const Settings = observer(({ isModalOpen, closeModal, showNotification }) => {
	const { settings } = useContext(Context)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [localNewSettings, setLocalNewSettings] = useState([]) // Локальные новые настройки

	const typeOptions = [
		{ value: 'string', label: 'Строка' },
		{ value: 'number', label: 'Число' },
		{ value: 'boolean', label: 'Boolean' },
	]

	// Загружаем настройки при открытии модального окна
	useEffect(() => {
		if (isModalOpen) {
			settings.fetchSettings()
			// Очищаем локальные новые настройки при открытии
			setLocalNewSettings([])
		}
	}, [isModalOpen])

	const handleChangeKey = (e, id, isNew = false) => {
		if (isNew) {
			setLocalNewSettings(prev => 
				prev.map(setting => 
					setting.id === id 
						? { ...setting, key: e.target.value }
						: setting
				)
			)
		} else {
			settings.updateExistingSetting(id, 'key', e.target.value)
		}
	}

	const handleChangeValue = (e, id, isNew = false) => {
		if (isNew) {
			setLocalNewSettings(prev => 
				prev.map(setting => 
					setting.id === id 
						? { ...setting, value: e.target.value }
						: setting
				)
			)
		} else {
			settings.updateExistingSetting(id, 'value', e.target.value)
		}
	}

	const handleChangeType = (value, id, isNew = false) => {
		if (isNew) {
			setLocalNewSettings(prev => 
				prev.map(setting => 
					setting.id === id 
						? { ...setting, type: value }
						: setting
				)
			)
		} else {
			settings.updateExistingSetting(id, 'type', value)
		}
	}

	const handleChangeDescription = (e, id, isNew = false) => {
		if (isNew) {
			setLocalNewSettings(prev => 
				prev.map(setting => 
					setting.id === id 
						? { ...setting, description: e.target.value }
						: setting
				)
			)
		} else {
			settings.updateExistingSetting(id, 'description', e.target.value)
		}
	}

	const handleChangeOrder = (e, id, isNew = false) => {
		const value = parseInt(e.target.value) || 0
		if (isNew) {
			setLocalNewSettings(prev => 
				prev.map(setting => 
					setting.id === id 
						? { ...setting, order: value }
						: setting
				)
			)
		} else {
			settings.updateExistingSetting(id, 'order', value)
		}
	}

	const saveSettings = async () => {
		try {
			setIsSubmitting(true)

			// Валидация новых настроек
			const invalidSettings = localNewSettings.filter(setting => 
				!setting.key.trim() || !setting.value.trim()
			)

			if (invalidSettings.length > 0) {
				showNotification('Пожалуйста, заполните все поля для новых настроек', 'error')
				return
			}

			// Проверка на дублирование ключей
			const allKeys = [...settings.settings.map(s => s.key), ...localNewSettings.map(s => s.key)]
			const duplicateKeys = allKeys.filter((key, index) => allKeys.indexOf(key) !== index)
			
			if (duplicateKeys.length > 0) {
				showNotification(`Дублирующиеся ключи: ${duplicateKeys.join(', ')}`, 'error')
				return
			}

			// Создаем новые настройки
			const createPromises = localNewSettings.map(setting => 
				settings.createSetting({
					key: setting.key.trim(),
					value: setting.value.trim(),
					type: setting.type,
					description: setting.description.trim(),
					order: setting.order
				})
			)

			// Обновляем измененные существующие настройки
			const updatePromises = settings.settings.map(setting => 
				settings.updateSetting(setting.id, setting)
			)

			// Выполняем все операции
			await Promise.all([...createPromises, ...updatePromises])

			// Очищаем локальные новые настройки
			setLocalNewSettings([])

			// Обновляем данные из БД
			await settings.fetchSettings()
			await settings.fetchSettingsObject()

			showNotification('Настройки успешно сохранены', 'success')
			closeModal()
		} catch (error) {
			console.error('Error saving settings:', error)
			showNotification('Ошибка при сохранении настроек', 'error')
		} finally {
			setIsSubmitting(false)
		}
	}

	const addSetting = () => {
		const newSetting = {
			id: `new_${Date.now()}`, // Временный ID для новых настроек
			key: '',
			value: '',
			type: 'string',
			description: '',
			order: settings.settings.length + localNewSettings.length + 1,
			isNew: true
		}
		setLocalNewSettings(prev => [...prev, newSetting])
	}

	const removeNewSetting = (id) => {
		setLocalNewSettings(prev => prev.filter(s => s.id !== id))
	}

	const removeExistingSetting = async (id) => {
		if (window.confirm('Вы уверены, что хотите удалить эту настройку?')) {
			try {
				await settings.deleteSetting(id)
				showNotification('Настройка успешно удалена', 'success')
			} catch (error) {
				console.error('Error deleting setting:', error)
				showNotification('Ошибка при удалении настройки', 'error')
			}
		}
	}

	// Объединяем существующие и локальные новые настройки для отображения
	const allSettings = [...settings.settings, ...localNewSettings]

	return (
		<Modal
			className='settings'
			isOpen={isModalOpen}
			onClose={closeModal}
			title='Настройки'
			type='white'
		>
			<div className={styles['admin-page__content-settings']}>
				<div className={styles['admin-page__content-settings-scroll-wrapper']}>
					{/* Список настроек */}
					{allSettings.length > 0 ? (
						<table className={styles['admin-page__content-settings-table']}>
							<thead className={styles['admin-page__content-settings-header']}>
								{/* Шапка таблицы */}
								<tr>
									<td className={styles['key']} width='200'>Ключ</td>
									<td className={styles['value']} width='250'>Значение</td>
									<td className={styles['type']} width='100'>Тип</td>
									<td className={styles['description']} width='200'>Описание</td>
									<td className={styles['order']} width='20'>Порядок</td>
									<td className={styles['actions']} width='100'>Действия</td>
								</tr>
							</thead>
							<tbody>
								{/* Список настроек */}
								{allSettings
									.slice()
									.sort((a, b) => a.order - b.order)
									.map((setting) => {
										const isNew = setting.isNew
										return (
											<tr key={setting.id} className={isNew ? styles['new-setting-row'] : ''}>
												<td>
													<input 
														type="text" 
														value={setting.key || ''} 
														onChange={(e) => handleChangeKey(e, setting.id, isNew)}
														placeholder="Введите ключ"
														className={styles['setting-input']}
													/>
												</td>
												<td>
													<input 
														type="text" 
														value={setting.value || ''} 
														onChange={(e) => handleChangeValue(e, setting.id, isNew)}
														placeholder="Введите значение"
														className={styles['setting-input']}
													/>
												</td>
												<td>
													<Dropdown 
														className={styles['setting-select']}
														options={typeOptions}
														value={setting.type || 'string'}
														onChange={(value) => handleChangeType(value, setting.id, isNew)}
														placeholder="Выберите тип"
														disabled={typeOptions.length === 0}
													/>
												</td>
												<td>
													<textarea 
														type="textarea" 
														value={setting.description || ''} 
														onChange={(e) => handleChangeDescription(e, setting.id, isNew)}
														placeholder="Введите описание"
														className={styles['setting-textarea']}
													/>
												</td>
												<td>
													<input 
														type="number" 
														value={setting.order || 0} 
														onChange={(e) => handleChangeOrder(e, setting.id, isNew)}
														className={styles['setting-input']}
													/>
												</td>
												<td className={styles['actions']}>
													{isNew ? (
														<Button 
															type='link' 
															className={styles['remove-button']}
															onClick={() => removeNewSetting(setting.id)}
														>
															Удалить
														</Button>
													) : (
														<Button 
															type='link' 
															className={styles['remove-button']}
															onClick={() => removeExistingSetting(setting.id)}
														>
															Удалить
														</Button>
													)}
												</td>
											</tr>
										)
									})}
							</tbody>
						</table>
					) : (
						<div className={styles['admin-page__content-settings-empty']}>
							<p>Настройки не найдены</p>
						</div>
					)}
				</div>

				<div className={styles['admin-page__content-settings-buttons']}>
					{/* Информация о новых настройках */}
					{(localNewSettings.length > 0) && (
						<div className={styles['new-settings-info']}>
							Новых настроек: {localNewSettings.length}
						</div>
					)}

					<div className={styles['right-buttons']}>
						{/* Добавить настройку */}
						<Button 
							onClick={addSetting}
							className={styles['add-button']}
						>
							Добавить настройку
						</Button>

						{/* Сохранить настройки */}
						<Button 
							onClick={saveSettings}
							disabled={isSubmitting}
							className={styles['save-button']}
						>
							{isSubmitting ? 'Сохранение...' : `Сохранить ${localNewSettings.length > 0 ? `(${localNewSettings.length})` : ''}`}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	)
})

export default Settings