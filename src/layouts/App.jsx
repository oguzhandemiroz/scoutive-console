import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "../views/Dashboard/Dashboard.jsx";
import HeaderMenu from "../components/includes/HeaderMenu.jsx";

function App() {
	return (
		<Router>
			<HeaderMenu />
			<Route path="/home" component={Home} />
		</Router>
	);
}

export default App;
