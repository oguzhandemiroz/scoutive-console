import React, { Component } from "react";
import {
	formValid,
	selectCustomStylesError,
	selectCustomStyles,
	emailRegEx,
	securityNoRegEx,
	difference
} from "../../assets/js/core";
import { Bloods, Branchs, Days, Months, Years, EmployeePositions, Kinship } from "../../services/FillSelect";
import { DetailEmployee, UpdateEmployee } from "../../services/Employee";
import { SplitBirthday, UploadFile, getSelectValue, clearMoney } from "../../services/Others";
import { showSwal } from "../../components/Alert";
import Select from "react-select";
import { Link } from "react-router-dom";
import Inputmask from "inputmask";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import moment from "moment";
const $ = require("jquery");

registerLocale("tr", tr);
Inputmask.extendDefaults({
	autoUnmask: true
});

Inputmask.extendAliases({
	try: {
		integerDigits: 12,
		suffix: " ₺",
		radixPoint: ",",
		groupSeparator: ".",
		alias: "numeric",
		autoGroup: true,
		digits: 2,
		autoUnmask: true,
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
	placeholder: ""
};

const initialState = {
	name: null,
	surname: null,
	security_id: null,
	email: null,
	phone: null,
	salary: null,
	position: null,
	branch: null,
	blood: null,
	day: null,
	month: null,
	body_height: null,
	body_weight: null,
	year: null,
	gender: null,
	emergency: null,
	school_history: null,
	certificates: null,
	image: null,
	start_date: null,
	end_date: null,
	imagePreview: null
};

export class Edit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			...initialState,
			response_data: {},
			select: {
				bloods: null,
				positions: null,
				days: null,
				months: null,
				years: null,
				branchs: null,
				kinships: null
			},
			formErrors: {
				image: "",
				name: "",
				surname: "",
				security_id: "",
				email: "",
				position: "",
				branch: "",
				phone: "",
				salary: ""
			},
			loading: "active",
			loadingImage: "",
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
				salary: $("[name=salary]"),
				emergency_phone: $("[name*='emergency.phone.']"),
				emergency_name: $("[name*='emergency.name.']"),
				school_history_name: $("[name*='school_history.name.']"),
				certificate_type: $("[name*='certificates.type.']"),
				certificate_corporation: $("[name*='certificates.corporation.']")
			};
			const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.emergency_phone);
			Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
			Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.salary);
			Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.emergency_name);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.certificate_type);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.certificate_corporation);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.school_history_name);
		} catch (e) {}
	};

	componentDidMount() {
		this.getFillSelect();
		this.getEmployeeDetail();
		setTimeout(this.fieldMasked, 250);
	}

	handleSubmit = e => {
		e.preventDefault();
		const {
			uid,
			name,
			surname,
			security_id,
			email,
			position,
			branch,
			phone,
			salary,
			blood,
			image,
			address,
			gender,
			day,
			month,
			year,
			note,
			body_height,
			body_weight,
			emergency,
			school_history,
			certificates,
			formErrors,
			to,
			select,
			start_date,
			end_date,
			response_data
		} = this.state;
		const requiredData = {};

		// require data
		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.security_id = security_id;
		requiredData.email = email;
		requiredData.phone = phone;
		requiredData.position = position ? position.value : null;
		requiredData.branch = branch ? branch.value : null;
		requiredData.start_date = start_date;
		requiredData.salary = salary;
		requiredData.formErrors = formErrors;

		const checkBirthday = year && month && day ? `${year}-${month}-${day}` : null;

		if (formValid(requiredData)) {
			this.setState({ loadingButton: "btn-loading" });
			UpdateEmployee({
				uid: uid,
				to: to,
				name: name.capitalize(),
				surname: surname.toLocaleUpperCase("tr-TR"),
				security_id: security_id,
				email: email,
				permission_id: position ? position.value : null,
				phone: phone,
				image: image,
				salary: clearMoney(salary),
				address: address,
				emergency: emergency,
				note: note,
				blood_id: blood ? blood.value : null,
				branch_id: branch ? branch.value : null,
				gender: gender,
				birthday: checkBirthday,
				school_history: school_history,
				certificates: certificates,
				start_date: moment(start_date).format("YYYY-MM-DD"),
				end_date: end_date ? moment(end_date).format("YYYY-MM-DD") : null,
				attributes: difference(
					{
						salary: clearMoney(salary),
						email: email,
						phone: phone,
						body_height: body_height,
						body_weight: body_weight,
						permission: position
					},
					{
						salary: clearMoney(response_data.salary),
						email: response_data.email,
						phone: response_data.phone,
						body_height: response_data.attributes.body_height,
						body_weight: response_data.attributes.body_weight,
						permission: response_data.position
					}
				)
			}).then(code => {
				if (code === 1020) setTimeout(() => this.props.history.push("/app/persons/employees/detail/" + to), 1000);
				else this.setState({ loadingButton: "" });
			});
		} else {
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					name: name ? (name.length < 2 ? "is-invalid" : "") : "is-invalid",
					surname: surname ? (surname.length < 2 ? "is-invalid" : "") : "is-invalid",
					security_id: securityNoRegEx.test(security_id)
						? security_id.length < 9
							? "is-invalid"
							: ""
						: "is-invalid",
					email: emailRegEx.test(email) ? "" : "is-invalid",
					phone: phone ? (phone.length !== 10 ? "is-invalid" : "") : "is-invalid",
					salary: salary ? "" : "is-invalid",
					start_date: start_date ? "" : "is-invalid",
					position: position ? false : true,
					branch: branch ? false : true
				}
			}));
		}
	};

	handleChange = e => {
		e.preventDefault();
		const { value, name } = e.target;
		let formErrors = { ...this.state.formErrors };

		switch (name) {
			case "name":
				this.setState(prevState => ({
					formErrors: {
						...prevState.formErrors,
						name: value.length < 2 ? "is-invalid" : ""
					}
				}));
				break;
			case "surname":
				this.setState(prevState => ({
					formErrors: {
						...prevState.formErrors,
						surname: value.length < 2 ? "is-invalid" : ""
					}
				}));
				break;
			case "security_id":
				this.setState(prevState => ({
					formErrors: {
						...prevState.formErrors,
						security_id: securityNoRegEx.test(value) ? (value.length < 9 ? "is-invalid" : "") : "is-invalid"
					}
				}));
				break;
			case "email":
				this.setState(prevState => ({
					formErrors: {
						...prevState.formErrors,
						email: emailRegEx.test(value.toLowerCase()) ? "" : "is-invalid"
					}
				}));
				break;
			case "phone":
				this.setState(prevState => ({
					formErrors: {
						...prevState.formErrors,
						phone: value.length !== 10 ? "is-invalid" : ""
					}
				}));
				break;
			case "salary":
				this.setState(prevState => ({
					formErrors: {
						...prevState.formErrors,
						salary: value.length < 2 ? "is-invalid" : ""
					}
				}));
				break;
			default:
				break;
		}
		if (name === "salary") {
			this.setState({ [name]: value === "0,00" ? null : value });
		} else if (name.indexOf(".") === -1) {
			this.setState({ formErrors, [name]: value });
		} else {
			const splitName = name.split(".");
			this.setState(prevState => {
				return (prevState[splitName[0]][splitName[2]][splitName[1]] = value);
			});
		}
	};

	handleImage = e => {
		try {
			e.preventDefault();
			const { uid, to } = this.state;
			const formData = new FormData();
			let reader = new FileReader();
			let file = e.target.files[0];
			reader.onloadend = () => {
				if (reader.result !== null) {
					this.setState({
						imagePreview: reader.result
					});
					this.setState({ loadingImage: "btn-loading", loadingButton: "btn-loading" });
				}
				formData.append("image", file);
				formData.append("uid", uid);
				formData.append("to", to);
				formData.append("type", "employee");
				UploadFile(formData).then(response => {
					if (response) this.setState({ image: response.data });
					this.setState({ loadingImage: "", loadingButton: "" });
				});
			};

			reader.readAsDataURL(file);
		} catch (e) {}
	};

	handleSelect = (value, name, extraData, arr) => {
		if (arr) {
			this.setState(prevState => {
				return (prevState[name][extraData].kinship = value.label);
			});
		} else {
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					[name]: value ? false : true
				},
				[name]: extraData ? value[extraData] : value
			}));
		}
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
	};

	handleDate = (date, name) => {
		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: date ? "" : "is-invalid"
			},
			[name]: date
		}));
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace("/app/reload");
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	getFillSelect = () => {
		EmployeePositions().then(response => {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					positions: response
				}
			}));
		});

		Branchs().then(response => {
            if (response) {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					branchs: response
				}
			}));
		}
		});

		Bloods().then(response => {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					bloods: response
				}
			}));
		});

		this.setState(prevState => ({
			select: {
				...prevState.select,
				days: Days(),
				months: Months(),
				years: Years(true),
				kinships: Kinship()
			}
		}));
	};

	getEmployeeDetail = () => {
		const { uid, to } = this.state;
		DetailEmployee({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					delete data.uid;

					const getSplitBirthday = SplitBirthday(data.birthday);
					const edited_data = {
						...data,
						imagePreview: data.image,
						salary: data.salary.toString().replace(".", ","),
						day: getSplitBirthday.day,
						month: getSplitBirthday.month,
						year: getSplitBirthday.year,
						emergency: data.emergency,
						school_history: data.school_history || [
							{
								start: "",
								end: "",
								name: ""
							},
							{
								start: "",
								end: "",
								name: ""
							},
							{
								start: "",
								end: "",
								name: ""
							}
						],
						certificates: data.certificates || [
							{
								type: "",
								year: "",
								corporation: ""
							},
							{
								type: "",
								year: "",
								corporation: ""
							},
							{
								type: "",
								year: "",
								corporation: ""
							}
						]
					};

					this.setState(prevState => ({
						...prevState,
						...edited_data,
						body_height: data.attributes.body_height,
						body_weight: data.attributes.body_weight,
						response_data: { ...edited_data },
						loading: ""
					}));
				}
			}
		});
	};

	render() {
		const {
			name,
			surname,
			security_id,
			email,
			position,
			branch,
			phone,
			salary,
			note,
			address,
			day,
			month,
			year,
			blood,
			gender,
			emergency,
			body_height,
			body_weight,
			school_history,
			certificates,
			start_date,
			end_date,
			formErrors,
			select,
			to,
			imagePreview,
			loading,
			loadingImage,
			loadingButton
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personel Düzenle</h1>
					<div className="col" />
					<div className="col-4 text-right">
						<Link to={`/app/persons/employees/detail/${to}`}>
							<i className="fe fe-arrow-left" /> Detay sayfasına dön
						</Link>
					</div>
				</div>

				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-4 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Genel Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loading}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row">
											<div className="col-auto m-auto">
												<label
													htmlFor="image"
													className={`avatar ${loadingImage} avatar-xxxl cursor-pointer`}
													style={{
														border: "none",
														outline: "none",
														fontSize: ".875rem",
														backgroundImage: `url(${imagePreview})`
													}}>
													{!imagePreview ? "Fotoğraf ekle" : ""}
												</label>
												<input
													type="file"
													id="image"
													name="image"
													hidden
													accept="image/*"
													onChange={this.handleImage}
												/>
											</div>
										</div>

										<div className="form-group">
											<label className="form-label">
												Adı
												<span className="form-required">*</span>
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.name}`}
												onChange={this.handleChange}
												placeholder="Adı"
												name="name"
												value={name || ""}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Soyadı
												<span className="form-required">*</span>
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.surname}`}
												onChange={this.handleChange}
												placeholder="Soyadı"
												name="surname"
												value={surname || ""}
											/>
										</div>
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
										<div className="form-group">
											<label className="form-label">
												Pozisyonu
												<span className="form-required">*</span>
											</label>
											<Select
												value={position}
												onChange={val => this.handleSelect(val, "position")}
												options={select.positions}
												name="position"
												placeholder="Seç..."
												styles={
													formErrors.position === true
														? selectCustomStylesError
														: selectCustomStyles
												}
												isClearable={true}
												isSearchable={true}
												isDisabled={select.positions ? false : true}
												noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Branşı
												<span className="form-required">*</span>
											</label>
											<Select
												value={branch}
												onChange={val => this.handleSelect(val, "branch")}
												options={select.branchs}
												name="branch"
												placeholder="Seç..."
												styles={
													formErrors.branch === true
														? selectCustomStylesError
														: selectCustomStyles
												}
												isSearchable={true}
												isDisabled={select.branchs ? false : true}
												noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Maaşı
												<span className="form-required">*</span>
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.salary}`}
												onChange={this.handleChange}
												placeholder="Maaş"
												name="salary"
												value={salary || ""}
											/>
										</div>

										<div className="form-group">
											<label className="form-label">
												İşe Başlama Tarihi
												<span className="form-required">*</span>
											</label>
											<DatePicker
												autoComplete="off"
												selected={start_date ? moment(start_date).toDate() : null}
												selectsEnd
												selected={start_date ? moment(start_date).toDate() : null}
												name="start_date"
												locale="tr"
												dateFormat="dd/MM/yyyy"
												onChange={date => this.handleDate(date, "start_date")}
												className={`form-control ${formErrors.start_date}`}
											/>
										</div>
										{end_date ? (
											<div className="form-group">
												<label className="form-label">
													İşten Ayrılma Tarihi
													<span className="form-required">*</span>
												</label>
												<DatePicker
													autoComplete="off"
													selected={end_date ? moment(end_date).toDate() : null}
													selectsEnd
													selected={end_date ? moment(end_date).toDate() : null}
													name="end_date"
													locale="tr"
													dateFormat="dd/MM/yyyy"
													onChange={date => this.handleDate(date, "end_date")}
													className={`form-control ${formErrors.end_date}`}
												/>
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Detay Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loading}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row">
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">
														Email
														<span className="form-required">*</span>
													</label>
													<input
														type="text"
														className={`form-control ${formErrors.email}`}
														onChange={this.handleChange}
														name="email"
														placeholder="Email"
														value={email || ""}
													/>
												</div>
												<div className="form-group">
													<label className="form-label">
														Telefonu
														<span className="form-required">*</span>
													</label>
													<input
														type="text"
														className={`form-control ${formErrors.phone}`}
														onChange={this.handleChange}
														name="phone"
														placeholder="(535) 123 4567"
														value={phone || ""}
													/>
												</div>

												<div className="form-group">
													<label className="form-label">Doğum Tarihi</label>
													<div className="row gutters-xs">
														<div className="col-4">
															<Select
																value={getSelectValue(select.days, day, "value")}
																onChange={val => this.handleSelect(val, "day", "value")}
																options={select.days}
																name="day"
																placeholder="Gün"
																styles={selectCustomStyles}
																isSearchable={true}
																isDisabled={select.days ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
															/>
														</div>
														<div className="col-4">
															<Select
																value={getSelectValue(select.months, month, "value")}
																onChange={val =>
																	this.handleSelect(val, "month", "value")
																}
																options={select.months}
																name="month"
																placeholder="Ay"
																styles={selectCustomStyles}
																isSearchable={true}
																isDisabled={select.months ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
															/>
														</div>
														<div className="col-4">
															<Select
																value={getSelectValue(select.years, year, "value")}
																onChange={val =>
																	this.handleSelect(val, "year", "value")
																}
																options={select.years}
																name="year"
																placeholder="Yıl"
																styles={selectCustomStyles}
																isSearchable={true}
																isDisabled={select.years ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
															/>
														</div>
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Adresi</label>
													<textarea
														className="form-control"
														name="address"
														onChange={this.handleChange}
														rows={6}
														maxLength="1000"
														placeholder="Adres"
														value={address || ""}
													/>
												</div>
											</div>
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">Boy ve Kilo</label>
													<div className="row gutters-xs">
														<div className="col-6">
															<input
																type="number"
																className="form-control"
																onChange={this.handleChange}
																name="body_height"
																placeholder="Boy (cm)"
																min="0"
																max="250"
																value={body_height || ""}
															/>
														</div>
														<div className="col-6">
															<input
																type="number"
																className="form-control"
																onChange={this.handleChange}
																name="body_weight"
																placeholder="Kilo (kg)"
																min="0"
																max="250"
																value={body_weight || ""}
															/>
														</div>
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Cinsiyeti</label>
													<div className="selectgroup w-100">
														<label className="selectgroup-item">
															<input
																type="radio"
																name="gender"
																value="1"
																onChange={this.handleRadio}
																checked={gender === 1 ? true : false}
																className="selectgroup-input"
															/>
															<span className="selectgroup-button">Kadın</span>
														</label>
														<label className="selectgroup-item">
															<input
																type="radio"
																name="gender"
																value="0"
																onChange={this.handleRadio}
																checked={gender === 0 ? true : false}
																className="selectgroup-input"
															/>
															<span className="selectgroup-button">Erkek</span>
														</label>
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Kan Grubu</label>
													<Select
														value={blood}
														onChange={val => this.handleSelect(val, "blood")}
														options={select.bloods}
														name="blood"
														placeholder="Seç..."
														styles={selectCustomStyles}
														isClearable={true}
														isSearchable={true}
														isDisabled={select.bloods ? false : true}
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
													/>
												</div>
											</div>
											<div className="col-12 mt-3">
												<label className="form-label">Acil Durumda İletişim</label>
												<div>
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="w-9 pl-0">Yakınlık</th>
																<th>Adı ve Soyadı</th>
																<th className="pl-0">Telefon</th>
															</tr>
														</thead>
														<tbody>
															{Array.isArray(emergency)
																? emergency.map((el, key) => {
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
																						name="emergency"
																						placeholder="Seç..."
																						styles={selectCustomStyles}
																						isSearchable={true}
																						isDisabled={
																							select.kinships
																								? false
																								: true
																						}
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
																						value={el.name || ""}
																					/>
																				</td>
																				<td className="pl-0">
																					<input
																						type="text"
																						name={`emergency.phone.${key}`}
																						onChange={this.handleChange}
																						className="form-control"
																						value={el.phone || ""}
																						placeholder="(535) 123 4567"
																					/>
																				</td>
																			</tr>
																		);
																  })
																: null}
														</tbody>
													</table>
												</div>
											</div>
											<div className="col-12 mt-3">
												<label className="form-label">Okul Bilgileri</label>
												<div>
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="w-9 pl-0">Baş. Yılı</th>
																<th className="w-9">BİTİŞ Yılı</th>
																<th className="pl-0">Okul Adı</th>
															</tr>
														</thead>
														<tbody>
															{school_history
																? school_history.map((el, key) => {
																		return (
																			<tr key={key.toString()}>
																				<td className="pl-0 pr-0">
																					<input
																						type="number"
																						min="1950"
																						max="2030"
																						className="w-9 form-control"
																						name={`school_history.start.${key}`}
																						value={el.start || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																				<td>
																					<input
																						type="number"
																						min={
																							school_history[key].start ||
																							1951
																						}
																						max="2030"
																						className="w-9 form-control"
																						name={`school_history.end.${key}`}
																						value={el.end || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																				<td className="pl-0">
																					<input
																						type="text"
																						className="form-control"
																						name={`school_history.name.${key}`}
																						value={el.name || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																			</tr>
																		);
																  })
																: null}
														</tbody>
													</table>
												</div>
											</div>

											<div className="col-12 mt-3">
												<label className="form-label">Sertifikalar</label>
												<div className="table-responsive">
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="pl-0 w-9">Aldığı Yıl</th>
																<th>TÜRÜ</th>
																<th className="pl-0">Aldığı Kurum</th>
															</tr>
														</thead>
														<tbody>
															{certificates
																? certificates.map((el, key) => {
																		return (
																			<tr key={key.toString()}>
																				<td className="pl-0 pr-0">
																					<input
																						type="number"
																						min="1950"
																						max="2030"
																						className="w-9 form-control"
																						name={`certificates.year.${key}`}
																						value={el.year || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																				<td>
																					<input
																						type="text"
																						className="form-control"
																						name={`certificates.type.${key}`}
																						value={el.type || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																				<td className="pl-0">
																					<input
																						type="text"
																						className="form-control"
																						name={`certificates.corporation.${key}`}
																						value={el.corporation || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																			</tr>
																		);
																  })
																: null}
														</tbody>
													</table>
												</div>
											</div>

											<div className="col-12 mt-3">
												<div className="form-group">
													<label className="form-label">Not</label>
													<textarea
														className="form-control resize-none"
														name="note"
														onChange={this.handleChange}
														rows={3}
														maxLength="1000"
														value={note || ""}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer text-right">
								<div className="d-flex" style={{ justifyContent: "space-between" }}>
									<a
										
										onClick={() => {
											showSwal({
												type: "info",
												title: "Emin misiniz?",
												text: "İşlemi iptal etmek istediğinize emin misiniz?",
												confirmButtonText: "Evet",
												cancelButtonText: "Hayır",
												cancelButtonColor: "#cd201f",
												showCancelButton: true,
												reverseButtons: true
											}).then(result => {
												if (result.value) this.props.history.goBack();
											});
										}}
										className="btn btn-link">
										İptal
									</a>
									<button
										style={{ width: 100 }}
										type="submit"
										className={`btn btn-primary ml-3 ${loadingButton} ${loadingImage}`}>
										Kaydet
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default Edit;
