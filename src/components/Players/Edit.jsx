import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    formValid,
    selectCustomStylesError,
    selectCustomStyles,
    emailRegEx,
    difference,
    securityNoRegEx
} from "../../assets/js/core";
import { Branchs, PlayerPositions, Bloods } from "../../services/FillSelect";
import { DetailPlayer, UpdatePlayer } from "../../services/Player";
import { UploadFile, nullCheck, formatDate, formatMoney, fullnameGenerator, formatPhone } from "../../services/Others";
import { showSwal } from "../../components/Alert";
import Select from "react-select";
import Inputmask from "inputmask";
import DatePicker, { registerLocale } from "react-datepicker";
import ParentModal from "./ParentModal";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import moment from "moment";
const $ = require("jquery");

registerLocale("tr", tr);

Inputmask.extendDefaults({
    autoUnmask: true
});

Inputmask.extendAliases({
    try: {
        integerDigits: 12,
        suffix: " ₺",
        radixPoint: ",",
        groupSeparator: ".",
        alias: "numeric",
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false,
        allowMinus: false,
        allowPlus: false,
        rightAlign: false
    }
});

const InputmaskDefaultOptions = {
    showMaskOnHover: false,
    showMaskOnFocus: false,
    placeholder: ""
};

/* const body_measure_list = [
    "Göğüs Çevresi",
    "Bel Çevresi",
    "Kalça Ölçüsü",
    "Kol Ölçüsü",
    "Kol Uzunluğu",
    "Bacak Uzunluğu"
]; */

