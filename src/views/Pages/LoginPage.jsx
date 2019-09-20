import logo from "../../assets/images/logo.svg";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { RequestLogin, SetSchoolInfoToLocalStorage } from "../../services/Login.jsx";
import { formValid } from "../../assets/js/core";
import { ActivateSchool } from "../../services/Others";
import { showSwal, Toast } from "../../components/Alert";

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
		const { username, password, remember } = this.state;
		e.preventDefault();

		if (formValid(this.state)) {
			this.setState({ loadingButton: "btn-loading" });
			RequestLogin(
				{
					username: username,
					password: password
				},
				remember
			).then(response => {
				if (response) {
					const data = response.data;
					const status = response.status;
					if (status.code === 1020) {
						Toast.fire({
							type: "success",
							title: "Giriş yapılıyor..."
						});
						SetSchoolInfoToLocalStorage(data);
					} else if (status.code === 1082) {
						this.notActivateSchool(data, status);
					}
				}
				this.setState({ loadingButton: "" });
			});
		} else {
			this.setState(prevState => ({
				formErrors: {
					...prevState.formErrors,
					username: username ? (username.length < 3 ? "is-invalid" : "") : "is-invalid",
					password: password ? (password.length < 3 ? "is-invalid" : "") : "is-invalid"
				}
			}));
		}
	};

	handleChange = e => {
		e.preventDefault();
		const { name, value } = e.target;

		this.setState(prevState => ({
			formErrors: {
				...prevState.formErrors,
				[name]: value ? (value.length < 3 ? "is-invalid" : "") : "is-invalid"
			},
			[name]: value
		}));
	};

	handleCheck = e => {
		const { name, checked } = e.target;
		this.setState({ [name]: checked });
	};

	notActivateSchool = (data, status) => {
		const { username, password } = this.state;
		showSwal({
			type: "warning",
			title: "Hata Kodu: " + status.code,
			text: status.description,
			confirmButtonText: "Aktive Et",
			cancelButtonText: "İptal",
			confirmButtonColor: "#467fcf",
			cancelButtonColor: "#868e96",
			showCancelButton: true,
			reverseButtons: true
		}).then(re => {
			if (re.value) {
				ActivateSchool("Hesabı Aktive Et", { username: username, password: password }, data);
				this.setState({ loadingButton: "" });
			}
		});
	};

	render() {
		const { username, remember, formErrors } = this.state;
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
												placeholder="Güvenlik Numarası veya Email"
												tabIndex="1"
												onChange={this.handleChange}
												value={username || ""}
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
													checked={remember}
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

export default withRouter(LoginPage);
