import React, { Component } from "react";
import {
    formValid,
    selectCustomStylesError,
    selectCustomStyles,
    emailRegEx,
    securityNoRegEx
} from "../../assets/js/core";
import { Bloods, Branchs, PlayerPositions, Groups } from "../../services/FillSelect";
import { UploadFile, clearMoney, formatDate, fullnameGenerator, formatPhone } from "../../services/Others";
import { CreatePlayer } from "../../services/Player";
import { showSwal } from "../../components/Alert";
import Select, { components } from "react-select";
import Inputmask from "inputmask";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import ParentModal from "./ParentModal";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import _ from "lodash";
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

const body_measure_list = [
    "Göğüs Çevresi",
    "Bel Çevresi",
    "Kalça Ölçüsü",
    "Kol Ölçüsü",
    "Kol Uzunluğu",
    "Bacak Uzunluğu"
];

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            name: null,
            surname: null,
            security_id: null,
            branch: null,
            fee: null,
            is_active: 1,
            is_trial: 0,
            is_scholarship: 0,
            start_date: new Date(),
            birthday: null,
            end_date: null,
            body_measure: [],
            parents: [],
            select: {
                bloods: null,
                branchs: null,
                groups: null,
                positions: null
            },
            formErrors: {
                name: "",
                surname: "",
                security_id: "",
                email: "",
                branch: "",
                phone: "",
                fee: "",
                point: ""
            },
            show: {},
            loadingButton: "",
            loadingImage: "",
            addContinuously: true,
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
        setTimeout(this.fieldMasked, 150);
    }

    componentWillUnmount() {
        this.setState({ body_measure: [] });
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
            phone,
            fee,
            address,
            gender,
            blood,
            point,
            group,
            body_height,
            body_weight,
            foot,
            foot_no,
            birthday,
            is_scholarship,
            is_active,
            note,
            body_measure,
            addContinuously,
            file,
            start_date,
            end_date,
            imagePreview,
            parents
        } = this.state;

        let require = { ...this.state };
        if (is_active === 1) delete require.end_date;
        if (is_scholarship) delete require.fee;
        delete require.loadingButton;
        delete require.loadingImage;

        this.setState({ parentError: false });
        if (parents.length > 0 && formValid(require)) {
            this.setState({ loadingButton: "btn-loading" });
            CreatePlayer({
                uid: uid,
                name: name.capitalize(),
                surname: surname.toLocaleUpperCase("tr-TR"),
                password: "151117",
                security_id: security_id,
                position_id: position ? position.value : null,
                branch_id: branch.value,
                blood_id: blood ? blood.value : null,
                group_id: group ? group.value : 1,
                email: email,
                phone: phone,
                gender: gender,
                address: address,
                point: point,
                fee: clearMoney(fee),
                foot: foot,
                note: note,
                birthday: formatDate(birthday, "YYYY-MM-DD"),
                start_date: formatDate(start_date, "YYYY-MM-DD"),
                end_date: end_date ? formatDate(end_date, "YYYY-MM-DD") : null,
                is_scholarship: is_scholarship ? 1 : 0,
                is_active: is_active,
                is_trial: is_active === 3 ? 1 : 0,
                attributes: _.pickBy({
                    start_date: formatDate(start_date, "YYYY-MM-DD"),
                    fee: clearMoney(fee),
                    position: position,
                    email: email,
                    phone: phone,
                    body_height: body_height,
                    body_weight: body_weight,
                    body_measure: body_measure,
                    foot_no: foot_no,
                    point: point,
                    group: group,
                    branch: branch,
                    is_scholarship: is_scholarship ? 1 : 0
                }),
                parents: parents
            }).then(response => {
                const status = response.status;
                const formData = new FormData();
                var imageUploading = false;
                if (status.code === 1020) {
                    const redirect_uid = response.uid;
                    if (imagePreview) {
                        this.setState({ loadingImage: "btn-loading" });
                        imageUploading = true;
                        formData.append("image", file);
                        formData.append("uid", uid);
                        formData.append("to", redirect_uid);
                        formData.append("type", "player");
                        formData.append("update", true);
                        UploadFile(formData).then(response => {
                            this.setState({ loadingImage: "", loadingButton: "" });
                            if (response)
                                if (!addContinuously) this.props.history.push("/app/players/detail/" + redirect_uid);
                                else this.reload();
                        });
                    } else if (addContinuously) this.reload();
                    else this.props.history.push("/app/players/detail/" + redirect_uid);
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
                    fee: !is_scholarship ? (fee ? "" : "is-invalid") : "",
                    birthday: birthday ? "" : "is-invalid",
                    start_date: start_date ? "" : "is-invalid",
                    end_date: is_active === 0 ? (end_date ? "" : "is-invalid") : "",
                    position: position ? "" : true,
                    branch: branch ? "" : true
                },
                parentError: parents.length === 0 ? true : false
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
            case "fee":
                formErrors.fee = value ? "" : "is-invalid";
                break;
            case "email":
                formErrors.email = value ? (emailRegEx.test(value) ? "" : "is-invalid") : "";
                break;
            default:
                break;
        }
        if (name === "fee") {
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

    handleSelect = (value, name) => {
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
            [name]: value
        }));
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

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    getFillSelect = () => {
        var sBranch = localStorage.getItem("sBranch");
        PlayerPositions(sBranch ? sBranch : 1).then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    positions: response
                }
            }));
        });

        Branchs().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    branchs: response
                },
                branch: response.filter(x => x.value === localStorage.getItem("sBranch"))[0] || null
            }));
        });

        Bloods().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    bloods: response
                }
            }));
        });

        Groups().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    groups: response
                }
            }));
        });

        body_measure_list.map(el =>
            this.setState(prevState => ({
                body_measure: [
                    ...prevState.body_measure,
                    {
                        type: el,
                        value: ""
                    }
                ]
            }))
        );
    };

    render() {
        const {
            position,
            branch,
            fee,
            gender,
            blood,
            point,
            group,
            foot,
            body_measure,
            select,
            birthday,
            is_scholarship,
            is_active,
            formErrors,
            loadingImage,
            imagePreview,
            addContinuously,
            start_date,
            end_date,
            loadingButton,
            show,
            parents,
            parentError
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Ekle</h1>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body pt-3">
                                <div className="row">
                                    <div className="col-auto m-auto">
                                        <label
                                            htmlFor="image"
                                            className={`avatar ${loadingImage} avatar-xxxl cursor-pointer disabled mb-2`}
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
                                            accept="image/*"
                                            name="image"
                                            id="image"
                                            hidden
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
                                        Aidat<span className="form-required">*</span>
                                    </label>
                                    <div className="row gutters-xs">
                                        <div className="col">
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.fee}`}
                                                onChange={this.handleChange}
                                                placeholder="Aidat"
                                                name="fee"
                                                disabled={is_scholarship}
                                                value={fee || "0,00"}
                                            />
                                        </div>
                                        <div className="col-auto">
                                            <label className="selectgroup-item" data-toggle="tooltip" title="Burslu">
                                                <input
                                                    type="checkbox"
                                                    name="is_scholarship"
                                                    checked={is_scholarship}
                                                    className="selectgroup-input"
                                                    onChange={this.handleCheck}
                                                />
                                                <span className="selectgroup-button selectgroup-button-icon">
                                                    <i className="fa fa-user-graduate"></i>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {is_scholarship ? (
                                    <div className="alert alert-icon alert-primary" role="alert">
                                        <i className="fe fe-alert-triangle mr-2" aria-hidden="true"></i>
                                        <p>
                                            <b>Öğrenci, burslu olarak tanımlandı!</b>
                                        </p>
                                        Burslu öğrenciler aidat ödemesinden muaf tutulur.
                                    </div>
                                ) : null}

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
                                            formErrors.branch === true ? selectCustomStylesError : selectCustomStyles
                                        }
                                        isSearchable={true}
                                        isDisabled={select.branchs ? false : true}
                                        isLoading={select.branchs ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Kayıt Durumu</label>
                                    <div className="selectgroup w-100">
                                        <label
                                            className="selectgroup-item"
                                            data-toggle="tooltip"
                                            title="Kaydı Aktif Öğrenci">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="1"
                                                className="selectgroup-input"
                                                checked={is_active === 1}
                                                onChange={this.handleRadio}
                                            />
                                            <span className="selectgroup-button success">Aktif</span>
                                        </label>
                                        <label
                                            className="selectgroup-item"
                                            data-toggle="tooltip"
                                            title="Kaydı Pasif Öğrenci">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="0"
                                                className="selectgroup-input"
                                                checked={is_active === 0}
                                                onChange={this.handleRadio}
                                            />
                                            <span className="selectgroup-button danger">Pasif</span>
                                        </label>
                                        <label
                                            className="selectgroup-item"
                                            data-toggle="tooltip"
                                            title="Kaydı Dondurulmuş Öğrenci">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="2"
                                                className="selectgroup-input"
                                                checked={is_active === 2}
                                                onChange={this.handleRadio}
                                            />
                                            <span className="selectgroup-button azure">Donuk</span>
                                        </label>
                                        <label
                                            className="selectgroup-item"
                                            data-toggle="tooltip"
                                            title="Ön Kayıt Öğrenci">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="3"
                                                className="selectgroup-input"
                                                checked={is_active === 3}
                                                onChange={this.handleRadio}
                                            />
                                            <span className="selectgroup-button indigo">Ön Kayıt</span>
                                        </label>
                                    </div>
                                </div>

                                {is_active === 0 || is_active === 2 ? (
                                    <fieldset className="form-fieldset">
                                        {is_active === 0 ? (
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Okuldan Ayrılma Tarihi
                                                    <span className="form-required">*</span>
                                                </label>
                                                <DatePicker
                                                    autoComplete="off"
                                                    selected={end_date}
                                                    selectsEnd
                                                    startDate={start_date}
                                                    minDate={start_date}
                                                    name="end_date"
                                                    locale="tr"
                                                    dateFormat="dd/MM/yyyy"
                                                    onChange={date => this.handleDate(date, "end_date")}
                                                    className={`form-control ${formErrors.end_date}`}
                                                />
                                            </div>
                                        ) : null}
                                        <div className="form-group mb-0">
                                            <label className="form-label">
                                                {is_active === 0 ? "Okuldan Ayrılma Nedeni" : "Dondurma Nedeni"}
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    this.setState(prevState => ({
                                                        show: {
                                                            ...prevState.show,
                                                            note: true
                                                        }
                                                    }));
                                                    $('textarea[name="note"]').focus();
                                                    $('button[name="note"]').addClass("active");
                                                }}
                                                className="btn btn-icon btn-secondary btn-block">
                                                <i className="fe fe-edit"></i> Not Gir
                                            </button>
                                        </div>
                                    </fieldset>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
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
                                            <label className="form-label">Grup</label>
                                            <Select
                                                value={group}
                                                onChange={val => this.handleSelect(val, "group")}
                                                options={select.groups}
                                                name="group"
                                                placeholder="Seç..."
                                                styles={selectCustomStyles}
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={select.groups ? false : true}
                                                isLoading={select.groups ? false : true}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
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
                                                                <div className="text-muted">Email: {el.email}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
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
                                        {show.email ? (
                                            <div className="form-group">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.email}`}
                                                    onChange={this.handleChange}
                                                    name="email"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        ) : null}

                                        {show.phone ? (
                                            <div className="form-group">
                                                <label className="form-label">Telefonu</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${formErrors.phone}`}
                                                    onChange={this.handleChange}
                                                    name="phone"
                                                    placeholder="(535) 123 4567"
                                                />
                                            </div>
                                        ) : null}

                                        {show.point ? (
                                            <div className="form-group">
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
                                                            onChange={this.handleChange}
                                                            value={point || "0"}
                                                        />
                                                    </div>
                                                    <div className="col-auto">
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            min="0"
                                                            max="5"
                                                            name="point"
                                                            className={`form-control w-8 ${formErrors.point}`}
                                                            onChange={this.handleChange}
                                                            value={point || "0"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {show.measure ? (
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
                                                            min="0"
                                                            max="250"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {show.blood ? (
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
                                                    isLoading={select.bloods ? false : true}
                                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                />
                                            </div>
                                        ) : null}

                                        {show.foot ? (
                                            <div className="form-group">
                                                <label className="form-label">Kullandığı Ayak</label>
                                                <div className="custom-controls-stacked">
                                                    <label className="custom-control custom-radio custom-control-inline">
                                                        <input
                                                            type="radio"
                                                            className="custom-control-input"
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
                                                            className="custom-control-input"
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
                                                            className="custom-control-input"
                                                            name="foot"
                                                            value="0"
                                                            checked={foot === 0 ? true : false}
                                                            onChange={this.handleRadio}
                                                        />
                                                        <span className="custom-control-label">Sağ & Sol</span>
                                                    </label>
                                                </div>
                                            </div>
                                        ) : null}

                                        {show.foot_no ? (
                                            <div className="form-group">
                                                <label className="form-label">Ayak Numarası</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    placeholder="Ayak Numarası"
                                                    name="foot_no"
                                                    min="10"
                                                    max="50"
                                                />
                                            </div>
                                        ) : null}

                                        {show.metrics ? (
                                            <div className="form-group">
                                                <label className="form-label">Vücut Ölçüleri</label>
                                                <table className="table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th className="w-11 pl-0">Tür</th>
                                                            <th className="pl-0">Değer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {body_measure.map((el, key) => {
                                                            return (
                                                                <tr key={key.toString()}>
                                                                    <td className="w-11 pl-0 pr-0">
                                                                        <div className="form-control-plaintext">
                                                                            {el.type}:
                                                                        </div>
                                                                    </td>
                                                                    <td className="pl-0">
                                                                        <input
                                                                            type="number"
                                                                            name={`body_measure.value.${key}`}
                                                                            onChange={this.handleChange}
                                                                            className="form-control"
                                                                            placeholder="(cm)"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : null}

                                        {show.note ? (
                                            <div className="form-group">
                                                <label className="form-label">Not</label>
                                                <textarea
                                                    className="form-control"
                                                    name="note"
                                                    onChange={this.handleChange}
                                                    rows={2}
                                                    maxLength="1000"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center">
                                <span className="d-inline-flex align-items-center">
                                    <label className="custom-switch pl-0">
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
                                            data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Öğrenci Detay"</b> sayfasına yönlendirilirsiniz.</p>'>
                                            ?
                                        </span>
                                    </span>
                                </span>
                                <button type="submit" className={`btn btn-primary ml-auto ${loadingButton}`}>
                                    {addContinuously ? "Ekle" : "Ekle ve Bitir"}
                                </button>
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
                                            name="metrics"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Vücut Ölçüleri
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

export default Add;
