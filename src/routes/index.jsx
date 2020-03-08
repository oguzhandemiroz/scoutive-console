import LoginPage from "../views/Pages/LoginPage";
import RegisterPage from "../views/Pages/RegisterPage";
import ForgotPassword from "../views/Pages/ForgotPassword";
import ChangePassword from "../views/Pages/ChangePassword";
import ResetPassword from "../views/Pages/ResetPassword";
import Dashboard from "../views/Dashboard/Dashboard";
import Employees from "../views/Employees/Employees";
import Players from "../views/Players/Players";
import Parents from "../views/Parents/Parents";
import Messages from "../views/Messages/Messages";
import _404 from "../views/Pages/404";
import Empty from "../components/Pages/Empty";
import Slip from "../components/Players/Payment/Slip";

import Terms from "../views/Pages/Terms";

import AddEmployee from "../components/Employees/Add";
import DetailEmployee from "../components/Employees/Detail";
import EditEmployee from "../components/Employees/Edit";
import VacationEmployee from "../components/Employees/Vacation";
import SalaryEmployee from "../components/Employees/Salary";
import SalaryDetailEmployee from "../components/Employees/SalaryDetail";
import RollcallEmployee from "../components/Employees/Rollcall";
import MessageDetailEmployee from "../components/Employees/MessageDetail";

import AddPlayer from "../components/Players/Add";
import TrialPlayer from "../components/Players/Trial";
import ActivateTrial from "../components/Players/ActivateTrial";
import DetailPlayer from "../components/Players/Detail";
import EditPlayer from "../components/Players/Edit";
import PaymentPlayer from "../components/Players/Payment";
import FeeDetailPlayer from "../components/Players/FeeDetail";
import MessageDetailPlayer from "../components/Players/MessageDetail";
import VacationPlayer from "../components/Players/Vacation";
import RollcallPlayer from "../components/Players/Rollcall";
import MessagesPlayer from "../components/Players/Messages";

import AddParent from "../components/Parents/Add";
import EditParent from "../components/Parents/Edit";
import DetailParent from "../components/Parents/Detail";
import MessageDetailParent from "../components/Parents/MessageDetail";

import Attributes from "../components/Others/Attributes";

import Groups from "../views/Groups/Groups";
import GroupAdd from "../components/Groups/Add";
import GroupDetail from "../components/Groups/Detail";
import GroupEdit from "../components/Groups/Edit";

import Budgets from "../views/Budgets/Budgets";
import BudgetAdd from "../components/Budgets/Add";
import BudgetDetail from "../components/Budgets/Detail";
import Transaction from "../components/Budgets/Transaction";

import Profile from "../views/Pages/Profile";
import Settings from "../views/Pages/Settings";

import EmployeesRollcallList from "../views/Rollcalls/Employee";
import EmployeesRollcallAdd from "../components/Rollcalls/Employee/Add";
import EmployeesRollcallDetail from "../components/Rollcalls/Employee/Detail";

import PlayersRollcallList from "../views/Rollcalls/Player";
import PlayersRollcallAdd from "../components/Rollcalls/Player/Add";
import PlayersRollcallDetail from "../components/Rollcalls/Player/Detail";

import Accountings from "../views/Accountings/Accountings";
import AccountingDetail from "../components/Accountings/Detail";
import IncomeFast from "../components/Accountings/Income/Fast";
import ExpenseFast from "../components/Accountings/Expense/Fast";
import IncomeInvoice from "../components/Accountings/Income/Invoice";
import ExpenseInvoice from "../components/Accountings/Expense/Invoice";
import Income from "../components/Accountings/Income/Income";
import Expense from "../components/Accountings/Expense/Expense";

import SelectType from "../components/Messages/SelectType";
import MessagesSingleAdd from "../components/Messages/SingleAdd";
import MessagesBulkAdd from "../components/Messages/BulkAdd";
import RecurringAdd from "../components/Messages/RecurringAdd";
import MessagesDetail from "../components/Messages/Detail";

import UnpaidPlayerList from "../components/Reports/UnpaidPlayerList";

import PlayerForm from "../components/Printable/PlayerForm";
import RollcallForm from "../components/Printable/RollcallForm";

import { CheckPermissions } from "../services/Others";

