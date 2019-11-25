import React, { Component } from "react";
import { Bloods, Branchs, Days, Months, Years, EmployeePositions, Kinship } from "../../services/FillSelect";
import {
    emailRegEx,
    securityNoRegEx,
    selectCustomStyles,
    selectCustomStylesError,
    formValid
} from "../../assets/js/core";
import { CreateEmployee } from "../../services/Employee";
import { UploadFile, getSelectValue, clearMoney } from "../../services/Others";
import { showSwal } from "../../components/Alert";
import Select from "react-select";
import Inputmask from "inputmask";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import moment from "moment";
import _ from "lodash";
import { GetSettings } from "../../services/School";
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

export class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            name: null,
            surname: null,
            security_id: null,
            email: null,
            position: null,
            branch: null,
            phone: null,
            start_date: new Date(),
            salary: null,
            emergency: [],
            school_history: [],
            certificates: [],
            select: {
                bloods: null,
                positions: null,
                days: null,
                months: null,
                years: null,
                branchs: null,
                schoolStartDates: null,
                schoolEndDates: null,
                kinships: null
            },
            formErrors: {
                name: "",
                surname: "",
                security_id: "",
                email: "",
                position: "",
                branch: "",
                phone: "",
                salary: ""
            },
            loadingButton: "",
            loadingImage: "",
            addContinuously: true
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                name: $("[name=name]"),
                surname: $("[name=surname]"),
                phone: $("[name=phone]"),
                security_id: $("[name=security_id]"),
                salary: $("[name=salary]"),
                emergency_phone: $("[name*='emergency.phone.']"),
                emergency_name: $("[name*='emergency.name.']"),
                school_history_name: $("[name*='school_history.name.']"),
                certificate_type: $("[name*='certificates.type.']"),
                certificate_corporation: $("[name*='certificates.corporation.']")
            };
            const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
            Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
            Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.emergency_phone);
            Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
            Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.salary);
            Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.emergency_name);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.certificate_type);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.certificate_corporation);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.school_history_name);
        } catch (e) {}
    };

    componentDidMount() {
        this.getFillSelect();
        setTimeout(this.fieldMasked, 150);
    }

    componentWillUnmount() {
        this.setState({ emergency: [], school_history: [], certificates: [] });
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            uid,
            name,
            surname,
            security_id,
            email,
            position,
            branch,
            blood,
            phone,
            gender,
            address,
            salary,
            day,
            month,
            year,
            note,
            body_height,
            body_weight,
            emergency,
            school_history,
            certificates,
            addContinuously,
            imagePreview,
            start_date,
            file
        } = this.state;

        if (formValid(this.state)) {
            this.setState({ loadingButton: "btn-loading" });
            const checkBirthday = year && month && day ? `${year.value}-${month.value}-${day.value}` : null;

            CreateEmployee({
                uid: uid,
                name: name.capitalize(),
                surname: surname.toLocaleUpperCase("tr-TR"),
                password: "151117",
                security_id: security_id,
                permission_id: position.value,
                email: email,
                phone: phone,
                address: address,
                gender: gender,
                blood: blood ? blood.value : null,
                branch: branch.value,
                salary: clearMoney(salary),
                birthday: checkBirthday,
                note: note,
                emergency: emergency,
                school_history: school_history,
                certificates: certificates,
                start_date: moment(start_date).format("YYYY-MM-DD"),
                attributes: _.pickBy({
                    salary: clearMoney(salary),
                    position: position,
                    email: email,
                    phone: phone,
                    body_height: body_height,
                    body_weight: body_weight
                })
            }).then(response => {
                const formData = new FormData();
                var imageUploading = false;
                if (response) {
                    if (imagePreview) {
                        this.setState({ loadingImage: "btn-loading" });
                        imageUploading = true;
                        formData.append("image", file);
                        formData.append("uid", uid);
                        formData.append("to", response.uid);
                        formData.append("type", "employee");
                        formData.append("update", true);
                        UploadFile(formData).then(response => {
                            this.setState({ loadingImage: "", loadingButton: "" });
                            if (response)
                                if (!addContinuously) this.props.history.push("/app/employees/detail/" + response.uid);
                                else this.reload();
                        });
                    } else if (addContinuously) this.reload();
                    else this.props.history.push("/app/employees/detail/" + response.uid);
                } else this.setState({ loadingButton: "" });
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
                    email: emailRegEx.test(email) ? "" : "is-invalid",
                    phone: phone ? (phone.length !== 10 ? "is-invalid" : "") : "is-invalid",
                    salary: salary ? "" : "is-invalid",
                    start_date: start_date ? "" : "is-invalid",
                    position: position ? false : true,
                    branch: branch ? false : true
                }
            }));
        }
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
                formErrors.email = value.length < 2 ? "is-invalid" : !emailRegEx.test(value) ? "is-invalid" : "";
                break;
            case "phone":
                formErrors.phone = value.length !== 10 ? "is-invalid" : "";
                break;
            case "salary":
                formErrors.salary = value ? "" : "is-invalid";
                break;
            default:
                break;
        }
        if (name === "salary") {
            this.setState({ formErrors, [name]: value === "0,00" ? null : value });
        } else if (name.indexOf(".") === -1) {
            this.setState({ formErrors, [name]: value });
        } else {
            const splitName = name.split(".");
            this.setState(prevState => {
                return (prevState[splitName[0]][splitName[2]][splitName[1]] = value);
            });
        }
    };

    handleImage = e => {
        try {
            e.preventDefault();
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
                if (reader.result !== null) {
                    this.setState({
                        imagePreview: reader.result,
                        file: file
                    });
                }
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
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    [name]: value ? false : true
                },
                [name]: value
            }));
        }
    };

    handleCheck = e => {
        const { name, checked } = e.target;
        this.setState({ [name]: checked });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        this.setState({ [name]: parseInt(value) });
    };

    handleDate = (date, name) => {
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: date ? "" : "is-invalid"
            },
            [name]: date
        }));
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    getFillSelect = () => {
        EmployeePositions().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    positions: response
                }
            }));
        });

        Branchs().then(response => {
            if (response) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        branchs: response
                    }
                }));
                GetSettings().then(resSettings =>
                    this.setState({
                        branch:
                            response.filter(x => x.value === resSettings.settings.branch_id).length > 0
                                ? response.filter(x => x.value === resSettings.settings.branch_id)
                                : null
                    })
                );
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

        this.setState(prevState => ({
            select: {
                ...prevState.select,
                days: Days(),
                months: Months(),
                years: Years(true),
                kinships: Kinship()
            },
            emergency: [
                ...prevState.emergency,
                {
                    kinship: "Anne",
                    name: "",
                    phone: ""
                },
                {
                    kinship: "Baba",
                    name: "",
                    phone: ""
                }
            ],
            school_history: [
                ...prevState.school_history,
                {
                    start: "",
                    end: "",
                    name: ""
                },
                {
                    start: "",
                    end: "",
                    name: ""
                },
                {
                    start: "",
                    end: "",
                    name: ""
                }
            ],
            certificates: [
                ...prevState.certificates,
                {
                    type: "",
                    year: "",
                    corporation: ""
                },
                {
                    type: "",
                    year: "",
                    corporation: ""
                },
                {
                    type: "",
                    year: "",
                    corporation: ""
                }
            ]
        }));
    };

    render() {
        const {
            position,
            branch,
            blood,
            gender,
            day,
            month,
            year,
            loadingButton,
            addContinuously,
            select,
            imagePreview,
            formErrors,
            loadingImage,
            emergency,
            school_history,
            certificates,
            start_date
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Personel Ekle</h1>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-auto m-auto">
                                        <label
                                            htmlFor="image"
                                            className={`avatar ${loadingImage} avatar-xxxl cursor-pointer disabled`}
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
                                            name="image"
                                            id="image"
                                            hidden
                                            accept="image/*"
                                            onChange={this.handleImage}
                                        />
                                    </div>
                                </div>

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
                                    />
                                </div>

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
                                    />
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
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Pozisyonu
                                        <span className="form-required">*</span>
                                    </label>
                                    <Select
                                        value={position}
                                        onChange={val => this.handleSelect(val, "position")}
                                        options={select.positions}
                                        name="position"
                                        placeholder="Seç..."
                                        styles={
                                            formErrors.position === true ? selectCustomStylesError : selectCustomStyles
                                        }
                                        isClearable={true}
                                        isSearchable={true}
                                        isDisabled={select.positions ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
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
                                            formErrors.branch === true ? selectCustomStylesError : selectCustomStyles
                                        }
                                        isSearchable={true}
                                        isDisabled={select.branchs ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Maaşı
                                        <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.salary}`}
                                        onChange={this.handleChange}
                                        placeholder="Maaş"
                                        name="salary"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        İşe Başlama Tarihi
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
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Email
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.email}`}
                                                onChange={this.handleChange}
                                                name="email"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Telefonu
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.phone}`}
                                                onChange={this.handleChange}
                                                name="phone"
                                                placeholder="(535) 123 4567"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Doğum Tarihi</label>
                                            <div className="row gutters-xs">
                                                <div className="col-4">
                                                    <Select
                                                        value={day}
                                                        onChange={val => this.handleSelect(val, "day")}
                                                        options={select.days}
                                                        name="day"
                                                        placeholder="Gün"
                                                        styles={selectCustomStyles}
                                                        isSearchable={true}
                                                        isDisabled={select.days ? false : true}
                                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <Select
                                                        value={month}
                                                        onChange={val => this.handleSelect(val, "month")}
                                                        options={select.months}
                                                        name="month"
                                                        placeholder="Ay"
                                                        styles={selectCustomStyles}
                                                        isSearchable={true}
                                                        isDisabled={select.months ? false : true}
                                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <Select
                                                        value={year}
                                                        onChange={val => this.handleSelect(val, "year")}
                                                        options={select.years}
                                                        name="year"
                                                        placeholder="Yıl"
                                                        styles={selectCustomStyles}
                                                        isSearchable={true}
                                                        isDisabled={select.years ? false : true}
                                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Adresi</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                onChange={this.handleChange}
                                                rows={6}
                                                maxLength="1000"
                                                placeholder="Adres"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">Vücut Metrikleri (Boy & Kilo)</label>
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
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        onChange={this.handleChange}
                                                        name="body_weight"
                                                        placeholder="Kilo (kg)"
                                                        id="weight"
                                                        min="0"
                                                        max="250"
                                                    />
                                                </div>
                                            </div>
                                        </div>
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
                                                    <span className="selectgroup-button">Kadın</span>
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
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">Acil Durumda İletişim</label>
                                        <div id="parent">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0 w-9">Yakınlık</th>
                                                        <th>Adı ve Soyadı</th>
                                                        <th className="pl-0">Telefon</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {emergency.map((el, key) => {
                                                        return (
                                                            <tr key={key.toString()}>
                                                                <td className="pl-0 pr-0">
                                                                    <Select
                                                                        value={getSelectValue(
                                                                            select.kinships,
                                                                            el.kinship,
                                                                            "label"
                                                                        )}
                                                                        onChange={val =>
                                                                            this.handleSelect(
                                                                                val,
                                                                                "emergency",
                                                                                key,
                                                                                true
                                                                            )
                                                                        }
                                                                        options={select.kinships}
                                                                        name="kinship"
                                                                        placeholder="Seç..."
                                                                        styles={selectCustomStyles}
                                                                        isSearchable={true}
                                                                        isDisabled={select.kinships ? false : true}
                                                                        noOptionsMessage={value =>
                                                                            `"${value.inputValue}" bulunamadı`
                                                                        }
                                                                        menuPlacement="top"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name={`emergency.name.${key}`}
                                                                        onChange={this.handleChange}
                                                                        className="form-control"
                                                                    />
                                                                </td>
                                                                <td className="pl-0">
                                                                    <input
                                                                        type="text"
                                                                        name={`emergency.phone.${key}`}
                                                                        onChange={this.handleChange}
                                                                        className="form-control"
                                                                        placeholder="(535) 123 4567"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">Okul Bilgileri</label>
                                        <div id="school">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="w-9 pl-0">Baş. Yılı</th>
                                                        <th className="w-9">BİTİŞ Yılı</th>
                                                        <th className="pl-0">Okul Adı</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {school_history.map((el, key) => {
                                                        return (
                                                            <tr key={key.toString()}>
                                                                <td className="pl-0 pr-0">
                                                                    <input
                                                                        type="number"
                                                                        min="1950"
                                                                        max="2030"
                                                                        className="w-9 form-control"
                                                                        name={`school_history.start.${key}`}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        min={school_history[key].start || 1951}
                                                                        max="2030"
                                                                        className="w-9 form-control"
                                                                        name={`school_history.end.${key}`}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </td>
                                                                <td className="pl-0">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name={`school_history.name.${key}`}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="col-12 mt-3">
                                        <label className="form-label">Sertifikalar</label>
                                        <div className="table-responsive">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0 w-9">Aldığı Yıl</th>
                                                        <th>TÜRÜ</th>
                                                        <th className="pl-0">Aldığı Kurum</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {certificates.map((el, key) => {
                                                        return (
                                                            <tr key={key.toString()}>
                                                                <td className="pl-0 pr-0">
                                                                    <input
                                                                        type="number"
                                                                        min="1950"
                                                                        max="2030"
                                                                        className="w-9 form-control"
                                                                        name={`certificates.year.${key}`}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name={`certificates.type.${key}`}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </td>
                                                                <td className="pl-0">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name={`certificates.corporation.${key}`}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="form-group">
                                            <label className="form-label">Not</label>
                                            <textarea
                                                className="form-control resize-none"
                                                name="note"
                                                onChange={this.handleChange}
                                                rows={3}
                                                maxLength="1000"
                                            />
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
                                                if (result.value) this.props.history.push("/app/employees");
                                            });
                                        }}
                                        className="btn btn-link">
                                        İptal
                                    </a>
                                    <div className="d-flex" style={{ alignItems: "center" }}>
                                        <label className="custom-switch">
                                            <input
                                                type="checkbox"
                                                name="addContinuously"
                                                className="custom-switch-input"
                                                checked={addContinuously}
                                                onChange={this.handleCheck}
                                            />
                                            <span className="custom-switch-indicator" />
                                            <span className="custom-switch-description">Sürekli ekle</span>
                                        </label>
                                        <span className="mx-2">
                                            <span
                                                className="form-help"
                                                data-toggle="popover"
                                                data-placement="top"
                                                data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Personel Detay"</b> sayfasına yönlendirilirsiniz.</p>'>
                                                ?
                                            </span>
                                        </span>
                                        <button
                                            style={{ width: 100 }}
                                            type="submit"
                                            className={`btn btn-primary ml-3 ${loadingButton}`}>
                                            {addContinuously ? "Ekle" : "Ekle ve Bitir"}
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

export default Add;
