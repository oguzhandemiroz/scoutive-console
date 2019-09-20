import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ListEmployees } from "../../services/Employee";
import { fullnameGenerator, getSelectValue } from "../../services/Others";
import {
	ListAdvancePayments,
	ListVacations,
	CreateSalary,
	ListSalaries,
	PayVacations,
	PayAdvancePayments
} from "../../services/EmployeeAction";
import { GetBudgets } from "../../services/FillSelect";
import { Toast, showSwal } from "../Alert";
import Select, { components } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import moment from "moment";
import Inputmask from "inputmask";
const $ = require("jquery");

registerLocale("tr", tr);

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

const formValid = ({ formErrors, ...rest }) => {
	let valid = true;

	Object.values(formErrors).forEach(val => {
		val.length > 0 && (valid = false);
	});

	Object.values(rest).forEach(val => {
		val === null && (valid = false);
	});

	return valid;
};

const customStyles = {
	control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

const customStylesError = {
	control: styles => ({
		...styles,
		borderColor: "#cd201f",
		borderRadius: 3,
		":hover": { ...styles[":hover"], borderColor: "#cd201f" }
	})
};

const { Option } = components;
const ImageOption = props => (
	<Option {...props}>
		<span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
		{props.data.label}
	</Option>
);
const IconOption = props => (
	<Option {...props}>
		<span>
			<i
				className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
				style={{ backgroundImage: `url(${props.data.image})` }}
			/>
			{props.data.label}
			<div className="small text-muted">
				Bütçe: <b>{props.data.balance.format(2, 3, '.', ',') + " ₺"}</b>
			</div>
		</span>
	</Option>
);

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
	);

const initialState = {
	paid_date: new Date(),
	salary: null,
	employee: null,
	budget: null,
	tabSelect: 0
};

