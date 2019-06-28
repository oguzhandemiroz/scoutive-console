import LoginPage from "../views/Pages/LoginPage";
import RegisterPage from "../views/Pages/RegisterPage";
import ForgotPassword from "../views/Pages/ForgotPassword";
import ResetPassword from "../views/Pages/ResetPassword";
import Dashboard from "../views/Dashboard/Dashboard";
import Employees from "../views/Employees/Employees";
import Players from "../views/Players/Players";
import _404 from "../views/Pages/404";

import AddEmployee from "../components/Employees/Add";
import DetailEmployee from "../components/Employees/Detail";
import EditEmployee from "../components/Employees/Edit";

import AddPlayers from "../components/Players/Add";
import DetailPlayer from "../components/Players/Detail";
import EditPlayer from "../components/Players/Edit";

import Groups from "../views/Groups/Groups";
import GroupAdd from "../components/Groups/Add";
import GroupDetail from "../components/Groups/Detail";
import GroupEdit from "../components/Groups/Edit";

import Profile from "../views/Pages/Profile";

import EmployeesRollcallList from "../views/Rollcalls/Employee";
import EmployeesRollcallAdd from "../components/Rollcalls/Employee/Add";
import EmployeesRollcallDetail from "../components/Rollcalls/Employee/Detail";

import PlayersRollcallList from "../views/Rollcalls/Player";
import PlayersRollcallAdd from "../components/Rollcalls/Player/Add";
import PlayersRollcallDetail from "../components/Rollcalls/Player/Detail";
import PlayersRollcallPast from "../components/Rollcalls/Player/Past";

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
		path: "/groups",
		name: "Groups",
		component: Groups,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/groups/add",
		name: "Groups",
		component: GroupAdd,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/groups/detail/:gid",
		name: "Groups",
		component: GroupDetail,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/groups/edit/:gid",
		name: "Groups",
		component: GroupEdit,
		layout: "/app",
		prop: { exact: true }
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
		path: "/rollcalls/player/add/:gid",
		name: "Players Rollcalls",
		component: PlayersRollcallAdd,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/player/detail/:gid",
		name: "Players Rollcalls",
		component: PlayersRollcallPast,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/player/detail/:gid/:rid",
		name: "Players Rollcalls Past",
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
