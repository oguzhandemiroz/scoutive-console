import React, { Component } from "react";
import { Kinship } from "../../services/FillSelect";
import Select from "react-select";
import { withRouter } from "react-router-dom";
import { getSelectValue } from "../../services/Others";
import Inputmask from "inputmask";
import { CreateTrialPlayer } from "../../services/Player";
const $ = require("jquery");

Inputmask.extendDefaults({
	autoUnmask: true
});

const InputmaskDefaultOptions = {
	showMaskOnHover: false,
	showMaskOnFocus: false,
	placeholder: ""
};

const securityNoRegEx = /^\d+$/;
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

const initialState = {
	name: null,
	surname: null,
	security_id: null,
	phone: null,
	note: null,
	emergency: [
		{
			kinship: "Anne",
			name: "",
			phone: ""
		},
		{
			kinship: "Baba",
			name: "",
			phone: ""
		}
	]
};

export class Trial extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			select: {
				kinships: null
			},
			formErrors: {
				name: "",
				surname: "",
				security_id: ""
			},
			loadingButton: ""
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				name: $("[name=name]"),
				surname: $("[name=surname]"),
				phone: $("[name=phone]"),
				security_id: $("[name=security_id]"),
				emergency_phone: $("[name*='emergency.phone.']"),
				emergency_name: $("[name*='emergency.name.']")
			};
			const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.emergency_phone);
			Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
			Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.emergency_name);
		} catch (e) {}
	};

	componentDidMount() {
		setTimeout(() => this.fieldMasked(), 500)
		let select = { ...this.state.select };
		select.kinships = Kinship();
		this.setState({ select });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, name, surname, security_id, phone, note, emergency, formErrors } = this.state;
		const requiredData = {};

		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.security_id = security_id;
		requiredData.formErrors = formErrors;

		if (formValid(requiredData)) {
			this.setState({ loadingButton: "btn-loading" });
			CreateTrialPlayer({
				uid: uid,
				name: name.capitalize(),
				surname: surname.toLocaleUpperCase('tr-TR'),
				security_id: security_id,
				phone: phone,
				password: "151117",
				note: note,
				emergency: JSON.stringify(emergency)
			}).then(response => {
				if (response) {
					if (response.status.code === 1020) {
						this.props.history.push("/app/players");
					}
				}
			});
		} else {
			console.error("FORM INVALID - DISPLAY ERROR");
			let formErrors = { ...this.state.formErrors };

			formErrors.name = name ? (name.length < 2 ? "is-invalid" : "") : "is-invalid";
			formErrors.surname = surname ? (surname.length < 2 ? "is-invalid" : "") : "is-invalid";
			formErrors.security_id = security_id
				? security_id.length < 9
					? "is-invalid"
					: !securityNoRegEx.test(security_id)
					? "is-invalid"
					: ""
				: "is-invalid";

			this.setState({ formErrors });
		}
	};

	handleChange = e => {
		e.preventDefault();
		const { value, name } = e.target;
		let formErrors = { ...this.state.formErrors };

		switch (name) {
			case "name":
				formErrors.name = value.length < 2 ? "is-invalid" : "";
				break;
			case "surname":
				formErrors.surname = value.length < 2 ? "is-invalid" : "";
				break;
			case "security_id":
				formErrors.security_id =
					value.length < 9 ? "is-invalid" : !securityNoRegEx.test(value) ? "is-invalid" : "";
				break;
			default:
				break;
		}
		if (name.indexOf(".") === -1) {
			this.setState({ formErrors, [name]: value });
		} else {
			const splitName = name.split(".");
			this.setState(prevState => {
				return (prevState[splitName[0]][splitName[2]][splitName[1]] = value);
			});
		}
	};

	handleSelect = (value, name, extraData, arr) => {
		if (arr) {
			this.setState(prevState => {
				return (prevState[name][extraData].kinship = value.label);
			});
		}
	};

	render() {
		const { name, surname, security_id, phone, note, emergency, formErrors, select, loadingButton } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Ekle &mdash; Deneme Öğrenci</h1>
				</div>
				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-4 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Genel Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col-12">
										<div className="form-group">
											<label className="form-label">
												Adı <span className="form-required">*</span>
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.name}`}
												onChange={this.handleChange}
												name="name"
												placeholder="Adı"
												value={name || ""}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Soyadı <span className="form-required">*</span>
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.surname}`}
												onChange={this.handleChange}
												name="surname"
												placeholder="Soyadı"
												value={surname || ""}
											/>
										</div>
									</div>

									<div className="col-12">
										<div className="form-group">
											<label className="form-label">
												T.C. Kimlik No
												<span className="form-required">*</span>
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.security_id}`}
												onChange={this.handleChange}
												placeholder="T.C. Kimlik No"
												name="security_id"
												value={security_id || ""}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">İletişim Bilgileri</h3>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col-12">
										<div className="form-group">
											<label className="form-label">Telefonu</label>
											<input
												type="text"
												className={`form-control ${formErrors.phone}`}
												onChange={this.handleChange}
												name="phone"
												placeholder="(535) 123 4567"
												value={phone || ""}
											/>
										</div>
									</div>

									<div className="col-12 mt-3">
										<label className="form-label">Veli İletişim Bilgisi</label>
										<div id="parent">
											<table className="table mb-0">
												<thead>
													<tr>
														<th className="pl-0 w-9">Yakınlık</th>
														<th>Adı ve Soyadı</th>
														<th className="pl-0">Telefon</th>
													</tr>
												</thead>
												<tbody>
													{emergency.map((el, key) => {
														return (
															<tr key={key.toString()}>
																<td className="pl-0 pr-0">
																	<Select
																		value={getSelectValue(
																			select.kinships,
																			el.kinship,
																			"label"
																		)}
																		onChange={val =>
																			this.handleSelect(
																				val,
																				"emergency",
																				key,
																				true
																			)
																		}
																		options={select.kinships}
																		name="kinship"
																		placeholder="Seç..."
																		styles={customStyles}
																		isSearchable={true}
																		isDisabled={select.kinships ? false : true}
																		noOptionsMessage={value =>
																			`"${value.inputValue}" bulunamadı`
																		}
																		menuPlacement="top"
																	/>
																</td>
																<td>
																	<input
																		type="text"
																		name={`emergency.name.${key}`}
																		onChange={this.handleChange}
																		className="form-control"
																	/>
																</td>
																<td className="pl-0">
																	<input
																		type="text"
																		name={`emergency.phone.${key}`}
																		onChange={this.handleChange}
																		placeholder="(535) 123 4567"
																		className="form-control"
																	/>
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>

									<div className="col-12 mt-3">
										<div className="form-group">
											<label className="form-label">Not</label>
											<textarea
												className="form-control"
												name="note"
												onChange={this.handleChange}
												rows={2}
												maxLength="1000"
												value={note || ""}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="card-footer text-right">
								<button
									style={{ width: 100 }}
									type="submit"
									className={`btn btn-primary ml-3 ${loadingButton}`}>
									Ekle
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(Trial);
