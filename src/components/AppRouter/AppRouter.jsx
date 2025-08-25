import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ADMIN_ROUTE, LOGIN_ROUTE, MAIN_ROUTE } from '../../constants'
import { Context } from '../../main'
import { authRoutes, publicRoutes } from '../../routes'

const AppRouter = observer(() => {
	const context = useContext(Context)
	const users = context?.users || { isAuth: false, isLoading: false }
	const location = useLocation()

	// Проверяем, является ли текущий путь защищенным
	const isProtectedRoute = authRoutes.some(route => location.pathname === route.path)

	// Запускаем проверку авторизации только для защищенных страниц
	useEffect(() => {
		if (isProtectedRoute && !users.isAuth && !users.isLoading) {
			users.checkAuth()
		}
	}, [location.pathname, isProtectedRoute, users])

	// НЕ показываем Loading в AppRouter - это делает Admin компонент
	// Это предотвращает конфликты и множественные Loading

	// Проверяем, если пользователь авторизован и пытается зайти на страницу логина
	if (users.isAuth && location.pathname === LOGIN_ROUTE) {
		return <Navigate to={ADMIN_ROUTE} replace />
	}

	// Для защищенных страниц проверяем авторизацию
	if (isProtectedRoute && !users.isAuth) {
		return <Navigate to={LOGIN_ROUTE} replace />
	}

	return (
		<Routes>
			{/* Публичные роуты доступны всем */}
			{publicRoutes.map(({ path, Component }) => ( // eslint-disable-line no-unused-vars
				<Route key={path} path={path} element={<Component />} />
			))}
			
			{/* Авторизированные роуты доступны только авторизированным пользователям */}
			{authRoutes.map(({ path, Component }) => ( // eslint-disable-line no-unused-vars
				<Route 
					key={path} 
					path={path} 
					element={<Component />}
				/>
			))}
			
			<Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
		</Routes>
	)
})

export default AppRouter;