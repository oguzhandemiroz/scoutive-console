import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Menu from "../components/includes/Menu";
import HeaderMenu from "../components/includes/HeaderMenu";
import Warnings from "../components/includes/Warnings";
import Footer from "../components/includes/Footer";
import Maintenance from "../components/Maintenance";
import indexRoutes from "../routes/index";
import { Start } from "../services/Starts";
const $ = require("jquery");

class App extends Component {
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
        if ($(".modal-backdrop.show")) {
            $(".modal-backdrop.show").remove();
            $("body").removeClass("modal-open");
            $("body").removeAttr("style");
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
        const { maintenanceCache, maintenance } = this.state;
        if (maintenanceCache || maintenance) {
            return <Maintenance />;
        } else {
            return (
                <div className="page">
                    <div className="flex-fill">
                        <Warnings />
                        <HeaderMenu />
                        <Menu />
                        {/*  <CommunicationService /> */}
                        <div className="my-3 my-md-5">
                            <Switch>
                                <Redirect exact from="/app" to="/app/dashboard" />
                                <Redirect exact from="/app/rollcalls" to="/app/rollcalls/player" />
                                <Redirect exact from="/app/persons" to="/app/persons/employees" />
                                {indexRoutes.map((route, key) => {
                                    if (route.layout === "/app" || route.name === "404") {
                                        return (
                                            <Route
                                                {...route.prop}
                                                key={key}
                                                path={route.layout + route.path}
                                                render={props =>
                                                    route.condition === false ? (
                                                        <Redirect to="/app/" />
                                                    ) : (
                                                        <route.component {...props} />
                                                    )
                                                }
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
        }
    }
}

export default withRouter(App);
