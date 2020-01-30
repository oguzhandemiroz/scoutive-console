import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import indexRoutes from "../routes/index.jsx";
import BackToApp from "../components/includes/BackToApp";

export class Printable extends Component {
    render() {
        return (
            <div className="page">
                <div className="flex-fill">
                    <BackToApp />
                    <div className="my-3 my-md-5">
                        <Switch>
                            {indexRoutes.map((route, key) => {
                                if (route.layout === "/printable" || route.name === "404") {
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
            </div>
        );
    }
}

export default withRouter(Printable);
