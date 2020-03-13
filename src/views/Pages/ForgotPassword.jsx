import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Forgot } from "../../services/Password";
import { formValid } from "../../assets/js/core";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            formErrors: {
                username: ""
            },
            loadingButton: ""
        };
    }

    handleSubmit = e => {
        const { username } = this.state;
        e.preventDefault();

        if (formValid(this.state)) {
            this.setState({ loadingButton: "btn-loading" });

            Forgot({
                username: username
            }).then(() => this.setState({ loadingButton: "" }));
        } else {
            const { value } = e.target;
            let formErrors = { ...this.state.formErrors };
            console.error("FORM INVALID - DISPLAY ERROR");

            formErrors.username = username ? "" : "is-invalid";
            this.setState({ formErrors });
        }
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };

        switch (name) {
            case "username":
                formErrors.username = value ? "" : "is-invalid";
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: value });
    };

    render() {
        const { formErrors, loadingButton } = this.state;
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
                                        <div className="card-title">Şifremi Unuttum</div>
                                        <p className="text-muted">
                                            Lütfen email adresinizi girin, şifre sıfırlama bağlantısı gönderilecektir.
                                        </p>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="username">
                                                Güvenlik Numarası veya Email
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.username}`}
                                                name="username"
                                                placeholder="Güvenlik Numarası veya Email"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-footer">
                                            <button
                                                type="submit"
                                                className={`btn btn-primary btn-block ${loadingButton}`}>
                                                Şifremi sıfırla
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <div className="text-center text-muted">
                                    Hatırladım, <Link to="/auth/login">geri dön</Link>.
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
