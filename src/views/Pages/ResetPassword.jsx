import React, {Component} from "react";
import {Link} from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import {Reset} from "../../services/Password";

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

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            UID: props.match.params.uid,
            newPassword: null,
            newPasswordAgain: null,
            formErrors: {
                newPassword: "",
                newPasswordAgain: ""
            },
            loadingButton: ""
        };
    }

    handleSubmit = e => {
        e.preventDefault();

        if (formValid(this.state)) {
            this.setState({loadingButton: "btn-loading"});

            Reset(
                {
                    uid: this.state.UID,
                    password: this.state.newPassword
                },
                this.props.history
            ).then(() => this.setState({loadingButton: ""}));
        } else {
            const {value} = e.target;
            let formErrors = {...this.state.formErrors};
            console.error("FORM INVALID - DISPLAY ERROR");

            formErrors.newPassword = this.state.newPassword
                ? this.state.newPassword.length < 3
                    ? "is-invalid"
                    : ""
                : "is-invalid";

            formErrors.newPasswordAgain = this.state.newPasswordAgain
                ? this.state.newPasswordAgain.length < 3
                    ? "is-invalid"
                    : this.state.newPasswordAgain === this.state.newPassword
                    ? ""
                    : "is-invalid"
                : "is-invalid";
            this.setState({formErrors});
        }
    };

    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "newPassword":
                formErrors.newPassword = value.length < 3 ? "is-invalid" : "";
                break;

            case "newPasswordAgain":
                formErrors.newPasswordAgain =
                    value.length < 3
                        ? "is-invalid"
                        : this.state.newPassword === value
                        ? ""
                        : "is-invalid";
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
                                        <div className="form-group">
                                            <label className="form-label">Yeni Şifre</label>
                                            <input
                                                type="email"
                                                className={`form-control ${formErrors.newPassword}`}
                                                name="newPassword"
                                                aria-describedby="emailHelp"
                                                placeholder="Yeni Şifre"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Yeni Şifre (Tekrar)
                                            </label>
                                            <input
                                                type="email"
                                                className={`form-control ${
                                                    formErrors.newPasswordAgain
                                                }`}
                                                name="newPasswordAgain"
                                                aria-describedby="emailHelp"
                                                placeholder="Yeni Şifre (Tekrar)"
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ResetPassword;
