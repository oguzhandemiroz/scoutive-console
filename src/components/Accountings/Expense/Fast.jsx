import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CreateAccountingRecord, ListAccountingTypes } from "../../../services/Accounting";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../../assets/js/core";
import { GetBudgets } from "../../../services/FillSelect";
import Inputmask from "inputmask";
import moment from "moment";
import { showSwal } from "../../Alert";
const $ = require("jquery");

Inputmask.extendDefaults({
	autoUnmask: true
});

Inputmask.extendAliases({
	try: {
		suffix: " ₺",
		radixPoint: ",",
		groupSeparator: ".",
		alias: "numeric",
		autoGroup: true,
		digits: 2,
		digitsOptional: false,
		clearMaskOnLostFocus: false,
		allowMinus: false,
		allowPlus: false,
		rightAlign: false
	}
});

const InputmaskDefaultOptions = {
	showMaskOnHover: false,
	showMaskOnFocus: false,
	placeholder: "0,00",
	autoUnmask: true
};

const { Option } = components;
const BudgetIconOption = props => (
	<Option {...props}>
		<span>
			<i
				className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
				style={{ backgroundImage: `url(${props.data.image})` }}
			/>
			{props.data.label}
			<div className="small text-muted">
				Bütçe: <b>{props.data.balance.format() + " ₺"}</b>
			</div>
		</span>
	</Option>
);

export class Fast extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			accounting_type: null,
			note: null,
			amount: null,
			budget: null,
			type: 0,
			payment_date: new Date(),
			select: {
				accounting_types: null,
				budgets: null
			},
			formErrors: {
				accounting_type: false,
				note: "",
				payment_date: "",
				amount: "",
				budget: false
			},
			loadingButton: ""
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				salary: $("[name=amount]")
			};
			Inputmask({
				alias: "try",
				...InputmaskDefaultOptions
			}).mask(elemArray.salary);
		} catch (e) {}
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	componentDidMount() {
		this.fieldMasked();
		this.listAccountingTypes();
		this.listBudgets();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, accounting_type, type, note, payment_date, amount, budget } = this.state;

		if (formValid(this.state)) {
			this.setState({ loadingButton: "btn-loading" });
			CreateAccountingRecord({
				uid: uid,
				type: type,
				accounting_type_id: accounting_type.value,
				budget_id: budget.value,
				amount: parseFloat(amount.replace(",", ".")),
				payment_date: moment(payment_date).format("YYYY-MM-DD"),
				note: note
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						showSwal({
							type: "success",
							title: "Başarılı!",
							backdrop: false,
							toast: true,
							confirmButtonText: "Görüntüle",
							cancelButtonText: "Eklemeye devam et",
							cancelButtonColor: "#868e96",
							confirmButtonColor: "#316cbe",
							showCancelButton: true,
							reverseButtons: true,
							position: "top-end",
							timer: 5000
						}).then(result => {
							if (result.value) {
								this.props.history.push("/app/accountings/expense/detail/" + response.accounting_id);
							} else if (result.dismiss) {
								this.reload();
							}
						});
					}
				}
				this.setState({ loadingButton: "" });
			});
		} else {
			console.error("ERROR FORM");
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					accounting_type: accounting_type ? false : true,
					budget: budget ? false : true,
					note: note ? "" : "is-invalid",
					payment_date: payment_date ? "" : "is-invalid",
					amount: amount ? "" : "is-invalid"
				}
			}));
		}
	};

	handleChange = e => {
		const { name, value } = e.target;

		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: value ? (value === "0,00" ? "is-invalid" : "") : "is-invalid"
			},
			[name]: value === "0,00" ? null : value
		}));
	};

	handleSelect = (value, name) => {
		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: value ? false : true
			},
			[name]: value
		}));
	};

	handleDate = (value, name) => {
		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: value ? "" : "is-invalid"
			},
			[name]: value
		}));
	};

	listAccountingTypes = () => {
		ListAccountingTypes(0).then(response =>
			this.setState(prevState => ({
				select: {
					// object that we want to update
					...prevState.select, // keep all other key-value pairs
					accounting_types: response // update the value of specific key
				}
			}))
		);
	};

	listBudgets = () => {
		try {
			GetBudgets().then(response => {
				this.setState(prevState => ({
					select: {
						// object that we want to update
						...prevState.select, // keep all other key-value pairs
						budgets: response // update the value of specific key
					},
					budget: response.find(x => x.default === 1)
				}));
			});
		} catch (e) {}
	};

	render() {
		const { budget, payment_date, select, formErrors, loadingButton } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gider &mdash; Hızlı İşlem</h1>
				</div>

				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-12 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className="fa fa-minus-square mr-2" /> Hızlı İşlem
								</h3>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col-12">
										<div className="form-group">
											<label className="form-label">
												Kategori <span className="form-required">*</span>
											</label>
											<Select
												onChange={val => this.handleSelect(val, "accounting_type")}
												options={select.accounting_types}
												name="accounting_type"
												placeholder="Seç..."
												styles={
													formErrors.accounting_type
														? selectCustomStylesError
														: selectCustomStyles
												}
												isClearable={true}
												isSearchable={true}
												isDisabled={select.accounting_types ? false : true}
												isLoading={select.accounting_types ? false : true}
												noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
											/>
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label className="form-label">
												İşlem Açıklaması <span className="form-required">*</span>
											</label>
											<input
												placeholder="İşlem Açıklaması"
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
												İşlem Tarihi <span className="form-required">*</span>
											</label>
											<DatePicker
                                                autoComplete="off"
												selected={payment_date}
												selectsStart
												startDate={payment_date}
												name="payment_date"
												locale="tr"
												dateFormat="dd/MM/yyyy"
												onChange={date => this.handleDate(date, "payment_date")}
												className={`form-control ${formErrors.payment_date}`}
											/>
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label className="form-label">
												Tutar <span className="form-required">*</span>
											</label>
											<input
												type="text"
												name="amount"
												className={`form-control ${formErrors.amount}`}
												onChange={this.handleChange}
											/>
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label className="form-label">
												Kasa Hesabı <span className="form-required">*</span>
											</label>
											<Select
												value={budget}
												onChange={val => this.handleSelect(val, "budget")}
												options={select.budgets}
												name="budget"
												placeholder="Kasa Seç..."
												styles={
													formErrors.budget ? selectCustomStylesError : selectCustomStyles
												}
												isClearable={true}
												isSearchable={true}
												isDisabled={select.budgets ? false : true}
												isLoading={select.budgets ? false : true}
												noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
												components={{ Option: BudgetIconOption }}
												autoSize
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer d-flex justify-content-between align-items-center">
								<Link to={`/app/accountings`}>Geri dön</Link>
								<button className={`btn btn-danger ${loadingButton}`}>Kaydet</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(Fast);
