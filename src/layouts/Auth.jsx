import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import indexRoutes from "../routes/index.jsx";
import Protected from "../components/Auth/Login.jsx";

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

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => (auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/" />)}
	/>
);

class Auth extends Component {
	render() {
		return (
			<Switch>
				<Redirect exact from="/auth" to="/auth/login" />
				<PrivateRoute exact path="/protected" component={Protected} />
				{indexRoutes.map((route, key) => {
					console.log(route);
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
