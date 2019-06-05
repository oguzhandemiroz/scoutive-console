import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect, withRouter} from "react-router-dom";
import {createBrowserHistory} from "history";
import Auth from "./Auth";
import App from "./App";
import _404 from "../views/Pages/404.jsx";

const history = createBrowserHistory();

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
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Redirect strict exact from="/" to={auth.isAuthenticated ? "/app" : "/auth"} />
                    <PublicRoute path="/auth" component={Auth} />
                    <PrivateRoute path="/app" component={App} />
                    <Route path="*" component={_404} />
                </Switch>
            </Router>
        );
    }
}

export default Core;