export class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            responseData: {},
            is_cash: true,
            select: {
                bloods: null,
                positions: null,
                branchs: null,
                kinships: null
            },
            show: {
                body_metrics: false
            },
            formErrors: {
                name: "",
                surname: "",
                security_id: ""
            },
            show: {},
            loadingButton: "",
            addContinuously: false,
            loading: "active",
            loadingImage: "",
            parents: [],
            parentError: false
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                name: $("[name=name]"),
                surname: $("[name=surname]"),
                phone: $("[name=phone]"),
                security_id: $("[name=security_id]"),
                fee: $("[name=fee]")
            };
            const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
            Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
            Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
            Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.fee);
            Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
        } catch (e) {}
    };

    componentDidMount() {
        this.getFillSelect();
        this.detailPlayer();
        setTimeout(this.fieldMasked, 150);
    }

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {
                uid,
                to,
                name,
                surname,
                security_id,
                email,
                phone,
                gender,
                address,
                image,
                position,
                branch,
                blood,
                foot,
                foot_no,
                body_weight,
                body_height,
                point,
                status,
                end_date,
                formErrors,
                payment_type,
                note,
                response_data,
                start_date,
                parents,
                birthday
            } = this.state;

            const require = {};
            require.name = name;
            require.surname = surname;
            require.security_id = security_id;
            require.start_date = start_date;
            require.branch = branch ? branch.value : null;
            if (status === 0) require.end_date = end_date;
            require.formErrors = formErrors;

            this.setState({ parentError: false });
            if (parents.length > 0 && formValid(require)) {
                this.setState({ loadingButton: "btn-loading" });
                UpdatePlayer({
                    uid: uid,
                    to: to,
                    name: name.capitalize(),
                    surname: surname.toLocaleUpperCase("tr-TR"),
                    security_id: security_id,
                    position_id: position ? position.value : null,
                    branch_id: branch.value,
                    blood_id: blood ? blood.value : null,
                    email: email,
                    phone: phone,
                    gender: gender,
                    address: address,
                    point: point,
                    foot: foot,
                    birthday: formatDate(birthday, "YYYY-MM-DD"),
                    image: image,
                    start_date: formatDate(start_date, "YYYY-MM-DD"),
                    end_date: end_date ? formatDate(end_date, "YYYY-MM-DD") : null,
                    note: note,
                    payment_type: payment_type,
                    attributes: difference(
                        {
                            start_date: formatDate(start_date, "YYYY-MM-DD"),
                            position: position ? position.value : null,
                            email: email,
                            phone: phone,
                            body_height: body_height,
                            body_weight: body_weight,
                            foot_no: foot_no,
                            point: point,
                            image: image,
                            branch: branch.value
                        },
                        {
                            start_date: response_data.start_date,
                            position: response_data.position ? response_data.position.value : null,
                            email: response_data.email,
                            phone: response_data.phone,
                            body_height: response_data.attributes.body_height,
                            body_weight: response_data.attributes.body_weight,
                            foot_no: response_data.foot_no,
                            point: response_data.point,
                            image: response_data.image,
                            branch: response_data.branch.value
                        }
                    ),
                    parents: parents
                }).then(response => {
                    if (response) {
                        if (response.status.code === 1020) {
                            setTimeout(this.props.history.push("/app/players/detail/" + to), 1000);
                        }
                    }
                    this.setState({ loadingButton: "" });
                });
            } else {
                this.setState(prevState => ({
                    formErrors: {
                        ...prevState.formErrors,
                        name: name ? (name.length < 2 ? "is-invalid" : "") : "is-invalid",
                        surname: surname ? (surname.length < 2 ? "is-invalid" : "") : "is-invalid",
                        security_id: securityNoRegEx.test(security_id)
                            ? security_id.length < 9
                                ? "is-invalid"
                                : ""
                            : "is-invalid",
                        start_date: start_date ? "" : "is-invalid",
                        position: position ? "" : true,
                        branch: branch ? "" : true,
                        birthday: birthday ? "" : "is-invalid"
                    },
                    parentError: parents.length === 0 ? true : false
                }));
            }
        } catch (e) {}
    };

    handleChange = e => {
        e.preventDefault();
        const { value, name } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "name":
                formErrors.name = value.length < 2 ? "is-invalid" : "";
                break;
            case "surname":
                formErrors.surname = value.length < 2 ? "is-invalid" : "";
                break;
            case "security_id":
                formErrors.security_id =
                    value.length !== 11 ? "is-invalid" : !securityNoRegEx.test(value) ? "is-invalid" : "";
                break;
            case "email":
                formErrors.email = value ? (emailRegEx.test(value) ? "" : "is-invalid") : "";
                break;
            case "phone":
                formErrors.phone = value.length !== 10 ? "is-invalid" : "";
                break;
            case "fee":
                formErrors.fee = value ? "" : "is-invalid";
                break;
            default:
                break;
        }
        if (name === "fee") {
            this.setState({ formErrors, [name]: value === "0,00" ? null : value });
        } else if (name.indexOf(".") === -1) this.setState({ formErrors, [name]: value });
        else {
            const splitName = name.split(".");
            this.setState(prevState => {
                return (prevState[splitName[0]][splitName[2]][splitName[1]] = value);
            });
        }
    };

    handleImage = e => {
        try {
            e.preventDefault();
            const { uid, to } = this.state;
            const formData = new FormData();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                if (reader.result !== null) {
                    this.setState({
                        imagePreview: reader.result
                    });
                    this.setState({ loadingImage: "btn-loading", loadingButton: "btn-loading" });
                }
                formData.append("image", file);
                formData.append("uid", uid);
                formData.append("to", to);
                formData.append("type", "player");
                UploadFile(formData).then(response => {
                    if (response) this.setState({ image: response.data });
                    this.setState({ loadingImage: "", loadingButton: "" });
                });
            };

            reader.readAsDataURL(file);
        } catch (e) {}
    };

    handleSelect = (value, name, extraData, arr) => {
        if (arr) {
            this.setState(prevState => {
                return (prevState[name][extraData].kinship = value.label);
            });
        } else {
            if (name === "branch") {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        positions: null
                    },
                    position: null
                }));
                PlayerPositions(value.value).then(response => {
                    this.setState(prevState => ({
                        select: {
                            ...prevState.select,
                            positions: response
                        }
                    }));
                });
            }
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    [name]: value ? false : true
                },
                [name]: extraData ? value[extraData] : value
            }));
        }
    };

    handleCheck = e => {
        const { name, checked } = e.target;
        if (name === "is_scholarship" && checked) {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    fee: ""
                },
                fee: null
            }));
        }
        this.setState({ [name]: checked });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        this.setState({ [name]: parseInt(value) });
    };

    handleDate = (date, name) => {
        if (name === "start_date") this.setState({ end_date: null });

        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: date ? "" : "is-invalid"
            },
            [name]: date
        }));
    };

    handleOtherInfo = e => {
        const { name } = e.target;
        const toggle = this.state.show[name];
        e.target.classList.toggle("active");
        this.setState(prevState => ({
            show: {
                ...prevState.show,
                [name]: !toggle
            }
        }));
    };

    handleFeeType = e => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                fee: ""
            },
            fee: null,
            [name]: parseInt(value)
        }));
    };

    renderFeeWarning = type => {
        switch (type) {
            case 0:
                return (
                    <div className="alert alert-icon alert-primary" role="alert">
                        <i className="fa fa-calendar-alt mr-2" aria-hidden="true"></i>
                        <p>
                            <b>Ödeme tipi aylık olarak tanımlı!</b>
                        </p>
                        Aylık ödemeler, öğrencinin okula başladığı tarih veya sabit bir tarihte alınır.
                    </div>
                );
            case 1:
                return (
                    <div className="alert alert-icon alert-primary mt-2" role="alert">
                        <i className="fa fa-graduation-cap mr-2" aria-hidden="true"></i>
                        <p>
                            <b>Ödeme tipi burslu olarak tanımlı!</b>
                        </p>
                        Burslu öğrenciler aidat ödemesinden muaf tutulur.
                    </div>
                );
            case 2:
                return (
                    <div className="alert alert-icon alert-primary" role="alert">
                        <i className="fa fa-money-bill-alt mr-2" aria-hidden="true"></i>
                        <p>
                            <b>Ödeme tipi tek ödeme olarak tanımlı!</b>
                        </p>
                        <p>
                            Tek ödeme tipi kurslar için tercih edilir. Tek ödeme tipinde peşinat girebilirsiniz ve
                            ödemeyi taksitlendirebilirsiniz.
                        </p>
                        Ödemesini tamamlayan öğrenciler ödemeden muaf tutulur.
                    </div>
                );
            default:
                break;
        }
    };

    getFillSelect = () => {
        var sBranch = localStorage.getItem("sBranch");

        Branchs().then(response => {
            if (response) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        branchs: response
                    },
                    branch: response.filter(x => x.value === localStorage.getItem("sBranch"))
                }));
            }
        });

        Bloods().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    bloods: response
                }
            }));
        });

        PlayerPositions(sBranch ? sBranch : 1).then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    positions: response
                }
            }));
        });
    };

    detailPlayer = () => {
        const { uid, to } = this.state;
        DetailPlayer({
            uid: uid,
            to: to,
            attribute_values: []
        }).then(response => {
            try {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    delete data.uid;

                    if (data.is_trial === 1) {
                        this.props.history.goBack();
                        return null;
                    }
                    const edited_data = {
                        ...data,
                        imagePreview: data.image,
                        fee: data.fee ? data.fee.toString().replace(".", ",") : null,
                        birthday: moment(data.birthday, "YYYY-MM-DD").toDate(),
                        start_date: moment(data.start_date, "YYYY-MM-DD").toDate(),
                        end_date: data.end_date ? moment(data.end_date, "YYYY-MM-DD").toDate() : null
                    };

                    if (data.branch === null) delete edited_data.branch;

                    this.setState(prevState => ({
                        ...prevState,
                        ...edited_data,
                        response_data: { ...edited_data },
                        body_height: data.attributes.body_height,
                        body_weight: data.attributes.body_weight,
                        point: data.attributes.point,
                        foot_no: data.attributes.foot_no,
                        loading: ""
                    }));
                }
            } catch (e) {}
        });
    };

    render() {
        const {
            to,
            name,
            surname,
            security_id,
            email,
            phone,
            gender,
            address,
            imagePreview,
            position,
            branch,
            blood,
            foot,
            birthday,
            foot_no,
            body_height,
            body_weight,
            end_date,
            fee,
            point,
            select,
            formErrors,
            note,
            loadingButton,
            loading,
            loadingImage,
            start_date,
            parents,
            parentError,
            show,
            payment_type,
            installment,
            installment_date,
            downpayment,
            downpayment_date,
            is_cash
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Düzenle</h1>
                    <div className="col" />
                    <div className="col-4 text-right">
                        <Link to={`/app/players/detail/${to}`}>
                            <i className="fe fe-arrow-left" /> Detay sayfasına dön
                        </Link>
                    </div>
                </div>

                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>

                            <div className="card-body pt-3">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-auto m-auto">
                                                <label
                                                    htmlFor="image"
                                                    className={`avatar ${loadingImage} avatar-xxxl cursor-pointer`}
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: ".875rem",
                                                        backgroundImage: `url(${imagePreview})`
                                                    }}>
                                                    {!imagePreview ? "Fotoğraf ekle" : ""}
                                                </label>
                                                <input
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={this.handleImage}
                                                />
                                            </div>
                                        </div>
                                        <div className="row gutters-xs">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Adı
                                                        <span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErrors.name}`}
                                                        onChange={this.handleChange}
                                                        placeholder="Adı"
                                                        name="name"
                                                        value={name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Soyadı
                                                        <span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErrors.surname}`}
                                                        onChange={this.handleChange}
                                                        placeholder="Soyadı"
                                                        name="surname"
                                                        value={surname}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                T.C. Kimlik No
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.security_id}`}
                                                onChange={this.handleChange}
                                                placeholder="T.C. Kimlik No"
                                                name="security_id"
                                                value={security_id}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Doğum Tarihi
                                                <span className="form-required">*</span>
                                            </label>
                                            <DatePicker
                                                autoComplete="off"
                                                selected={birthday}
                                                selectsEnd
                                                startDate={birthday}
                                                name="birthday"
                                                locale="tr"
                                                dateFormat="dd/MM/yyyy"
                                                onChange={date => this.handleDate(date, "birthday")}
                                                className={`form-control ${formErrors.birthday}`}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Ödeme Tipi<span className="form-required">*</span>
                                            </label>
                                            <div className="selectgroup w-100">
                                                {payment_type === 2 ? (
                                                    <label className="selectgroup-item">
                                                        <input
                                                            type="radio"
                                                            name="payment_type"
                                                            value="2"
                                                            className="selectgroup-input"
                                                            checked
                                                        />
                                                        <span className="selectgroup-button selectgroup-button-icon">
                                                            <i className="fa fa-money-bill-alt"></i>
                                                            <div className="small">Tek Ödeme</div>
                                                        </span>
                                                    </label>
                                                ) : null}
                                                {payment_type === 0 ? (
                                                    <label className="selectgroup-item">
                                                        <input
                                                            type="radio"
                                                            name="payment_type"
                                                            value="0"
                                                            className="selectgroup-input"
                                                            checked
                                                        />
                                                        <span className="selectgroup-button selectgroup-button-icon">
                                                            <i className="fa fa-calendar-alt"></i>
                                                            <div className="small">Aylık</div>
                                                        </span>
                                                    </label>
                                                ) : null}
                                                {payment_type === 1 ? (
                                                    <label className="selectgroup-item">
                                                        <input
                                                            type="radio"
                                                            name="payment_type"
                                                            value="1"
                                                            className="selectgroup-input"
                                                            checked
                                                        />
                                                        <span className="selectgroup-button selectgroup-button-icon">
                                                            <i className="fa fa-graduation-cap"></i>
                                                            <div className="small">Burslu</div>
                                                        </span>
                                                    </label>
                                                ) : null}
                                            </div>
                                        </div>

                                        <fieldset
                                            className={`form-fieldset ${payment_type === 0 ? "d-block" : "d-none"}`}>
                                            <label className="form-label mb-0">
                                                Aidat<span className="form-required">*</span>
                                            </label>
                                            <div className="form-control-plaintext">
                                                {formatMoney(parseFloat(fee) || 0)}
                                            </div>
                                        </fieldset>

                                        <fieldset
                                            className={`form-fieldset ${payment_type === 2 ? "d-block" : "d-none"}`}>
                                            <div className="form-group mb-2">
                                                <label className="form-label">
                                                    Ödeme Tutarı<span className="form-required">*</span>
                                                </label>
                                                <div className="form-control-plaintext">
                                                    {formatMoney(parseFloat(fee) || 0)}
                                                </div>
                                            </div>
                                            <label className="custom-control custom-checkbox custom-control-inline">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    name="is_cash"
                                                    disabled
                                                    checked={is_cash}
                                                />
                                                <span className="custom-control-label">Peşin Ödendi</span>
                                            </label>
                                            <div className={is_cash ? "d-none" : "d-block"}>
                                                <div className="row gutters-xs">
                                                    <div className="col-lg-6 col-md-12">
                                                        <div className="form-group">
                                                            <label className="form-label">Peşinat</label>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${formErrors.downpayment}`}
                                                                onChange={this.handleChange}
                                                                placeholder="Aidat"
                                                                name="downpayment"
                                                                value={downpayment || "0,00"}
                                                                disabled={!fee}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-12">
                                                        <div className="form-group">
                                                            <label className="form-label">Peşinat Tarihi</label>
                                                            <DatePicker
                                                                autoComplete="off"
                                                                selected={downpayment_date}
                                                                selectsEnd
                                                                startDate={downpayment_date}
                                                                name="downpayment_date"
                                                                locale="tr"
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={date =>
                                                                    this.handleDate(date, "downpayment_date")
                                                                }
                                                                className={`form-control ${formErrors.downpayment_date}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row gutters-xs">
                                                    <div className="col-lg-6 col-md-12">
                                                        <div className="form-group">
                                                            <label className="form-label">
                                                                Taksit Sayısı<span className="form-required">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className={`form-control ${formErrors.installment}`}
                                                                onChange={this.handleChange}
                                                                placeholder="Taksit"
                                                                name="installment"
                                                                min="1"
                                                                max="48"
                                                                value={installment}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-12">
                                                        <div className="form-group">
                                                            <label className="form-label">
                                                                Taksit Başlangıç<span className="form-required">*</span>
                                                            </label>
                                                            <DatePicker
                                                                autoComplete="off"
                                                                selected={installment_date}
                                                                selectsEnd
                                                                startDate={installment_date}
                                                                name="installment_date"
                                                                locale="tr"
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={date =>
                                                                    this.handleDate(date, "installment_date")
                                                                }
                                                                className={`form-control ${formErrors.installment_date}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {fee ? (
                                                <div className="alert alert-icon alert-success" role="alert">
                                                    <i className="fa fa-align-left mr-2" aria-hidden="true"></i>
                                                    <p>
                                                        <b>Ödeme Özeti</b>
                                                    </p>
                                                    <p>
                                                        <b>{formatMoney(parseFloat(fee))}</b> ödemenin,
                                                        <br />
                                                        <b>
                                                            {is_cash
                                                                ? formatMoney(parseFloat(fee))
                                                                : formatMoney(parseFloat(downpayment || 0))}
                                                        </b>
                                                        'sı peşin olarak ödendi.
                                                    </p>
                                                    {is_cash ? null : (
                                                        <>
                                                            Geriye kalan&nbsp;
                                                            <b>
                                                                {formatMoney(
                                                                    parseFloat(fee) - parseFloat(downpayment || 0)
                                                                )}
                                                            </b>
                                                            ,<br />
                                                            <b>{formatDate(installment_date)}</b> tarihinden
                                                            itibaren&nbsp;
                                                            <b>{installment}</b>
                                                            &nbsp;taksit olarak ayda
                                                            <br />
                                                            <b>
                                                                {formatMoney(
                                                                    (parseFloat(fee) - parseFloat(downpayment || 0)) /
                                                                        parseInt(installment)
                                                                )}
                                                            </b>
                                                            &nbsp; ödenecektir.
                                                        </>
                                                    )}
                                                </div>
                                            ) : null}
                                        </fieldset>

                                        {this.renderFeeWarning(payment_type)}

                                        <div className="form-group">
                                            <label className="form-label">
                                                Okula Başlama Tarihi
                                                <span className="form-required">*</span>
                                            </label>
                                            <DatePicker
                                                autoComplete="off"
                                                selected={start_date}
                                                selectsEnd
                                                startDate={start_date}
                                                name="start_date"
                                                locale="tr"
                                                dateFormat="dd/MM/yyyy"
                                                onChange={date => this.handleDate(date, "start_date")}
                                                className={`form-control ${formErrors.start_date}`}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Branşı
                                                <span className="form-required">*</span>
                                            </label>
                                            <Select
                                                value={branch}
                                                onChange={val => this.handleSelect(val, "branch")}
                                                options={select.branchs}
                                                name="branch"
                                                placeholder="Seç..."
                                                styles={
                                                    formErrors.branch === true
                                                        ? selectCustomStylesError
                                                        : selectCustomStyles
                                                }
                                                isSearchable={true}
                                                isDisabled={select.branchs ? false : true}
                                                isLoading={select.branchs ? false : true}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>

                                        {end_date ? (
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Okuldan Ayrılma Tarihi
                                                    <span className="form-required">*</span>
                                                </label>
                                                <DatePicker
                                                    autoComplete="off"
                                                    selected={end_date}
                                                    selectsEnd
                                                    startDate={end_date}
                                                    name="start_date"
                                                    locale="tr"
                                                    dateFormat="dd/MM/yyyy"
                                                    onChange={date => this.handleDate(date, "end_date")}
                                                    className={`form-control ${formErrors.end_date}`}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label className="form-label">Cinsiyeti</label>
                                                    <div className="selectgroup w-100">
                                                        <label className="selectgroup-item">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value="1"
                                                                checked={gender === 1 ? true : false}
                                                                onChange={this.handleRadio}
                                                                className="selectgroup-input"
                                                            />
                                                            <span className="selectgroup-button">Kız</span>
                                                        </label>
                                                        <label className="selectgroup-item">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value="0"
                                                                checked={gender === 0 ? true : false}
                                                                onChange={this.handleRadio}
                                                                className="selectgroup-input"
                                                            />
                                                            <span className="selectgroup-button">Erkek</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Mevkii</label>
                                                    <Select
                                                        value={position}
                                                        onChange={val => this.handleSelect(val, "position")}
                                                        options={select.positions}
                                                        name="position"
                                                        placeholder="Seç..."
                                                        styles={selectCustomStyles}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={select.positions ? false : true}
                                                        isLoading={select.positions ? false : true}
                                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Adresi</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="address"
                                                        onChange={this.handleChange}
                                                        rows={3}
                                                        maxLength="1000"
                                                        placeholder="Adres"
                                                        value={nullCheck(address, "")}
                                                    />
                                                </div>

                                                <label className="form-label">
                                                    Veli Bilgileri
                                                    <span className="form-required">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#parentModal"
                                                    className="btn btn-cyan btn-icon">
                                                    <i className="fa fa-user mr-2" />
                                                    Veli Atama
                                                </button>
                                                {parentError ? (
                                                    <span className="ml-2 text-red font-italic">
                                                        <i className="fe fe-alert-circle mr-1" />
                                                        Veli ataması yapılmadı!
                                                    </span>
                                                ) : null}
                                                {parents.length > 0 ? (
                                                    <div className="row gutters-xs mt-3">
                                                        {parents.map(el => (
                                                            <div className="col-6" key={el.parent_id.toString()}>
                                                                <div className="card">
                                                                    <div className="card-body">
                                                                        <div className="text-dark font-weight-600">
                                                                            {el.kinship}
                                                                        </div>
                                                                        <Link
                                                                            to={`/app/parents/detail/${el.uid}`}
                                                                            target="_blank">
                                                                            {fullnameGenerator(el.name, el.surname)}
                                                                        </Link>
                                                                        <div className="text-muted">
                                                                            Telefon: {formatPhone(el.phone)}
                                                                        </div>
                                                                        <div className="text-muted">
                                                                            Email: {el.email}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="font-italic text-center w-100 p-4">
                                                        Kayıtlı veli bilgisi bulunamadı...
                                                    </div>
                                                )}
                                                <ParentModal
                                                    parents={parents}
                                                    assignParents={parents =>
                                                        this.setState({
                                                            parents: parents,
                                                            parentError: parents.length > 0 ? false : true
                                                        })
                                                    }
                                                />
                                                <hr className="mt-4 mb-2" />
                                            </div>
                                            <div className="col-12">
                                                <div className={`form-group ${show.email ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErrors.email}`}
                                                        onChange={this.handleChange}
                                                        name="email"
                                                        placeholder="Email"
                                                        value={nullCheck(email, "")}
                                                    />
                                                </div>
                                                <div className={`form-group ${show.phone ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Telefonu</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formErrors.phone}`}
                                                        onChange={this.handleChange}
                                                        name="phone"
                                                        placeholder="(535) 123 4567"
                                                        value={nullCheck(phone, "")}
                                                    />
                                                </div>
                                                <div className={`form-group ${show.point ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Genel Puanı</label>
                                                    <div className="row align-items-center">
                                                        <div className="col">
                                                            <input
                                                                type="range"
                                                                className="form-control custom-range"
                                                                step="0.1"
                                                                min="0"
                                                                max="5"
                                                                name="point"
                                                                value={nullCheck(point, "0")}
                                                                onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <input
                                                                type="number"
                                                                name="point"
                                                                step="0.1"
                                                                min="0"
                                                                max="5"
                                                                value={nullCheck(point, "0")}
                                                                className={`form-control w-8 ${formErrors.point}`}
                                                                onChange={this.handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`form-group ${show.measure ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Boy & Kilo</label>
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                onChange={this.handleChange}
                                                                name="body_height"
                                                                placeholder="Boy (cm)"
                                                                min="0"
                                                                max="250"
                                                                value={nullCheck(body_height, "")}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                onChange={this.handleChange}
                                                                name="body_weight"
                                                                placeholder="Kilo (kg)"
                                                                min="0"
                                                                max="250"
                                                                value={nullCheck(body_weight, "")}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`form-group ${show.blood ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Kan Grubu</label>
                                                    <Select
                                                        value={blood}
                                                        onChange={val => this.handleSelect(val, "blood")}
                                                        options={select.bloods}
                                                        name="blood"
                                                        placeholder="Seç..."
                                                        styles={selectCustomStyles}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        isDisabled={select.bloods ? false : true}
                                                        isLoading={select.bloods ? false : true}
                                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                    />
                                                </div>
                                                <div className={`form-group ${show.foot ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Kullandığı Ayak</label>
                                                    <div className="custom-controls-stacked">
                                                        <label className="custom-control custom-radio custom-control-inline">
                                                            <input
                                                                type="radio"
                                                                className={`custom-control-input ${formErrors.foot}`}
                                                                name="foot"
                                                                value="1"
                                                                checked={foot === 1 ? true : false}
                                                                onChange={this.handleRadio}
                                                            />
                                                            <span className="custom-control-label">Sağ</span>
                                                        </label>
                                                        <label className="custom-control custom-radio custom-control-inline">
                                                            <input
                                                                type="radio"
                                                                className={`custom-control-input ${formErrors.foot}`}
                                                                name="foot"
                                                                value="2"
                                                                checked={foot === 2 ? true : false}
                                                                onChange={this.handleRadio}
                                                            />
                                                            <span className="custom-control-label">Sol</span>
                                                        </label>
                                                        <label className="custom-control custom-radio custom-control-inline">
                                                            <input
                                                                type="radio"
                                                                className={`custom-control-input ${formErrors.foot}`}
                                                                name="foot"
                                                                value="0"
                                                                checked={foot === 0 ? true : false}
                                                                onChange={this.handleRadio}
                                                            />
                                                            <span className="custom-control-label">Sağ & Sol</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className={`form-group ${show.foot_no ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Ayak Numarası</label>
                                                    <input
                                                        type="number"
                                                        className={`form-control ${formErrors.foot_no}`}
                                                        onChange={this.handleChange}
                                                        placeholder="Ayak Numarası"
                                                        name="foot_no"
                                                        min="10"
                                                        max="50"
                                                        value={nullCheck(foot_no, "")}
                                                    />
                                                </div>
                                                <div className={`form-group ${show.note ? "d-block" : "d-none"}`}>
                                                    <label className="form-label">Not</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="note"
                                                        onChange={this.handleChange}
                                                        rows={2}
                                                        maxLength="1000"
                                                        value={nullCheck(note, "")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-right">
                                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                                    <a
                                        onClick={() => {
                                            showSwal({
                                                type: "info",
                                                title: "Emin misiniz?",
                                                text: "İşlemi iptal etmek istediğinize emin misiniz?",
                                                confirmButtonText: "Evet",
                                                cancelButtonText: "Hayır",
                                                cancelButtonColor: "#cd201f",
                                                showCancelButton: true,
                                                reverseButtons: true
                                            }).then(result => {
                                                if (result.value) this.props.history.goBack();
                                            });
                                        }}
                                        className="btn btn-link">
                                        İptal
                                    </a>
                                    <button
                                        type="submit"
                                        className={`btn btn-primary ml-3 ${loadingButton} ${loadingImage}`}>
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Ek Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <button
                                            name="email"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Email
                                        </button>
                                        <button
                                            name="phone"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Telefon
                                        </button>
                                        <button
                                            name="point"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Genel Puan
                                        </button>
                                        <button
                                            name="measure"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Boy ve Kilo
                                        </button>
                                        <button
                                            name="blood"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Kan Grubu
                                        </button>
                                        <button
                                            name="foot"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Kullandığı Ayak
                                        </button>
                                        <button
                                            name="foot_no"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Ayak Numarası
                                        </button>
                                        <button
                                            name="note"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Not
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Edit;
