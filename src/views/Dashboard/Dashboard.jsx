import React, { Component } from "react";
import Budget from "../../components/Dashboard/Budget";
import EmployeeRollcall from "../../components/Dashboard/EmployeeRollcall";
import PlayerRollcall from "../../components/Dashboard/PlayerRollcall";

class Dashboard extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Genel Durum</h1>
				</div>
				<div className="row row-cards">
					<div className="col-sm-12 col-lg-4">
						<EmployeeRollcall />
					</div>
					<div className="col-sm-12 col-lg-4">
						<PlayerRollcall />
					</div>
					<div className="col-sm-12 col-lg-4">
						<Budget />
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
