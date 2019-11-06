import React, { Component } from "react";
import { formValid, selectCustomStyles, emailRegEx } from "../../assets/js/core";
import Select from "react-select";
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

export class ParentModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			search: false,
			name: null,
			surname: null,
			phone: null,
			email: null,
			formErrors: {
				name: "",
				surname: "",
				phone: "",
				email: ""
			},
			select: {
				kinships: [
					{ value: "Anne", label: "Anne" },
					{ value: "Baba", label: "Baba" },
					{ value: "Diğer", label: "Diğer" }
				]
			},
			loadingButton: ""
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				name: $("[name=name]"),
				surname: $("[name=surname]"),
				phone: $("[name=phone]")
			};
			const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
			Inputmask({ alias: "try", ...InputmaskDefaultOptions }).mask(elemArray.phone);
			Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
			Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
		} catch (e) {}
	};

	componentDidMount() {
		this.fieldMasked();
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, name, surname, phone, email } = this.state;

		if (formValid(this.state)) {
			this.setState({ loadingButton: "btn-loading" });
			console.log("gönderdik");
		} else {
			console.error("ERRORR", this.state);
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					name: name ? "" : "is-invalid",
					surname: name ? "" : "is-invalid",
					phone: name ? "" : "is-invalid"
				}
			}));
		}
	};

	handleChange = e => {
		const { name, value } = e.target;
		let formErrors = { ...this.state.formErrors };
		switch (name) {
			case "name":
				formErrors.name = value.length < 2 ? "is-invalid" : "";
				break;
			case "surname":
				formErrors.surname = value.length < 2 ? "is-invalid" : "";
				break;
			case "email":
				formErrors.email = value ? (emailRegEx.test(value) ? "" : "is-invalid") : "";
				break;
			case "phone":
				formErrors.phone = value.length !== 10 ? "is-invalid" : "";
				break;
			default:
				break;
		}
		this.setState({ formErrors, [name]: value });
	};

	handleSelect = (value, name) => {
		this.setState({ [name]: value });
	};

	render() {
		const { select, search, formErrors } = this.state;
		return (
			<div
				className="modal fade"
				id="parentModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="parentModalLabel"
				aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="parentModalLabel">
								<i className={`mr-2 fa fa-user`} />
								Veli Oluştur ve Ata
							</h5>
							<button
								type="button"
								onClick={() => {
									const search = !this.state.search;
									this.setState({ search });
								}}
								className={`btn btn-${search ? "success" : "primary"} btn-sm ml-auto`}>
								{search ? "Veli Oluştur" : "Veli Ara"}
							</button>
							<button type="button" className="close ml-0" data-dismiss="modal" aria-label="Close" />
						</div>
						{search ? (
							<div className="modal-body">
								<div className="form-group">
									<label className="form-label">Veli Ara</label>
									<Select
										//value={kinship}
										onChange={val => this.handleSelect(val, "kinship")}
										options={select.kinships}
										name="kinship"
										placeholder="Seç..."
										styles={selectCustomStyles}
									/>
								</div>
							</div>
						) : (
							<div className="modal-body">
								<div className="form-group">
									<div className="row gutters-xs">
										<div className="col-6">
											<label className="form-label">
												Adı<span className="form-required">*</span>
											</label>
											<input
												type="text"
												name="name"
												onChange={this.handleChange}
												className={`form-control ${formErrors.name}`}
											/>
										</div>
										<div className="col-6">
											<label className="form-label">
												Soyadı<span className="form-required">*</span>
											</label>
											<input
												type="text"
												name="surname"
												onChange={this.handleChange}
												className={`form-control ${formErrors.surname}`}
											/>
										</div>
									</div>
								</div>

								<div className="form-group">
									<div className="row gutters-xs">
										<div className="col-6">
											<label className="form-label">
												Telefon<span className="form-required">*</span>
											</label>
											<input
												type="text"
												name="phone"
												onChange={this.handleChange}
												className={`form-control ${formErrors.phone}`}
											/>
										</div>
										<div className="col-6">
											<label className="form-label">Email</label>
											<input
												type="text"
												name="email"
												onChange={this.handleChange}
												className={`form-control ${formErrors.email}`}
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="modal-footer">
							<button type="button" onClick={this.handleSubmit} className="btn btn-success">
								{search ? "Veli Ata" : "Veli Oluştur"}
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ParentModal;