export class Salary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			formErrors: {
				employee: "",
				paid_date: ""
			},
			select: {
				employees: null,
				budgets: null
			},

			loadingData: false,
			loadingPast: false,
			loadingButton: "",
			tabData: null,
			payVacations: [],
			payAdvancePayments: []
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				salary: $("[name=salary]")
			};
			Inputmask({
				alias: "try",
				...InputmaskDefaultOptions
			}).mask(elemArray.salary);
		} catch (e) {}
	};

	componentDidMount() {
		let select = { ...this.state.select };
		this.fieldMasked();
		this.listEmployees(select);
		this.listBudgets(select);
	}

	paySalaryAlert = (employee, salary) => {
		try {
			return showSwal({
				type: "warning",
				title: "Uyarı",
				html: `Maaş ödemesi yapmadan önce <b>Geçmiş İşlemler'i</b> kontrol et. 
					Verilen "Avans" ve "İzinlerin" kesintisini yapman gerekebilir.
					Kesintileri yaptıysan devam edebilirsin
					<hr>
					<b>${employee.label}</b> adlı personele <b>${parseFloat(salary.replace(",", ".")).format(2, 3, '.', ',') + " ₺"}</b> maaş ödenecek`,
				confirmButtonText: "Devam et",
				cancelButtonText: "Kontrol et",
				confirmButtonColor: "#cd201f",
				cancelButtonColor: "#467fcf",
				showCancelButton: true,
				reverseButtons: true
			});
		} catch (e) {
			console.log(e);
		}
	};

	handleSubmit = e => {
		try {
			e.preventDefault();
			const {
				uid,
				formErrors,
				salary,
				budget,
				employee,
				paid_date,
				payVacations,
				payAdvancePayments
			} = this.state;
			const requiredData = {};
			requiredData.salary = salary;
			requiredData.employee = employee ? employee.value : null;
			requiredData.paid_date = paid_date;
			requiredData.budget = budget ? budget.value : null;
			requiredData.formErrors = formErrors;

			if (formValid(requiredData)) {
				showSwal({
					type: "warning",
					title: "Uyarı!",
					text: "Ödenen maaş, alması gereken maaştan fazla! Devam etmek istiyor musunuz?",
					confirmButtonText: "Evet",
					showCancelButton: true,
					cancelButtonText: "İptal",
					confirmButtonColor: "#cd201f",
					cancelButtonColor: "#868e96",
					reverseButtons: true
				}).then(re => {
					if (re.value) {
						this.paySalaryAlert(employee, salary).then(re => {
							if (re.value) {
								this.setState({ loadingButton: "btn-loading" });
								var statusOkay = {
									salary: false,
									vacation: false,
									advance_payment: false
								};
								Promise.all([
									CreateSalary({
										uid: uid,
										to: employee.value,
										amount: parseFloat(salary.replace(",", ".")),
										payment_date: moment(paid_date).format("YYYY-MM-DD"),
										budget_id: budget.value
									}),
									PayVacations({
										uid: uid,
										vacation_id_array: payVacations
									}),
									PayAdvancePayments({
										uid: uid,
										advance_payments: payAdvancePayments
									})
								]).then(([responseSalary, responseVacation, responseAdvancePayment]) => {
									if (responseSalary) {
										const status = responseSalary.status;
										if (status.code === 1020) statusOkay.salary = true;
									}
									if (responseVacation) {
										const status = responseVacation.status;
										if (status.code === 1020) {
											statusOkay.vacation = true;
											this.setState({ payVacations: [] });
										}
									}

									if (responseAdvancePayment) {
										const status = responseAdvancePayment.status;
										if (status.code === 1020) {
											statusOkay.advance_payment = true;
											this.setState({ payAdvancePayments: [] });
										}
									}

									if (statusOkay.salary && statusOkay.vacation && statusOkay.advance_payment) {
										Toast.fire({
											type: "success",
											title: "İşlem başarılı..."
										});
										this.renderSalaryTab();
									} else {
										Toast.fire({
											type: "warning",
											title: "Bir sorun oluştu..."
										});
									}
									this.setState({
										loadingButton: "",
										salary: employee.salary
											.format(2, 3, '.', ',')
											.toString()
											.split(".")
											.join("")
									});
								});
							}
						});
					}
				});
			} else {
				console.error("ERROR FORM");
				let formErrors = { ...this.state.formErrors };
				formErrors.salary = salary ? "" : "is-invalid";
				formErrors.employee = employee ? "" : "is-invalid";
				formErrors.salary = salary ? "" : "is-invalid";
				formErrors.paid_date = paid_date ? "" : "is-invalid";
				formErrors.budget = budget ? false : true;
				this.setState({ formErrors });
			}
		} catch (e) {
			console.log(e);
		}
	};

	handleChange = e => {
		try {
			const { name, value } = e.target;
			let formErrors = { ...this.state.formErrors };
			switch (name) {
				case "salary":
					formErrors.salary = value ? "" : "is-invalid";
					break;
				default:
					break;
			}
			if (name === "salary") {
				this.setState({ [name]: value === "0,00" ? null : value });
			} else {
				this.setState({ [name]: value });
			}

			this.setState({ formErrors });
		} catch (e) {}
	};

	handleDate = (date, name) => {
		let formErrors = { ...this.state.formErrors };
		switch (name) {
			case "paid_date":
				formErrors[name] = date ? "" : "is-invalid";
				break;
			default:
				break;
		}

		this.setState({ formErrors, [name]: date });
	};

	handleSelect = (value, name) => {
		try {
			let formErrors = { ...this.state.formErrors };
			formErrors[name] = value ? false : true;
			console.log(value, name);
			switch (name) {
				case "employee":
					{
						if (value) {
							this.setState(
								{
									[name]: value,
									salary: value.salary
										? value.salary
												.format(2, 3, '.', ',')
												.toString()
												.split(".")
												.join("")
										: null
								},
								() => this.renderSalaryTab()
							);
						} else {
							this.setState({ ...initialState, tabData: [] });
						}
					}
					break;
				default:
					this.setState({
						[name]: value
					});
					break;
			}
			this.setState({ formErrors });
		} catch (e) {}
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
	};

	listEmployees = select => {
		try {
			const { uid } = this.state;
			const to = this.props.match.params.uid;
			this.setState({ loadingData: true });
			ListEmployees(uid).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data;
						const selectData = [];
						data.map(el => {
							selectData.push({
								value: el.uid,
								label: fullnameGenerator(el.name, el.surname),
								image: el.image,
								salary: el.salary,
								salary_date: el.start_date
							});
						});
						select.employees = selectData;
						const toSalary = to ? getSelectValue(selectData, to, "value").salary : null;
						this.setState(
							{
								select,
								loadingData: false,
								employee: to ? getSelectValue(selectData, to, "value") : initialState.employee,
								salary: to
									? toSalary
										? toSalary
												.format(2, 3, '.', ',')
												.toString()
												.split(".")
												.join("")
										: null
									: null
							},
							() => this.renderSalaryTab()
						);
					}
				}
			});
		} catch (e) {}
	};

	listBudgets = select => {
		try {
			GetBudgets().then(response => {
				console.log(response);
				select.budgets = response;
				if (response) {
					this.setState({ budget: response.find(x => x.default === 1) });
				}
				this.setState({ select });
			});
		} catch (e) {}
	};

	renderSalaryTab = () => {
		const { uid, employee } = this.state;
		this.setState({ tabData: null, tabSelect: 0 });
		if (employee) {
			ListSalaries({
				uid: uid,
				to: employee.value
			}).then(response => {
				console.log(response);
				if (response) {
					const status = response.status;
					if (status.code === 1020) this.setState({ tabData: response.data.reverse() });
				}
			});
		}
	};

	renderAdvancePaymentTab = () => {
		try {
			const { uid, employee } = this.state;
			this.setState({ tabData: null, tabSelect: 1 });
			if (employee) {
				ListAdvancePayments({
					uid: uid,
					to: employee.value
				}).then(response => {
					console.log(response);
					if (response) {
						const status = response.status;
						if (status.code === 1020) this.setState({ tabData: response.data.reverse() });
					}
				});
			}
		} catch (e) {}
	};

	renderVacationTab = () => {
		const { uid, employee } = this.state;
		this.setState({ tabData: null, tabSelect: 2 });
		if (employee) {
			ListVacations(
				{
					uid: uid,
					to: employee.value
				},
				"employee"
			).then(response => {
				console.log(response);
				if (response) {
					const status = response.status;
					if (status.code === 1020) this.setState({ tabData: response.data.reverse() });
				}
			});
		}
	};

	salaryTabContent = (el, key) => {
		if (key < 10) {
			return (
				<li className="timeline-item" key={key.toString()}>
					<div className={`timeline-badge ${el.is_future === 0 ? "bg-success" : ""}`} />
					<div>
						<strong>{el.amount ? el.amount.format(2, 3, '.', ',') + " ₺" : null}</strong> maaş ödendi
					</div>
					<div className="timeline-time">{moment(el.payment_date).format("DD-MM-YYYY")}</div>

					<div>
						{el.is_future === 1 ? (
							<button
								type="button"
								data-toggle="tooltip"
								title="Maaşı Öde"
								className="btn btn-sm btn-success btn-icon p-1">
								<i className="fa fa-money-bill-wave"></i>
							</button>
						) : null}
					</div>
				</li>
			);
		}
	};

	advancePaymentTabContent = (el, key) => {
		if (el.status !== 1) return null;
		const { payAdvancePayments } = this.state;
		const findAdvancePayment = payAdvancePayments.filter(x => x.advance_payment_id === el.advance_payment_id);
		console.log(el.advance_payment_id, findAdvancePayment);
		var total = 0;
		findAdvancePayment.map(el => (total += el.paid_amount));
		return (
			<li className="timeline-item" key={key.toString()}>
				<div className={`timeline-badge ${el.paid_amount !== el.amount ? "" : "bg-primary"}`} />
				<div>
					<strong
						className={`${
							el.paid_amount !== 0 && el.amount !== el.paid_amount ? "text-line-through" : ""
						}`}>
						{el.amount.format(2, 3, '.', ',') + " ₺"}
					</strong>{" "}
					avans verildi.{" "}
					{el.paid_amount !== 0 && el.amount !== el.paid_amount ? (
						<strong>
							{(el.amount - el.paid_amount).format(2, 3, '.', ',') + " ₺"}
							<span className="font-weight-normal"> kaldı</span>
						</strong>
					) : null}
					{el.note ? <small className="d-block text-muted">Not: {el.note}</small> : null}
					{el.amount !== el.paid_amount ? (
						<div>
							<span className="text-red font-weight-600">{total.format(2, 3, '.', ',') + " ₺"}</span> tutarında kesinti
							uygulandı, <br /> kalan tutar:{" "}
							<strong>{(el.amount - el.paid_amount - total).format(2, 3, '.', ',') + " ₺"}</strong>
						</div>
					) : null}
				</div>
				<div className="timeline-time">{moment(el.advance_date).format("DD-MM-YYYY")}</div>
				<div className="ml-2">
					{!findAdvancePayment ? (
						el.paid_amount !== el.amount ? (
							<button
								onClick={() => this.payAdvancePayment(el)}
								type="button"
								data-toggle="tooltip"
								title="Maaşından Düşür"
								className="btn btn-sm btn-primary btn-icon p-1">
								<i className="fe fe-arrow-down-circle"></i>
							</button>
						) : (
							<i className="fa fa-check-circle text-primary"></i>
						)
					) : total + el.paid_amount === el.amount ? (
						<i className="fa fa-check-circle text-primary"></i>
					) : (
						<button
							onClick={() => this.payAdvancePayment(el)}
							type="button"
							data-toggle="tooltip"
							title="Maaşından Düşür"
							className="btn btn-sm btn-primary btn-icon p-1">
							<i className="fe fe-arrow-down-circle"></i>
						</button>
					)}
				</div>
			</li>
		);
	};

	vacationTabContent = (el, key) => {
		if (el.status !== 1 || el.no_cost === 0) return null;
		const { payVacations } = this.state;
		const findVacation = payVacations.find(x => x === el.vacation_id);
		return (
			<li className="timeline-item" key={key.toString()}>
				<div className={`timeline-badge ${el.status === 1 ? "" : "bg-primary"}`} />
				<div>
					<strong>{el.day} günlük ücretsiz</strong> izin verildi
					<small className="d-block text-muted">
						Günlük Kesinti: <strong>{el.daily_amount ? el.daily_amount.format(2, 3, '.', ',') + " ₺" : "—"}</strong>
					</small>
				</div>
				<div className="ml-auto">
					{!findVacation ? (
						el.status === 1 ? (
							<button
								onClick={() => this.payVacation(el)}
								type="button"
								data-toggle="tooltip"
								title="Maaşından Düşür"
								className="btn btn-sm btn-primary btn-icon p-1">
								<i className="fe fe-arrow-down-circle"></i>
							</button>
						) : (
							<i className="fa fa-check-circle text-primary"></i>
						)
					) : (
						<i className="fa fa-check-circle text-primary"></i>
					)}
				</div>
			</li>
		);
	};

	payVacation = vacation => {
		try {
			const { uid, salary, employee, payVacations } = this.state;
			if (salary === null) {
				Toast.fire({
					type: "error",
					title: "Tanımsız maaş bilgisi..."
				});

				return null;
			}

			const totalDeduction = vacation.daily_amount * vacation.day;
			const parseSalary = parseFloat(salary.replace(",", "."));
			const totalSalary = parseSalary - totalDeduction;
			const formatTotalSalary = totalSalary.format(2, 3, '.', ',').replace(".", "");
			console.log(totalDeduction, parseSalary, totalSalary);
			showSwal({
				type: "info",
				title: "Bilgi",
				html: `<b>${employee.label}</b> adlı personelin, <b>${
					vacation.day
				} günlük</b> ücretsiz izni için maaşına toplamda <b>${totalDeduction.format(2, 3, '.', ',')} ₺</b> kesinti uygulanacaktır.<br>
				Onaylıyor musunuz?`,
				confirmButtonText: "Onaylıyorum",
				cancelButtonText: "İptal",
				confirmButtonColor: "#467fcf",
				cancelButtonColor: "#868e96",
				showCancelButton: true,
				reverseButtons: true
			}).then(re => {
				if (re.value) {
					this.setState({ payVacations: [...payVacations, vacation.vacation_id] });
					this.setState({ salary: formatTotalSalary });
				}
			});
		} catch (e) {
			console.log(e);
		}
	};

	payAdvancePayment = advance_payment => {
		try {
			const { uid, salary, employee, payAdvancePayments } = this.state;
			if (salary === null) {
				Toast.fire({
					type: "error",
					title: "Tanımsız maaş bilgisi..."
				});

				return null;
			}
			const findAdvancePayment = payAdvancePayments.filter(
				x => x.advance_payment_id === advance_payment.advance_payment_id
			);
			var total = 0;
			findAdvancePayment.map(el => (total += el.paid_amount));
			const totalDeduction = advance_payment.amount - advance_payment.paid_amount - total;
			showSwal({
				type: "question",
				title: "Ödeme Tutarı",
				html: `<b>${advance_payment.amount.format(2, 3, '.', ',')} ₺</b> tutarındaki avansın ne kadarını kesinti olarak uygulamak istiyorsunuz? <hr> Toplam kesinti tutarı: <b>${(
					advance_payment.paid_amount + total
				).format(2, 3, '.', ',')} ₺</b>`,
				input: "number",
				inputValue: totalDeduction,
				inputAttributes: {
					min: 0,
					max: totalDeduction
				},
				inputValidator: value => {
					return new Promise(resolve => {
						if (value > 0 && value <= totalDeduction) {
							console.log(value);
							showSwal({
								type: "info",
								title: "Bilgi",
								html: `<b>${
									employee.label
								}</b> adlı personelin, <b>${advance_payment.amount.format(2, 3, '.', ',')} ₺</b> tutarındaki avansı için maaşına toplamda <b>${parseFloat(
									value
								).format(2, 3, '.', ',')} ₺</b> kesinti uygulanacaktır.<br>
				Onaylıyor musunuz?`,
								confirmButtonText: "Onaylıyorum",
								cancelButtonText: "İptal",
								confirmButtonColor: "#467fcf",
								cancelButtonColor: "#868e96",
								showCancelButton: true,
								reverseButtons: true
							}).then(re => {
								if (re.value) {
									//const totalDeduction = advance_payment.amount - parseFloat(value);
									const parseSalary = parseFloat(salary.replace(",", "."));
									const totalSalary = parseSalary - parseFloat(value);
									const formatTotalSalary = totalSalary.format(2, 3, '.', ',').replace(".", "");
									this.setState({
										payAdvancePayments: [
											...payAdvancePayments,
											{
												advance_payment_id: advance_payment.advance_payment_id,
												paid_amount: parseFloat(value)
											}
										]
									});
									this.setState({ salary: formatTotalSalary });
								}
							});
						} else {
							resolve("Hatalı değer!");
						}
					});
				}
			});
		} catch (e) {
			console.log(e);
		}
	};

	renderSalaryDay = () => {
		const { employee } = this.state;
		return employee
			? employee.salary_date
				? "Her ayın " + moment(employee.salary_date).format("D") + ". günü"
				: "—"
			: "—";
	};

	render() {
		const {
			uid,
			budget,
			salary,
			salary_date,
			paid_date,
			formErrors,
			select,
			employee,
			tabSelect,
			loadingButton,
			loadingData,
			loadingPast,
			tabData
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personeller &mdash; Maaş Öde</h1>
					<div className="col" />
					<div className="col-auto px-0" />
				</div>

				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-7 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className="fa fa-money-bill-wave mr-2" /> Maaş Öde
								</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loadingData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row mb-4">
											<div className="col-auto">
												<span
													className="avatar avatar-xxl"
													style={{
														backgroundImage: `url(${employee ? employee.image : null})`
													}}
												/>
											</div>
											<div className="col">
												<div className="form-group">
													<label className="form-label">
														Personel
														<span className="form-required">*</span>
													</label>
													<Select
														value={employee}
														onChange={val => this.handleSelect(val, "employee")}
														options={select.employees}
														name="employee"
														placeholder="Personel Seç..."
														styles={
															formErrors.employee === true
																? customStylesError
																: customStyles
														}
														isClearable={true}
														isSearchable={true}
														autoSize
														isDisabled={select.employees ? false : true}
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
														components={{ Option: ImageOption }}
													/>
												</div>
											</div>
										</div>
										<div className={`dimmer ${employee ? "" : "active"}`}>
											<div className="dimmer-content">
												<div className="row">
													<div className="col-lg-6 col-md-6 col-sm-12">
														<div className="form-group">
															<label className="form-label">Maaş Bilgisi</label>
															<div className="form-control-plaintext">
																{employee
																	? employee.salary
																		? employee.salary.format(2, 3, '.', ',') + " ₺"
																		: "—"
																	: "—"}
															</div>
														</div>
													</div>
													<div className="col-lg-6 col-md-6 col-sm-12">
														<div className="form-group">
															<label className="form-label">Maaş Tarihi</label>
															<div className="form-control-plaintext">
																{this.renderSalaryDay()}
															</div>
														</div>
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">
														Alacağı Maaş
														<span className="form-required">*</span>
													</label>
													<input
														name="salary"
														className={`form-control ${formErrors.salary}`}
														type="text"
														value={salary || ""}
														onChange={this.handleChange}
													/>
												</div>
												<div className="row">
													<div className="form-group col-6">
														<label className="form-label">
															Ödenen Tarih
															<span className="form-required">*</span>
														</label>
														<DatePicker
															autoComplete="off"
															selected={paid_date}
															selectsStart
															startDate={paid_date}
															name="paid_date"
															locale="tr"
															dateFormat="dd/MM/yyyy"
															onChange={date => this.handleDate(date, "paid_date")}
															className={`form-control ${formErrors.paid_date}`}
														/>
													</div>
													<div className="form-group col-6">
														<label className="form-label">
															Kasa Hesabı
															<span className="form-required">*</span>
														</label>
														<Select
															value={budget}
															onChange={val => this.handleSelect(val, "budget")}
															options={select.budgets}
															name="budget"
															placeholder="Kasa Seç..."
															styles={
																formErrors.budget === true
																	? customStylesError
																	: customStyles
															}
															isClearable={true}
															isSearchable={true}
															autoSize
															isDisabled={select.budgets ? false : true}
															noOptionsMessage={value =>
																`"${value.inputValue}" bulunamadı`
															}
															components={{ Option: IconOption }}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="card-footer text-right">
								<button
									className={`btn btn-success ${loadingButton} ${
										employee ? "" : "disabled disable-overlay"
									}`}>
									Ödeme Yap
								</button>
							</div>
						</div>
					</div>
					<div className="col-lg-5 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header pr-3">
								<h3 className="card-title">
									<i className="fa fa-history mr-2" /> Geçmiş İşlemler
								</h3>
								<div className="btn-group ml-auto" role="group" aria-label="Salary History Tabs">
									<button
										onClick={this.renderSalaryTab}
										type="button"
										className={`btn btn-sm btn-secondary ${tabSelect === 0 ? "active" : ""}`}>
										Maaş
									</button>
									<button
										onClick={this.renderAdvancePaymentTab}
										type="button"
										className={`btn btn-sm btn-secondary ${tabSelect === 1 ? "active" : ""}`}>
										Avans
									</button>
									<button
										onClick={this.renderVacationTab}
										type="button"
										className={`btn btn-sm btn-secondary ${tabSelect === 2 ? "active" : ""}`}>
										İzin
									</button>
								</div>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loadingPast ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										{tabData ? (
											tabData.length > 0 ? (
												<ul className="timeline mb-0">
													{tabData.map((el, key) => {
														switch (tabSelect) {
															case 0:
																return this.salaryTabContent(el, key);
															case 1:
																return this.advancePaymentTabContent(el, key);
															case 2:
																return this.vacationTabContent(el, key);
														}
													})}
												</ul>
											) : (
												noRow()
											)
										) : (
											noRow(true)
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(Salary);
