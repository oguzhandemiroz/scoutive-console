import React, { Component } from "react";
import {
	Bloods,
	Branchs,
	Days,
	Months,
	Years,
	EmployeePositions,
	DateRange,
	Kinship
} from "../../services/FillSelect.jsx";
import { DetailEmployee, UpdateEmployee } from "../../services/Employee.jsx";
import { SplitBirthday, UploadFile, getSelectValue } from "../../services/Others.jsx";
import { showSwal } from "../../components/Alert.jsx";
import Select from "react-select";

const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const securityNoRegEx = /^\d+$/;

const formValid = ({ formErrors, ...rest }) => {
	let valid = true;

	Object.values(formErrors).forEach(val => {
		val.length > 0 && (valid = false);
	});

	Object.values(rest).forEach(val => {
		console.log("rest: ", val);
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
	year: null,
	gender: null,
	schoolStartDate: null,
	schoolEndDate: null,
	emergency: null,
	kinship: null,
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
			select: {
				bloods: null,
				positions: null,
				days: null,
				months: null,
				years: null,
				branchs: null,
				schoolStartDates: null,
				schoolEndDates: null,
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

	componentDidMount() {
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
					const getSplitBirthday = SplitBirthday(data.birthday);

					initialState.name = data.name;
					initialState.surname = data.surname;
					initialState.securityNo = data.security_id;
					initialState.phone = data.phone;
					initialState.salary = data.salary;
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
					initialState.emergency = data.emergency;
					/*initialState.emergency = data.emergency;
                initialState.school = data.school_history;
                initialState.certificate = data.certificates;
                initialState.body.height = data.body_metrics ? data.body_metrics.height : "...";
                initialState.body.weight = data.body_metrics ? data.body_metrics.weight : "...";
                
                initialState.secretSalary = data.salary
                    ? CryptoJS.AES.encrypt(data.salary.toString(), "scSecretSalary").toString()
                    : null;
*/
					this.setState({ ...initialState });
					this.setState({ onLoadedData: true });
				}
			}
		});

		select.days = Days();
		select.months = Months();
		select.years = Years();
		select.schoolStartDates = DateRange(1970, 2019);
		select.schoolEndDates = DateRange(1970, 2030);
		select.kinships = Kinship();

		this.setState({ select });
		console.log(this.state.select);
	}

	handleSubmit = e => {
		e.preventDefault();
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
			formErrors,
			to,
			addContinuously
		} = this.state;
		const requiredData = {};
		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.securityNo = securityNo;
		requiredData.email = email;
		requiredData.position = position ? position.value : null;
		requiredData.branch = branch ? branch.value : null;
		requiredData.phone = phone;
		requiredData.salary = salary;
		requiredData.formErrors = formErrors;

		console.log(`
    ---SUBMITTING---
       name: ${name}
       surname: ${surname}
       securityNo: ${securityNo}
       email: ${email}
       position: ${position}
       branch: ${branch}
       phone: ${phone}
       salary: ${salary}
       image: ${image}
   `);

		console.log(requiredData);

		if (formValid(requiredData)) {
			console.log(`
         ---SUBMITTING---
            name: ${name}
            surname: ${surname}
            securityNo: ${securityNo}
            email: ${email}
            position: ${position}
            branch: ${branch}
            phone: ${phone}
            salary: ${salary}
            image: ${image}
        `);

			this.setState({ loadingButton: "btn-loading" });

			UpdateEmployee({
				uid: localStorage.getItem("UID"),
				to: to,
				name: name,
				surname: surname,
				security_id: securityNo,
				email: email,
				permission_id: position.value,
				phone: phone,
				image: image,
				salary: salary
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
			const { name, surname, securityNo, email, position, branch, phone, salary } = this.state;

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
			formErrors.phone = phone ? (phone.length !== 11 ? "is-invalid" : "") : "is-invalid";
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
				formErrors.phone = value.length !== 11 ? "is-invalid" : "";
				break;
			case "salary":
				formErrors.salary = value ? "" : "is-invalid";
				break;
			default:
				break;
		}

		this.setState({ formErrors, [name]: value });
	};

	handleImage = e => {
		try {
			e.preventDefault();
			const formData = new FormData();
			let reader = new FileReader();
			let file = e.target.files[0];
			console.log("geldi", reader, file);
			reader.onloadend = () => {
				if (reader.result !== null) {
					this.setState({
						imagePreview: reader.result
					});
				}
				formData.append("image", file);
				formData.append("uid", localStorage.getItem("UID"));
				formData.append("to", this.state.to);
				formData.append("type", "employee");
				this.setState({ uploadedFile: false });
				UploadFile(formData).then(response => {
					console.log(response);
					if (response.status.code === 1020) this.setState({ uploadedFile: true, image: response.data });
				});
			};

			reader.readAsDataURL(file);
		} catch (e) {}
	};

	handleSelect = (value, name) => {
		let formErrors = { ...this.state.formErrors };

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
		console.log(this.state);
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
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
			kinship,
			formErrors,
			select,
			imagePreview,
			onLoadedData,
			uploadedFile
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personel Düzenle</h1>
					<div className="col" />
					<div className="col-4">
						<select name="user" id="select-employees" className="form-control custom-select" />
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
												maxLength="11"
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
														placeholder="Telefon (05xx)"
														maxLength="11"
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
														rows={6}
														placeholder="Adres"
														value={address}
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
																name="height"
																placeholder="Boy (cm)"
																min={0}
															/>
														</div>
														<div className="col-6">
															<input
																type="number"
																className="form-control"
																name="weight"
																placeholder="Kilo (kg)"
																id="weight"
																min={0}
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
															<span className="selectgroup-button">Kız</span>
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
												<label className="form-label">
													Acil Durumda İletişim
													<span className="form-required">*</span>
												</label>
												<div>
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="pl-0">Yakınlık</th>
																<th>Adı ve Soyadı</th>
																<th className="pl-0">Telefon</th>
																<th style={{ width: "5.5rem" }} className="pl-0">
																	Ekle/Sil
																</th>
															</tr>
														</thead>
														<tbody>
															{emergency
																? emergency.map(el => {																		
																		return (
																			<tr>
																				<td className="pl-0 pr-0">
																					<Select
																						value={getSelectValue(select.kinships, el.kinship, "label")}
																						onChange={val =>
																							this.handleSelect(
																								val,
																								"kinship"
																							)
																						}
																						options={
																							this.state.select.kinships
																						}
																						name="kinship"
																						placeholder="Seç..."
																						styles={customStyles}
																						isClearable={true}
																						isSearchable={true}
																						isDisabled={
																							this.state.select.kinships
																								? false
																								: true
																						}
																						noOptionsMessage={value =>
																							`"${
																								value.inputValue
																							}" bulunamadı`
																						}
																						menuPlacement="top"
																					/>
																				</td>
																				<td>
																					<input
																						type="text"
																						className="form-control"
																						value={el.name}
																					/>
																				</td>
																				<td className="pl-0">
																					<input
																						type="text"
																						className="form-control"
																						value={el.phone}
																					/>
																				</td>
																				<td
																					style={{
																						width: "5.5rem",
																						verticalAlign: "middle"
																					}}
																					className="pl-0 pr-0">
																					<button
																						type="button"
																						className="btn btn-sm btn-icon btn-success mr-1">
																						<i className="fe fe-plus" />
																					</button>
																					<button
																						type="button"
																						className="btn btn-sm btn-icon btn-danger">
																						<i className="fe fe-minus" />
																					</button>
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
												<label className="form-label">
													Okul Bilgileri
													<span className="form-required">*</span>
												</label>
												<div>
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="w-8 pl-0">Baş. Yılı</th>
																<th className="w-8">BİTİŞ Yılı</th>
																<th className="pl-0">Okul Adı</th>
																<th style={{ width: "5.5rem" }} className="pl-0">
																	Ekle/Sil
																</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td className="pl-0 pr-0">
																	<input
																		type="text"
																		maxLength="4"
																		className="w-8 form-control school_start"
																	/>
																</td>
																<td>
																	<input
																		type="text"
																		maxLength="4"
																		className="w-8 form-control school_end"
																	/>
																</td>
																<td className="pl-0">
																	<input
																		type="text"
																		className="form-control school_name"
																	/>
																</td>
																<td
																	style={{
																		width: "5.5rem",
																		verticalAlign: "middle"
																	}}
																	className="pl-0 pr-0">
																	<button
																		type="button"
																		className="btn btn-sm btn-icon btn-success">
																		<i className="fe fe-plus" />
																	</button>
																	<button
																		type="button"
																		className="btn btn-sm btn-icon btn-danger">
																		<i className="fe fe-minus" />
																	</button>
																</td>
															</tr>
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
