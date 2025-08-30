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
import Admin from "../pages/Admin"
import Auth from "../pages/Auth"
import Cart from "../pages/Cart"
import CategoryPage from "../pages/CategoryPage"
import Delivery from "../pages/Delivery"
import Main from "../pages/Main"
import Order from "../pages/Order"
import Policy from "../pages/Policy"
import Sale0 from "../pages/SalePages/Sale-0"
import Sale1 from "../pages/SalePages/Sale-1"
import Sale2 from "../pages/SalePages/Sale-2"
import Sale3 from "../pages/SalePages/Sale-3"
import Sale4 from "../pages/SalePages/Sale-4"
import Sale5 from "../pages/SalePages/Sale-5"
import Sales from "../pages/Sales"
import SearchResults from "../pages/SearchResults"
import UserAgreement from "../pages/UserAgreement"

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