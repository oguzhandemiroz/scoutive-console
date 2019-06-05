import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

export class ForgotPassword extends Component {
	constructor(props) {
		super(props);
	}
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
								<form className="card" action="" method="post">
									<div className="card-body p-6">
										<div className="card-title">Şifremi Unuttum</div>
										<p className="text-muted">
											Lütfen vergi numaranızı veya email adresinizi girin, şifre sıfırlama
											bağlantısı gönderilecektir.
										</p>
										<div className="form-group">
											<label className="form-label" htmlFor="username">
												Vergi No veya Email
											</label>
											<input
												type="text"
												className="form-control"
												id="username"
												aria-describedby="emailHelp"
												placeholder="Vergi No veya Email"
											/>
										</div>
										<div className="form-footer">
											<button type="submit" className="btn btn-primary btn-block">
												Şifremi sıfırla
											</button>
										</div>
									</div>
								</form>
								<div className="text-center text-muted">
									Hatırladım,{" "}
									<a href="#" onClick={() => this.props.history.goBack()}>
										geriye dön
									</a>
									.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ForgotPassword;
