import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import Employees from "../views/Employees/Employees.jsx";
import Menu from "../components/includes/Menu.jsx";
import HeaderMenu from "../components/includes/HeaderMenu.jsx";
import Footer from "../components/includes/Footer.jsx";

function App() {
    return (
        <Router>
            <div className="page">
                <div className="flex-fill">
                    <HeaderMenu />
                    <Menu />
                    <div className="my-3 my-md-5">
                        <Route path="/" exact component={Dashboard} />
                        <Route path="/employees" exact component={Employees} />
                    </div>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
