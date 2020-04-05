import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import moment from "moment";
import _ from "lodash";
import Inputmask from "inputmask";
import {
    avatarPlaceholder,
    clearMoney,
    formatMoney,
    formatDate,
    nullCheck,
    CheckPermissions
} from "../../../services/Others";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../../assets/js/core";
import { ListPlayerFeesNew } from "../../../services/Player";
import { GetBudgets, Years } from "../../../services/FillSelect";
import { Toast, showSwal } from "../../Alert";
import { CreatePaymentFee, UpdatePaymentFee, DeletePaymentFee } from "../../../services/PlayerAction";
const $ = require("jquery");

registerLocale("tr", tr);

Inputmask.extendDefaults({
    autoUnmask: true
});

Inputmask.extendAliases({
    try: {
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
    placeholder: "0,00",
    autoUnmask: true
};

const feeStatus = {
    "-1": { text: "Yeni Ödeme", color: "tag-info", badge: () => <span className="badge badge-info">Yeni Ödeme</span> },
    0: { text: "İptal Ödeme", color: "tag-dark", badge: () => <span className="badge badge-dark">İptal Ödeme</span> },
    1: {
        text: "Eksik Ödeme",
        color: "tag-warning",
        badge: () => <span className="badge badge-warning">Eksik Ödeme</span>
    },
    2: {
        text: "Tamamlanmış Ödeme",
        color: "tag-success",
        badge: () => <span className="badge badge-success">Tamamlanmış Ödeme</span>
    },
    3: {
        text: "Gecikmiş Ödeme",
        color: "tag-danger",
        badge: () => <span className="badge badge-danger">Gecikmiş Ödeme</span>
    }
};

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Öğrenci" },
    1: { bg: "bg-success", title: "Aktif Öğrenci" },
    2: { bg: "bg-azure", title: "Donuk Öğrenci" }
};

const IconOption = props => (
    <Option {...props}>
        <span>
            <i
                className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
                style={{ backgroundImage: `url(${props.data.image})` }}
            />
            {props.data.label}
            <div className="small text-muted">
                Bütçe: <b>{formatMoney(props.data.balance)}</b>
            </div>
        </span>
    </Option>
);

const { Option } = components;
const ImageOption = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
    </Option>
);

const initialState = {
    select_fee: {
        fee: 0,
        amount: 0,
        note: null,
        paid_date: moment().format("YYYY-MM-DD")
    },
    selected_month: null,
    selectError: false
};

