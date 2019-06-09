import LoginPage from "../views/Pages/LoginPage.jsx";
import RegisterPage from "../views/Pages/RegisterPage.jsx";
import ForgotPassword from "../views/Pages/ForgotPassword.jsx";
import ResetPassword from "../views/Pages/ResetPassword.jsx";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import Employees from "../views/Employees/Employees.jsx";
import _404 from "../views/Pages/404.jsx";

import AddEmployee from "../components/Employees/Add.jsx";
import DetailEmployee from "../components/Employees/Detail.jsx";
import EditEmployee from "../components/Employees/Edit.jsx";

var indexRoutes = [
    {
        path: "/login",
        name: "Login",
        component: LoginPage,
        layout: "/auth",
        prop: {exact: true}
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterPage,
        layout: "/auth",
        prop: {exact: true}
    },
    {
        path: "/forgot-password",
        name: "Forgot Password",
        component: ForgotPassword,
        layout: "/auth",
        prop: {exact: true}
    },
    {
        path: "/reset-password/:uid",
        name: "Reset Password",
        component: ResetPassword,
        layout: "/auth",
        prop: {exact: true}
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        layout: "/app",
        prop: {exact: true}
    },
    {
        path: "/employees",
        name: "Employees",
        component: Employees,
        layout: "/app",
        prop: {exact: true}
    },
    {
        path: "/employees/add",
        name: "Add Employees",
        component: AddEmployee,
        layout: "/app",
        prop: {exact: true}
    },
    {
        path: "/employees/detail/:uid",
        name: "Detail Employee",
        component: DetailEmployee,
        layout: "/app",
        prop: {exact: true}
    },
    {
        path: "/employees/edit/:uid",
        name: "Edit Employee",
        component: EditEmployee,
        layout: "/app",
        prop: {exact: true}
    },
    {
        path: "*",
        layout: "",
        name: "404",
        component: _404
    }
];

export default indexRoutes;
