import { lazy } from "react"
import {
	ADMIN_ROUTE,
	CART_ROUTE,
	CATEGORY_ROUTE,
	DELIVERY_ROUTE,
	LOGIN_ROUTE,
	MAIN_ROUTE,
	ORDER_ROUTE,
	POLICY_ROUTE,
	SALE_0_ROUTE,
	SALE_1_ROUTE,
	SALE_2_ROUTE,
	SALE_3_ROUTE,
	SALE_4_ROUTE,
	SALE_5_ROUTE,
	SALES_ROUTE,
	SEARCH_RESULTS_ROUTE,
	USER_AGREEMENT_ROUTE
} from "../constants"

// Lazy loading для страниц - загружаются только при необходимости
const Admin = lazy(() => import("../pages/Admin"))
const Auth = lazy(() => import("../pages/Auth"))
const Cart = lazy(() => import("../pages/Cart"))
const CategoryPage = lazy(() => import("../pages/CategoryPage"))
const Delivery = lazy(() => import("../pages/Delivery"))
const Main = lazy(() => import("../pages/Main"))
const Order = lazy(() => import("../pages/Order"))
const Policy = lazy(() => import("../pages/Policy"))
const Sale0 = lazy(() => import("../pages/SalePages/Sale-0"))
const Sale1 = lazy(() => import("../pages/SalePages/Sale-1"))
const Sale2 = lazy(() => import("../pages/SalePages/Sale-2"))
const Sale3 = lazy(() => import("../pages/SalePages/Sale-3"))
const Sale4 = lazy(() => import("../pages/SalePages/Sale-4"))
const Sale5 = lazy(() => import("../pages/SalePages/Sale-5"))
const Sales = lazy(() => import("../pages/Sales"))
const SearchResults = lazy(() => import("../pages/SearchResults"))
const UserAgreement = lazy(() => import("../pages/UserAgreement"))

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
		path: SALES_ROUTE,
		Component: Sales,
	},
	{
		path: SALE_0_ROUTE,
		Component: Sale0,
	},
	{
		path: SALE_1_ROUTE,
		Component: Sale1,
	},
	{
		path: SALE_2_ROUTE,
		Component: Sale2,
	},
	{
		path: SALE_3_ROUTE,
		Component: Sale3,
	},
	{
		path: SALE_4_ROUTE,
		Component: Sale4,
	},
	{
		path: SALE_5_ROUTE,
		Component: Sale5,
	},
	{
		path: DELIVERY_ROUTE,
		Component: Delivery,
	},
	{
		path: POLICY_ROUTE,
		Component: Policy,
	}, 
	{
		path: USER_AGREEMENT_ROUTE,
		Component: UserAgreement,
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