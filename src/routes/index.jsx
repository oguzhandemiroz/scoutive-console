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
        path: "/persons/employees",
        name: "Employees",
        component: Employees,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/employees/add",
        name: "Add Employees",
        component: AddEmployee,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/employees/detail/:uid",
        name: "Detail Employee",
        component: DetailEmployee,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/employees/vacation/:uid",
        name: "Vacation Employee",
        component: VacationEmployee,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/employees/rollcall/:uid",
        name: "Rollcall Employee",
        component: RollcallEmployee,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/employees/edit/:uid",
        name: "Edit Employee",
        component: EditEmployee,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/employees/salary/:uid?",
        name: "Pay Salary",
        component: SalaryEmployee,
        layout: "/app",
        prop: { exact: false }
    },
    {
        path: "/persons/employees/salary-detail/:uid",
        name: "Detail Salary",
        component: SalaryDetailEmployee,
        layout: "/app"
    },
    {
        path: "/persons/employees/message-detail/:uid",
        name: "Message Detail Employee",
        component: MessageDetailEmployee,
        layout: "/app"
    },
    /* {
        path: "/persons",
        name: "Persons",
        component: Persons,
        layout: "/app",
        prop: { exact: true }
    }, */
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
        component: AddPlayer,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/players/add/trial",
        name: "Trial Players",
        component: TrialPlayer,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/players/trial/activate/:uid",
        name: "Activate Trial Players",
        component: ActivateTrial,
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
        path: "/players/fee-detail/:uid",
        name: "Detail Fee",
        component: FeeDetailPlayer,
        layout: "/app"
    },
    {
        path: "/players/vacation/:uid",
        name: "Vacation Player",
        component: VacationPlayer,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/players/rollcall/:uid",
        name: "Rollcall Player",
        component: RollcallPlayer,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/players/messages/:uid",
        name: "Messages Player",
        component: MessagesPlayer,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/players/message-detail/:uid",
        name: "Messages Detail Player",
        component: MessageDetailPlayer,
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
        path: "/players/payment/fee/:uid?",
        name: "Receive Payment",
        component: PaymentPlayer,
        layout: "/app"
    },
    {
        path: "/persons/parents",
        name: "Parents",
        component: Parents,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/parents/add",
        name: "Add Parent",
        component: AddParent,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/parents/edit/:uid",
        name: "Edit Parent",
        component: EditParent,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/parents/detail/:uid",
        name: "Detail Parent",
        component: DetailParent,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/persons/parents/message-detail/:uid",
        name: "Messages Detail Parent",
        component: MessageDetailParent,
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
        name: "Grup Oluştur",
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
        prop: { exact: true }
    },
    {
        path: "/rollcalls/employee/add/:rcid",
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
        path: "/rollcalls/player/add/:rcid",
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
        path: "/budgets/detail/list/:bid",
        name: "All List Budget",
        component: Transaction,
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
        path: "/accountings",
        name: "Accountings",
        component: Accountings,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/detail/:aid",
        name: "Accountings Detail",
        component: AccountingDetail,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/income/fast",
        name: "Hızlı Gelir İşlemi",
        component: IncomeFast,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/income/invoice",
        name: "Gelir - Fatura",
        component: IncomeInvoice,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/income/list",
        name: "Gelir - Tüm List",
        component: Income,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/expense/fast",
        name: "Hızlı Gider İşlemi",
        component: ExpenseFast,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/expense/invoice",
        name: "Gider - Fatura",
        component: ExpenseInvoice,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/accountings/expense/list",
        name: "Gider - Tüm List",
        component: Expense,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/reports/unpaid/players",
        name: "Ödeme Yapmayanlar",
        component: UnpaidPlayerList,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/messages",
        name: "Mesaj Gönderim Merkezi",
        component: Messages,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/messages/select",
        name: "Mesaj Gönderim Merkezi - Tekil Mesaj Oluştur",
        component: SelectType,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/messages/single/add/:uid?/:ptype?",
        name: "Mesaj Gönderim Merkezi - Tekil Mesaj Oluştur",
        component: MessagesSingleAdd,
        layout: "/app"
    },
    {
        path: "/messages/bulk/add",
        name: "Mesaj Gönderim Merkezi - Toplu Mesaj Oluştur",
        component: MessagesBulkAdd,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/messages/recurring/add",
        name: "Mesaj Gönderim Merkezi - Otomatik Mesaj Oluştur",
        component: RecurringAdd,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/messages/detail/:cid",
        name: "Mesaj Gönderim Merkezi - Görüntüle",
        component: MessagesDetail,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/reload",
        name: "Reload App Page",
        component: Empty,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/slip",
        name: "Slip",
        component: Slip,
        layout: "/app",
        prop: { exact: true }
    },
    {
        path: "/reload",
        name: "Reload Account Page",
        component: Empty,
        layout: "/account",
        prop: { exact: true }
    },
    {
        path: "/player-form/:name?/:phone?/:fee?",
        name: "PlayerForm",
        component: PlayerForm,
        layout: "/printable",
        prop: { exact: true }
    },
    {
        path: "/rollcall-form/:rcid?/:type?",
        name: "RollcallForm",
        component: RollcallForm,
        layout: "/printable",
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
