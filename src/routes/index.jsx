import LoginPage from "../views/Pages/LoginPage.jsx";
import RegisterPage from "../views/Pages/RegisterPage.jsx";
import ForgotPassword from "../views/Pages/ForgotPassword.jsx";
import ResetPassword from "../views/Pages/ResetPassword.jsx";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import Employees from "../views/Employees/Employees.jsx";
import Players from "../views/Players/Players.jsx";
import Groups from "../views/Groups/Groups.jsx";
import _404 from "../views/Pages/404.jsx";

import AddEmployee from "../components/Employees/Add.jsx";
import DetailEmployee from "../components/Employees/Detail.jsx";
import EditEmployee from "../components/Employees/Edit.jsx";

import AddPlayers from "../components/Players/Add.jsx";
import DetailPlayer from "../components/Players/Detail.jsx";
import EditPlayer from "../components/Players/Edit.jsx";

import Profile from "../views/Pages/Profile.jsx";

import EmployeesRollcallAdd from "../views/Rollcalls/Employee/Add";
import EmployeesRollcallList from "../views/Rollcalls/Employee/List";
import EmployeesRollcallDetail from "../views/Rollcalls/Employee/Detail";

import PlayersRollcallList from "../views/Rollcalls/Player/List";
import PlayersRollcallDetail from "../views/Rollcalls/Player/Detail";

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
		path: "/reset-password/:uid",
		name: "Reset Password",
		component: ResetPassword,
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
		path: "/employees/add",
		name: "Add Employees",
		component: AddEmployee,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/employees/detail/:uid",
		name: "Detail Employee",
		component: DetailEmployee,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/employees/edit/:uid",
		name: "Edit Employee",
		component: EditEmployee,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/players",
		name: "Players",
		component: Players,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/players/add",
		name: "Add Players",
		component: AddPlayers,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/players/detail/:uid",
		name: "Detail Players",
		component: DetailPlayer,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/players/edit/:uid",
		name: "Edit Players",
		component: EditPlayer,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/groups/:gid",
		name: "Groups",
		component: Groups,
		layout: "/app"
	},
	{
		path: "/profile",
		name: "Profile",
		component: Profile,
		layout: "/account",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/employee",
		component: EmployeesRollcallList,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/employee/add",
		component: EmployeesRollcallAdd,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/employee/detail/:rid",
		name: "Employees Rollcalls",
		component: EmployeesRollcallDetail,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/player",
		name: "Players Rollcalls",
		component: PlayersRollcallList,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/player/detail/:gid",
		name: "Players Rollcalls",
		component: PlayersRollcallDetail,
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
