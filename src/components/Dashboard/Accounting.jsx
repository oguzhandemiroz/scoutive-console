import React, { Component } from "react";
import { ListAccountingRecords } from "../../services/Accounting";
import moment from "moment";
import _ from "lodash";
const $ = require("jquery");

export class Accounting extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			recordsIncome: null,
			recordsExpense: null,
			recordsEndorsement: null
		};
	}

	componentDidMount() {
		this.listAccountingRecords();
	}

	listAccountingRecords = () => {
		const { uid } = this.state;
		ListAccountingRecords({
			uid: uid,
			filter: {
				payment_date: moment()
					.startOf("day")
					.format("YYYY-MM-DD")
			}
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					const income = data.filter(x => x.type === 1);
					const expense = data.filter(x => x.type === 0);
					console.log(income, expense);
					const totalIncome = _.sumBy(income, "amount");
					const totalExpense = _.sumBy(expense, "amount");
					this.setState({
						recordsIncome: totalIncome,
						recordsExpense: totalExpense,
						recordsEndorsement: totalIncome - totalExpense
					});
					$('[data-toggle="tooltip"]').tooltip();
				}
			}
		});
	};

	render() {
		const { recordsIncome, recordsExpense, recordsEndorsement } = this.state;
		return (
			<>
				<div className="col-md-6 col-sm-6 col-lg-3">
					<div className="card">
						<div className="card-body p-3 text-center">
							{recordsIncome !== null ? (
								<div
									data-html="true"
									data-toggle="tooltip"
									data-title={`Bugünün Toplam Geliri: <h5>${
										recordsIncome !== null ? recordsIncome.format() + " ₺" : "0,00 ₺"
									}</h5>`}
									className="h1 m-0 mt-2">
									{recordsIncome.nFormatter(2) + " ₺"}
								</div>
							) : (
								<div className="loader m-auto" />
							)}
							<div className="text-muted mb-2">Günlük Gelir</div>
						</div>
					</div>
				</div>
				<div className="col-md-6 col-sm-6 col-lg-3">
					<div className="card">
						<div className="card-body p-3 text-center">
							{recordsExpense !== null ? (
								<div
									data-html="true"
									data-toggle="tooltip"
									data-title={`Bugünün Toplam Gideri: <h5>${
										recordsExpense !== null ? recordsExpense.format() + " ₺" : "0,00 ₺"
									}</h5>`}
									className="h1 m-0 mt-2">
									{recordsExpense.nFormatter(2) + " ₺"}
								</div>
							) : (
								<div className="loader m-auto" />
							)}
							<div className="text-muted mb-2">Günlük Gider</div>
						</div>
					</div>
				</div>
				<div className="col-md-6 col-sm-6 col-lg-3">
					<div className="card">
						<div className="card-body p-3 text-center">
							{recordsEndorsement !== null ? (
								<div
									data-html="true"
									data-toggle="tooltip"
									data-title={`Bugünün Toplam Cirosu: <h5>${
										recordsEndorsement !== null ? recordsEndorsement.format() + " ₺" : "0,00 ₺"
									}</h5>`}
									className={`h1 m-0 mt-2 ${recordsEndorsement > 0 ? "text-green" : "text-red"}`}>
									{recordsEndorsement.nFormatter(2) + " ₺"}
								</div>
							) : (
								<div className="loader m-auto" />
							)}
							<div className="text-muted mb-2">Günlük Ciro</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default Accounting;
