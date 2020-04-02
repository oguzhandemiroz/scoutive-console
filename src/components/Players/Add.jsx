import React, { Component } from "react";
import {
    formValid,
    selectCustomStylesError,
    selectCustomStyles,
    emailRegEx,
    securityNoRegEx
} from "../../assets/js/core";
import { Bloods, Branchs, PlayerPositions, Groups, Bodies } from "../../services/FillSelect";
import { GetSettings } from "../../services/School";
import { UploadFile, clearMoney, formatDate, fullnameGenerator, formatPhone, formatMoney } from "../../services/Others";
import { CreatePlayer } from "../../services/Player";
import Select from "react-select";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import ParentModal from "./ParentModal";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import _ from "lodash";
import moment from "moment";
import Inputmask from "inputmask";
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
            branch: null,
            groups: [],
            fee: null,
            is_cash: true,
            downpayment: null,
            downpayment_date: new Date(),
            installment: 1,
            installment_date: new Date(
                moment()
                    .add(1, "months")
                    .startOf("month")
            ),
            is_active: 1,
            is_trial: 0,
            start_date: new Date(),
            birthday: null,
            end_date: null,
            parents: [],
            select: {
                bloods: null,
                branchs: null,
                groups: null,
                positions: null,
                bodies: null
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
            payment_type: null,
            loadingButton: "",
            loadingImage: "",
            addContinuously: true,
            parentError: false,
            paymentError: false,
            installment_amounts: null,
            check_permissions: {
                group: true
            }
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                name: $("[name=name]"),
                surname: $("[name=surname]"),
                phone: $("[name=phone]"),
                security_id: $("[name=security_id]"),
                fee: $("[name=fee]"),
                downpayment: $("[name=downpayment]")
            };
            const onlyString = "[a-zA-Z-ğüşöçİĞÜŞÖÇı ]*";
            Inputmask({ mask: "(999) 999 9999", ...InputmaskDefaultOptions }).mask(elemArray.phone);
            Inputmask({ mask: "99999999999", ...InputmaskDefaultOptions }).mask(elemArray.security_id);
            Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.fee);
            Inputmask({ alias: "try", ...InputmaskDefaultOptions, placeholder: "0,00" }).mask(elemArray.downpayment);
            Inputmask({ regex: "[a-zA-ZğüşöçİĞÜŞÖÇı]*", ...InputmaskDefaultOptions }).mask(elemArray.surname);
            Inputmask({ regex: onlyString, ...InputmaskDefaultOptions }).mask(elemArray.name);
        } catch (e) {}
    };

    componentDidMount() {
        this.getFillSelect();
        setTimeout(this.fieldMasked, 150);
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
            groups,
            body_height,
            body_weight,
            foot,
            foot_no,
            body,
            birthday,
            is_active,
            note,
            addContinuously,
            file,
            start_date,
            end_date,
            imagePreview,
            parents,
            payment_type,
            is_cash,
            payment_date,
            downpayment,
            downpayment_date,
            installment,
            installment_date,
            installment_amounts
        } = this.state;

        let require = { ...this.state };
        if (is_active === 1) delete require.end_date;
        if (payment_type === 1) delete require.fee;
        if (payment_type !== 2 || is_cash) {
            delete require.installment;
            delete require.installment_date;
        }

        delete require.show;
        delete require.installment_amounts;
        delete require.position;
        delete require.downpayment;
        delete require.loadingButton;
        delete require.loadingImage;

        let feeJSON = {
            fee: clearMoney(fee),
            payment_date: formatDate(payment_date, "YYYY-MM-DD"), //tek ödeme seçildiğinde sil
            downpayment: is_cash ? clearMoney(fee) : clearMoney(downpayment || "0,00"), //aylık seçildiğinde sil
            downpayment_date: formatDate(downpayment_date, "YYYY-MM-DD"), //aylık seçildiğinde sil
            installment: parseInt(installment), //aylık seçildiğinde sil
            installment_amounts: installment_amounts,
            installment_date: formatDate(installment_date, "YYYY-MM-DD"), //aylık seçildiğinde sil
            is_cash: is_cash //aylık seçildiğinde sil
        };

        if (payment_type === 0) {
            delete feeJSON.downpayment;
            delete feeJSON.installment;
            delete feeJSON.installment_amounts;
            delete feeJSON.downpayment_date;
            delete feeJSON.installment_date;
            delete feeJSON.is_cash;
        } else if (payment_type === 1) {
            feeJSON = {};
        } else if (payment_type === 2) {
            delete feeJSON.payment_date;
        }

        const sumInstallmentAmount = _.sumBy(installment_amounts);
        this.setState({ parentError: false, paymentError: false });

        if (
            (installment_amounts === null ||
                sumInstallmentAmount === clearMoney(fee) - (clearMoney(downpayment) || 0)) &&
            parents.length > 0 &&
            formValid(require)
        ) {
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
                groups: _.map(groups, "value"),
                email: email,
                phone: phone,
                gender: gender,
                address: address,
                point: point,
                fee: feeJSON,
                foot: foot,
                note: note,
                birthday: formatDate(birthday, "YYYY-MM-DD"),
                start_date: formatDate(start_date, "YYYY-MM-DD"),
                end_date: end_date ? formatDate(end_date, "YYYY-MM-DD") : null,
                payment_type: payment_type,
                is_active: is_active,
                is_trial: 0,
                attributes: _.pickBy({
                    start_date: formatDate(start_date, "YYYY-MM-DD"),
                    fee: fee,
                    position: position ? position.value : null,
                    email: email,
                    phone: phone,
                    body_height: body_height,
                    body_weight: body_weight,
                    foot_no: foot_no,
                    point: point,
                    branch: branch.value,
                    body: body ? body.label : null
                }),
                parents: parents
            }).then(response => {
                const status = response.status;
                const formData = new FormData();
                var imageUploading = false;
                if (status.code === 1021) {
                    if (imagePreview) {
                        this.setState({ loadingImage: "btn-loading" });
                        imageUploading = true;
                        formData.append("image", file);
                        formData.append("uid", uid);
                        formData.append("to", response.uid);
                        formData.append("type", "player");
                        formData.append("update", true);
                        UploadFile(formData).then(responseFile => {
                            this.setState({ loadingImage: "", loadingButton: "" });
                            if (responseFile)
                                if (!addContinuously) this.props.history.push("/app/players/detail/" + response.uid);
                                else this.reload();
                        });
                    } else if (addContinuously) this.reload();
                    else this.props.history.push("/app/players/detail/" + response.uid);
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            console.error("HATA");
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
                    fee: payment_type !== 1 ? (fee ? "" : "is-invalid") : "",
                    installment: !is_cash ? (installment ? "" : "is-invalid") : "",
                    installment_date: !is_cash ? (installment_date ? "" : "is-invalid") : "",
                    birthday: birthday ? "" : "is-invalid",
                    start_date: start_date ? "" : "is-invalid",
                    end_date: is_active === 0 ? (end_date ? "" : "is-invalid") : "",
                    branch: branch ? "" : true
                },
                parentError: parents.length === 0 ? true : false,
                paymentError: payment_type === null ? true : false
            }));
        }
    };

    handleChange = e => {
        e.preventDefault();
        const { value, name } = e.target;
        const { fee } = this.state;
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
                this.setState({ installment_amounts: null });
                break;
            case "downpayment":
                formErrors.downpayment = value && clearMoney(value) <= clearMoney(fee) ? "" : "is-invalid";
                this.setState({ installment_amounts: null });
                break;
            case "installment":
                formErrors.installment = value ? "" : "is-invalid";
                this.setState({ installment_amounts: null });
                break;
            case "installment_date":
                formErrors.installment_date = value ? "" : "is-invalid";
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
        this.setState({ [name]: checked });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        this.setState({ [name]: parseInt(value) });
    };

    handleDate = (date, name) => {
        const { settings } = this.state;
        if (name === "start_date") {
            this.setState({ end_date: null });
            if (parseInt(settings.payment_day) <= 0) {
                this.setState({
                    payment_date: date
                });
            }
        }

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
            paymentError: false,
            [name]: parseInt(value)
        }));
    };

    handleInstallment = () => {
        const { installment, downpayment, fee } = this.state;
        const intInstallment = parseInt(installment);
        const installmentAmount = (clearMoney(fee || 0) - clearMoney(downpayment || 0)) / intInstallment;
        const installmentArr = _.range(0, intInstallment);

        let installment_amounts = installmentArr.map(el => parseFloat(installmentAmount.toFixed(2)));

        this.setState({ installment_amounts: installment_amounts });
    };

    handleInstallmentAmount = (e, idx) => {
        const { value } = e.target;
        let installment_amounts = [...this.state.installment_amounts];
        installment_amounts[idx] = clearMoney(value || 0);
        this.setState({ installment_amounts: installment_amounts });
    };

    installmentError = () => {
        const { installment_amounts, fee, downpayment } = this.state;
        const sumInstallmentAmount = _.sumBy(installment_amounts);
        const clearFee = (clearMoney(fee) || 0) - clearMoney(downpayment);

        if (clearMoney(fee) > 0 && installment_amounts && Math.round(sumInstallmentAmount) !== clearFee) {
            return (
                <div className="ml-2 mb-3 text-center text-red font-italic">
                    <i className="fe fe-alert-circle mr-1" />
                    Hatalı Taksit Tutarı
                </div>
            );
        }
        return null;
    };

    installmentWarning = () => {
        const { installment_amounts, fee, downpayment } = this.state;
        const sumInstallmentAmount = _.sumBy(installment_amounts);
        const clearFee = (clearMoney(fee) || 0) - clearMoney(downpayment);
        const diffInstallment = clearFee - sumInstallmentAmount;

        return (
            <div
                className={`alert alert-${sumInstallmentAmount > clearFee ? "danger" : "warning"} w-100 alert-icon`}
                id="installment-warning">
                <i className="fa fa-layer-group mr-2" aria-hidden="true"></i>
                <p>
                    <strong>{formatMoney(clearFee)}</strong> ödeme tutarını,
                    <br />
                    <strong> {formatMoney(sumInstallmentAmount)}</strong> olarak taksitlendirdiniz.
                </p>
                {sumInstallmentAmount === clearFee ? (
                    "Tebrikler! Taksitlendirme tamamlandı."
                ) : sumInstallmentAmount > clearFee ? (
                    <span>
                        Hatalı taksit dağılımı!
                        <br />
                        <strong>{formatMoney(diffInstallment * -1)}</strong> düşürmeniz gerekmektedir.
                    </span>
                ) : (
                    <span>
                        Geriye kalan <strong>{formatMoney(diffInstallment)}</strong>'yi dağıtmanız gerekmektedir.
                    </span>
                )}
            </div>
        );
    };

    renderFeeInfo = () => {
        const { fee, installment, downpayment, payment_type, installment_date, is_cash } = this.state;
        if (payment_type === 2 && fee)
            return (
                <div className="alert alert-icon alert-success" role="alert">
                    <i className="fa fa-align-left mr-2" aria-hidden="true"></i>
                    <p>
                        <b>Ödeme Özeti</b>
                    </p>
                    <p>
                        <b>{formatMoney(parseFloat(fee))}</b> ödeme tutarının,
                        <br />
                        <b>{is_cash ? formatMoney(parseFloat(fee)) : formatMoney(parseFloat(downpayment || 0))}</b>
                        'si peşin olarak ödendi.
                    </p>
                    {is_cash ? null : (
                        <>
                            Geriye kalan&nbsp;
                            <b>{formatMoney(parseFloat(fee) - parseFloat(downpayment || 0))}</b>
                            ,<br />
                            <b>{formatDate(installment_date)}</b> tarihinden itibaren&nbsp;
                            <b>{installment}</b>
                            &nbsp;taksit olarak ayda
                            <br />
                            <b>
                                {formatMoney((parseFloat(fee) - parseFloat(downpayment || 0)) / parseInt(installment))}
                            </b>
                            &nbsp; ödenecektir.
                        </>
                    )}
                </div>
            );
    };

    renderFeeWarning = type => {
        switch (type) {
            case 2:
                return (
                    <div className="alert alert-icon alert-primary" role="alert">
                        <i className="fa fa-money-bill-alt mr-2" aria-hidden="true"></i>
                        <p>
                            <b>Ödeme tipi tek ödeme olarak tanımlandı!</b>
                        </p>
                        <p>
                            Tek ödeme tipi kurslar için tercih edilir. Tek ödeme tipinde peşinat girebilirsiniz ve
                            ödemeyi taksitlendirebilirsiniz.
                        </p>
                        Ödemesini tamamlayan öğrenciler ödemeden muaf tutulur.
                    </div>
                );
            case 0:
                return (
                    <div className="alert alert-icon alert-primary" role="alert">
                        <i className="fa fa-calendar-alt mr-2" aria-hidden="true"></i>
                        <p>
                            <b>Ödeme tipi aylık olarak tanımlandı!</b>
                        </p>
                        Aylık ödemeler, öğrencinin okula başladığı tarih veya sabit bir tarihte alınır.
                    </div>
                );
            case 1:
                return (
                    <div className="alert alert-icon alert-primary mt-2" role="alert">
                        <i className="fa fa-graduation-cap mr-2" aria-hidden="true"></i>
                        <p>
                            <b>Ödeme tipi burslu olarak tanımlandı!</b>
                        </p>
                        Burslu öğrenciler aidat ödemesinden muaf tutulur.
                    </div>
                );
            default:
                break;
        }
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    getFillSelect = () => {
        GetSettings().then(resSettings =>
            this.setState(
                {
                    settings: resSettings.settings
                },
                () => {
                    PlayerPositions(
                        parseInt(resSettings.settings.branch_id).length > 0
                            ? parseInt(resSettings.settings.branch_id)
                            : 1
                    ).then(response => {
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
                                },
                                branch:
                                    response.filter(x => x.value === resSettings.settings.branch_id).length > 0
                                        ? response.filter(x => x.value === resSettings.settings.branch_id)[0]
                                        : null,
                                payment_date:
                                    parseInt(resSettings.settings.payment_day) <= 0
                                        ? moment().toDate()
                                        : moment()
                                              .date(resSettings.settings.payment_day)
                                              .toDate()
                            }));
                        }
                    });
                }
            )
        );

        Bloods().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    bloods: response
                }
            }));
        });

        Groups().then(response => {
            if (response) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        groups: response
                    }
                }));
            } else {
                this.setState(prevState => ({
                    check_permissions: {
                        ...prevState.check_permissions,
                        group: false
                    }
                }));
            }
        });

        this.setState(prevState => ({
            select: {
                ...prevState.select,
                bodies: Bodies()
            }
        }));
    };

    render() {
        const {
            position,
            branch,
            fee,
            gender,
            blood,
            body,
            point,
            groups,
            foot,
            select,
            birthday,
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
            parentError,
            paymentError,
            payment_type,
            is_cash,
            downpayment,
            downpayment_date,
            installment,
            installment_date,
            payment_date,
            installment_amounts,
            check_permissions
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
                                        maxDate={moment()
                                            .subtract(3, "years")
                                            .endOf("year")
                                            .toDate()}
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
                                    <label className="form-label">
                                        Ödeme Tipi<span className="form-required">*</span>
                                        {paymentError ? (
                                            <span className="ml-2 text-red font-italic">
                                                <i className="fe fe-alert-circle mr-1" />
                                                Ödeme Tipi seçilmedi
                                            </span>
                                        ) : null}
                                    </label>
                                    <div className="selectgroup w-100">
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="payment_type"
                                                value="2"
                                                className="selectgroup-input"
                                                checked={payment_type === 2 ? true : false}
                                                onChange={this.handleFeeType}
                                            />
                                            <span className="selectgroup-button selectgroup-button-icon">
                                                <i className="fa fa-money-bill-alt"></i>
                                                <div className="small">Tek Ödeme</div>
                                            </span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="payment_type"
                                                value="0"
                                                className="selectgroup-input"
                                                checked={payment_type === 0 ? true : false}
                                                onChange={this.handleFeeType}
                                            />
                                            <span className="selectgroup-button selectgroup-button-icon">
                                                <i className="fa fa-calendar-alt"></i>
                                                <div className="small">Aylık</div>
                                            </span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="payment_type"
                                                value="1"
                                                className="selectgroup-input"
                                                checked={payment_type === 1 ? true : false}
                                                onChange={this.handleFeeType}
                                            />
                                            <span className="selectgroup-button selectgroup-button-icon">
                                                <i className="fa fa-graduation-cap"></i>
                                                <div className="small">Burslu</div>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <fieldset className={`form-fieldset pb-0 ${payment_type === 0 ? "d-block" : "d-none"}`}>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Aidat<span className="form-required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.fee}`}
                                            onChange={this.handleChange}
                                            placeholder="Aidat"
                                            name="fee"
                                            value={fee || "0,00"}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Ödeme Tarihi<span className="form-required">*</span>
                                        </label>
                                        <div className="form-form-control-plaintext">
                                            {formatDate(payment_date, "DD/MM/YYYY")}
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className={`form-fieldset pb-0 ${payment_type === 2 ? "d-block" : "d-none"}`}>
                                    <div className="form-group">
                                        <label className="form-label">
                                            Ödeme Tutarı<span className="form-required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.fee}`}
                                            onChange={this.handleChange}
                                            placeholder="Ödeme Tutarı"
                                            name="fee"
                                            value={fee || "0,00"}
                                        />
                                    </div>
                                    <div className={`form-group ${is_cash ? "d-block" : "d-none"} mb-2`}>
                                        Ödeme Tarihi<span className="form-required">*</span>
                                        <DatePicker
                                            autoComplete="off"
                                            selected={downpayment_date}
                                            selectsEnd
                                            startDate={downpayment_date}
                                            name="downpayment_date"
                                            locale="tr"
                                            dateFormat="dd/MM/yyyy"
                                            onChange={date => this.handleDate(date, "downpayment_date")}
                                            className={`form-control ${formErrors.downpayment_date}`}
                                        />
                                    </div>
                                    <label className="custom-control custom-checkbox custom-control-inline">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            name="is_cash"
                                            checked={is_cash}
                                            onChange={this.handleCheck}
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
                                            {downpayment ? (
                                                <div className="col-lg-6 col-md-12">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            Peşinat Tarihi<span className="form-required">*</span>
                                                        </label>
                                                        <DatePicker
                                                            autoComplete="off"
                                                            selected={downpayment_date}
                                                            selectsEnd
                                                            startDate={downpayment_date}
                                                            name="downpayment_date"
                                                            locale="tr"
                                                            dateFormat="dd/MM/yyyy"
                                                            onChange={date => this.handleDate(date, "downpayment_date")}
                                                            className={`form-control ${formErrors.downpayment_date}`}
                                                        />
                                                    </div>
                                                </div>
                                            ) : null}
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
                                                        onChange={date => this.handleDate(date, "installment_date")}
                                                        className={`form-control ${formErrors.installment_date}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hr-text mt-1">Taksit Tutarları</div>
                                        <div className="row gutters-xs">
                                            {installment_amounts ? (
                                                <>
                                                    {installment_amounts.map((el, key) => (
                                                        <div
                                                            className="col-lg-6 col-md-12"
                                                            key={"installment_amount-" + key}>
                                                            <div className="form-group">
                                                                <label className="form-label">
                                                                    {key + 1}. Taksit (₺)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    className={`form-control ${el ? "" : "is-invalid"}`}
                                                                    placeholder={key + 1 + ". Taksit"}
                                                                    name={"installment_amount-" + key}
                                                                    value={el === null ? "" : el}
                                                                    onChange={e => this.handleInstallmentAmount(e, key)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {this.installmentWarning()}
                                                </>
                                            ) : (
                                                <div className="col-lg-12 mb-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-gray btn-sm"
                                                        onClick={this.handleInstallment}>
                                                        Taksit Tutarlarını Düzenle
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {this.installmentError()}
                                    </div>
                                </fieldset>

                                {this.renderFeeInfo()}
                                {this.renderFeeWarning(payment_type)}

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
                                    </div>
                                </div>

                                {is_active === 0 ? (
                                    <fieldset className="form-fieldset">
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
                                        <div className="form-group mb-0">
                                            <label className="form-label">Okuldan Ayrılma Nedeni</label>
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
                                                value={groups}
                                                isMulti
                                                onChange={val => this.handleSelect(val, "groups")}
                                                options={select.groups}
                                                name="groups"
                                                placeholder={check_permissions.group ? "Seç..." : "Yetersiz yetki"}
                                                styles={selectCustomStyles}
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={select.groups ? false : true}
                                                isLoading={
                                                    check_permissions.group ? (select.groups ? false : true) : false
                                                }
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
                                                                    to={`/app/persons/parents/detail/${el.uid}`}
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
                                        <div className={`form-group ${show.email ? "d-block" : "d-none"}`}>
                                            <label className="form-label">Email</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.email}`}
                                                onChange={this.handleChange}
                                                name="email"
                                                placeholder="Email"
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
                                        <div className={`form-group ${show.measure ? "d-block" : "d-none"}`}>
                                            <label className="form-label">Boy ve Kilo</label>
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
                                        <div className={`form-group ${show.body ? "d-block" : "d-none"}`}>
                                            <label className="form-label">Beden</label>
                                            <Select
                                                value={body}
                                                onChange={val => this.handleSelect(val, "body")}
                                                options={select.bodies}
                                                name="blood"
                                                placeholder="Seç..."
                                                styles={selectCustomStyles}
                                                isClearable={true}
                                                isSearchable={true}
                                                isDisabled={select.bodies ? false : true}
                                                isLoading={select.bodies ? false : true}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>
                                        <div className={`form-group ${show.foot ? "d-block" : "d-none"}`}>
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
                                        <div className={`form-group ${show.foot_no ? "d-block" : "d-none"}`}>
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
                                        <div className={`form-group ${show.note ? "d-block" : "d-none"}`}>
                                            <label className="form-label">Not</label>
                                            <textarea
                                                className="form-control"
                                                name="note"
                                                onChange={this.handleChange}
                                                rows={2}
                                                maxLength="1000"
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
                                Yukarıdaki bilgilerin, öğrencinin (veya velisinin) rızası ve bilgisi dahilinde sisteme
                                kayıt edildiğini ve gerektiğinde öğrenciyle (veya velisiyle) iletişime geçileceğini
                                kabul ediyor ve onaylıyorum.
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
                                            name="body"
                                            type="button"
                                            onClick={this.handleOtherInfo}
                                            className="btn btn-secondary btn-block">
                                            Beden
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

export default Add;
