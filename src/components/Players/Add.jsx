import React, { Component } from "react";
import { Bloods, Branchs, Days, Months, Years, PlayerPositions, Kinship, Groups } from "../../services/FillSelect.jsx";
import { UploadFile } from "../../services/Others";
import { CreatePlayer } from "../../services/Player.jsx";
import { showSwal } from "../../components/Alert.jsx";
import Select from "react-select";

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

const body_measure_list = [
	"Göğüs Çevresi",
	"Bel Çevresi",
	"Kalça Ölçüsü",
	"Kol Ölçüsü",
	"Kol Uzunluğu",
	"Bacak Uzunluğu"
];

const initialState = {
	name: null,
	address: null,
	surname: null,
	securityNo: null,
	email: null,
	phone: null,
	branch: null,
	fee: null,
	blood: null,
	gender: null,
	body_height: null,
	body_weight: null,
	point: null,
	day: null,
	month: null,
	year: null,
	foot: null,
	foot_no: null,
	emergency: [],
	body_measure: [],
	position: null,
	group: null,
	imagePreview: null
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
				kinships: null,
				groups: null,
				positions: null
			},
			formErrors: {
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
			addContinuously: false,
			uploadedFile: true
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

		Groups().then(response => {
			console.log(response);
			select.groups = response;
			this.setState({ select });
		});

		PlayerPositions().then(response => {
			console.log(response);
			select.positions = response;
			this.setState({ select });
		});

		for (var i = 0; i < 2; i++) {
			initialState.emergency.push({
				kinship: "",
				name: "",
				phone: ""
			});
		}

		for (var i = 0; i < body_measure_list.length; i++) {
			initialState.body_measure.push({
				type: body_measure_list[i],
				value: ""
			});
		}

		select.days = Days();
		select.months = Months();
		select.years = Years(true);
		select.kinships = Kinship();
		this.setState({ select });
	}

	componentWillUnmount() {
		initialState.emergency = [];
		initialState.body_measure = [];
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
			address,
			gender,
			blood,
			point,
			group,
			body_height,
			body_weight,
			day,
			month,
			year,
			foot,
			foot_no,
			emergency,
			body_measure,
			formErrors,
			addContinuously,
			file,
			imagePreview
		} = this.state;

		const requiredData = {};
		const attributesData = {};

		// require data
		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.securityNo = securityNo;
		requiredData.branch = branch ? branch.value : null;
		requiredData.fee = fee;
		requiredData.day = day ? day.value : null;
		requiredData.month = month ? month.value : null;
		requiredData.year = year ? year.value : null;
		requiredData.foot = foot;
		requiredData.foot_no = foot_no;
		requiredData.formErrors = formErrors;

		//attributes data
		if (fee) {
			attributesData.fee = fee.toString();
		}

		if (position) {
			attributesData.position = position.value.toString();
		}

		if (email) {
			attributesData.email = email.toString();
		}

		if (phone) {
			attributesData.phone = phone.toString();
		}
		if (position) {
			attributesData.position = position.value.toString();
		}

		if (body_height) {
			attributesData.body_height = body_height.toString();
		}

		if (body_weight) {
			attributesData.body_weight = body_weight.toString();
		}

		if (foot_no) {
			attributesData.foot_no = foot_no.toString();
		}

		if (point) {
			attributesData.point = point.toString();
		}

		if (body_measure) {
			attributesData.body_measure = JSON.stringify(body_measure);
		}
		if (group) {
			attributesData.group = group.value.toString();
		}

		console.log(`
        ---SUBMITTING---
           name: ${name}
           surname: ${surname}
           securityNo: ${securityNo}
           email: ${email}
		   position: ${JSON.stringify(position)}
		   group: ${group}
           branch: ${branch}
           phone: ${phone}
           fee: ${fee}
           point: ${point}
           blood: ${blood}
           gender: ${gender}
           foot: ${foot}
           foot_no: ${foot_no}
           birthday: ${year ? year.value : null}-${month ? month.value : null}-${day ? day.value : null}
           attributes: ${JSON.stringify(attributesData)}
           emergency: ${JSON.stringify(emergency)}
           body_measure: ${JSON.stringify(body_measure)}
       `);

		const checkBirthday = year && month && day ? `${year.value}-${month.value}-${day.value}` : null;

		console.log(requiredData);

		if (formValid(requiredData)) {
			this.setState({ loadingButton: "btn-loading" });

			CreatePlayer({
				uid: localStorage.getItem("UID"),
				name: name,
				surname: surname,
				password: "0000",
				security_id: securityNo,
				position_id: position ? position.value : null,
				branch_id: branch ? branch.value : null,
				blood_id: blood ? blood.value : null,
				group_id: group ? group.value : null,
				email: email,
				phone: phone,
				gender: gender,
				address: address,
				emergency: emergency,
				point: point,
				fee: fee ? fee.toString().replace(",", ".") : null,
				foot: foot,
				birthday: checkBirthday,
				attributes: attributesData
			}).then(response => {
				setTimeout(() => {
					if (response.status.code === 1020) {
						if (addContinuously) {
							if (imagePreview) {
								const formData = new FormData();
								formData.append("image", file);
								formData.append("uid", localStorage.getItem("UID"));
								formData.append("to", response.uid);
								formData.append("type", "player");
								formData.append("update", true);
								this.setState({ uploadedFile: false });
								UploadFile(formData).then(response => {
									if (response.status.code === 1020) {
										this.setState({ uploadedFile: true });
									}
									this.setState({ ...initialState });
								});
							} else {
								this.setState({ ...initialState });
							}
						} else {
							if (imagePreview) {
								const formData = new FormData();
								formData.append("image", file);
								formData.append("uid", localStorage.getItem("UID"));
								formData.append("to", response.uid);
								formData.append("type", "player");
								formData.append("update", true);
								this.setState({ uploadedFile: false });
								UploadFile(formData).then(response => {
									if (response.status.code === 1020) {
										this.setState({ uploadedFile: true });
										this.props.history.push("/app/players");
									}
								});
							} else this.props.history.push("/app/players");
						}
					}
				}, 1000);
				this.setState({ loadingButton: "" });
			});
		} else {
			console.error("FORM INVALID - DISPLAY ERROR");
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
			formErrors.email = email ? (!emailRegEx.test(email) ? "is-invalid" : "") : "";
			formErrors.phone = phone ? (phone.length !== 10 ? "is-invalid" : "") : "";
			formErrors.fee = fee ? "" : "is-invalid";
			formErrors.foot = foot !== null ? "" : "is-invalid";
			formErrors.foot_no = foot_no ? "" : "is-invalid";
			//formErrors.point = point ? "" : "is-invalid-iconless";
			//select
			formErrors.position = position ? "" : true;
			formErrors.branch = branch ? "" : true;
			formErrors.day = day ? "" : true;
			formErrors.month = month ? "" : true;
			formErrors.year = year ? "" : true;

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
			case "fee":
				formErrors.fee = value ? "" : "is-invalid";
				break;
			/*case "point":
                formErrors.point = value ? "" : "is-invalid-iconless";
                break;*/
			case "foot_no":
				formErrors.foot_no = value ? "" : "is-invalid";
				break;
			default:
				break;
		}
		if (name.indexOf(".") === -1) this.setState({ formErrors, [name]: value });
		else {
			const splitName = name.split(".");
			this.setState(prevState => {
				return (prevState[splitName[0]][splitName[2]][splitName[1]] = value);
			});
		}
	};

	handleImage = e => {
		try {
			e.preventDefault();
			let reader = new FileReader();
			let file = e.target.files[0];
			reader.onloadend = () => {
				if (reader.result !== null) {
					this.setState({
						imagePreview: reader.result,
						file: file
					});
				}
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

				case "day":
					formErrors.day = value ? false : true;
					break;

				case "month":
					formErrors.month = value ? false : true;
					break;

				case "year":
					formErrors.year = value ? false : true;
					break;
				default:
					break;
			}

			this.setState({ formErrors, [name]: value });
		}
	};

	handleCheck = e => {
		const { name, checked } = e.target;
		this.setState({ [name]: checked });
	};

	handleRadio = e => {
		const { name, value } = e.target;

		let formErrors = { ...this.state.formErrors };

		switch (name) {
			case "foot":
				formErrors.foot = value ? false : true;
				break;
			default:
				break;
		}

		this.setState({ formErrors, [name]: parseInt(value) });
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
			address,
			gender,
			blood,
			point,
			group,
			body_height,
			body_weight,
			day,
			month,
			year,
			foot,
			foot_no,
			body_measure,
			select,
			emergency,
			formErrors,
			uploadedFile,
			imagePreview,
			addContinuously,
			loadingButton
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
											className={`avatar ${
												uploadedFile ? "" : "btn-loading"
											} avatar-xxxl cursor-pointer disabled`}
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
											accept="image/*"
											name="image"
											id="image"
											hidden
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
									<label className="form-label">Grup</label>
									<Select
										value={group}
										onChange={val => this.handleSelect(val, "group")}
										options={select.groups}
										name="group"
										placeholder="Seç..."
										styles={customStyles}
										isClearable={true}
										isSearchable={true}
										isDisabled={select.groups ? false : true}
										noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
									/>
								</div>

								<div className="form-group">
									<label className="form-label">Mevkii</label>
									<Select
										value={position}
										onChange={val => this.handleSelect(val, "position")}
										options={select.positions}
										name="position"
										placeholder="Seç..."
										styles={customStyles}
										isClearable={true}
										isSearchable={true}
										isDisabled={select.positions ? false : true}
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
									<label className="form-label">Genel Puanı</label>
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
												value={point || "0"}
												className={`form-control w-8 ${formErrors.point}`}
												onChange={this.handleChange}
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
											<label className="form-label">Telefonu</label>
											<input
												type="text"
												className={`form-control ${formErrors.phone}`}
												onChange={this.handleChange}
												name="phone"
												placeholder="Telefon (5xx)"
												maxLength="10"
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
														styles={
															formErrors.day === true ? customStylesError : customStyles
														}
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
														styles={
															formErrors.month === true ? customStylesError : customStyles
														}
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
														styles={
															formErrors.year === true ? customStylesError : customStyles
														}
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
														min={0}
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
														id="weight"
														min={0}
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
														checked={gender === 1 ? true : false}
														onChange={this.handleRadio}
														className="selectgroup-input"
													/>
													<span className="selectgroup-button">Kız</span>
												</label>
												<label className="selectgroup-item">
													<input
														type="radio"
														name="gender"
														value="0"
														checked={gender === 0 ? true : false}
														onChange={this.handleRadio}
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

										<div className="form-group">
											<label className="form-label">
												Kullandığı Ayak
												<span className="form-required">*</span>
											</label>
											<div className="custom-controls-stacked">
												<label className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														className={`custom-control-input ${formErrors.foot}`}
														name="foot"
														value="1"
														checked={foot === 1 ? true : false}
														onChange={this.handleRadio}
													/>
													<span className="custom-control-label">Sağ</span>
												</label>
												<label className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														className={`custom-control-input ${formErrors.foot}`}
														name="foot"
														value="2"
														checked={foot === 2 ? true : false}
														onChange={this.handleRadio}
													/>
													<span className="custom-control-label">Sol</span>
												</label>
												<label className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														className={`custom-control-input ${formErrors.foot}`}
														name="foot"
														value="0"
														checked={foot === 0 ? true : false}
														onChange={this.handleRadio}
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
												className={`form-control ${formErrors.foot_no}`}
												onChange={this.handleChange}
												placeholder="Ayak Numarası"
												name="foot_no"
												min="10"
												max="50"
												value={foot_no || ""}
											/>
										</div>
									</div>
									<div className="col-12 mt-3">
										<label className="form-label">Acil Durumda İletişim</label>
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
																		maxLength="10"
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
										<label className="form-label">Vücut Ölçüleri</label>
										<div id="school">
											<table className="table mb-0">
												<thead>
													<tr>
														<th className="w-11 pl-0">Tür</th>
														<th className="pl-0">Değer</th>
													</tr>
												</thead>
												<tbody>
													{body_measure.map((el, key) => {
														return (
															<tr key={key.toString()}>
																<td className="w-11 pl-0 pr-0">
																	<div className="form-control-plaintext">
																		{el.type}:
																	</div>
																</td>
																<td className="pl-0">
																	<input
																		type="number"
																		name={`body_measure.value.${key}`}
																		onChange={this.handleChange}
																		className="form-control"
																		placeholder="(cm)"
																	/>
																</td>
															</tr>
														);
													})}
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
												checked={addContinuously}
												onChange={this.handleCheck}
											/>
											<span className="custom-switch-indicator" />
											<span className="custom-switch-description">Sürekli ekle</span>
										</label>
										<span className="mx-2">
											<span
												className="form-help"
												data-toggle="popover"
												data-placement="top"
												data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Öğrenciler"</b> sayfasına yönlendirilirsiniz.</p>'>
												?
											</span>
										</span>
										<button
											style={{ width: 100 }}
											type="submit"
											className={`btn btn-primary ml-3 ${loadingButton}`}>
											{addContinuously ? "Ekle" : "Ekle ve Bitir"}
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
