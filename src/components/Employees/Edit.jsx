import React, { Component } from "react";
import { Bloods, Branchs, Days, Months, Years, EmployeePositions, Kinship } from "../../services/FillSelect.jsx";
import { DetailEmployee, UpdateEmployee } from "../../services/Employee.jsx";
import { SplitBirthday, UploadFile, getSelectValue, AttributeDataChecker } from "../../services/Others.jsx";
import { showSwal } from "../../components/Alert.jsx";
import Select from "react-select";
import { Link } from "react-router-dom";
import Inputmask from "inputmask";
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

// eslint-disable-next-line
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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

const customStylesError = {
	control: styles => ({
		...styles,
		borderColor: "#cd201f",
		borderRadius: 3,
		":hover": { ...styles[":hover"], borderColor: "#cd201f" }
	})
};

const initialState = {
	name: null,
	surname: null,
	securityNo: null,
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
	certificate: null,
	image: null,
	imagePreview: null
};

export class Edit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			...initialState,
			responseData: {},
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
				securityNo: "",
				email: "",
				position: "",
				branch: "",
				phone: "",
				salary: ""
			},
			loadingButton: "",
			onLoadedData: false,
			uploadedFile: true
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				name: $("[name=name]"),
				surname: $("[name=surname]"),
				phone: $("[name=phone]"),
				email: $("[name=email]"),
				securityNo: $("[name=securityNo]"),
				salary: $("[name=salary]"),
				emergency_phone: $("[name*='emergency.phone.']")
			};
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.emergency_phone);
			Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.securityNo);
			Inputmask({ alias: "email", ...InputmaskDefaultOptions }).mask(elemArray.email);
			Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.salary);
			Inputmask({ regex: "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*", ...InputmaskDefaultOptions }).mask(elemArray.name);
			Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
		} catch (e) {}
	};

	componentDidMount() {
		setTimeout(() => {
			this.fieldMasked();
		}, 500);

		const { uid, to } = this.state;
		let select = { ...this.state.select };

		Bloods().then(response => {
			console.log(response);
			select.bloods = response;
			this.setState({ select });
		});

		EmployeePositions().then(response => {
			console.log(response);
			select.positions = response;
			this.setState({ select });
		});

		Branchs().then(response => {
			console.log(response);
			select.branchs = response;
			this.setState({ select });
		});

		DetailEmployee({
			uid: uid,
			to: to
		}).then(response => {
			if (response !== null) {
				const status = response.status;
				initialState.body = {};
				if (status.code === 1020) {
					const data = response.data;
					this.setState({ responseData: data });
					const getSplitBirthday = SplitBirthday(data.birthday);
					console.log(getSplitBirthday);

					initialState.name = data.name;
					initialState.surname = data.surname;
					initialState.securityNo = data.security_id;
					initialState.phone = data.phone;
					initialState.salary = data.salary ? data.salary.toString().replace(".", ",") : null;
					initialState.imagePreview = data.image;
					initialState.image = data.image;
					initialState.email = data.email;
					initialState.position = getSelectValue(select.positions, data.position, "label");
					initialState.branch = getSelectValue(select.branchs, data.branch, "label");
					initialState.day = getSelectValue(select.days, getSplitBirthday.day, "value");
					initialState.month = getSelectValue(select.months, getSplitBirthday.month, "value");
					initialState.year = getSelectValue(select.years, getSplitBirthday.year, "value");
					initialState.address = data.address;
					initialState.gender = data.gender;
					initialState.blood = getSelectValue(select.bloods, data.blood, "label");
					initialState.emergency = data.emergency || [];
					initialState.school_history = data.school_history || [];
					initialState.certificate = data.certificates || [];
					if (initialState.emergency) {
						const len = initialState.emergency.length;
						if (len < 2) {
							for (var i = 0; i < 2 - len; i++) {
								initialState.emergency.push({
									kinship: "",
									name: "",
									phone: ""
								});
							}
						}
					}
					if (initialState.school_history) {
						const len = initialState.school_history.length;
						if (len < 3) {
							for (var i = 0; i < 3 - len; i++) {
								initialState.school_history.push({
									start: "",
									end: "",
									name: ""
								});
							}
						}
					}
					if (initialState.certificate) {
						const len = initialState.certificate.length;
						if (len < 3) {
							for (var i = 0; i < 3 - len; i++) {
								initialState.certificate.push({
									type: "",
									year: "",
									corporation: ""
								});
							}
						}
					}
					initialState.body_height = data.attributes.body_height;
					initialState.body_weight = data.attributes.body_weight;
					this.setState({ ...initialState });
					this.setState({ onLoadedData: true });
				}
			}
		});

		select.days = Days();
		select.months = Months();
		select.years = Years(true);
		select.kinships = Kinship();

		this.setState({ select });
		console.log(this.state.select);
	}

	handleSubmit = e => {
		e.preventDefault();
		const {
			uid,
			name,
			surname,
			securityNo,
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
			body_height,
			body_weight,
			emergency,
			school_history,
			certificate,
			formErrors,
			to,
			responseData
		} = this.state;
		const requiredData = {};
		const attributesData = {};

		// require data
		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.securityNo = securityNo;
		requiredData.email = email;
		requiredData.phone = phone;
		requiredData.position = position ? position.value : null;
		requiredData.branch = branch ? branch.value : null;
		requiredData.salary = salary;
		requiredData.formErrors = formErrors;

		const formatSalary = salary ? parseFloat(salary.toString().replace(",", ".")) : null;

		//attributes data
		if (AttributeDataChecker(responseData.salary, formatSalary)) {
			attributesData.salary = formatSalary;
		}
		if (AttributeDataChecker(responseData.position, position ? position.label : null)) {
			attributesData.position = position ? position.value : "";
		}
		if (AttributeDataChecker(responseData.email, email)) {
			attributesData.email = email;
		}
		if (AttributeDataChecker(responseData.phone, phone)) {
			attributesData.phone = phone;
		}
		if (AttributeDataChecker(responseData.image, image)) {
			attributesData.image = image;
		}
		if (AttributeDataChecker(responseData.attributes.body_height, body_height)) {
			attributesData.body_height = body_height;
		}
		if (AttributeDataChecker(responseData.attributes.body_weight, body_weight)) {
			attributesData.body_weight = body_weight;
		}

		const checkBirthday = year && month && day ? `${year.value}-${month.value}-${day.value}` : null;
		console.log(`
            ---SUBMITTING---
            name: ${name}
            surname: ${surname}
            securityNo: ${securityNo}
            email: ${email}
            position: ${JSON.stringify(position)}
            branch: ${JSON.stringify(branch)}
            phone: ${phone}
            salary: ${formatSalary}
            image: ${image}
            emergency: ${JSON.stringify(emergency)}
            school_history: ${JSON.stringify(school_history)}
            blood: ${JSON.stringify(blood)}
            gender: ${gender}
            birthday: ${checkBirthday}
			attributes: ${JSON.stringify(attributesData)}
        `);

		console.log(requiredData);

		if (formValid(requiredData)) {
			this.setState({ loadingButton: "btn-loading" });
			UpdateEmployee({
				uid: uid,
				to: to,
				name: name,
				surname: surname,
				security_id: securityNo,
				email: email,
				permission_id: position ? position.value : null,
				phone: phone,
				image: image,
				salary: formatSalary,
				address: address,
				emergency: emergency,
				blood_id: blood ? blood.value : null,
				gender: gender,
				birthday: checkBirthday,
				school_history: school_history,
				certificates: certificate,
				attributes: attributesData
			}).then(code => {
				this.setState({ loadingButton: "" });
				setTimeout(() => {
					if (code === 1020) {
						this.props.history.push("/app/employees/detail/" + to);
					}
				}, 1000);
			});
		} else {
			console.error("FORM INVALID - DISPLAY ERROR");
			const { value } = e.target;
			let formErrors = { ...this.state.formErrors };

			formErrors.name = name ? (name.length < 3 ? "is-invalid" : "") : "is-invalid";
			formErrors.surname = surname ? (surname.length < 3 ? "is-invalid" : "") : "is-invalid";
			formErrors.securityNo = securityNo
				? securityNo.length < 9
					? "is-invalid"
					: !securityNoRegEx.test(securityNo)
					? "is-invalid"
					: ""
				: "is-invalid";
			formErrors.email = email ? (!emailRegEx.test(email) ? "is-invalid" : "") : "is-invalid";
			formErrors.phone = phone ? (phone.length !== 10 ? "is-invalid" : "") : "is-invalid";
			formErrors.salary = salary ? "" : "is-invalid";
			//select
			formErrors.position = position ? "" : true;
			formErrors.branch = branch ? "" : true;

			this.setState({ formErrors });
		}
	};

	handleChange = e => {
		e.preventDefault();
		const { value, name } = e.target;
		let formErrors = { ...this.state.formErrors };

		switch (name) {
			case "name":
				formErrors.name = value.length < 3 ? "is-invalid" : "";
				break;
			case "surname":
				formErrors.surname = value.length < 3 ? "is-invalid" : "";
				break;
			case "securityNo":
				formErrors.securityNo =
					value.length < 9 ? "is-invalid" : !securityNoRegEx.test(value) ? "is-invalid" : "";
				break;
			case "email":
				formErrors.email = value.length < 3 ? "is-invalid" : !emailRegEx.test(value) ? "is-invalid" : "";
				break;
			case "phone":
				formErrors.phone = value.length !== 10 ? "is-invalid" : "";
				break;
			case "salary":
				formErrors.salary = value ? "" : "is-invalid";
				break;
			default:
				break;
		}
		if (name === "salary") {
			this.setState({ formErrors, [name]: value === "0,00" ? null : value });
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
					this.setState({ uploadedFile: false, loadingButton: "btn-loading" });
				}
				formData.append("image", file);
				formData.append("uid", uid);
				formData.append("to", to);
				formData.append("type", "employee");
				UploadFile(formData).then(response => {
					if (response) this.setState({ image: response.data });
					this.setState({ uploadedFile: true, loadingButton: "" });
				});
			};

			reader.readAsDataURL(file);
		} catch (e) {}
	};

	handleSelect = (value, name, extraData, arr) => {
		let formErrors = { ...this.state.formErrors };

		if (arr) {
			this.setState(prevState => {
				return (prevState[name][extraData].kinship = value.label);
			});
		} else {
			switch (name) {
				case "position":
					formErrors.position = value ? false : true;
					break;
				case "branch":
					formErrors.branch = value ? false : true;
					break;
				default:
					break;
			}

			this.setState({ formErrors, [name]: value });
		}
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	render() {
		const {
			name,
			surname,
			securityNo,
			email,
			position,
			branch,
			phone,
			salary,
			image,
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
			certificate,
			formErrors,
			select,
			to,
			imagePreview,
			onLoadedData,
			uploadedFile
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personel Düzenle</h1>
					<div className="col" />
					<div className="col-4 text-right">
						<Link to={`/app/employees/detail/${to}`}>
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
								<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row">
											<div className="col-auto m-auto">
												<label
													htmlFor="image"
													className={`avatar ${
														uploadedFile ? "" : "btn-loading"
													} avatar-xxxl cursor-pointer`}
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
													onClick={() => console.log("tıkladın")}
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
												className={`form-control ${formErrors.securityNo}`}
												onChange={this.handleChange}
												placeholder="T.C. Kimlik No"
												name="securityNo"
												value={securityNo || ""}
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
												styles={formErrors.position === true ? customStylesError : customStyles}
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
												styles={formErrors.branch === true ? customStylesError : customStyles}
												isClearable={true}
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
								<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
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
																value={day}
																onChange={val => this.handleSelect(val, "day")}
																options={select.days}
																name="day"
																placeholder="Gün"
																styles={customStyles}
																isSearchable={true}
																isDisabled={select.days ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
															/>
														</div>
														<div className="col-4">
															<Select
																value={month}
																onChange={val => this.handleSelect(val, "month")}
																options={select.months}
																name="month"
																placeholder="Ay"
																styles={customStyles}
																isSearchable={true}
																isDisabled={select.months ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
															/>
														</div>
														<div className="col-4">
															<Select
																value={year}
																onChange={val => this.handleSelect(val, "year")}
																options={select.years}
																name="year"
																placeholder="Yıl"
																styles={customStyles}
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
														placeholder="Adres"
														value={address || ""}
													/>
												</div>
											</div>
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">Vücut Metrikleri (Boy & Kilo)</label>
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
														styles={customStyles}
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
																						styles={customStyles}
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
															{certificate
																? certificate.map((el, key) => {
																		return (
																			<tr key={key.toString()}>
																				<td className="pl-0 pr-0">
																					<input
																						type="number"
																						min="1950"
																						max="2030"
																						className="w-9 form-control"
																						name={`certificate.year.${key}`}
																						value={el.year || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																				<td>
																					<input
																						type="text"
																						className="form-control"
																						name={`certificate.type.${key}`}
																						value={el.type || ""}
																						onChange={this.handleChange}
																					/>
																				</td>
																				<td className="pl-0">
																					<input
																						type="text"
																						className="form-control"
																						name={`certificate.corporation.${key}`}
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
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer text-right">
								<div className="d-flex" style={{ justifyContent: "space-between" }}>
									<a
										href="javascript:void(0)"
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
										disabled={!uploadedFile ? true : !onLoadedData ? true : false}
										className={`btn btn-primary ml-3 ${this.state.loadingButton}`}>
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
