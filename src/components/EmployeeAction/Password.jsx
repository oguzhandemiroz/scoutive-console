import React, { Component } from "react";
import { ChangeEmployee } from "../../services/Password";
import { Link } from "react-router-dom";
const $ = require("jquery");

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

export class Password extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			password: null,
			data: {},
			formErrors: {
				password: ""
			},
			loadingButton: ""
		};
	}

	componentDidMount() {
		if (this.props.visible)
			$("#passwordModal").modal({
				keyboard: false,
				backdrop: "static"
			});
		this.setState({ ...this.props });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible)
			$("#passwordModal").modal({
				keyboard: false,
				backdrop: "static"
			});
		this.setState({ ...nextProps, password: null });
	}

	handleSubmit = e => {
		try {
			e.preventDefault();
			const { uid, password, data } = this.state;
			if (formValid(this.state)) {
				this.setState({ loadingButton: "btn-loading" });
				ChangeEmployee({
					uid: uid,
					to: data.uid,
					password: password
				}).then(response => {
					this.setState({ loadingButton: "" });
					setTimeout(() => this.reload(), 1000);
				});
			} else {
				console.error("ERROR FORM");
				let formErrors = { ...this.state.formErrors };
				formErrors.password = password
					? password.length < 4
						? "is-invalid-iconless"
						: ""
					: "is-invalid-iconless";

				this.setState({ formErrors });
			}
		} catch (e) {}
	};

	handleChange = e => {
		try {
			e.preventDefault();
			const { value, name } = e.target;
			let formErrors = { ...this.state.formErrors };

			switch (name) {
				case "password":
					formErrors.password = value
						? value.length < 4
							? "is-invalid-iconless"
							: ""
						: "is-invalid-iconless";
					break;
				default:
					break;
			}

			this.setState({ [name]: value, formErrors });
		} catch (e) {}
	};

	generatePassword = e => {
		e.preventDefault();
		let formErrors = { ...this.state.formErrors };
		const pass = Math.random()
			.toString(36)
			.substring(7);

		formErrors.password = "";

		this.setState({ password: pass, formErrors });
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	render() {
		const { password, loadingButton, formErrors, data } = this.state;
		return (
			<div
				className="modal fade"
				id="passwordModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								<i className="fa fa-key mr-2" />
								Şifre Değişikliği
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" />
						</div>
						<form onSubmit={this.handleSubmit}>
							<div className="modal-body">
								<div className="form-group">
									<label className="form-label">Personel Bilgisi:</label>
									<div className="form-control-plaintext">
										<Link to={`/app/employees/detail/${data.uid}`}>{data.name}</Link>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">Yeni Şifre:</label>
									<div className="input-group">
										<input
											type="text"
											className={`form-control ${formErrors.password}`}
											name="password"
											placeholder="Yeni Şifre"
											onChange={this.handleChange}
											id="passwordEmployeeAction"
											value={password || ""}
										/>
										<span className="input-group-append">
											<button
												data-toggle="tooltip"
												title="Şifre Üret"
												className="btn btn-sm btn-indigo"
												onClick={this.generatePassword}
												type="button">
												<i className="fa fa-sync-alt"></i>
											</button>
										</span>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className={`ml-auto btn btn-success ${loadingButton}`}>
									Güncelle
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Password;
