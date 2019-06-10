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
	image: null,
	name: null,
	surname: null,
	securityNo: null,
	email: null,
	phone: null,
	branch: null,
	fee: null,
	point: null,
	day: null,
	month: null,
	year: null,
	kinship: null
};

export class Add extends Component {
	constructor(props) {
		super(props);

		this.state = {
			...initialState,
			select: {
				bloods: null,
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
				branch: "",
				phone: "",
				fee: "",
				point: ""
			},
			loadingButton: "",
			addContinuously: false
		};
	}

	componentDidMount() {
		let select = { ...this.state.select };

		Bloods().then(response => {
			console.log(response);
			select.bloods = response;
			this.setState({ select });
		});

		Branchs().then(response => {
			console.log(response);
			select.branchs = response;
			this.setState({ select });
		});

		select.days = Days();
		select.months = Months();
		select.years = Years();
		select.kinships = Kinship();
		this.setState({ select });
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
			fee,
			point,
			image,
			formErrors,
			addContinuously
		} = this.state;
		const requiredData = {};
		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.securityNo = securityNo;
		requiredData.position = position ? position.value : null;
		requiredData.branch = branch ? branch.value : null;
		requiredData.phone = phone;
		requiredData.fee = fee;
		requiredData.point = point;
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
           fee: ${fee}
           point: ${point}
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
                fee: ${fee}
                point: ${point}
                image: ${image}
			`);

			this.setState({ loadingButton: "btn-loading" });

			/*CreateEmployee({
				uid: localStorage.getItem("UID"),
				name: name,
				surname: surname,
				password: "0000",
				security_id: securityNo,
				email: email,
				permission_id: position.value,
				phone_gsm: phone
			}).then(code => {
				this.setState({ loadingButton: "" });
				setTimeout(() => {
					if (code === 1020) {
						if (addContinuously) {
							console.log("devaaam");
							this.setState({ ...initialState });
						} else {
							this.props.history.push("/app/employees");
						}
					}
				}, 1000);
			});*/
		} else {
			console.error("FORM INVALID - DISPLAY ERROR");
			const { value } = e.target;
			let formErrors = { ...this.state.formErrors };
			const { name, surname, securityNo, email, position, branch, phone, fee, point, image } = this.state;

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
			formErrors.fee = fee ? "" : "is-invalid";
			formErrors.point = point ? "" : "is-invalid";
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
			case "fee":
				formErrors.fee = value ? "" : "is-invalid";
				break;
			default:
				break;
		}

		this.setState({ formErrors, [name]: value });
	};

	handleImage = e => {
		try {
			e.preventDefault();

			let reader = new FileReader();
			let file = e.target.files[0];

			reader.onloadend = () => {
				this.setState({
					file: file,
					image: reader.result
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
			fee,
			point,
			image,
			blood,
			day,
			month,
			year,
			kinship,
			select,
			formErrors
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Ekle</h1>
				</div>
				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-4 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Genel Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col-auto m-auto">
										<label
											htmlFor="image"
											className="avatar avatar-xxxl cursor-pointer"
											style={{
												border: "none",
												outline: "none",
												fontSize: ".875rem"
											}}>
											Fotoğraf Ekle
										</label>
										<input type="file" name="image" id="image" hidden onChange={this.handleImage} />
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
										Aidat
										<span className="form-required">*</span>
									</label>
									<input
										type="text"
										className={`form-control ${formErrors.fee}`}
										onChange={this.handleChange}
										placeholder="Aidat"
										name="fee"
										value={fee || ""}
									/>
								</div>

								<div className="form-group">
									<label className="form-label">
										Genel Puanı
										<span className="form-required">*</span>
									</label>
									<div className="row align-items-center">
										<div className="col">
											<input
												type="range"
												className="form-control custom-range"
												step="0.1"
												min="1"
												max="5"
												name="point"
												value={point || "0"}
												onChange={this.handleChange}
											/>
										</div>
										<div className="col-auto">
											<input
												type="number"
												name="point"
												className="form-control w-8"
												onChange={this.handleChange}
												value={point || "0"}
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
								<div className="row">
									<div className="col-lg-6 col-md-12">
										<div className="form-group">
											<label className="form-label">Email</label>
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
											<label className="form-label">
												Doğum Tarihi
												<span className="form-required">*</span>
											</label>
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
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
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
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
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
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
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
												defaultValue={""}
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
														defaultValue={0}
														className="selectgroup-input"
														defaultChecked
													/>
													<span className="selectgroup-button">Erkek</span>
												</label>
												<label className="selectgroup-item">
													<input
														type="radio"
														name="gender"
														defaultValue={1}
														className="selectgroup-input"
													/>
													<span className="selectgroup-button">Kız</span>
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

										<div className="form-group">
											<label className="form-label">
												Kullandığı Ayak
												<span className="form-required">*</span>
											</label>
											<div className="custom-controls-stacked">
												<label className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														className="custom-control-input"
														name="example-inline-radios"
														value="option1"
													/>
													<span className="custom-control-label">Sağ</span>
												</label>
												<label className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														className="custom-control-input"
														name="example-inline-radios"
														value="option2"
													/>
													<span className="custom-control-label">Sol</span>
												</label>
												<label className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														className="custom-control-input"
														name="example-inline-radios"
														value="option3"
													/>
													<span className="custom-control-label">Sağ & Sol</span>
												</label>
											</div>
										</div>

										<div className="form-group">
											<label className="form-label">
												Ayak Numarası
												<span className="form-required">*</span>
											</label>
											<input
												type="number"
												className={`form-control`}
												onChange={this.handleChange}
												placeholder="Ayak Numarası"
												name="foot_no"
												min="10"
												max="50"
											/>
										</div>
									</div>
									<div className="col-12 mt-3">
										<label className="form-label">
											Acil Durumda İletişim
											<span className="form-required">*</span>
										</label>
										<div id="parent">
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
													<tr>
														<td className="pl-0 pr-0">
															<Select
																value={kinship}
																onChange={val => this.handleSelect(val, "kinship")}
																options={select.kinships}
																name="kinship"
																placeholder="Seç..."
																styles={customStyles}
																isClearable={true}
																isSearchable={true}
																isDisabled={select.kinships ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
																menuPlacement="top"
															/>
														</td>
														<td>
															<input type="text" className="form-control" />
														</td>
														<td className="pl-0">
															<input type="text" className="form-control" />
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
												</tbody>
											</table>
										</div>
									</div>
									<div className="col-12 mt-3">
										<label className="form-label">Vücut Ölçüleri</label>
										<div id="school">
											<table className="table mb-0">
												<thead>
													<tr>
														<th className="pl-0">Tür</th>
														<th>Değer</th>
														<th style={{ width: "5.5rem" }} className="pl-0">
															Ekle/Sil
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="pl-0 pr-0" />
														<td className="pl-0">
															<input type="text" className="form-control" />
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
																<i className="fe fe-plus" id="addSchool" />
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
												if (result.value) this.props.history.push("/app/players");
											});
										}}
										className="btn btn-link">
										İptal
									</a>
									<div className="d-flex" style={{ alignItems: "center" }}>
										<label className="custom-switch">
											<input
												type="checkbox"
												name="addContinuously"
												className="custom-switch-input"
											/>
											<span className="custom-switch-indicator" />
											<span className="custom-switch-description">Sürekli ekle</span>
										</label>
										<span className="mx-2">
											<span
												className="form-help"
												data-toggle="popover"
												data-placement="top"
												data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Personeller"</b> sayfasına yönlendirilirsiniz.</p>'>
												?
											</span>
										</span>
										<button style={{ width: 100 }} type="submit" className={`btn btn-primary ml-3`}>
											Ekle ve Bitir
										</button>
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

export default Add;
