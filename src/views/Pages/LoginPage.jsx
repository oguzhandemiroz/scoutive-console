import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

export class LoginPage extends Component {
	render() {
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
								<form className="card" id="loginForm">
									<div className="card-body p-6">
										<div className="card-title">Giriş yap</div>
										<div className="form-group">
											<label className="form-label username-label">
												Güvenlik Numarası veya Email
											</label>
											<input
												type="text"
												className="form-control"
												id="username"
												name="username"
												aria-describedby="emailHelp"
												placeholder="Güvenlik Numarası veya Email"
												tabIndex="1"
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
												className="form-control"
												name="password"
												id="password"
												placeholder="Şifre"
												tabIndex="2"
											/>
										</div>
										<div className="form-group">
											<label className="custom-control custom-checkbox">
												<input
													type="checkbox"
													className="custom-control-input"
													name="remember"
													id="remember"
													tabIndex="3"
												/>
												<span className="custom-control-label">Beni Hatırla</span>
											</label>
										</div>
										<div className="form-footer">
											<button
												tabIndex="4"
												type="submit"
												className="btn btn-primary btn-block"
												id="loginButton">
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
