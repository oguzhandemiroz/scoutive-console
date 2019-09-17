import React, { Component } from "react";
import { GetBudget, MakeDefaultBudget, BalanceHistoryBudget } from "../../services/Budget";
import { nullCheck } from "../../services/Others";
import { Link } from "react-router-dom";
import "jquery";
import Inputmask from "inputmask";
import moment from "moment";
import AmountIncreaseModal from "./Modals/AmountIncreaseModal";
import AmountDecreaseModal from "./Modals/AmountDecreaseModal";
import TransferModal from "./Modals/TransferModal";
import List from "./Detail/List";
import Report from "./Detail/Report";
const $ = require("jquery");

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

export class Detail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			budget_name: "",
			budget_type: -1,
			balance: 0,
			currency: "TRY",
			note: "—",
			loadingData: true,
			loadingDefaultButton: ""
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
						this.setState({ ...data, default_budget: data.default });
					}
					this.setState({ loadingData: false });
				}
			});
		} catch (e) {}
	};

	makeDefault = () => {
		try {
			const { uid } = this.state;
			const { bid } = this.props.match.params;
			this.setState({ loadingDefaultButton: "btn-loading" });
			MakeDefaultBudget({
				uid: uid,
				budget_id: bid
			}).then(response => {
				if (response) {
					this.setState({ default_budget: 1 });
				}
				this.setState({ loadingDefaultButton: "" });
			});
		} catch (e) {}
	};

	render() {
		const {
			bank_name,
			bank_branch,
			bank_account_number,
			iban,
			note,
			last_update,
			budget_name,
			balance,
			currency,
			default_budget,
			budget_type,
			loadingData,
			loadingDefaultButton
		} = this.state;
		const getBudgetType = budgetType[budget_type];
		const getCurrencyType = currencyType[currency];
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Kasa ve Bankalar &mdash; {budget_name}</h1>
					<div className="ml-auto">
						{default_budget === 1 ? (
							<span className="tag tag-primary">
								Varsayılan Olarak Tanımlı
								<span className="tag-addon">
									<i className="fe fe-check"></i>
								</span>
							</span>
						) : default_budget === 0 ? (
							<button
								onClick={this.makeDefault}
								className={`btn btn-sm btn-primary ${loadingDefaultButton}`}>
								Varsayılan Yap
							</button>
						) : null}
					</div>
				</div>
				<div className="row">
					<div className="col-lg-8 col-md-12">
						<List match={this.props.match} />
					</div>

					<div className="col-lg-4 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className={`fa fa-${getBudgetType.icon} mr-2`}></i>
									{budget_name}
								</h3>
							</div>
							<Report match={this.props.match} />
							<div className="card-body">
								<div className={`dimmer ${loadingData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="form-group mb-5">
											<div className="float-right d-flex flex-column">
												<span
													data-toggle="tooltip"
													data-placement="left"
													title="Para Girişi Ekle">
													<button
														className="btn btn-sm btn-icon btn-success"
														data-toggle="modal"
														data-target="#amountIncreaseModal">
														<i className="fe fe-plus" />
													</button>
													<AmountIncreaseModal
														history={this.props.history}
														bid={this.props.match.params.bid}
														budget={{
															name: budget_name,
															balance: balance,
															currency: getCurrencyType.sign
														}}
													/>
												</span>
												<span
													data-toggle="tooltip"
													data-placement="left"
													title="Para Çıkışı Ekle">
													<button
														className="btn btn-sm btn-icon btn-danger my-1"
														data-toggle="modal"
														data-target="#amountDecreaseModal">
														<i className="fe fe-minus" />
													</button>
													<AmountDecreaseModal
														history={this.props.history}
														bid={this.props.match.params.bid}
														budget={{
															name: budget_name,
															balance: balance,
															currency: getCurrencyType.sign
														}}
													/>
												</span>
												<span
													data-toggle="tooltip"
													data-placement="left"
													title="Hesaplar Arası Transfer">
													<button
														className="btn btn-sm btn-icon btn-azure"
														data-toggle="modal"
														data-target="#transferModal">
														<i className="fa fa-exchange-alt" />
													</button>
													<TransferModal
														history={this.props.history}
														bid={this.props.match.params.bid}
													/>
												</span>
											</div>
											<h3 className="mb-1">{balance.format() + " " + getCurrencyType.sign}</h3>
											<div className="text-muted">Bakiye</div>
										</div>

										<div className="form-group">
											<label className="form-label">Hesap Türü</label>
											<div className="form-control-plaintext">{getBudgetType.text}</div>
										</div>

										<div className="form-group">
											<label className="form-label">Para Birimi</label>
											<div className="form-control-plaintext">
												{getCurrencyType.sign} ({currency})
											</div>
										</div>

										<div className="form-group">
											<label className="form-label">Not</label>
											<div className="form-control-plaintext">{nullCheck(note, "—")}</div>
										</div>

										{budget_type === 1 ? (
											<div>
												<hr className="my-5" />
												<div className="form-group">
													<label className="form-label">Banka Adı</label>
													<div className="form-control-plaintext">{bank_name}</div>
												</div>

												<div className="form-group">
													<label className="form-label">Banka Şubesi</label>
													<div className="form-control-plaintext">
														{nullCheck(bank_branch, "—")}
													</div>
												</div>

												<div className="form-group">
													<label className="form-label">Banka Hesap Numarası</label>
													<div className="form-control-plaintext">
														{nullCheck(bank_account_number, "—")}
													</div>
												</div>

												<div className="form-group">
													<label className="form-label">IBAN</label>
													<div className="form-control-plaintext">
														{iban
															? Inputmask.format(iban, {
																	mask: "AA99 9999 9999 9999 9999 99"
															  })
															: "—"}
													</div>
												</div>
											</div>
										) : null}
										<hr className="my-5" />
										<div className="form-group">
											<label className="form-label">Son Güncelleme Tarihi</label>
											<div className="form-control-plaintext">
												{moment(last_update).format("LLL")}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer">
								<Link to="#" className={`btn btn-link btn-block ${loadingData ? "disabled" : ""}`}>
									Hesabı Düzenle
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Detail;
