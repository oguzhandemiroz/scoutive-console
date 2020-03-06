import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Menu from "../components/includes/Menu.jsx";
import HeaderMenu from "../components/includes/HeaderMenu.jsx";
import Warnings from "../components/includes/Warnings.jsx";
import Footer from "../components/includes/Footer.jsx";
import FABs from "../components/Others/FABs";
import indexRoutes from "../routes/index.jsx";
import { Start } from "../services/Starts.jsx";
const $ = require("jquery");

class App extends Component {
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
        Start();
    }
    render() {
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
                                                route.condition ? (
                                                    <route.component {...props} />
                                                ) : (
                                                    <Redirect to="/app/" />
                                                )
                                            }
                                        />
                                    );
                                } else return null;
                            })}
                        </Switch>
                    </div>
                </div>
                <FABs />
                <Footer />
            </div>
        );
    }
}

export default withRouter(App);
