import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import moment from "moment";
import _ from "lodash";
import Inputmask from "inputmask";
import { avatarPlaceholder, clearMoney, formatMoney, formatDate, nullCheck } from "../../../services/Others";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../../assets/js/core";
import { ListPlayerFeesNew } from "../../../services/Player";
import { GetBudgets } from "../../../services/FillSelect";
import { Toast, showSwal } from "../../Alert";
import { CreatePaymentFee } from "../../../services/PlayerAction";
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

export class Monthly extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            fees: null,
            fees_keys: [],
            select_fee: {
                fee: 0,
                amount: 0,
                note: null,
                paid_date: moment().format("YYYY-MM-DD")
            },
            selected_month: null,
            budget: null,
            select: {
                budgets: null
            },
            formErrors: {
                paid_date: "",
                fee: "",
                amount: ""
            },
            selectError: false,
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
        this.listPlayerFees();
        this.listBudgets();
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
                )}</b> ödemesi alınacaktır.`,
                confirmButtonText: "Devam et",
                cancelButtonText: "İptal",
                confirmButtonColor: "#cd201f",
                cancelButtonColor: "#467fcf",
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
            const { uid, selected_month, select_fee } = this.state;
            const { to, settings, player } = this.props.state;
            const { fee, amount, paid_date, budget_id, note } = select_fee;

            let required = {
                fee: fee,
                amount: amount,
                budget_id: budget_id,
                paid_date: paid_date
            };

            if (selected_month && formValid(required)) {
                this.feePaymentAlert().then(re => {
                    if (re.value) {
                        this.setState({ loadingButton: "btn-loading" });
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
                        }).then(response => {
                            if (response) {
                                const status = response.status;
                                if (status.code === 1020) {
                                    Toast.fire({
                                        type: "success",
                                        title: "İşlem başarılı..."
                                    });
                                }
                            }
                            this.reload();
                        });
                    }
                });
            } else {
                console.error("ERROR FORM");
                this.setState(prevState => ({
                    selectError: true,
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

    handleChange = e => {
        const { value, name } = e.target;
        this.setState(prevState => ({
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
    };

    renderAvatar = () => {
        const { image, name, surname } = this.props.state;
        return (
            <span
                className="avatar avatar-xxl"
                style={{
                    backgroundImage: `url(${image})`
                }}>
                {!image ? avatarPlaceholder(name, surname) : null}
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

    formatPaidDate = (date, show_day) => {
        try {
            const splitDate = date.split(",");
            const firstDate = moment(splitDate[0]);
            const secondDate = moment(splitDate[1]);
            const diff = Math.ceil(moment(secondDate).diff(moment(firstDate), "days", true));

            return `${firstDate.format("MMMM")} ${firstDate.format("YYYY")} - ${secondDate.format(
                "MMMM"
            )} ${secondDate.format("YYYY")} ${show_day ? "(" + diff + " günlük)" : ""}`;
        } catch (e) {}
    };

    listPlayerFees = () => {
        const { uid, to } = this.props.state;
        this.setState({ loading: "active" });
        ListPlayerFeesNew({
            uid: uid,
            to: to,
            year: 2019
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
        const { fees, select_fee } = this.state;
        const { fee } = this.props.state;
        this.setState(prevState => ({
            select_fee: { ...prevState.select_fee, fee: fee, amount: 0, fee_id: null, ...fees[el] },
            selected_month: el,
            selectError: false
        }));
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
        const { fees } = this.props.state;
        return (
            <div className="d-flex justify-content-between align-items-center mt-2">
                {fees && Object.keys(fees).length > 0 ? (
                    <div className="text-body font-italic">
                        <span className="status-icon bg-success" />
                        Bugüne kadar <strong>{formatMoney(_.sumBy(_.values(fees), "amount"))}</strong> ödeme
                        yapılmıştır.
                    </div>
                ) : (
                    <div className="text-body">
                        <span className="status-icon bg-success" />
                        Bugüne kadar <strong>0,00 ₺</strong> ödeme yapılmıştır.
                    </div>
                )}
            </div>
        );
    };

    // Aylık Ödeme - Geçmiş Aidat Çizelgesi
    renderMonthlyPastNew = () => {
        const { fees, selected_month, fees_keys } = this.state;
        return (
            <div className="col-12">
                <div className="form-group">
                    <label className="form-label">Geçmiş Aidat Çizelgesi (2019)</label>
                    <div className="installment-detail monthly-detail d-flex flex-lg-row flex-md-row flex-column">
                        {fees && fees_keys.length > 0 ? (
                            fees_keys.map((el, key) => {
                                const fee = fees[el].fee;
                                const amount = fees[el].amount;

                                const tooltip =
                                    Object.keys(fees[el]).length > 0
                                        ? amount >= fee
                                            ? "Tamamlandı"
                                            : "Eksik"
                                        : "Yapılmadı";

                                const tag_color =
                                    selected_month === el
                                        ? "tag-info"
                                        : Object.keys(fees[el]).length > 0
                                        ? amount >= fee
                                            ? "tag-success"
                                            : "tag-warning"
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
                            <span className="tag" style={{ width: "100%" }} />
                        )}
                    </div>
                    {this.renderMonthlyFinalSituation()}
                </div>
            </div>
        );
    };

    // Aylık Ödeme - Yeni Ödeme
    renderNewPayment = () => {
        const { select_fee, selected_month, select, formErrors, paid_date, budget } = this.state;
        const { fee } = this.props.state;
        if (selected_month) {
            return (
                <div className="form-fieldset mt-2">
                    <h3 className="text-uppercase">{moment(selected_month).format("MMMM YYYY")}</h3>
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
                                value={select_fee.note}
                                onChange={this.handleChange}
                                maxLength="100"></textarea>
                        </div>
                    </div>
                </div>
            );
        } else return null;
    };

    render() {
        const { selectError } = this.state;
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
                                    <i class="fe fe-alert-triangle mr-2" aria-hidden="true"></i>
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
                                                    ? formatDate(player.start_date, "LL")
                                                    : "Her ayın " + settings.payment_day + ". günü"}
                                            </div>
                                        </div>
                                        <div className="col"></div>
                                        <div className="col-lg-2 text-right col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Yıl</label>

                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value="2019"
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
                    </div>
                </div>
            </>
        );
    }
}

export default Monthly;
