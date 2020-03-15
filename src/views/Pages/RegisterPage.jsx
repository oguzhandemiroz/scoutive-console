import React, { Component } from "react";
import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { RequestRegister } from "../../services/Register.jsx";
import { formValid, emailRegEx, securityNoRegEx } from "../../assets/js/core";
import { ActivateSchool } from "../../services/Others";

export class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            email: null,
            tax_no: null,
            password: null,
            terms: null,
            formErrors: {
                name: "",
                email: "",
                tax_no: "",
                password: "",
                terms: ""
            },
            loadingButton: "",
            showPassword: false
        };
    }

    handleSubmit = e => {
        const { name, email, tax_no, password, terms } = this.state;
        e.preventDefault();

        if (formValid(this.state)) {
            this.setState({ loadingButton: "btn-loading" });

            RequestRegister({
                name: name,
                email: email,
                tax_no: tax_no,
                password: password
            }).then(response => {
                if (response) {
                    const data = response.data;
                    const status = response.status;

                    if (status.code === 1021) {
                        localStorage.setItem("sRemember", tax_no);
                        ActivateSchool("Hesabınız Oluşturuldu", { username: tax_no, password: password }, data);
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    name: name ? (name.length < 3 ? "is-invalid" : "") : "is-invalid",
                    email: email ? (emailRegEx.test(email.toLowerCase()) ? "" : "is-invalid") : "is-invalid",
                    tax_no: securityNoRegEx.test(tax_no) ? (tax_no.length < 9 ? "is-invalid" : "") : "is-invalid",
                    password: password ? (password.length < 3 ? "is-invalid" : "") : "is-invalid",
                    terms: terms ? "" : "is-invalid"
                }
            }));
        }
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "name":
                formErrors.name = value.length < 3 ? "is-invalid" : "";
                break;
            case "email":
                formErrors.email = !emailRegEx.test(value.toLowerCase()) ? "is-invalid" : "";
                break;
            case "tax_no":
                formErrors.tax_no = value.length < 9 ? "is-invalid" : securityNoRegEx.test(value) ? "" : "is-invalid";
                break;
            case "password":
                formErrors.password = value.length < 3 ? "is-invalid" : "";
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: value });
    };

    handleSelect = (value, name) => {
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: value ? false : true
            },
            [name]: value
        }));
    };

    handleCheck = e => {
        const { name, checked } = e.target;
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                terms: checked ? "" : "is-invalid"
            },
            [name]: checked
        }));
    };

    handleShowPassword = () => {
        const { showPassword } = this.state;
        const showPasswordToggle = !showPassword;
        this.setState({ showPassword: showPasswordToggle });
    };

    render() {
        const { formErrors, showPassword } = this.state;
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
                                <form className="card" noValidate onSubmit={this.handleSubmit}>
                                    <div className="card-body p-6">
                                        <div className="card-title">Yeni üyelik oluştur</div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Okul Adı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.name}`}
                                                placeholder="Okul Adı"
                                                name="name"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Vergi Numarası
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.tax_no}`}
                                                placeholder="Vergi Numarası"
                                                name="tax_no"
                                                maxLength="11"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Email<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="mail"
                                                className={`form-control ${formErrors.email}`}
                                                placeholder="Email"
                                                name="email"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Şifre<span className="form-required">*</span>
                                            </label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className={`form-control ${formErrors.password}`}
                                                    placeholder="Şifre"
                                                    name="password"
                                                    noValidate
                                                    onChange={this.handleChange}
                                                />
                                                <span
                                                    class="input-group-append cursor-pointer"
                                                    onClick={this.handleShowPassword}>
                                                    <span class="input-group-text">
                                                        <i className={`fe fe-eye${showPassword ? "-off" : ""}`}></i>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="custom-control custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className={`custom-control-input ${formErrors.terms}`}
                                                    name="terms"
                                                    onChange={this.handleCheck}
                                                    checked={this.state.term}
                                                    noValidate
                                                />
                                                <span className="custom-control-label">
                                                    <Link to="/auth/terms" target="_blank">
                                                        Üyelik sözleşmesini{" "}
                                                    </Link>
                                                    okudum ve onaylıyorum
                                                    <span className="form-required">*</span>
                                                </span>
                                            </label>
                                        </div>
                                        <div className="form-footer">
                                            <button
                                                type="submit"
                                                className={`btn btn-primary btn-block ${this.state.loadingButton}`}>
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
