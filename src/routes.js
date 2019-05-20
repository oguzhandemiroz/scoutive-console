import Dashboard from "./views/Dashboard/Dashboard.jsx";
import Employees from "./views/Dashboard/Employees.jsx";
import LoginPage from "./views/Pages/LoginPage.jsx";

var routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    layout: "/"
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
    layout: "/"
  },
  {
    path: "/login",
    name: "Giriş Sayfası",
    component: LoginPage,
    layout: "/auth"
  }
];

export default routes;
