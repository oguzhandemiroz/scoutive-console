import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Branchs, PlayerPositions, Groups, Bloods, Days, Months, Years, Kinship } from "../../services/FillSelect";
import { DetailPlayer, UpdatePlayer } from "../../services/Player";
import { SplitBirthday, getSelectValue, AttributeDataChecker, UploadFile } from "../../services/Others";
import { showSwal } from "../../components/Alert";
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
	surname: null,
	securityNo: null,
	email: null,
	phone: null,
	gender: null,
	address: null,
	image: null,
	imagePreview: null,
	position: null,
	branch: null,
	group: null,
	blood: null,
	day: null,
	month: null,
	year: null,
	foot: null,
	foot_no: null,
	body_weight: null,
	body_height: null,
	fee: null,
	point: null,
	emergency: [],
	body_measure: []
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
				kinships: null,
				groups: null
			},
			formErrors: {
				name: "",
				surname: "",
				securityNo: ""
			},
			loadingButton: "",
			addContinuously: false,
			onLoadedData: false,
			uploadedFile: true
		};
	}
	componentWillMount() {
		const { uid, to } = this.state;
		let select = { ...this.state.select };

		Bloods().then(response => {
			select.bloods = response;
			this.setState({ select });
		});

		PlayerPositions().then(response => {
			select.positions = response;
			this.setState({ select });
		});

		Branchs().then(response => {
			select.branchs = response;
			this.setState({ select });
		});

		Groups().then(response => {
			select.groups = response;
			this.setState({ select });
		});

		DetailPlayer({
			uid: uid,
			to: to
		}).then(response => {
			try {
				const status = response.status;
				initialState.body = {};
				if (status.code === 1020) {
					const data = response.data;
					this.setState({ responseData: data });
					const getSplitBirthday = SplitBirthday(data.birthday);
					initialState.name = data.name;
					initialState.surname = data.surname;
					initialState.securityNo = data.security_id;
					initialState.email = data.email;
					initialState.phone = data.phone;
					initialState.image = data.image;
					initialState.imagePreview = data.image;
					initialState.gender = data.gender;
					initialState.address = data.address;
					initialState.body_height = data.attributes.body_height;
					initialState.body_weight = data.attributes.body_weight;
					initialState.foot_no = data.attributes.foot_no;
					initialState.fee = data.fee;
					initialState.point = data.point;
					initialState.foot = data.foot;
					initialState.position = getSelectValue(select.positions, data.position, "label");
					initialState.branch = getSelectValue(select.branchs, data.branch, "label");
					initialState.group = data.group ? getSelectValue(select.groups, data.group.name, "label") : null;
					initialState.day = getSelectValue(select.days, getSplitBirthday.day, "value");
					initialState.month = getSelectValue(select.months, getSplitBirthday.month, "value");
					initialState.year = getSelectValue(select.years, getSplitBirthday.year, "value");
					initialState.blood = getSelectValue(select.bloods, data.blood, "label");
					initialState.emergency = data.emergency || [];
					initialState.body_measure = data.attributes.body_measure
						? JSON.parse(data.attributes.body_measure)
						: [];
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
					if (initialState.body_measure) {
						const len = initialState.body_measure.length;
						if (len === 0) {
							for (var i = 0; i < body_measure_list.length; i++) {
								initialState.body_measure.push({
									type: body_measure_list[i],
									value: ""
								});
							}
						}
					}

					this.setState({ ...initialState });
					this.setState({ onLoadedData: true });
				}
			} catch (e) {}
		});

		select.days = Days();
		select.months = Months();
		select.years = Years(true);
		select.kinships = Kinship();

		this.setState({ select });
		console.log(this.state.select);
	}

	handleSubmit = e => {
		try {
			e.preventDefault();
			const {
				to,
				name,
				surname,
				securityNo,
				email,
				phone,
				gender,
				address,
				image,
				imagePreview,
				position,
				branch,
				group,
				blood,
				day,
				month,
				year,
				foot,
				foot_no,
				body_weight,
				body_height,
				fee,
				point,
				emergency,
				body_measure,
				select,
				formErrors,
				loadingButton,
				addContinuously,
				onLoadedData,
				uploadedFile,
				responseData
			} = this.state;
			const requiredData = {};
			const attributesData = {};

			//requiredData
			requiredData.name = name;
			requiredData.surname = surname;
			requiredData.securityNo = securityNo;
			requiredData.fee = fee;
			requiredData.day = day;
			requiredData.month = month;
			requiredData.year = year;
			requiredData.foot = foot;
			requiredData.foot_no = foot_no;
			requiredData.position = position ? position.value : null;
			requiredData.branch = branch ? branch.value : null;
			requiredData.formErrors = formErrors;

			//attributes data
			if (AttributeDataChecker(responseData.fee, fee)) {
				attributesData.fee = fee.toString();
			}
			if (AttributeDataChecker(responseData.position, position ? position.label : "")) {
				attributesData.position = position.value.toString();
			}
			if (AttributeDataChecker(responseData.phone, phone)) {
				attributesData.phone = phone.toString();
			}
			if (AttributeDataChecker(responseData.phone, phone)) {
				attributesData.email = email.toString();
			}
			if (AttributeDataChecker(responseData.image, image)) {
				attributesData.image = image.toString();
			}
			if (AttributeDataChecker(responseData.attributes.foot_no, foot_no)) {
				attributesData.foot_no = foot_no.toString();
			}
			if (AttributeDataChecker(responseData.attributes.point, point)) {
				attributesData.point = point.toString();
			}
			if (AttributeDataChecker(responseData.attributes.body_measure, JSON.stringify(body_measure))) {
				attributesData.body_measure = JSON.stringify(body_measure);
			}
			if (AttributeDataChecker(responseData.attributes.body_height, body_height)) {
				attributesData.body_height = body_height.toString();
			}
			if (AttributeDataChecker(responseData.attributes.body_weight, body_weight)) {
				attributesData.body_weight = body_weight.toString();
			}
			if (AttributeDataChecker(responseData.group ? responseData.group.group_id : "", group ? group.value : "")) {
				attributesData.group = group.value.toString();
			}

			console.log(`
                ---SUBMITTING---
                name: ${name}
                surname: ${surname}
                securityNo: ${securityNo}
                email: ${email}
                position: ${JSON.stringify(position)}
                branch: ${JSON.stringify(branch)}
                phone: ${phone}
                fee: ${fee}
                image: ${image}
                emergency: ${JSON.stringify(emergency)}
                blood: ${JSON.stringify(blood)}
                gender: ${gender}
                birthday: ${year.value}-${month.value}-${day.value}
            `);
			const checkBirthday = year && month && day ? `${year.value}-${month.value}-${day.value}` : null;
			if (formValid(requiredData)) {
				this.setState({ loadingButton: "btn-loading" });
				UpdatePlayer({
					uid: localStorage.getItem("UID"),
					to: to,
					name: name,
					surname: surname,
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
					image: image,
					attributes: attributesData
				}).then(code => {
					this.setState({ loadingButton: "" });
					setTimeout(() => {
						if (code === 1020) {
							this.props.history.push("/app/players/detail/" + to);
						}
					}, 1000);
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
		} catch (e) {}
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
			const formData = new FormData();
			let reader = new FileReader();
			let file = e.target.files[0];
			reader.onloadend = () => {
				if (reader.result !== null) {
					this.setState({
						imagePreview: reader.result
					});
				}
				formData.append("image", file);
				formData.append("uid", localStorage.getItem("UID"));
				formData.append("to", this.state.to);
				formData.append("type", "player");
				this.setState({ uploadedFile: false });
				UploadFile(formData).then(response => {
					if (response) if (response.status.code === 1020) this.setState({ image: response.data });

					this.setState({ uploadedFile: true });
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
			to,
			name,
			surname,
			securityNo,
			email,
			phone,
			gender,
			address,
			image,
			imagePreview,
			position,
			branch,
			group,
			blood,
			day,
			month,
			year,
			foot,
			foot_no,
			body_weight,
			body_height,
			fee,
			point,
			emergency,
			body_measure,
			select,
			formErrors,
			loadingButton,
			onLoadedData,
			uploadedFile
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Düzenle</h1>
					<div className="col" />
					<div className="col-4 text-right">
						<Link to={`/app/players/detail/${to}`}>
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
											<label className="form-label">
												Mevkii
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
																	formErrors.day === true
																		? customStylesError
																		: customStyles
																}
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
																styles={
																	formErrors.month === true
																		? customStylesError
																		: customStyles
																}
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
																styles={
																	formErrors.year === true
																		? customStylesError
																		: customStyles
																}
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
																						maxLength="10"
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
																				value={el.value || ""}
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
										className={`btn btn-primary ml-3 ${loadingButton}`}>
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
