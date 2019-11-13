import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { fullnameGenerator, formatPhone } from "../../services/Others";
import Inputmask from "inputmask";
import { CreateTrialPlayer } from "../../services/Player";
import ParentModal from "./ParentModal";
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

const initialState = {
	name: null,
	surname: null,
	security_id: null,
	phone: null,
	note: null,
	parents: []
};

export class Trial extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			formErrors: {
				name: "",
				surname: "",
				security_id: ""
			},
			loadingButton: "",
			parentError: false
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				name: $("[name=name]"),
				surname: $("[name=surname]"),
				phone: $("[name=phone]"),
				security_id: $("[name=security_id]")
			};
			const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
			Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
			Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
			Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
		} catch (e) {}
	};

	componentDidMount() {
		setTimeout(() => this.fieldMasked(), 500);
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, name, surname, security_id, phone, note, parents, formErrors } = this.state;
		const requiredData = {};

		requiredData.name = name;
		requiredData.surname = surname;
		requiredData.security_id = security_id;
		requiredData.formErrors = formErrors;

		if (parents.length > 0 && formValid(requiredData)) {
			this.setState({ loadingButton: "btn-loading" });
			CreateTrialPlayer({
				uid: uid,
				name: name.capitalize(),
				surname: surname.toLocaleUpperCase("tr-TR"),
				security_id: security_id,
				phone: phone,
				password: "151117",
				note: note,
				parents: parents
			}).then(response => {
				if (response) {
					if (response.status.code === 1020) {
						this.props.history.push("/app/players");
					}
				}
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
				},
				parentError: parents.length === 0 ? true : false
			}));
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

	render() {
		const { name, surname, security_id, phone, note, parents, parentError, formErrors, loadingButton } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Ekle &mdash; Ön Kayıt Öğrenci</h1>
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
										<label className="form-label">
											Veli Bilgileri
											<span className="form-required">*</span>
										</label>
										<button
											type="button"
											data-toggle="modal"
											data-target="#parentModal"
											className="btn btn-cyan btn-icon">
											<i className="fa fa-user mr-2" />
											Veli Atama
										</button>
										{parentError ? (
											<span className="ml-2 text-red font-italic">
												<i className="fe fe-alert-circle mr-1" />
												Veli ataması yapılmadı!
											</span>
										) : null}
										{parents.length > 0 ? (
											<div className="row gutters-xs mt-3">
												{parents.map(el => (
													<div className="col-6" key={el.parent_id.toString()}>
														<div className="card">
															<div className="card-body">
																<div className="text-dark font-weight-600">
																	{el.kinship}
																</div>
																<Link
																	to={`/app/parents/detail/${el.uid}`}
																	target="_blank">
																	{fullnameGenerator(el.name, el.surname)}
																</Link>
																<div className="text-muted">
																	Telefon: {formatPhone(el.phone)}
																</div>
																<div className="text-muted">Email: {el.email}</div>
															</div>
														</div>
													</div>
												))}
											</div>
										) : null}
										<ParentModal
											assignParents={parents =>
												this.setState({
													parents: parents,
													parentError: parents.length > 0 ? false : true
												})
											}
										/>
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
