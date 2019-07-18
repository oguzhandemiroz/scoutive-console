import React, {Component} from "react";
import {Link} from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import {Forgot} from "../../services/Password";

// eslint-disable-next-line
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const formValid = ({formErrors, ...rest}) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

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
        e.preventDefault();

        if (formValid(this.state)) {
            console.log(`
				---SUBMITTING---
				username: ${this.state.username}
			`);
            this.setState({loadingButton: "btn-loading"});

            Forgot({
                email: this.state.username
            }).then(() => this.setState({loadingButton: ""}));
        } else {
            const {value} = e.target;
            let formErrors = {...this.state.formErrors};
            console.error("FORM INVALID - DISPLAY ERROR");

            formErrors.username = this.state.username
                ? !emailRegEx.test(this.state.username.toLowerCase())
                    ? "is-invalid"
                    : ""
                : "is-invalid";
            this.setState({formErrors});
        }
    };

    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "username":
                formErrors.username = !emailRegEx.test(value.toLowerCase()) ? "is-invalid" : "";
                break;
            default:
                break;
        }

        this.setState({formErrors, [name]: value});
    };

    render() {
        const {formErrors} = this.state;
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
                                            Lütfen email adresinizi girin, şifre sıfırlama
                                            bağlantısı gönderilecektir.
                                        </p>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="username">
                                                Email
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.username}`}
                                                name="username"
                                                placeholder="Email"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-footer">
                                            <button
                                                type="submit"
                                                className={`btn btn-primary btn-block ${
                                                    this.state.loadingButton
                                                }`}>
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