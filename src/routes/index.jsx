import LoginPage from "../views/Pages/LoginPage.jsx";
import RegisterPage from "../views/Pages/RegisterPage.jsx";
import ForgotPassword from "../views/Pages/ForgotPassword.jsx";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import Employees from "../views/Employees/Employees.jsx";
import _404 from "../views/Pages/404.jsx";

var indexRoutes = [
	{
		path: "/login",
		name: "Login",
		component: LoginPage,
		layout: "/auth",
		prop: { exact: true }
	},
	{
		path: "/register",
		name: "Register",
		component: RegisterPage,
		layout: "/auth",
		prop: { exact: true }
	},
	{
		path: "/forgot-password",
		name: "Forgot Password",
		component: ForgotPassword,
		layout: "/auth",
		prop: { exact: true }
	},
	{
		path: "/dashboard",
		name: "Dashboard",
		component: Dashboard,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/employees",
		name: "Employees",
		component: Employees,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "*",
		layout: "",
		name: "404",
		component: _404
	}
];

export default indexRoutes;
