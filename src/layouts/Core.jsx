import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Auth from "./Auth";
import App from "./App";
import Account from "./Account";
import _404 from "../views/Pages/404.jsx";

const auth = {
    isAuthenticated: localStorage.getItem("UID") ? true : false
};

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/" />
        }
    />
);

const PublicRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            auth.isAuthenticated === false ? <Component {...props} /> : <Redirect to="/" />
        }
    />
);

export class Core extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Redirect strict exact from="/" to={auth.isAuthenticated ? "/app" : "/auth"} />
                    <PublicRoute path="/auth" component={Auth} />
                    <PrivateRoute path="/app" component={App} />
                    <PrivateRoute path="/account" component={Account} />
                    <Route path="*" component={_404} />
                    <Route path="/reload" component={null} key="reload" />
                </Switch>
            </Router>
        );
    }
}

export default Core;
