import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import Plug from '../../../assets/images/plug.webp'
import { getImageUrl } from '../../../constants'
import { Context } from '../../../main'
import Button from '../../Button'
import CreateEditBanner from '../CreateEditBanner'
import Modal from '../index'
import styles from './index.module.scss'

const Banners = observer(({ isModalOpen, closeModal, showNotification }) => {
	const { banners } = useContext(Context)

	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
	const [bannerModalType, setBannerModalType] = useState('create')
	const [editingBanner, setEditingBanner] = useState(null)

	const handleDeleteBanner = (bannerId) => {
		if (window.confirm('Вы уверены, что хотите удалить этот баннер?')) {
			banners.deleteBanner(bannerId)
		}
	}

	const openBannerModal = (type = 'create', banner = null) => {
		setBannerModalType(type)
		setEditingBanner(banner)
		setIsBannerModalOpen(true)
	}

	const closeBannerModal = () => {
		setIsBannerModalOpen(false)
	}

	return (
		<Modal
			className='banners'
			isOpen={isModalOpen}
			onClose={closeModal}
			title='Баннеры'
			type='white'
		>

				<div className={styles['admin-page__content-banners']}>

					<div className={styles['admin-page__content-banners-scroll-wrapper']}>
						{/* Список баннеров */}
						{banners.banners.length > 0 ? (
							<table className={styles['admin-page__content-banners-table']}>
								<thead className={styles['admin-page__content-banners-header']}>

									{/* Шапка таблицы */}
									<tr>
										<td className={styles['imgDesktop']} width='200'>Desktop</td>
										<td className={styles['imgMobile']} width='100'>Mobile</td>
										<td className={styles['link']} width='200'><span>Ссылка</span></td>
										<td className={styles['order']} width='100'><span>Порядок</span></td>
										<td className={styles['actions']} width='200'></td>
									</tr>
								</thead>
								<tbody>

									{/* Список баннеров */}
									{banners.banners.slice().sort((a, b) => a.order - b.order).map((banner) => (
										<tr key={banner.id}>
											<td><img className={styles['image']} src={getImageUrl(banner.imgDesktop) || Plug} /></td>
											<td><img className={styles['image']} src={getImageUrl(banner.imgMobile) || Plug} /></td>
											<td className={styles['link-content']}><span>{banner.link}</span></td>
											<td className={styles['order']}><span>{banner.order ? banner.order : '-'}</span></td>
											<td className={styles['actions']}>

											{/* Изменить товар */}
											<Button 
												type='link' 
												className={styles['edit-button']}
												onClick={() => openBannerModal('edit', banner)}
											>
												Изменить
											</Button>

											{/* Удалить товар */}
											<Button 
												type='link' 
												className={styles['delete-button']}
												onClick={() => handleDeleteBanner(banner.id)}
											>
												Удалить
											</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<div className={styles['admin-page__content-banners-empty']}>
								<p>Баннеры не найдены</p>
							</div>
						)}
					</div>

					<div className={styles['admin-page__content-banners-add']}>
						<Button onClick={() => openBannerModal('create')}>
							Добавить баннер
						</Button>
					</div>
				</div>

				{isBannerModalOpen && (
					<CreateEditBanner
						className='add-banner'
						isModalOpen={isBannerModalOpen}
						closeModal={closeBannerModal}
						showNotification={showNotification}
						type={bannerModalType}
						bannerData={editingBanner}
					/>
				)}
			</Modal>
	)
})

export default Banners