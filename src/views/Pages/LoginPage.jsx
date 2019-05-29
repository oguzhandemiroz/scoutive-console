import logo from "../../assets/images/logo.svg";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { showSwal } from "../../components/Alert.jsx";
import { RequestLogin } from "../../services/Login.jsx";

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

export class LoginPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: localStorage.getItem("sRemember") || null,
			password: null,
			remember: localStorage.getItem("sRemember") ? true : false,
			formErrors: {
				username: "",
				password: ""
			},
			loadingButton: ""
		};
	}

	handleSubmit = e => {
		e.preventDefault();

		if (formValid(this.state)) {
			console.log(`
             ---SUBMITTING---
             username: ${this.state.username}
             password: ${this.state.password}
             remember: ${this.state.remember}
			`);

			this.setState({ loadingButton: "btn-loading" });

			RequestLogin(
				{
					username: this.state.username,
					password: this.state.password
				},
				this.state.remember
			).then(code => {
				this.setState({ loadingButton: "" });
			});
		} else {
			console.error("FORM INVALID - DISPLAY ERROR");
		}
	};

	handleChange = e => {
		e.preventDefault();
		const { name, value } = e.target;
		let formErrors = { ...this.state.formErrors };

		switch (name) {
			case "username":
				formErrors.username = value.length < 3 ? "is-invalid" : "";
				break;
			case "password":
				formErrors.password = value.length < 3 ? "is-invalid" : "";
				break;
			default:
				break;
		}

		this.setState({ formErrors, [name]: value });
	};

	handleCheck = e => {
		const { name, checked } = e.target;
		this.setState({ [name]: checked });
	};

	render() {
		const { formErrors } = this.state;
		return (
			<div className="page">
				<div className="page-single">
					<div className="container">
						<div className="row">
							<div className="col col-login mx-auto">
								<div className="text-center mb-4">
									<Link className="header-brand" to="#" tabIndex="-1">
										<img id="ScoutiveLogo" src={logo} alt="" />
									</Link>
								</div>
								<form className="card" noValidate onSubmit={this.handleSubmit}>
									<div className="card-body p-6">
										<div className="card-title">Giriş yap</div>
										<div className="form-group">
											<label className="form-label username-label">
												Güvenlik Numarası veya Email
											</label>
											<input
												type="text"
												className={`form-control ${formErrors.username}`}
												name="username"
												aria-describedby="emailHelp"
												placeholder="Güvenlik Numarası veya Email"
												tabIndex="1"
												onChange={this.handleChange}
												value={this.state.username}
												noValidate
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Şifre
												<Link to="/auth/forgot-password" className="float-right small">
													Şifremi unuttum
												</Link>
											</label>
											<input
												type="password"
												className={`form-control ${formErrors.password}`}
												name="password"
												placeholder="Şifre"
												tabIndex="2"
												onChange={this.handleChange}
												noValidate
											/>
										</div>
										<div className="form-group">
											<label className="custom-control custom-checkbox">
												<input
													type="checkbox"
													className="custom-control-input"
													name="remember"
													checked={this.state.remember}
													onChange={this.handleCheck}
													tabIndex="3"
												/>
												<span className="custom-control-label">Beni Hatırla</span>
											</label>
										</div>
										<div className="form-footer">
											<button
												tabIndex="4"
												type="submit"
												className={`btn btn-primary btn-block ${this.state.loadingButton}`}>
												Giriş yap
											</button>
										</div>
									</div>
								</form>
								<div className="text-center text-muted">
									Bir hesaba sahip değil misin? <Link to="/auth/register">Üye ol</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LoginPage;
