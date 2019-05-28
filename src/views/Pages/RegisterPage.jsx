import React, { Component } from "react";
import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";

export class RegisterPage extends Component {
	render() {
		return (
			<div className="page">
				<div className="page-single">
					<div className="container">
						<div className="row">
							<div className="col col-login mx-auto">
								<div className="text-center mb-4">
									<Link className="header-brand" to="#">
										<img id="ScoutiveLogo" src={logo} alt="" />
									</Link>
								</div>
								<form className="card" id="registerForm">
									<div className="card-body p-6">
										<div className="card-title">Yeni üyelik oluştur</div>
										<div className="form-group">
											<label className="form-label">
												Okul Adı<span className="form-required">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Okul Adı"
												name="schoolName"
												id="schoolName"
												value="Test -"
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Vergi Numarası<span className="form-required">*</span>
											</label>
											<input
												type="text"
												className="form-control"
												placeholder="Vergi Numarası"
												name="taxNo"
												id="taxNo"
												value="1234567890"
												maxLength="11"
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Email<span className="form-required">*</span>
											</label>
											<input
												type="mail"
												className="form-control"
												placeholder="Email"
												name="email"
												id="email"
												value="test@test.com"
											/>
										</div>
										<div className="form-group">
											<label className="form-label">
												Şifre<span className="form-required">*</span>
											</label>
											<input
												type="password"
												className="form-control"
												placeholder="Şifre"
												name="password"
												id="password"
												value="1234"
											/>
										</div>
										<div className="form-group">
											<label className="custom-control custom-checkbox">
												<input
													type="checkbox"
													className="custom-control-input"
													id="terms"
													name="terms"
												/>
												<span className="custom-control-label">
													<Link to="/auth/terms">Üyelik sözleşmesini </Link>
													okudum ve onaylıyorum<span className="form-required">*</span>
												</span>
											</label>
										</div>
										<div className="form-footer">
											<button
												type="submit"
												className="btn btn-primary btn-block"
												id="registerButton">
												Üye ol
											</button>
										</div>
									</div>
								</form>
								<div className="text-center text-muted">
									Bir hesaba sahip misin? <Link to="/auth/login">Giriş yap</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default RegisterPage;
