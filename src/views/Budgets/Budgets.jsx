import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import List from "../../components/Budgets/List";
import TotalCaseAmount from "../../components/Budgets/Charts/TotalCaseAmount";
import TotalBankAmount from "../../components/Budgets/Charts/TotalBankAmount";
import TotalAmount from "../../components/Budgets/Charts/TotalAmount";
import { ListBudgets } from "../../services/Budget";

export class Budgets extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: []
		};
	}

	componentDidMount() {
		this.renderBudgetList();
	}

	renderBudgetList = () => {
		const { uid } = this.state;
		ListBudgets(uid).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) this.setState({ data: response.data });
			}
		});
	};

	render() {
		const { data } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Kasa ve Bankalar</h1>
					<Link to="/app/budgets/add" className="btn btn-sm btn-success ml-auto">
						Yeni Oluştur
					</Link>
				</div>

				<div className="row row-cards">
					<div className="col-lg-4 col-sm-12">
						<TotalCaseAmount data={data} />
					</div>

					<div className="col-lg-4 col-sm-12">
						<TotalBankAmount data={data} />
					</div>

					<div className="col-lg-4 col-sm-12">
						<TotalAmount data={data} />
					</div>
				</div>
				
				<div className="row row-cards">
					<div className="col">
						<div className="card">
							<div className="table-responsive employee-list">
								<List history={this.props.history} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Budgets);
