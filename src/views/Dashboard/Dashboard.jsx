import React, { Component } from "react";
import { Revenue, Cost, Budgets } from "../../components/Dashboard/dashboard";

class Dashboard extends Component {

	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Genel Durum</h1>
				</div>
				<div className="row row-cards">
					<Budgets />
				</div>
			</div>
		);
	}
}

export default Dashboard;
