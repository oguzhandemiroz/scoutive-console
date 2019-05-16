import Dashboard from "./views/Dashboard/Dashboard.jsx";
import LoginPage from "./views/Pages/LoginPage.jsx";


var routes = [{
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    layout: "/"

}, {
    path: "/login",
    name: "Giriş Sayfası",
    component: LoginPage,
    layout: "/auth"
}]

export default routes;