import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import Auth from "./Auth";
import App from "./App";
import _404 from "../views/Pages/404.jsx";

const history = createBrowserHistory();

export class Core extends Component {
	render() {
		return (
			<Router history={history}>
				<Switch>
					<Redirect strict exact from="/" to="/auth" />
					<Route path="/auth" component={Auth}/>
					<Route path="/app" component={App}/>
					<Route path="*" component={_404} />
				</Switch>
			</Router>
		);
	}
}

export default Core;
