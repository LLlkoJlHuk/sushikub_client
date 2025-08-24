import { ADMIN_ROUTE, CART_ROUTE, CATEGORY_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, ORDER_ROUTE, SEARCH_RESULTS_ROUTE } from "../constants"
import Admin from "../pages/Admin"
import Auth from "../pages/Auth"
import Cart from "../pages/Cart"
import CategoryPage from "../pages/CategoryPage"
import Main from "../pages/Main"
import Order from "../pages/Order"
import SearchResults from "../pages/SearchResults"

export const authRoutes = [
	{
		path: ADMIN_ROUTE,
		Component: Admin,
	}
]

export const publicRoutes = [
	{
		path: LOGIN_ROUTE,
		Component: Auth,
	},
	{
		path: MAIN_ROUTE,
		Component: Main,
	},
	{
		path: CART_ROUTE,
		Component: Cart,
	},
	{
		path: ORDER_ROUTE,
		Component: Order,
	},
	{
		path: `${CATEGORY_ROUTE}/:categoryId`,
		Component: CategoryPage,
	},
	{
		path: SEARCH_RESULTS_ROUTE,
		Component: SearchResults,
	}
]