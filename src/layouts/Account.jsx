import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Menu from "../components/includes/Menu.jsx";
import HeaderMenu from "../components/includes/HeaderMenu.jsx";
import Warnings from "../components/includes/Warnings.jsx";
import Footer from "../components/includes/Footer.jsx";
import Maintenance from "../components/Maintenance";
import indexRoutes from "../routes/index.jsx";
import { Start } from "../services/Starts.jsx";
const $ = require("jquery");

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maintenance: false,
            maintenanceCache: localStorage.getItem("S:M")
        };
    }

    componentDidUpdate() {
        if ($(".tooltip.show")) {
            $(".tooltip.show").remove();
        }
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: "hover"
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        Start().then(response => {
            if (response) {
                const status = response.status;
                const data = response.data;
                if (status.code === 1020) {
                    if (data.maintenance) {
                        localStorage.setItem("S:M", 1);
                        this.setState({ maintenance: true });
                    } else {
                        localStorage.removeItem("S:M");
                        this.setState({ maintenance: false, maintenanceCache: null });
                    }
                }
            }
        });
    }

    render() {
        const { maintenance } = this.state;
        if (!maintenance) {
            return (
                <div className="page">
                    <div className="flex-fill">
                        <Warnings />
                        <HeaderMenu />
                        <Menu layout={this.props.match.url} />
                        <div className="my-3 my-md-5">
                            <Switch>
                                <Redirect exact from="/account" to="/account/profile" />
                                {indexRoutes.map((route, key) => {
                                    if (route.layout === "/account" || route.name === "404") {
                                        return (
                                            <Route
                                                {...route.prop}
                                                key={key}
                                                path={route.layout + route.path}
                                                component={route.component}
                                            />
                                        );
                                    } else return null;
                                })}
                            </Switch>
                        </div>
                    </div>
                    <Footer />
                </div>
            );
        } else {
            return <Maintenance />;
        }
    }
}

export default withRouter(Account);
