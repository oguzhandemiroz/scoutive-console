import React, { Component } from "react";
import AllList from "./Detail/AllList";
import Report from "./Detail/Report";
import BudgetAccountingCategories from "./Charts/BudgetAccountingCategories";
import { GetBudget } from "../../services/Budget";

export class Transaction extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			budget_name: ""
		};
	}

	componentDidMount() {
		this.renderBudgetDetail();
	}

	renderBudgetDetail = () => {
		try {
			const { uid } = this.state;
			const { bid } = this.props.match.params;
			GetBudget({
				uid: uid,
				budget_id: bid
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data;
						this.setState({ ...data });
					}
				}
			});
		} catch (e) {}
	};
	render() {
		const { budget_name } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Kasa ve Bankalar &mdash; {budget_name} &mdash; Tüm İşlemler</h1>
				</div>

				<div className="row row-cards">
					<div className="col-sm-6 col-md-4">
						<BudgetAccountingCategories match={this.props.match} />
					</div>
					<div className="col-sm-6 col-md-8"></div>
				</div>

				<div className="row row-cards">
					<div className="col-12">
						<AllList match={this.props.match} />
					</div>
				</div>
			</div>
		);
	}
}

export default Transaction;
