import React, { Component } from "react";
import Income from "../../components/Accountings/Income";
import Expense from "../../components/Accountings/Expense";
import GeneralChart from "../../components/Accountings/GeneralChart";

export class Accountings extends Component {
	render() {
		return (
			<div className="container" style={{ marginTop: "-1.5rem" }}>
				<div className="row row-cards">
					<Income />
					<Expense />
				</div>
				<div className="row row-cards">
					<GeneralChart />
				</div>
			</div>
		);
	}
}

export default Accountings;
