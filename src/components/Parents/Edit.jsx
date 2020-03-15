import React, { Component } from "react";
import { formValid, emailRegEx, securityNoRegEx } from "../../assets/js/core";
import { UpdateParent, DetailParent } from "../../services/Parent";
import { Link, withRouter } from "react-router-dom";
import Inputmask from "inputmask";
import { nullCheck } from "../../services/Others";
const $ = require("jquery");

Inputmask.extendDefaults({
    autoUnmask: true
});

const InputmaskDefaultOptions = {
    showMaskOnHover: false,
    showMaskOnFocus: false,
    placeholder: ""
};

export class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: this.props.match.params.uid,
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
            },
            loadingButton: "",
            loading: "active"
        };
        console.log(this.props.match.params.uid);
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
        this.detailParent();
    }

    detailParent = () => {
        const { uid, to } = this.state;
        DetailParent({
            uid: uid,
            to: to
        }).then(response => {
            if (response) {
                if (response.status.code === 1020) {
                    const data = response.data;
                    delete data.uid;
                    this.setState({ ...data, loading: "" });
                }
            }
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { uid, to, name, surname, phone, email, job, security_id } = this.state;
        let require = { ...this.state };
        delete require.email;
        delete require.job;
        delete require.security_id;
        delete require.loadingButton;

        if (formValid(require)) {
            this.setState({ loadingButton: "btn-loading" });

            UpdateParent({
                uid: uid,
                to: to,
                name: name.capitalize(),
                surname: surname.toLocaleUpperCase("tr-TR"),
                phone: phone,
                email: email === "" ? null : email,
                job: job,
                security_id: security_id
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1022) {
                        this.props.history.push("/app/persons/parents/detail/" + response.uid);
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
        const { name, surname, to, security_id, job, email, phone, formErrors, loading, loadingButton } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Veli Düzenle</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/persons/parents/detail/" + to}>
                        Veli Detayına Geri Dön
                    </Link>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className={`dimmer ${loading}`}>
                                <div className="loader" />
                                <div className="dimmer-content">
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
                                                        value={nullCheck(name, "")}
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
                                                        value={nullCheck(surname, "")}
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
                                                        value={nullCheck(phone, "")}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        onChange={this.handleChange}
                                                        className={`form-control ${formErrors.email}`}
                                                        value={nullCheck(email, "")}
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
                                                        value={nullCheck(security_id, "")}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label">Meslek</label>
                                                    <input
                                                        type="text"
                                                        name="job"
                                                        onChange={this.handleChange}
                                                        className="form-control"
                                                        value={nullCheck(job, "")}
                                                    />
                                                </div>
                                            </div>
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
                                <button className={`btn btn-primary ${loadingButton}`}>Kaydet</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Edit);
