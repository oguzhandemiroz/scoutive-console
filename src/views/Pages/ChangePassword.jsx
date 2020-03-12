import React, { Component } from "react";
import { Change } from "../../services/Password";

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

const initialState = {
    password: null,
    new_password: null,
    new_password_again: null
};

export class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            loadingButton: "",
            formErrors: { password: "", new_password: "", new_password_again: "" }
        };
    }

    handleSubmit = e => {
        try {
            e.preventDefault();
            const { uid, password, new_password, new_password_again } = this.state;

            if (formValid(this.state)) {
                this.setState({ loadingButton: "btn-loading" });
                Change({
                    uid: uid,
                    current_password: password,
                    new_password: new_password_again
                }).then(response => {
                    if (response) {
                        if (response.status.code === 1022) {
                            this.props.history.push("/app/dashboard");
                        }
                    }
                    this.setState({ loadingButton: "" });
                });
            } else {
                console.error("FORM INVALID - DISPLAY ERROR");
                let formErrors = { ...this.state.formErrors };

                formErrors.password = password ? (password.length < 3 ? "is-invalid" : "") : "is-invalid";
                formErrors.new_password = new_password ? (new_password.length < 3 ? "is-invalid" : "") : "is-invalid";
                formErrors.new_password_again = new_password_again
                    ? new_password_again === new_password
                        ? ""
                        : "is-invalid"
                    : "is-invalid";

                this.setState({ formErrors });
            }
        } catch (e) {}
    };

    handleChange = e => {
        try {
            e.preventDefault();
            const { name, value } = e.target;
            let formErrors = { ...this.state.formErrors };
            const { new_password } = this.state;

            switch (name) {
                case "password":
                    formErrors.password = value ? (value.length < 3 ? "is-invalid" : "") : "is-invalid";
                    break;
                case "new_password":
                    formErrors.new_password = value ? (value.length < 3 ? "is-invalid" : "") : "is-invalid";
                    break;
                case "new_password_again":
                    formErrors.new_password_again = value ? (value === new_password ? "" : "is-invalid") : "is-invalid";
                    break;
                default:
                    break;
            }

            this.setState({ formErrors, [name]: value });
        } catch (e) {}
    };

    render() {
        const { formErrors, loadingButton, password, new_password, new_password_again } = this.state;
        return (
            <div className="page-single">
                <div className="container">
                    <div className="row">
                        <div className="col col-login mx-auto">
                            <form className="card" noValidate onSubmit={this.handleSubmit}>
                                <div className="card-body p-6">
                                    <div className="card-title">Şifre Değişikliği</div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Mevcut Şifre
                                            <span className="form-required">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${formErrors.password}`}
                                            name="password"
                                            placeholder="Mevcut Şifre"
                                            onChange={this.handleChange}
                                            value={password || ""}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Yeni Şifre
                                            <span className="form-required">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${formErrors.new_password}`}
                                            name="new_password"
                                            placeholder="Yeni Şifre"
                                            onChange={this.handleChange}
                                            value={new_password || ""}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Yeni Şifre (Tekrar)
                                            <span className="form-required">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${formErrors.new_password_again}`}
                                            name="new_password_again"
                                            placeholder="Yeni Şifre (Tekrar)"
                                            onChange={this.handleChange}
                                            value={new_password_again || ""}
                                        />
                                    </div>
                                    <div className="form-footer">
                                        <button className={`btn btn-primary btn-block ${loadingButton}`}>
                                            Değiştir
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePassword;
