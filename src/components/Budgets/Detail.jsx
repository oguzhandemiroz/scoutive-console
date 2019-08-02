import React, { Component } from "react";
import { GetBugdet } from "../../services/Budget";
import { nullCheck } from "../../services/Others";
import "jquery";
import c3 from "c3";
import "../../assets/css/c3.min.css";
import sc from "../../assets/js/sc";

const budgetType = {
	"-1": { icon: "", text: "—" },
	0: { icon: "briefcase", text: "Kasa" },
	1: { icon: "university", text: "Banka" }
};

const currencyType = {
	TRY: { icon: "lira-sign", text: "TRY", sign: "₺" },
	USD: { icon: "dollar-sign", text: "USD", sign: "$" },
	EUR: { icon: "euro-sign", text: "EUR", sign: "€" },
	GBP: { icon: "pound-sign", text: "GBP", sign: "£" }
};

const chartOptions = {
	padding: {
		bottom: -1,
		left: -1,
		right: -1
	},
	legend: {
		position: "inset",
		padding: 0,
		inset: {
			anchor: "top-left",
			x: 10,
			y: 3,
			step: 10
		}
	},
	tooltip: {
		format: {
			value: function(value, ratio, id, index) {
				return value.format() + " ₺";
			}
		}
	},
	axis: {
		x: {
			type: "timeseries",
			localtime: true,
			tick: {
				fit: true,
				format: "%Y-%m-%d",
				culling: {
					max: 5
				}
			},
			padding: {
				left: 0,
				right: 0
			},
			show: true
		}
	}
};

class Report extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [11, 8, 15, 18, 19, 17, 23, 33],
			data2: [7, 7, 5, 7, 9, 12, 6, 8]
		};
	}
	shouldComponentUpdate() {
		return false;
	}
	componentDidMount() {
		this.renderChart();
	}
	componentDidUpdate() {
		this.renderChart();
	}

	renderChart() {
		c3.generate({
			bindto: "#budget-report",
			data: {
				x: "x",
				columns: [
					[
						"x",
						"2013-01-01",
						"2013-01-02",
						"2013-01-03",
						"2013-01-04",
						"2013-01-05",
						"2013-01-06",
						"2013-01-07"
					],
					["data1", ...this.state.data],
					["data2", ...this.state.data2]
				],
				type: "area", // default type of chart
				colors: {
					data1: sc.colors.blue,
					data2: sc.colors.pink
				},
				names: {
					// name of each serie
					data1: "Nakit Girişi",
					data2: "Nakit Çıkışı"
				}
			},
			...chartOptions
		});
	}

	render() {
		return <div id="budget-report" style={{ height: "100%" }} ref="budget-report" />;
	}
}

export class Detail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			budget_name: "—",
			budget_type: -1,
			balance: 0,
			currency: "TRY",
			note: "—",
			loadingData: true
		};
	}

	componentDidMount() {
		this.renderBudgetDetail();
	}

	renderBudgetDetail = () => {
		try {
			const { uid } = this.state;
			const { bid } = this.props.match.params;
			GetBugdet({
				uid: uid,
				budget_id: bid
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data;
						this.setState({ ...data });
					}
					this.setState({ loadingData: false });
				}
			});
		} catch (e) {}
	};

	render() {
		const {
			bank,
			bank_branch,
			bank_account_number,
			iban,
			note,
			last_update,
			budget_name,
			balance,
			currency,
			budget_type,
			loadingData
		} = this.state;
		const getBudgetType = budgetType[budget_type];
		const getCurrencyType = currencyType[currency];
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Kasa ve Bankalar &mdash; {budget_name}</h1>
				</div>
				<div className="row">
					<div className="col-8">
						<div className="card">
							<div className="card-body p-0">
								<Report />
							</div>
						</div>
					</div>

					<div className="col-4">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className={`fa fa-${getBudgetType.icon} mr-2`}></i>
									{getBudgetType.text} Detay
								</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loadingData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div class="form-group mb-5">
											<div class="card-value float-right text-blue">+5%</div>
											<h3 class="mb-1">{balance.format() + " " + getCurrencyType.sign}</h3>
											<div class="text-muted">Bakiye</div>
										</div>
										<div class="form-group">
											<label class="form-label">Hesap Adı</label>
											<div class="form-control-plaintext">{budget_name}</div>
										</div>

										<div class="form-group">
											<label class="form-label">Hesap Türü</label>
											<div class="form-control-plaintext">{getBudgetType.text}</div>
										</div>

										<div class="form-group">
											<label class="form-label">Para Birimi</label>
											<div class="form-control-plaintext">
												{getCurrencyType.sign} ({currency})
											</div>
										</div>

										<div class="form-group">
											<label class="form-label">Not</label>
											<div class="form-control-plaintext">{nullCheck(note, "—")}</div>
										</div>

										{budget_type === 1 ? (
											<div>
												<hr className="my-5" />
												<div class="form-group">
													<label class="form-label">Banka Adı</label>
													<div class="form-control-plaintext">{bank}</div>
												</div>

												<div class="form-group">
													<label class="form-label">Banka Şubesi</label>
													<div class="form-control-plaintext">
														{nullCheck(bank_branch, "—")}
													</div>
												</div>

												<div class="form-group">
													<label class="form-label">Banka Hesap Numarası</label>
													<div class="form-control-plaintext">
														{nullCheck(bank_account_number, "—")}
													</div>
												</div>

												<div class="form-group">
													<label class="form-label">IBAN</label>
													<div class="form-control-plaintext">{nullCheck(iban, "—")}</div>
												</div>
											</div>
										) : null}
									</div>
								</div>
							</div>
                            <div className="card-footer">
                                
                            </div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Detail;
