import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
	formValid,
	selectCustomStylesError,
	selectCustomStyles,
	emailRegEx,
	difference,
	securityNoRegEx
} from "../../assets/js/core";
import { Branchs, PlayerPositions, Groups, Bloods, Days, Months, Years, Kinship } from "../../services/FillSelect";
import { DetailPlayer, UpdatePlayer } from "../../services/Player";
import {
	SplitBirthday,
	getSelectValue,
	UploadFile,
	nullCheck,
	formatDate,
	formatMoney,
	clearMoney
} from "../../services/Others";
import { showSwal } from "../../components/Alert";
import Select from "react-select";
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

const body_measure_list = [
	"Göğüs Çevresi",
	"Bel Çevresi",
	"Kalça Ölçüsü",
	"Kol Ölçüsü",
	"Kol Uzunluğu",
	"Bacak Uzunluğu"
];

export class Edit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			responseData: {},
			emergency: [],
			body_measure: [],
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
				security_id: ""
			},
			loadingButton: "",
			addContinuously: false,
			loading: "active",
			loadingImage: ""
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				name: $("[name=name]"),
				surname: $("[name=surname]"),
				phone: $("[name=phone]"),
				security_id: $("[name=security_id]"),
				fee: $("[name=fee]"),
				emergency_phone: $("[name*='emergency.phone.']"),
				emergency_name: $("[name*='emergency.name.']")
			};
			const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.emergency_phone);
			Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
			Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.fee);
			Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.emergency_name);
		} catch (e) {}
	};

	componentDidMount() {
		this.getFillSelect();
		setTimeout(this.detailPlayer, 150);
		setTimeout(this.fieldMasked, 150);
	}

	handleSubmit = e => {
		try {
			e.preventDefault();
			const {
				uid,
				to,
				name,
				surname,
				security_id,
				email,
				phone,
				gender,
				address,
				image,
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
				status,
				end_date,
				emergency,
				body_measure,
				formErrors,
				is_scholarship,
				note,
				response_data,
				start_date
			} = this.state;

			const require = {};
			require.name = name;
			require.surname = surname;
			require.security_id = security_id;
			require.fee = fee;
			require.day = day;
			require.month = month;
			require.year = year;
			require.start_date = start_date;
			require.branch = branch ? branch.value : null;
			if (status === 0) require.end_date = end_date;
			require.formErrors = formErrors;

			const checkBirthday = year && month && day ? `${year}-${month}-${day}` : null;
			if (formValid(require)) {
				this.setState({ loadingButton: "btn-loading" });
				UpdatePlayer({
					uid: uid,
					to: to,
					name: name.capitalize(),
					surname: surname.toLocaleUpperCase("tr-TR"),
					security_id: security_id,
					position_id: position ? position.value : null,
					branch_id: branch ? branch.value : null,
					blood_id: blood ? blood.value : null,
					group_id: group ? group.value : 1,
					email: email,
					phone: phone,
					gender: gender,
					address: address,
					emergency: emergency,
					point: point,
					fee: formatMoney,
					foot: foot,
					birthday: checkBirthday,
					image: image,
					start_date: moment(start_date).format("YYYY-MM-DD"),
					is_scholarship: is_scholarship,
					note: note,
					attributes: difference(
						{
							start_date: formatDate(start_date, "YYYY-MM-DD"),
							fee: clearMoney(fee),
							position: position,
							email: email,
							phone: phone,
							body_height: body_height,
							body_weight: body_weight,
							body_measure: body_measure,
							foot_no: foot_no,
							point: point,
							image: image,
							group: group,
							branch: branch
						},
						{
							start_date: response_data.start_date,
							fee: clearMoney(response_data.fee),
							position: response_data.position,
							email: response_data.email,
							phone: response_data.phone,
							body_height: response_data.attributes.body_height,
							body_weight: response_data.attributes.body_weight,
							body_measure: response_data.attributes.body_measure,
							foot_no: response_data.foot_no,
							point: response_data.point,
							image: response_data.image,
							group: response_data.group,
							branch: response_data.branch
						}
					)
				}).then(code => {
					this.setState({ loadingButton: "" });
					setTimeout(() => {
						if (code === 1020) {
							this.props.history.push("/app/players/detail/" + to);
						}
					}, 1000);
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
						fee: !is_scholarship ? (fee ? "" : "is-invalid") : "",
						start_date: start_date ? "" : "is-invalid",
						position: position ? "" : true,
						branch: branch ? "" : true,
						day: day ? "" : true,
						month: month ? "" : true,
						year: year ? "" : true
					}
				}));
			}
		} catch (e) {}
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
					value.length !== 11 ? "is-invalid" : !securityNoRegEx.test(value) ? "is-invalid" : "";
				break;
			case "email":
				formErrors.email = value ? (emailRegEx.test(value) ? "" : "is-invalid") : "";
				break;
			case "phone":
				formErrors.phone = value.length !== 10 ? "is-invalid" : "";
				break;
			case "fee":
				formErrors.fee = value ? "" : "is-invalid";
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
				formData.append("type", "player");
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

	handleCheck = e => {
		const { name, checked } = e.target;
		if (name === "is_scholarship" && checked) {
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					fee: ""
				},
				fee: null
			}));
		}
		this.setState({ [name]: checked });
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
	};

	handleDate = (date, name) => {
		if (name === "start_date") this.setState({ end_date: null });

		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: date ? "" : "is-invalid"
			},
			[name]: date
		}));
	};

	getFillSelect = () => {
		Groups().then(response => {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					groups: response
				}
			}));
		});

		Branchs().then(response => {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					branchs: response
				},
				branch: response.filter(x => x.value === localStorage.getItem("sBranch"))
			}));
		});

		Bloods().then(response => {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					bloods: response
				}
			}));
		});

		PlayerPositions().then(response => {
			this.setState(prevState => ({
				select: {
					...prevState.select,
					positions: response
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
			},
			emergency: [
				...prevState.emergency,
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
		}));

		body_measure_list.map(el =>
			this.setState(prevState => ({
				body_measure: [
					...prevState.body_measure,
					{
						type: el,
						value: ""
					}
				]
			}))
		);
	};

	detailPlayer = () => {
		const { uid, to, select } = this.state;
		DetailPlayer({
			uid: uid,
			to: to
		}).then(response => {
			try {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					delete data.uid;

					if (data.is_trial === 1) {
						this.props.history.goBack();
						return null;
					}
					const getSplitBirthday = SplitBirthday(data.birthday);
					const edited_data = {
						...data,
						imagePreview: data.image,
						fee: data.fee.toString().replace(".", ","),
						day: getSplitBirthday.day,
						month: getSplitBirthday.month,
						year: getSplitBirthday.year,
						emergency: data.emergency,
						start_date: data.start_date ? moment(data.start_date, "YYYY-MM-DD").toDate() : null,
						end_date: data.end_date ? moment(data.end_date, "YYYY-MM-DD").toDate() : null
					};

					if (data.branch === null) delete edited_data.branch;

					this.setState(prevState => ({
						...prevState,
						...edited_data,
						response_data: { ...edited_data },
						body_height: data.attributes.body_height,
						body_weight: data.attributes.body_weight,
						body_measure: data.attributes.body_measure,
						foot_no: data.attributes.foot_no,
						loading: ""
					}));
				}
			} catch (e) {}
		});
	};

	render() {
		const {
			to,
			name,
			surname,
			security_id,
			email,
			phone,
			gender,
			address,
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
			body_measure,
			body_height,
			body_weight,
			end_date,
			fee,
			point,
			emergency,
			select,
			formErrors,
			is_scholarship,
			note,
			loadingButton,
			loading,
			loadingImage,
			start_date
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
												value={name}
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
												value={surname}
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
												value={security_id}
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
												styles={selectCustomStyles}
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
												styles={selectCustomStyles}
												isClearable={true}
												isSearchable={true}
												isDisabled={select.positions ? false : true}
												noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">Aidat</label>
											<div className="row gutters-xs">
												<div className="col">
													<input
														type="text"
														className={`form-control ${formErrors.fee}`}
														onChange={this.handleChange}
														placeholder="Aidat"
														name="fee"
														value={fee || "0,00"}
														disabled={is_scholarship}
													/>
												</div>
												<div className="col-auto">
													<label
														className="selectgroup-item"
														data-toggle="tooltip"
														title="Burslu">
														<input
															type="checkbox"
															name="is_scholarship"
															checked={is_scholarship}
															className="selectgroup-input"
															onChange={this.handleCheck}
														/>
														<span className="selectgroup-button selectgroup-button-icon">
															<i className="fa fa-user-graduate"></i>
														</span>
													</label>
												</div>
											</div>
										</div>
										{is_scholarship ? (
											<div className="alert alert-icon alert-primary" role="alert">
												<i className="fe fe-alert-triangle mr-2" aria-hidden="true"></i>
												<p>
													<b>Öğrenci, burslu olarak tanımlandı!</b>
												</p>
												Burslu öğrenciler aidat ödemesinden muaf tutulur.
											</div>
										) : null}
										<div className="form-group">
											<label className="form-label">Genel Puanı</label>
											<div className="row align-items-center">
												<div className="col">
													<input
														type="range"
														className="form-control custom-range"
														step="0.1"
														min="0"
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
														step="0.1"
														min="0"
														max="5"
														value={point || "0"}
														className={`form-control w-8 ${formErrors.point}`}
														onChange={this.handleChange}
													/>
												</div>
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">
												Okula Başlama Tarihi
												<span className="form-required">*</span>
											</label>
											<DatePicker
												autoComplete="off"
												selected={start_date}
												selectsEnd
												startDate={start_date}
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
													Okula Başlama Tarihi
													<span className="form-required">*</span>
												</label>
												<DatePicker
													autoComplete="off"
													selected={end_date}
													selectsEnd
													startDate={end_date}
													name="start_date"
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
													<label className="form-label">Email</label>
													<input
														type="text"
														className={`form-control ${formErrors.email}`}
														onChange={this.handleChange}
														name="email"
														placeholder="Email"
														value={nullCheck(email, "")}
													/>
												</div>
												<div className="form-group">
													<label className="form-label">Telefonu</label>
													<input
														type="text"
														className={`form-control ${formErrors.phone}`}
														onChange={this.handleChange}
														name="phone"
														placeholder="(535) 123 4567"
														value={nullCheck(phone, "")}
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
																value={getSelectValue(select.days, day, "value")}
																onChange={val => this.handleSelect(val, "day", "value")}
																options={select.days}
																name="day"
																placeholder="Gün"
																styles={
																	formErrors.day === true
																		? selectCustomStylesError
																		: selectCustomStyles
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
																value={getSelectValue(select.months, month, "value")}
																onChange={val =>
																	this.handleSelect(val, "month", "value")
																}
																options={select.months}
																name="month"
																placeholder="Ay"
																styles={
																	formErrors.month === true
																		? selectCustomStylesError
																		: selectCustomStyles
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
																value={getSelectValue(select.years, year, "value")}
																onChange={val =>
																	this.handleSelect(val, "year", "value")
																}
																options={select.years}
																name="year"
																placeholder="Yıl"
																styles={
																	formErrors.year === true
																		? selectCustomStylesError
																		: selectCustomStyles
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
														maxLength="1000"
														placeholder="Adres"
														value={nullCheck(address, "")}
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
																value={nullCheck(body_height, "")}
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
																value={nullCheck(body_weight, "")}
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
														styles={selectCustomStyles}
														isClearable={true}
														isSearchable={true}
														isDisabled={select.bloods ? false : true}
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
													/>
												</div>

												<div className="form-group">
													<label className="form-label">Kullandığı Ayak</label>
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
													<label className="form-label">Ayak Numarası</label>
													<input
														type="number"
														className={`form-control ${formErrors.foot_no}`}
														onChange={this.handleChange}
														placeholder="Ayak Numarası"
														name="foot_no"
														min="10"
														max="50"
														value={nullCheck(foot_no, "")}
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
																				value={nullCheck(el.value, "")}
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
														rows={3}
														maxLength="1000"
														value={nullCheck(note, "")}
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
