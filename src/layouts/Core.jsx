import React, {Component} from "react";
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import indexRoutes from "../routes/index.jsx";
import {createBrowserHistory} from "history";
import Protected from "../components/Auth/Login.jsx";

const history = createBrowserHistory();
const auth = {
    isAuthenticated: false,
    authenticated(callback) {
        this.isAuthenticated = true;
        setTimeout(callback, 100); // fake async
    },
    signout(callback) {
        this.isAuthenticated = false;
        setTimeout(callback, 100);
    }
};

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/" />
        }
    />
);

class Core extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    {indexRoutes.map((route, key) => {
                        console.log(route);
                        return (
                            <Route
                                {...route.props}
                                key={key}
                                path={route.path}
                                component={route.component}
                            />
                        );
                    })}
                    <PrivateRoute path="/protected" component={Protected} />
                </Switch>
            </Router>
        );
    }
}

export default Core;