export class Monthly extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            fees: null,
            fees_keys: [],
            budget: null,
            year: { value: moment().format("YYYY"), label: moment().format("YYYY") },
            select: {
                budgets: null,
                year: null
            },
            formErrors: {
                paid_date: "",
                fee: "",
                amount: ""
            },
            loadingButton: ""
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                amount: $("[name=amount]"),
                fee: $("[name=fee]")
            };
            Inputmask({
                alias: "try",
                ...InputmaskDefaultOptions
            }).mask(elemArray.amount);
            Inputmask({
                alias: "try",
                ...InputmaskDefaultOptions
            }).mask(elemArray.fee);
        } catch (e) {}
    };

    componentDidMount() {
        this.listPlayerFees(moment().format("YYYY"));
        this.listBudgets();
        this.setState(prevState => ({
            select: {
                ...prevState.select,
                years: Years(true, parseInt(moment().format("YYYY")) - 5, moment().format("YYYY"))
            }
        }));
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
        if (!$("[name=fee]").attr("im-insert") && !$("[name=amount]").attr("im-insert")) {
            this.fieldMasked();
        }
        $('[data-toggle="tooltip"]').tooltip();
    }

    feePaymentAlert = () => {
        try {
            const { select_fee } = this.state;
            const { player } = this.props.state;
            return showSwal({
                type: "warning",
                title: "Uyarı",
                html: `<b>${player.label}</b> adlı öğrencinin <b>${formatMoney(
                    select_fee.amount
                )}</b> ödemesi alınacaktır.<br>Onaylıyor musunuz?`,
                confirmButtonText: "Devam et",
                cancelButtonText: "İptal",
                confirmButtonColor: "#cd201f",
                cancelButtonColor: "#868e96",
                showCancelButton: true,
                reverseButtons: true
            });
        } catch (e) {
            console.log(e);
        }
    };

    handleSubmit = e => {
        try {
            e.preventDefault();
            const { selected_month, select_fee } = this.state;
            const { fee, amount, paid_date, budget_id } = select_fee;

            let required = {
                fee: fee,
                amount: amount || null,
                budget_id: budget_id,
                paid_date: paid_date
            };

            this.setState(prevState => ({
                selectError: selected_month ? false : true,
                formErrors: {
                    ...prevState.formErrors,
                    fee: "",
                    amount: "",
                    paid_date: "",
                    budget_id: ""
                }
            }));

            if (selected_month && formValid(required)) {
                this.feePaymentAlert().then(re => {
                    if (re.value) {
                        this.setState({ loadingButton: "btn-loading" });
                        select_fee.fee_id ? this.updateSubmit() : this.createSubmit();
                    }
                });
            } else {
                console.error("ERROR FORM");
                this.setState(prevState => ({
                    selectError: selected_month ? false : true,
                    formErrors: {
                        ...prevState.formErrors,
                        fee: fee ? "" : "is-invalid",
                        amount: amount ? "" : "is-invalid",
                        paid_date: paid_date ? "" : "is-invalid",
                        budget_id: budget_id ? "" : "is-invalid"
                    }
                }));
            }
        } catch (e) {}
    };

    createSubmit = () => {
        const { uid, selected_month, select_fee } = this.state;
        const { to, settings, player } = this.props.state;
        const { fee, amount, paid_date, budget_id, note } = select_fee;
        CreatePaymentFee({
            uid: uid,
            to: to,
            fee: clearMoney(fee),
            amount: clearMoney(amount),
            required_payment_date: moment(selected_month, "YYYY-MM")
                .date(settings.payment_day === "0" ? player.start_date : settings.payment_day)
                .format("YYYY-MM-DD"),
            payment_end_date: moment(selected_month, "YYYY-MM")
                .date(settings.payment_day === "0" ? player.start_date : settings.payment_day)
                .add(1, "month")
                .format("YYYY-MM-DD"),
            paid_date: moment(paid_date).format("YYYY-MM-DD"),
            payment_type: 0,
            budget_id: budget_id,
            note: note
        }).then(response => this.reload());
    };

    updateSubmit = () => {
        const { uid, selected_month, select_fee } = this.state;
        const { to, settings, player } = this.props.state;
        const { fee, amount, paid_date, budget_id, note } = select_fee;
        UpdatePaymentFee({
            uid: uid,
            to: to,
            fee_id: select_fee.fee_id,
            fee: clearMoney(fee),
            amount: clearMoney(amount),
            required_payment_date: moment(selected_month, "YYYY-MM")
                .date(settings.payment_day === "0" ? player.start_date : settings.payment_day)
                .format("YYYY-MM-DD"),
            payment_end_date: moment(selected_month, "YYYY-MM")
                .date(settings.payment_day === "0" ? player.start_date : settings.payment_day)
                .add(1, "month")
                .format("YYYY-MM-DD"),
            paid_date: moment(paid_date).format("YYYY-MM-DD"),
            payment_type: 0,
            budget_id: budget_id,
            note: note
        }).then(response => this.reload());
    };

    handleChange = e => {
        const { value, name } = e.target;
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: value ? "" : "is-invalid"
            },
            select_fee: {
                ...prevState.select_fee,
                [name]: value
            }
        }));
    };

    handleDate = (date, name) => {
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: date ? "" : "is-invalid"
            },
            select_fee: {
                ...prevState.select_fee,
                [name]: date
            }
        }));
    };

    handleSelect = (value, name) => {
        const { select_fee } = this.state;
        if (name === "year") {
            this.setState({ [name]: value });
            this.listPlayerFees(value.value);
            this.setState({
                ...initialState,
                select_fee: {
                    budget_id: select_fee.budget_id,
                    paid_date: select_fee.paid_date
                }
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    [name]: value ? "" : "is-invalid"
                },
                select_fee: {
                    ...prevState.select_fee,
                    budget_id: value.value
                }
            }));
        }
    };

    renderAvatar = () => {
        const { image, name, surname, status } = this.props.state;
        return (
            <span className="avatar avatar-xxl" style={{ backgroundImage: `url(${image})` }}>
                {image ? "" : avatarPlaceholder(name, surname)}
                <span
                    data-toggle="tooltip"
                    title={statusType[status !== undefined ? status : 1].title}
                    className={`avatar-sm avatar-status ${statusType[status !== undefined ? status : 1].bg}`}
                />
            </span>
        );
    };

    renderPlayerSelect = () => {
        const { select, player } = this.props.state;
        return (
            <div className="form-group">
                <label className="form-label">
                    Öğrenci
                    <span className="form-required">*</span>
                </label>
                <Select
                    value={player}
                    onChange={val => this.props.handleSelect(val, "player")}
                    options={select.players}
                    name="player"
                    placeholder="Öğrenci Seç..."
                    styles={selectCustomStyles}
                    isSearchable={true}
                    autoSize
                    isDisabled={select.players ? false : true}
                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                    components={{ Option: ImageOption }}
                />
            </div>
        );
    };

    listPlayerFees = year => {
        const { uid, to } = this.props.state;
        this.setState({ fees: null, fees_keys: [], loading: "active" });
        ListPlayerFeesNew({
            uid: uid,
            to: to,
            year: parseInt(year)
        }).then(response => {
            if (response) {
                const status = response.status;
                const data = response.data;
                if (status.code === 1020) {
                    this.setState({ fees: data, fees_keys: Object.keys(data) });
                }
            }
        });
    };

    listBudgets = () => {
        try {
            GetBudgets().then(response => {
                if (response) {
                    this.setState(prevState => ({
                        select: {
                            ...prevState.select,
                            budgets: response
                        },
                        select_fee: {
                            ...prevState.select_fee,
                            budget_id: response.find(x => x.default === 1).value || null
                        }
                    }));
                }
            });
        } catch (e) {}
    };

    selectFee = el => {
        const { fees } = this.state;
        const { fee } = this.props.state;
        this.setState(prevState => ({
            select_fee: { ...prevState.select_fee, fee: fee, amount: 0, fee_id: null, status: -1, ...fees[el] },
            selected_month: el,
            selectError: el ? false : true,
            formErrors: {
                ...prevState.formErrors,
                fee: "",
                amount: "",
                paid_date: "",
                budget_id: ""
            }
        }));
    };

    completeFee = () => {
        const { uid, select_fee, select } = this.state;
        const { fee, amount, budget_id, fee_id, paid_date, note } = select_fee;
        const { to, player } = this.props.state;
        const { label } = player;

        if (fee === null) {
            Toast.fire({
                type: "error",
                title: "Tanımsız ödeme bilgisi..."
            });
            return null;
        }
        const totalDept = fee - amount;
        showSwal({
            type: "question",
            title: "Ödeme Tutarı",
            html: `<strong>${label}</strong> adlı öğrenci, <strong>${formatDate(
                paid_date,
                "LL"
            )}</strong> tarihinde <strong>${formatMoney(amount)}</strong> ödeme yapmıştır. <strong>${formatMoney(
                totalDept
            )} </strong> tutarında borcu bulunmaktadır.<hr>Ne kadarını ödemek istiyorsunuz?`,
            confirmButtonText: "Onayla",
            cancelButtonText: "İptal",
            cancelButtonColor: "#868e96",
            showCancelButton: true,
            reverseButtons: true,
            input: "number",
            inputValue: totalDept,
            inputAttributes: {
                min: 0,
                max: totalDept
            },
            inputValidator: value => {
                return new Promise(resolve => {
                    if (value > 0 && value <= totalDept) {
                        showSwal({
                            type: "info",
                            title: "Bilgi",
                            html: `<b>${label}</b> adlı öğrencinin, <strong>${formatMoney(
                                totalDept
                            )} </strong> tutarındaki borcu için toplamda <strong>${formatMoney(
                                parseFloat(value)
                            )} </strong> ödeme yapılacaktır.<br><strong>${moment().format(
                                "LL"
                            )}</strong> tarihinde <strong>${
                                select.budgets.find(x => x.value === budget_id).label
                            }</strong> adlı kasa hesabına yatırılacaktır.<br>Onaylıyor musunuz?`,
                            confirmButtonText: "Onaylıyorum",
                            cancelButtonText: "İptal",
                            cancelButtonColor: "#868e96",
                            showCancelButton: true,
                            reverseButtons: true
                        }).then(re => {
                            if (re.value) {
                                UpdatePaymentFee({
                                    uid: uid,
                                    to: to,
                                    fee_id: fee_id,
                                    amount: clearMoney(value),
                                    paid_date: moment().format("YYYY-MM-DD"),
                                    payment_type: 0,
                                    budget_id: budget_id,
                                    note: note
                                }).then(response => {
                                    if (response) this.reload();
                                });
                            }
                        });
                    } else {
                        resolve("Hatalı değer!");
                    }
                });
            }
        });
    };

    deleteFee = () => {
        const { uid, select_fee, selected_month } = this.state;
        const { fee, fee_id } = select_fee;
        const { to, player } = this.props.state;
        const { label } = player;
        if (fee === null) {
            Toast.fire({
                type: "error",
                title: "Tanımsız ödeme bilgisi..."
            });
            return null;
        }
        showSwal({
            type: "warning",
            title: "Ödeme İptali",
            html: `<strong>${label}</strong> adlı öğrencinin, <strong>${formatDate(
                selected_month,
                "MMMM YYYY"
            )}</strong> tarihli ödemesi silinecektir.<br>Onaylıyor musunuz?`,
            confirmButtonText: "Onaylıyorum",
            cancelButtonText: "İptal",
            confirmButtonColor: "#cd201f",
            cancelButtonColor: "#868e96",
            showCancelButton: true,
            reverseButtons: true
        }).then(re => {
            if (re.value) {
                DeletePaymentFee({
                    uid: uid,
                    to: to,
                    fee_id: fee_id
                }).then(response => {
                    if (response) this.reload();
                });
            }
        });
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    // Aylık Ödeme - Bugüne kadar
    renderMonthlyFinalSituation = () => {
        const { fees, year } = this.state;
        return (
            <div className="d-flex justify-content-between align-items-center mt-2">
                {fees && Object.keys(fees).length > 0 ? (
                    <div className="text-body font-italic">
                        <span className="status-icon bg-success" />
                        {year.value} yılında <strong>{formatMoney(_.sumBy(_.values(fees), "amount") || 0)}</strong>{" "}
                        ödeme yapılmıştır.
                    </div>
                ) : (
                    <div className="text-body font-italic">
                        <span className="status-icon bg-success" />
                        {year.value} yılında <strong>0,00 ₺</strong> ödeme yapılmıştır.
                    </div>
                )}
            </div>
        );
    };

    // Aylık Ödeme - Geçmiş Aidat Çizelgesi
    renderMonthlyPastNew = () => {
        try {
            const { fees, selected_month, fees_keys, year } = this.state;
            return (
                <div className="col-12">
                    <div className="form-group">
                        <label className="form-label">Geçmiş Aidat Çizelgesi ({year.value})</label>
                        <div className="installment-detail monthly-detail d-flex flex-lg-row flex-md-row flex-column">
                            {fees && fees_keys.length > 0 ? (
                                fees_keys.map((el, key) => {
                                    const status = fees[el].status;

                                    const tooltip =
                                        Object.keys(fees[el]).length > 0 ? feeStatus[status].text : "Ödeme Yok";

                                    const tag_color =
                                        selected_month === el
                                            ? "tag-info"
                                            : Object.keys(fees[el]).length > 0
                                            ? feeStatus[status].color
                                            : "";

                                    return (
                                        <span
                                            onClick={() => this.selectFee(el)}
                                            key={key.toString()}
                                            className={"tag " + tag_color}
                                            data-toggle="tooltip"
                                            title={tooltip}>
                                            <div className="d-none d-lg-block">{moment(el).format("MMMM")}</div>
                                            <div className="d-block d-lg-none">{moment(el).format("MMM")}</div>
                                        </span>
                                    );
                                })
                            ) : (
                                <div className="loader mx-auto"></div>
                            )}
                        </div>
                        {this.renderMonthlyFinalSituation()}
                    </div>
                </div>
            );
        } catch (e) {}
    };

    // Aylık Ödeme - Yeni Ödeme
    renderNewPayment = () => {
        const { select_fee, selected_month, select, formErrors, paid_date, budget } = this.state;
        const { fee } = this.props.state;
        if (!selected_month) return null;

        if (select_fee.status === -1 || select_fee.status === 3) {
            return (
                <div className="mt-2">
                    <div className="hr-text hr-text-center mt-0">{moment(selected_month).format("MMMM YYYY")}</div>
                    <div className="mb-3">{feeStatus[select_fee.status].badge()}</div>

                    <div className="row gutters-xs">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Aidat Tutarı
                                    <span className="form-required">*</span>
                                </label>
                                <input
                                    name="fee"
                                    className={`form-control ${formErrors.fee}`}
                                    type="text"
                                    value={formatMoney(select_fee.fee || fee)}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Ödenen Tutar
                                    <span className="form-required">*</span>
                                </label>
                                <input
                                    name="amount"
                                    className={`form-control ${formErrors.amount}`}
                                    type="text"
                                    value={formatMoney(select_fee.amount)}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        {clearMoney(select_fee.amount) > clearMoney(select_fee.fee || fee) ? (
                            <div className="col-lg-12">
                                <div className="alert alert-warning">
                                    <strong>Uyarı!</strong> &mdash; Ödenen Tutar, Aidat Tutarından fazla!
                                </div>
                            </div>
                        ) : null}
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Ödenen Tarih
                                    <span className="form-required">*</span>
                                </label>
                                <DatePicker
                                    autoComplete="off"
                                    selected={select_fee.paid_date ? moment(select_fee.paid_date).toDate() : null}
                                    selectsStart
                                    startDate={select_fee.paid_date ? moment(select_fee.paid_date).toDate() : null}
                                    name="paid_date"
                                    locale="tr"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={date => this.handleDate(date, "paid_date")}
                                    className={`form-control ${formErrors.paid_date}`}
                                />
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Kasa Hesabı
                                    <span className="form-required">*</span>
                                </label>
                                <Select
                                    value={select.budgets.find(x => x.value === select_fee.budget_id)}
                                    onChange={val => this.handleSelect(val, "budget")}
                                    options={select.budgets}
                                    name="budget"
                                    placeholder="Kasa Seç..."
                                    styles={formErrors.budget === true ? selectCustomStylesError : selectCustomStyles}
                                    isSearchable={true}
                                    autoSize
                                    isDisabled={select.budgets ? false : true}
                                    isLoading={select.budgets ? false : true}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    components={{ Option: IconOption }}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label">Not</label>
                            <textarea
                                className="form-control resize-none"
                                placeholder="Not..."
                                name="note"
                                value={nullCheck(select_fee.note, "")}
                                onChange={this.handleChange}
                                maxLength="100"></textarea>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="mt-2">
                    <div className="hr-text hr-text-center mt-0">{moment(selected_month).format("MMMM YYYY")}</div>
                    <div className="mb-3">{feeStatus[select_fee.status].badge()}</div>
                    <div className="row gutters-xs">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Aidat Tutarı</label>
                                {formatMoney(select_fee.fee)}
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Ödenen Tutar</label>
                                {formatMoney(select_fee.amount)}
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Ödenen Tarih</label>
                                {formatDate(select_fee.paid_date, "LL")}
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Kasa Hesabı</label>

                                {select.budgets.find(x => x.value === select_fee.budget_id).label}
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="form-label">Not</label>
                            {nullCheck(select_fee.note, "")}
                        </div>
                    </div>
                </div>
            );
        }
    };

    printSlip = () => {
        const { uid, select_fee } = this.state;
        const { to } = this.props.state;

        const renderURL = `https://scoutive.online/api/v1/fee/slip/${uid}/${to}/${select_fee.fee_id}`;
        window.open(renderURL, "_blank");
    };

    render() {
        const { selectError, select_fee, select, year } = this.state;
        const { uid, player, loadingButton, tab, settings } = this.props.state;
        return (
            <>
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                <i className={`fa ${tab.icon} mr-2`} /> {tab.title}
                            </h3>
                        </div>
                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-auto">{this.renderAvatar()}</div>
                                <div className="col">{this.renderPlayerSelect()}</div>
                            </div>
                            {settings.payment_day === "-1" ? (
                                <div className="alert alert-danger alert-icon">
                                    <i className="fe fe-alert-triangle mr-2" aria-hidden="true"></i>
                                    <p className="mb-2">
                                        <strong>Ayarlarını Tamamla!</strong>
                                    </p>
                                    Ödeme ayarlarını tamamlamadan aidat ödemesi alamazsınız.&nbsp;
                                    <Link
                                        to={"/account/settings/general/" + uid}
                                        className="text-inherit font-weight-600">
                                        Ayarlamak için tıkla...
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="row">
                                        <div className="col-lg-2 col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Aidat Bilgisi</label>
                                                {formatMoney(player.fee || 0) + " — AYLIK"}
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Okula Başlama Tarihi</label>
                                                {formatDate(player.start_date, "LL")}
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Aidat Ödeme Günü</label>
                                                {settings.payment_day === "0"
                                                    ? `Her ayın ${formatDate(player.start_date, "D")}. günü`
                                                    : `Her ayın ${settings.payment_day}. günü (Sabit)`}
                                            </div>
                                        </div>
                                        <div className="col"></div>
                                        <div className="col-lg-2 text-right col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Yıl</label>
                                                <Select
                                                    value={year}
                                                    onChange={val => this.handleSelect(val, "year")}
                                                    options={select.years}
                                                    name="year"
                                                    placeholder="Yıl"
                                                    styles={selectCustomStyles}
                                                    isDisabled={select.years ? false : true}
                                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-2">{this.renderMonthlyPastNew()}</div>
                                    {this.renderNewPayment()}
                                    {selectError ? (
                                        <div className="text-center">
                                            <span className="text-red font-italic">
                                                <i className="fe fe-alert-circle mr-1" />
                                                Ödeme Yapılacak Ay Seçiniz
                                            </span>
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </div>
                        {select_fee.status === 1 ? (
                            <div className="card-footer d-flex justify-content-between">
                                {CheckPermissions(["a_remove"]) && (
                                    <button className="btn btn-danger btn-icon" onClick={this.deleteFee} type="button">
                                        Ödemeyi İptal Et
                                    </button>
                                )}
                                <div>
                                    <button
                                        className="btn btn-secondary btn-icon mr-2"
                                        onClick={this.printSlip}
                                        type="button">
                                        <i className="fe fe-printer mr-2"></i>Makbuz Yazdır
                                    </button>
                                    <button
                                        onClick={this.completeFee}
                                        type="button"
                                        className={`btn btn-primary ${loadingButton}`}>
                                        Aidat Ödemesi Ekle
                                    </button>
                                </div>
                            </div>
                        ) : select_fee.status === -1 || select_fee.status === 3 ? (
                            <div className="card-footer d-flex justify-content-between">
                                <button className="btn btn-success btn-icon disabled disable-overlay" disabled>
                                    <i className="fe fe-lock mr-2"></i>
                                    Kredi Kartı ile Ödeme Al <sup>(Yakında)</sup>
                                </button>
                                <button
                                    onClick={this.handleSubmit}
                                    type="button"
                                    className={`btn btn-primary ${loadingButton} ${
                                        settings.payment_day === "-1" ? "disabled" : ""
                                    }`}
                                    disabled={settings.payment_day === "-1"}>
                                    Aidat Ödemesi Al
                                </button>
                            </div>
                        ) : select_fee.status === 2 ? (
                            <div className="card-footer d-flex justify-content-between">
                                {CheckPermissions(["a_remove"]) && (
                                    <button className="btn btn-danger btn-icon" onClick={this.deleteFee} type="button">
                                        Ödemeyi İptal Et
                                    </button>
                                )}
                                <button className="btn btn-secondary btn-icon" onClick={this.printSlip} type="button">
                                    <i className="fe fe-printer mr-2"></i>Makbuz Yazdır
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </>
        );
    }
}

export default Monthly;
