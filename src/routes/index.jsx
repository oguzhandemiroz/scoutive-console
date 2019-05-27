import LoginPage from "../views/Pages/LoginPage.jsx";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import _404 from "../views/Pages/404.jsx";

var indexRoutes = [
	{
		path: "/",
		name: "Login",
		component: LoginPage,
		props: { exact: true }
	},
	{
		path: "/app/dashboard",
		name: "Dashboard",
		component: Dashboard,
		layout: "/app",
		props: { exact: true, strict: true }
	},
	{
		path: "*",
		name: "404",
		component: _404
	}
];

export default indexRoutes;