var indexRoutes = [
    {
        path: "/login",
        name: "Login",
        component: LoginPage,
        layout: "/auth",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterPage,
        layout: "/auth",

        prop: { exact: true },
        condition: true
    },
    {
        path: "/forgot-password",
        name: "Forgot Password",
        component: ForgotPassword,
        layout: "/auth",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/reset-password/:uid",
        name: "Reset Password",
        component: ResetPassword,
        layout: "/auth",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/terms",
        name: "Terms",
        component: Terms,
        layout: "/auth",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        layout: "/app",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/profile/:uid",
        name: "Profile",
        component: Profile,
        layout: "/account",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/password/change",
        name: "Change Password",
        component: ChangePassword,
        layout: "/account",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/persons/employees",
        name: "Employees",
        component: Employees,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["e_read", "e_write", "e_remove"], "||")
    },
    {
        path: "/persons/employees/add",
        name: "Add Employees",
        component: AddEmployee,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["e_write"])
    },
    {
        path: "/persons/employees/detail/:uid",
        name: "Detail Employee",
        component: DetailEmployee,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["e_read"])
    },
    {
        path: "/persons/employees/vacation/:uid",
        name: "Vacation Employee",
        component: VacationEmployee,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["e_read"])
    },
    {
        path: "/persons/employees/rollcall/:uid",
        name: "Rollcall Employee",
        component: RollcallEmployee,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["e_read", "r_read"])
    },
    {
        path: "/persons/employees/edit/:uid",
        name: "Edit Employee",
        component: EditEmployee,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["e_read", "e_write"])
    },
    {
        path: "/persons/employees/salary/:uid?",
        name: "Pay Salary",
        component: SalaryEmployee,
        layout: "/app",
        prop: { exact: false },
        condition: CheckPermissions(["e_read", "a_read", "a_write"])
    },
    {
        path: "/persons/employees/salary-detail/:uid",
        name: "Detail Salary",
        component: SalaryDetailEmployee,
        layout: "/app",
        condition: CheckPermissions(["e_read", "a_read"])
    },
    {
        path: "/persons/employees/message-detail/:uid",
        name: "Message Detail Employee",
        component: MessageDetailEmployee,
        layout: "/app",
        condition: CheckPermissions(["e_read", "m_read"])
    },
    {
        path: "/players",
        name: "Players",
        component: Players,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "p_write", "p_remove"], "||")
    },
    {
        path: "/players/add",
        name: "Add Players",
        component: AddPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_write"])
    },
    {
        path: "/players/detail/:uid",
        name: "Detail Players",
        component: DetailPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read"])
    },
    {
        path: "/players/fee-detail/:uid",
        name: "Detail Fee",
        component: FeeDetailPlayer,
        layout: "/app",
        condition: CheckPermissions(["p_read", "a_read"])
    },
    {
        path: "/players/vacation/:uid",
        name: "Vacation Player",
        component: VacationPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read"])
    },
    {
        path: "/players/rollcall/:uid",
        name: "Rollcall Player",
        component: RollcallPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "r_read"])
    },
    {
        path: "/players/messages/:uid",
        name: "Messages Player",
        component: MessagesPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "m_write", "p_write"])
    },
    {
        path: "/players/message-detail/:uid",
        name: "Messages Detail Player",
        component: MessageDetailPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "m_read"])
    },
    {
        path: "/players/edit/:uid",
        name: "Edit Players",
        component: EditPlayer,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "p_write"])
    },
    {
        path: "/players/payment/fee/:uid?",
        name: "Receive Payment",
        component: PaymentPlayer,
        layout: "/app",
        condition: CheckPermissions(["p_read", "a_read", "a_write"])
    },
    {
        path: "/persons/parents",
        name: "Parents",
        component: Parents,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "p_write", "p_remove"], "||")
    },
    {
        path: "/persons/parents/add",
        name: "Add Parent",
        component: AddParent,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_write"])
    },
    {
        path: "/persons/parents/edit/:uid",
        name: "Edit Parent",
        component: EditParent,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "p_write"])
    },
    {
        path: "/persons/parents/detail/:uid",
        name: "Detail Parent",
        component: DetailParent,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read"])
    },
    {
        path: "/persons/parents/message-detail/:uid",
        name: "Messages Detail Parent",
        component: MessageDetailParent,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["p_read", "m_read"])
    },
    {
        path: "/groups",
        name: "Groups",
        component: Groups,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["g_read", "g_write", "g_remove"], "||")
    },
    {
        path: "/groups/add",
        name: "Grup Oluştur",
        component: GroupAdd,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["g_write"])
    },
    {
        path: "/groups/detail/:gid",
        name: "Groups",
        component: GroupDetail,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["g_read"])
    },
    {
        path: "/groups/edit/:gid",
        name: "Groups",
        component: GroupEdit,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["g_read", "g_write"])
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
        layout: "/account",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/settings/:branch?/:uid",
        name: "Settings",
        component: Settings,
        layout: "/account",
        prop: { exact: false }
    },
    {
        path: "/rollcalls/employee",
        component: EmployeesRollcallList,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["r_read", "r_write", "r_remove"], "||")
    },
    {
        path: "/rollcalls/employee/add/:rcid",
        component: EmployeesRollcallAdd,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["r_write"])
    },
    {
        path: "/rollcalls/employee/detail/:rcid",
        name: "Employees Rollcalls",
        component: EmployeesRollcallDetail,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["r_read"])
    },
    {
        path: "/rollcalls/player",
        name: "Players Rollcalls",
        component: PlayersRollcallList,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["r_read", "r_write", "r_remove"], "||")
    },
    {
        path: "/rollcalls/player/add/:rcid",
        name: "Players Rollcalls",
        component: PlayersRollcallAdd,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["r_write"])
    },
    {
        path: "/rollcalls/player/detail/:rcid",
        name: "Players Rollcalls Past",
        component: PlayersRollcallDetail,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["r_read"])
    },
    {
        path: "/budgets",
        name: "Budgets",
        component: Budgets,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read", "a_write", "a_remove"], "||")
    },
    {
        path: "/budgets/add",
        name: "Add Budget",
        component: BudgetAdd,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_write"])
    },
    {
        path: "/budgets/detail/:bid",
        name: "Detail Budget",
        component: BudgetDetail,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read"])
    },
    {
        path: "/budgets/detail/list/:bid",
        name: "All List Budget",
        component: Transaction,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read"])
    },
    {
        path: "/accountings",
        name: "Accountings",
        component: Accountings,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read", "a_write", "a_remove"], "||")
    },
    {
        path: "/accountings/detail/:aid",
        name: "Accountings Detail",
        component: AccountingDetail,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read"])
    },
    {
        path: "/accountings/income/fast",
        name: "Hızlı Gelir İşlemi",
        component: IncomeFast,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_write"])
    },
    {
        path: "/accountings/income/invoice",
        name: "Gelir - Fatura",
        component: IncomeInvoice,
        layout: "/app",
        prop: { exact: true },
        condition: false
    },
    {
        path: "/accountings/income/list",
        name: "Gelir - Tüm List",
        component: Income,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read"])
    },
    {
        path: "/accountings/expense/fast",
        name: "Hızlı Gider İşlemi",
        component: ExpenseFast,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_write"])
    },
    {
        path: "/accountings/expense/invoice",
        name: "Gider - Fatura",
        component: ExpenseInvoice,
        layout: "/app",
        prop: { exact: true },
        condition: false
    },
    {
        path: "/accountings/expense/list",
        name: "Gider - Tüm List",
        component: Expense,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read"])
    },
    {
        path: "/reports/unpaid/players",
        name: "Ödeme Yapmayanlar",
        component: UnpaidPlayerList,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read", "p_read"], "||")
    },
    {
        path: "/messages",
        name: "Mesaj Gönderim Merkezi",
        component: Messages,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["m_read", "m_write", "m_remove"], "||")
    },
    {
        path: "/messages/select",
        name: "Mesaj Gönderim Merkezi - Tekil Mesaj Oluştur",
        component: SelectType,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["m_write"])
    },
    {
        path: "/messages/single/add/:uid?/:ptype?",
        name: "Mesaj Gönderim Merkezi - Tekil Mesaj Oluştur",
        component: MessagesSingleAdd,
        layout: "/app",
        condition: CheckPermissions(["m_write"])
    },
    {
        path: "/messages/bulk/add",
        name: "Mesaj Gönderim Merkezi - Toplu Mesaj Oluştur",
        component: MessagesBulkAdd,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["m_write"])
    },
    {
        path: "/messages/recurring/add",
        name: "Mesaj Gönderim Merkezi - Otomatik Mesaj Oluştur",
        component: RecurringAdd,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["m_write"])
    },
    {
        path: "/messages/detail/:cid",
        name: "Mesaj Gönderim Merkezi - Görüntüle",
        component: MessagesDetail,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["m_read"])
    },
    {
        path: "/reload",
        name: "Reload App Page",
        component: Empty,
        layout: "/app",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/slip",
        name: "Slip",
        component: Slip,
        layout: "/app",
        prop: { exact: true },
        condition: CheckPermissions(["a_read"])
    },
    {
        path: "/reload",
        name: "Reload Account Page",
        component: Empty,
        layout: "/account",
        prop: { exact: true },
        condition: true
    },
    {
        path: "/player-form/:name?/:phone?/:fee?",
        name: "PlayerForm",
        component: PlayerForm,
        layout: "/printable",
        condition: true
    },
    {
        path: "/rollcall-form/:rcid?/:type?",
        name: "RollcallForm",
        component: RollcallForm,
        layout: "/printable",
        condition: false
    },
    {
        path: "*",
        layout: "",
        name: "404",
        component: _404
    }
];

export default indexRoutes;
