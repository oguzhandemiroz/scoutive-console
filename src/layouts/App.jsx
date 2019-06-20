import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Menu from "../components/includes/Menu.jsx";
import HeaderMenu from "../components/includes/HeaderMenu.jsx";
import Footer from "../components/includes/Footer.jsx";
import indexRoutes from "../routes/index.jsx";
const $ = require("jquery");
class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidUpdate() {
		console.log("render");
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
					<HeaderMenu />
					<Menu layout={this.props.match.url} />
					<div className="my-3 my-md-5">
						<Switch>
							<Redirect exact from="/app" to="/app/dashboard" />
							<Redirect exact from="/app/groups" to="/app/groups/all" />
							{indexRoutes.map((route, key) => {
								console.log(route);
								if (route.layout === "/app" || route.name === "404") {
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
