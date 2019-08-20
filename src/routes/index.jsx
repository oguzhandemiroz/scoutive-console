import LoginPage from "../views/Pages/LoginPage";
import RegisterPage from "../views/Pages/RegisterPage";
import ForgotPassword from "../views/Pages/ForgotPassword";
import ChangePassword from "../views/Pages/ChangePassword";
import ResetPassword from "../views/Pages/ResetPassword";
import Dashboard from "../views/Dashboard/Dashboard";
import Employees from "../views/Employees/Employees";
import Players from "../views/Players/Players";
import _404 from "../views/Pages/404";

import Terms from "../views/Pages/Terms";

import AddEmployee from "../components/Employees/Add";
import DetailEmployee from "../components/Employees/Detail";
import EditEmployee from "../components/Employees/Edit";
import VacationEmployee from "../components/Employees/Vacation";
import SalaryEmployee from "../components/Employees/Salary";
import SalaryDetailEmployee from "../components/Employees/SalaryDetail";

import AddPlayers from "../components/Players/Add";
import DetailPlayer from "../components/Players/Detail";
import EditPlayer from "../components/Players/Edit";
import PaymentPlayer from "../components/Players/Payment";

import Attributes from "../components/Others/Attributes";

import Groups from "../views/Groups/Groups";
import GroupAdd from "../components/Groups/Add";
import GroupDetail from "../components/Groups/Detail";
import GroupEdit from "../components/Groups/Edit";

import Budgets from "../views/Budgets/Budgets";
import BudgetAdd from "../components/Budgets/Add";
import BudgetDetail from "../components/Budgets/Detail";

import Profile from "../views/Pages/Profile";
import Settings from "../views/Pages/Settings";

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
		path: "/terms",
		name: "Terms",
		component: Terms,
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
		path: "/profile/:uid",
		name: "Profile",
		component: Profile,
		layout: "/account",
		prop: { exact: true }
	},
	{
		path: "/password/change",
		name: "Change Password",
		component: ChangePassword,
		layout: "/account",
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
		path: "/employees/vacation/:uid",
		name: "Vacation Employee",
		component: VacationEmployee,
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
		path: "/employees/salary/:uid?",
		name: "Pay Salary",
		component: SalaryEmployee,
		layout: "/app",
		prop: { exact: false }
	},
	{
		path: "/employees/salary-detail/:uid?",
		name: "Detail Salary",
		component: SalaryDetailEmployee,
		layout: "/app"
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
		path: "/players/payment/:uid?",
		name: "Receive Payment",
		component: PaymentPlayer,
		layout: "/app"
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
		path: "/settings",
		name: "Settings",
		component: Settings,
		layout: "/account",
		prop: { exact: false }
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
		path: "/rollcalls/employee/detail/:rcid",
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
		path: "/rollcalls/player/add",
		name: "Players Rollcalls",
		component: PlayersRollcallAdd,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/rollcalls/player/detail/:rcid",
		name: "Players Rollcalls Past",
		component: PlayersRollcallDetail,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/budgets",
		name: "Budgets",
		component: Budgets,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/budgets/add",
		name: "Add Budget",
		component: BudgetAdd,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/budgets/detail/:bid",
		name: "Detail Budget",
		component: BudgetDetail,
		layout: "/app",
		prop: { exact: true }
	},
	{
		path: "/players/attr/:pid",
		name: "Detail Attributes",
		component: Attributes,
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
