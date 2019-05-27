import LoginPage from "../views/Pages/LoginPage.jsx";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import _404 from "../views/Pages/404.jsx";

var indexRoutes = [
    {
        path: "/",
        name: "Login",
        component: LoginPage,
        props: {exact: true}
    },
    {
        path: "/app",
        name: "Dashboard",
        component: Dashboard,
        props: {exact: true}
    },
    {
        name: "404",
        component: _404
    }
];

export default indexRoutes;
