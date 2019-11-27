import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Menu from "../components/includes/Menu.jsx";
import HeaderMenu from "../components/includes/HeaderMenu.jsx";
import Warnings from "../components/includes/Warnings.jsx";
import Footer from "../components/includes/Footer.jsx";
import indexRoutes from "../routes/index.jsx";
const $ = require("jquery");
class App extends Component {
    constructor(props) {
        super(props);
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

    render() {
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
    }
}

export default withRouter(App);
