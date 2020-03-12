import React, { Component } from "react";
import { formValid, emailRegEx, securityNoRegEx } from "../../assets/js/core";
import { CreateParent } from "../../services/Parent";
import { Link, withRouter } from "react-router-dom";
import Inputmask from "inputmask";
const $ = require("jquery");

Inputmask.extendDefaults({
    autoUnmask: true
});

const InputmaskDefaultOptions = {
    showMaskOnHover: false,
    showMaskOnFocus: false,
    placeholder: ""
};

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            name: null,
            surname: null,
            phone: null,
            email: null,
            job: null,
            security_id: null,
            formErrors: {
                name: "",
                surname: "",
                phone: "",
                email: "",
                parent: ""
            }
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                name: $("[name=name]"),
                surname: $("[name=surname]"),
                phone: $("[name=phone]"),
                security_id: $("[name=security_id]")
            };
            const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
            Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
            Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
            Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
        } catch (e) {}
    };

    componentDidMount() {
        this.fieldMasked();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { uid, name, surname, phone, email, job, security_id } = this.state;
        let require = { ...this.state };
        delete require.email;
        delete require.job;
        delete require.security_id;
        delete require.loadingButton;

        if (formValid(require)) {
            this.setState({ loadingButton: "btn-loading" });

            CreateParent({
                uid: uid,
                name: name,
                surname: surname,
                phone: phone,
                email: email === "" ? null : email,
                password: "151117",
                job: job,
                security_id: security_id
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1021) {
                        this.props.history.push("/app/persons/parents/detail/" + response.data.uid);
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    name: name ? "" : "is-invalid",
                    surname: surname ? "" : "is-invalid",
                    phone: phone ? (phone.length !== 10 ? "is-invalid" : "") : "is-invalid"
                }
            }));
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "name":
                formErrors.name = value.length < 2 ? "is-invalid" : "";
                break;
            case "surname":
                formErrors.surname = value.length < 2 ? "is-invalid" : "";
                break;
            case "email":
                formErrors.email = value ? (emailRegEx.test(value) ? "" : "is-invalid") : "";
                break;
            case "security_id":
                formErrors.security_id = value ? (securityNoRegEx.test(value) ? "" : "is-invalid") : "";
                break;
            case "phone":
                formErrors.phone = value.length !== 10 ? "is-invalid" : "";
                break;
            default:
                break;
        }
        this.setState({ formErrors, [name]: value });
    };

    handleSelect = (value, name) => {
        this.setState({ [name]: value });
    };

    render() {
        const { formErrors, loadingButton } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Veli Ekle</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/persons/parents"}>
                        Veliler Sayfasına Geri Dön
                    </Link>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="form-label">
                                                Adı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.name}`}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">
                                                Soyadı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="surname"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.surname}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="form-label">
                                                Telefon<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.phone}`}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                name="email"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.email}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="form-label">T.C. Kimlik Numarası</label>
                                            <input
                                                type="text"
                                                name="security_id"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.security_id}`}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Meslek</label>
                                            <input
                                                type="text"
                                                name="job"
                                                onChange={this.handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-primary alert-icon card-alert">
                                <i className="fe fe-alert-triangle mr-2"></i>
                                <p>
                                    <strong>Kişisel Veri Koruma Kanunu (KVKK/GDPR) Uyarısı</strong>
                                </p>
                                Yukarıdaki bilgilerin, velinin rızası ve bilgisi dahilinde sisteme kayıt edildiğini ve
                                gerektiğinde veliyle iletişime geçileceğini kabul ediyor ve onaylıyorum.
                            </div>
                            <div className="card-footer text-right">
                                <button className={`btn btn-primary ${loadingButton}`}>Ekle ve Bitir</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Add);
