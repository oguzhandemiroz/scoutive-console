import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Inputmask from "inputmask";
import moment from "moment";
import { showSwal } from "../../Alert";
import { GetBudgets } from "../../../services/FillSelect";
const $ = require("jquery");

export class Invoice extends Component {
	constructor(props) {
		super(props);

		this.state = {
			check_expiry: 0,
			invoice_date: new Date(),
			expiry_date: new Date(),
			formErrors: {
				note: "",
				invoice_date: "",
				expiry_date: ""
			}
		};
	}

	handleDate = (value, name) => {
		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: value ? "" : "is-invalid"
			},
			[name]: value
		}));

		if (name === "expiry_date") {
			const today = new Date();
			const date = moment(value);
			console.log(today, date.toDate());
			this.setState({ check_expiry: Math.ceil(date.diff(today, "days", true)) });
		}
	};

	handleExpiry = e => {
		const { value } = e.target;
		this.setState({
			check_expiry: parseInt(value),
			expiry_date: moment()
				.add(parseInt(value), "days")
				.toDate()
		});
	};

	render() {
		const { invoice_date, expiry_date, check_expiry, formErrors } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gelir &mdash; Fatura</h1>
				</div>

				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-12 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className="fa fa-receipt mr-2" /> Fatura
								</h3>
							</div>
							<div className="card-body pb-0">
								<div className="row">
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label className="form-label">
												Fatura Açıklaması <span className="form-required">*</span>
											</label>
											<input
												type="text"
												name="note"
												className={`form-control ${formErrors.note}`}
												onChange={this.handleChange}
											/>
										</div>
									</div>

									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label className="form-label">
												Düzenleme Tarihi <span className="form-required">*</span>
											</label>
											<DatePicker
												todayButton="Bugün"
												selected={invoice_date}
												selectsStart
												startDate={invoice_date}
												name="invoice_date"
												locale="tr"
												dateFormat="dd/MM/yyyy"
												onChange={date => this.handleDate(date, "invoice_date")}
												className={`form-control ${formErrors.invoice_date}`}
											/>
										</div>
									</div>

									<div className="col-12">
										<div className="form-group">
											<label className="form-label">
												Vade Tarihi <span className="form-required">*</span>
											</label>
											<div className="row gutters-md">
												<div className="col-sm-12 col-md-6 col-lg-6 mb-sm-3 mb-lg-0">
													<DatePicker
														todayButton="Bugün"
														selected={expiry_date}
														selectsStart
														startDate={expiry_date}
														name="expiry_date"
														locale="tr"
														dateFormat="dd/MM/yyyy"
														onChange={date => this.handleDate(date, "expiry_date")}
														className={`form-control ${formErrors.expiry_date}`}
													/>
												</div>
												<div className="col-sm-12 col-md-6 col-lg-6">
													<div className="selectgroup w-100">
														<label className="selectgroup-item">
															<input
																type="radio"
																name="value"
																value="0"
																className="selectgroup-input"
																onChange={this.handleExpiry}
																checked={check_expiry === 0}
															/>
															<span className="selectgroup-button">Aynı Gün</span>
														</label>
														<label className="selectgroup-item">
															<input
																type="radio"
																name="value"
																value="7"
																className="selectgroup-input"
																onChange={this.handleExpiry}
																checked={check_expiry === 7}
															/>
															<span className="selectgroup-button">7 Gün</span>
														</label>
														<label className="selectgroup-item">
															<input
																type="radio"
																name="value"
																value="14"
																className="selectgroup-input"
																onChange={this.handleExpiry}
																checked={check_expiry === 14}
															/>
															<span className="selectgroup-button">14 Gün</span>
														</label>
														<label className="selectgroup-item">
															<input
																type="radio"
																name="value"
																value="30"
																className="selectgroup-input"
																onChange={this.handleExpiry}
																checked={check_expiry === 30}
															/>
															<span className="selectgroup-button">30 Gün</span>
														</label>
														<label className="selectgroup-item">
															<input
																type="radio"
																name="value"
																value="60"
																className="selectgroup-input"
																onChange={this.handleExpiry}
																checked={check_expiry === 60}
															/>
															<span className="selectgroup-button">60 Gün</span>
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="col-12">
										<div className="form-group">
											<label className="form-label">
												Fatura Numarası <span className="form-required">*</span>
											</label>
											<div className="row gutters-md">
												<div className="col-sm-12 col-md-6 col-lg-6 mb-sm-3 mb-lg-0">
													<div class="input-group">
														<span class="input-group-prepend" id="basic-addon1">
															<span class="input-group-text">Seri</span>
														</span>
														<input type="text" name="serial_no" class="form-control" />
													</div>
												</div>
												<div className="col-sm-12 col-md-6 col-lg-6">
													<div class="input-group">
														<span class="input-group-prepend" id="basic-addon1">
															<span class="input-group-text">Sıra</span>
														</span>
														<input type="text" name="row_no" class="form-control" />
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="col-lg-3 col-sm-12">
										<div class="form-group">
											<label class="form-label">Hizmet/Ürün</label>
											<input type="text" class="form-control" />
										</div>
									</div>
									<div className="col-lg-2 col-sm-12">
										<div class="form-group">
											<label class="form-label">Miktar</label>
											<input type="text" class="form-control" />
										</div>
									</div>
									<div className="col-lg-2 col-sm-12">
										<div class="form-group">
											<label class="form-label">Birim Fiyatı</label>
											<input type="text" class="form-control" />
										</div>
									</div>
									<div className="col-lg-2 col-sm-12">
										<div class="form-group">
											<label class="form-label">Vergi</label>
											<input type="text" class="form-control" />
										</div>
									</div>
									<div className="col-lg-2 col-sm-12">
										<div class="form-group">
											<label class="form-label">Toplam</label>
											<input type="text" class="form-control" />
										</div>
									</div>
									<div className="col-12">
										<hr className="my-3" />
									</div>
								</div>
							</div>

							<div className="card-header">
								<h3 className="card-title">Özet</h3>
							</div>

							<fieldset class="form-fieldset mb-0" style={{ borderRadius: 0, border: 0 }}></fieldset>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default Invoice;
