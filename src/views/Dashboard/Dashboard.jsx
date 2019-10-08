import React, { Component } from "react";
import Budget from "../../components/Dashboard/Budget";
import EmployeeRollcall from "../../components/Dashboard/EmployeeRollcall";
import PlayerRollcall from "../../components/Dashboard/PlayerRollcall";
import DailyCreatedPlayer from "../../components/Dashboard/DailyCreatedPlayer";
import Birthdays from "../../components/Dashboard/Birthdays";
import TrainingGroups from "../../components/Dashboard/TrainingGroups";
import UnpaidPlayers from "../../components/Dashboard/UnpaidPlayers";
import FastMenu from "../../components/Dashboard/FastMenu";
import DailyPlayer from "../../components/Dashboard/DailyPlayer";
import Accounting from "../../components/Dashboard/Accounting";
import AccountingChart from "../../components/Dashboard/AccountingChart";

class Dashboard extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Genel Durum</h1>
				</div>
				<PlayerRollcall />
				<div className="row row-cards">
					<DailyPlayer />
					<Accounting />
				</div>
				<div className="row row-cards">
					<AccountingChart />
				</div>
				<div className="row row-cards">
					<div className="col-sm-12 col-lg-4 order-1">
						<UnpaidPlayers />
					</div>
					<div className="col-sm-12 col-lg-4 order-1">
						<Birthdays />
					</div>
					<div className="col-sm-12 col-lg-4 order-1">
						<TrainingGroups />
						<FastMenu />
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
