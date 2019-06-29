import React, {Component} from "react";
import logo from "../../assets/images/logo.svg";
import {Link} from "react-router-dom";
import {RequestRegister} from "../../services/Register.jsx";

// eslint-disable-next-line
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const taxNoRegEx = /^\d+$/;

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

export class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            email: null,
            taxNo: null,
            password: null,
            terms: false,
            formErrors: {
                name: "",
                email: "",
                taxNo: "",
                password: "",
                terms: ""
            },
            loadingButton: ""
        };
    }

    handleSubmit = e => {
        e.preventDefault();

        if (formValid(this.state)) {
            console.log(`
             ---SUBMITTING---
             name: ${this.state.name}
             email: ${this.state.email}
             taxNo: ${this.state.taxNo}
             password: ${this.state.password}
             terms: ${this.state.terms}
			`);

            this.setState({loadingButton: "btn-loading"});

            RequestRegister({
                name: this.state.name,
                email: this.state.email,
                tax_no: this.state.taxNo,
                password: this.state.password
            }).then(code => {
                this.setState({loadingButton: ""});
            });
        } else {
            console.error("FORM INVALID - DISPLAY ERROR");
            const {value} = e.target;
            let formErrors = {...this.state.formErrors};

            formErrors.name = this.state.name
                ? this.state.name.length < 3
                    ? "is-invalid"
                    : ""
                : "is-invalid";
            formErrors.email = this.state.email
                ? !emailRegEx.test(this.state.email.toLowerCase())
                    ? "is-invalid"
                    : ""
                : "is-invalid";
            formErrors.taxNo = this.state.taxNo
                ? this.state.taxNo.length < 9
                    ? "is-invalid"
                    : taxNoRegEx.test(this.state.taxNo)
                    ? ""
                    : "is-invalid"
                : "is-invalid";
            formErrors.password = this.state.password
                ? this.state.password.length < 3
                    ? "is-invalid"
                    : ""
                : "is-invalid";
            formErrors.terms = this.state.terms ? "" : "is-invalid";

            this.setState({formErrors});
        }
    };

    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = {...this.state.formErrors};
        switch (name) {
            case "name":
                formErrors.name = value.length < 3 ? "is-invalid" : "";
                break;
            case "email":
                formErrors.email = !emailRegEx.test(value.toLowerCase()) ? "is-invalid" : "";
                break;
            case "taxNo":
                formErrors.taxNo =
                    value.length < 9 ? "is-invalid" : taxNoRegEx.test(value) ? "" : "is-invalid";
                break;
            case "password":
                formErrors.password = value.length < 3 ? "is-invalid" : "";
                break;
            default:
                break;
        }
        this.setState({formErrors, [name]: value});
    };

    handleCheck = e => {
        const {name, checked} = e.target;
        let formErrors = {...this.state.formErrors};

        switch (name) {
            case "terms":
                formErrors.terms = !checked ? "is-invalid" : "";
                break;
            default:
                break;
        }
        this.setState({formErrors, [name]: checked});
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
                                                className={`form-control ${formErrors.taxNo}`}
                                                placeholder="Vergi Numarası"
                                                name="taxNo"
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
                                            <input
                                                type="password"
                                                className={`form-control ${formErrors.password}`}
                                                placeholder="Şifre"
                                                name="password"
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="custom-control custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className={`custom-control-input ${
                                                        formErrors.terms
                                                    }`}
                                                    name="terms"
                                                    onChange={this.handleCheck}
                                                    checked={this.state.term}
                                                    noValidate
                                                />
                                                <span className="custom-control-label">
                                                    <Link to="/auth/terms">
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
                                                className={`btn btn-primary btn-block ${
                                                    this.state.loadingButton
                                                }`}>
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
