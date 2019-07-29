import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ListEmployees } from "../../services/Employee";
import { fullnameGenerator, getSelectValue } from "../../services/Others";
import { GetBudgets } from "../../services/FillSelect";
import { Toast } from "../Alert";
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
				className={`mr-1 fa fa-${props.data.type === 0 ? "university" : "briefcase"}`}
				style={{ backgroundImage: `url(${props.data.image})` }}
			/>
			{props.data.label}
		</span>
	</Option>
);

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="5" className="text-center text-muted font-italic">
			{loading ? (
				<div className={`dimmer active`}>
					<div className="loader" />
					<div className="dimmer-content" />
				</div>
			) : (
				"Kayıt bulunamadı..."
			)}
		</td>
	</tr>
);

const initialState = {
	salary_date: new Date(),
	salary: null,
	payment_type: null,
	employee: {
		label: null,
		value: null,
		image: null,
		salary: null
	},
	budget: null
};

export class Salary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			formErrors: {
				employee: "",
				salary_date: ""
			},
			select: {
				employees: null,
				budgets: null
			},

			loadingData: false,
			loadingButton: ""
		};
	}

	fieldMasked = () => {
		try {
			console.log("e");
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
		this.fieldMasked();
		this.listEmployees();
		this.listBudgets();
	}

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

		formErrors.startDate = date ? "" : "is-invalid";

		this.setState({ formErrors, [name]: date });
	};

	handleSelect = (value, name) => {
		try {
			let formErrors = { ...this.state.formErrors };
			formErrors[name] = value ? false : true;
			if (value) {
				this.setState({
					[name]: value,
					salary: value.salary ? value.salary.toString().replace(".", ",") : null
				});
			} else {
				this.setState({ ...initialState });
			}
			this.setState({ formErrors });
		} catch (e) {}
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
	};

	listEmployees = () => {
		try {
			const { uid } = this.state;
			const to = this.props.match.params.uid;
			let select = { ...this.state.select };
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
								salary: el.salary
							});
						});
						select.employees = selectData;
						const toSalary = getSelectValue(selectData, to, "value").salary;
						this.setState({
							...select,
							loadingData: false,
							employee: to ? getSelectValue(selectData, to, "value") : initialState.employee,
							salary: to ? (toSalary ? toSalary.toString().replace(".", ",") : null) : null
						});
					}
				}
			});
		} catch (e) {}
	};

	listBudgets = () => {
		try {
			let select = { ...this.state.select };
			console.log(select);
			GetBudgets().then(response => {
				console.log(response);
				select.budgets = response;
				this.setState({ select });
			});
		} catch (e) {}
	};

	render() {
		const {
			uid,
			budget,
			salary,
			salary_date,
			payment_type,
			formErrors,
			select,
			employee,
			loadingButton,
			loadingData
		} = this.state;
		console.log("Salary: ", this.props);
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
													className="avatar avatar-xl"
													style={{
														backgroundImage: `url(${employee.image})`
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
										<div className={`dimmer ${employee.value ? "" : "active"}`}>
											<div className="dimmer-content">
												<div className="form-group">
													<label className="form-label">Maaş Bilgisi</label>
													<div className="form-control-plaintext">
														{employee.salary ? employee.salary.format() + " ₺" : "—"}
													</div>
												</div>

												<div className="form-group">
													<label className="form-label">
														Maaş Tarihi
														<span className="form-required">*</span>
													</label>
													<DatePicker
														selected={salary_date}
														selectsStart
														startDate={salary_date}
														name="salary_date"
														locale="tr"
														dateFormat="dd/MM/yyyy"
														onChange={date => this.handleDate(date, "salary_date")}
														className={`form-control ${formErrors.salary_date}`}
													/>
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

												<div className="form-group">
													<label className="form-label">
														Ödeme Durumu
														<span className="form-required">*</span>
													</label>
													<div className="selectgroup w-100">
														<label className="selectgroup-item">
															<input
																type="radio"
																name="payment_type"
																value="0"
																checked={payment_type === 0 ? true : false}
																onChange={this.handleRadio}
																className="selectgroup-input"
															/>
															<span className="selectgroup-button">Ödendi</span>
														</label>
														<label className="selectgroup-item">
															<input
																type="radio"
																name="payment_type"
																value="1"
																checked={payment_type === 1 ? true : false}
																onChange={this.handleRadio}
																className="selectgroup-input"
															/>
															<span className="selectgroup-button">Ödenecek</span>
														</label>
													</div>
												</div>

												<div className="form-group">
													<label className="form-label">
														Ödeme Tarihi
														<span className="form-required">*</span>
													</label>
													<div className="form-control-plaintext"></div>
												</div>

												<div className="row">
													<div className="form-group col-6">
														<label className="form-label">
															Ödenen Tarih
															<span className="form-required">*</span>
														</label>
													</div>
													<div className="form-group col-6">
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
						</div>
					</div>
					<div className="col-lg-5 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className="fa fa-history mr-2" /> Geçmiş İşlemler
								</h3>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(Salary);
