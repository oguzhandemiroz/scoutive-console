import React, {Component} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import indexRoutes from "../routes/index.jsx";

class Auth extends Component {
    render() {
        return (
            <Switch>
                <Redirect exact from="/auth" to="/auth/login" />
                {indexRoutes.map((route, key) => {
                    if (route.layout === "/auth" || route.name === "404") {
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
        );
    }
}

export default Auth;
