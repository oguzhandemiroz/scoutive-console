import React, { Component } from "react";
import Select, { components } from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import moment from "moment";
import _ from "lodash";
import { avatarPlaceholder, clearMoney, formatMoney, formatDate, nullCheck } from "../../../services/Others";
import { selectCustomStyles, selectCustomStylesError } from "../../../assets/js/core";
import { ListPlayerFeesNew } from "../../../services/Player";
import { GetBudgets } from "../../../services/FillSelect";
const $ = require("jquery");

registerLocale("tr", tr);

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
            fees: null,
            fees_keys: [],
            select_fee: null,
            selected_month: null,
            paid_date: new Date(),
            budget: null,
            select: {
                budgets: null
            },
            formErrors: {
                paid_date: ""
            }
        };
    }

    componentDidMount() {
        this.listPlayerFees();
        this.listBudgets();
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    handleChange = e => {
        console.log(e);
        const { value, name } = e.target;
        this.setState(prevState => ({
            select_fee: {
                ...prevState.select_fee,
                [name]: value
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

    // Aylık Ödeme - Bugüne kadar
    renderMonthlyFinalSituation = () => {
        const { pastData } = this.props.state;
        return (
            <div className="d-flex justify-content-between align-items-center mt-2">
                {pastData && pastData.length > 0 ? (
                    <div className="text-body font-italic">
                        <span className="status-icon bg-success" />
                        Bugüne kadar <strong>{formatMoney(_.sumBy(pastData, "amount"))}</strong> ödeme yapılmıştır.
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
        const { fees, select_fee, fees_keys } = this.state;
        return (
            <div className="col-12">
                <div className="form-group">
                    <label className="form-label">Geçmiş Aidat Çizelgesi (2019)</label>
                    <div className="installment-detail monthly-detail d-flex flex-lg-row flex-md-row flex-column">
                        {fees && fees_keys.length > 0 ? (
                            fees_keys.map((el, key) => {
                                const fee = fees[el].fee;
                                const fee_id = fees[el].fee_id;
                                const amount = fees[el].amount;

                                const tooltip =
                                    Object.keys(fees[el]).length > 0
                                        ? amount >= fee
                                            ? "Tamamlandı"
                                            : "Eksik"
                                        : "Yapılmadı";

                                const tag_color =
                                    Object.keys(fees[el]).length > 0
                                        ? amount >= fee
                                            ? "tag-success"
                                            : "tag-warning"
                                        : "";

                                return (
                                    <span
                                        onClick={() => {
                                            console.log("lick");
                                            this.setState({ select_fee: { ...fees[el] }, selected_month: el });
                                        }}
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
        if (!select_fee) return null;

        if (select_fee && Object.keys(select_fee).length === 0) {
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
                                    className="form-control"
                                    type="text"
                                    value={formatMoney(fee || 0)}
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
                                    className="form-control"
                                    type="text"
                                    value={formatMoney(0)}
                                    onChange={this.props.handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Ödenen Tarih
                                    <span className="form-required">*</span>
                                </label>
                                <DatePicker
                                    autoComplete="off"
                                    selected={paid_date}
                                    selectsStart
                                    startDate={paid_date}
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
                                    value={budget}
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
                                onChange={this.handleChange}
                                maxLength="100"></textarea>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <fieldset className="form-fieldset mt-2">
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
                                    className="form-control"
                                    type="text"
                                    value={formatMoney(select_fee.fee || 0)}
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
                                    className="form-control"
                                    type="text"
                                    value={formatMoney(select_fee.amount || 0)}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Ödenen Tarih
                                    <span className="form-required">*</span>
                                </label>
                                <DatePicker
                                    autoComplete="off"
                                    selected={paid_date}
                                    selectsStart
                                    startDate={paid_date}
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
                                onChange={this.handleChange}
                                maxLength="100"></textarea>
                        </div>
                    </div>
                </fieldset>
            );
        }
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
                        budget: response.find(x => x.default === 1) || null
                    }));
                }
            });
        } catch (e) {}
    };

    render() {
        const {
            fee,
            period,
            loadingButton,
            editfee,
            tab,
            start_date,
            required_payment_date,
            settings,
            periodToggle
        } = this.props.state;
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

                            <div className="row">
                                <div className="col-lg-2 col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Aidat Bilgisi</label>
                                        <div className={`input-group ${editfee ? "d-flex" : "d-none"}`}>
                                            <input
                                                name="fee"
                                                className="form-control"
                                                type="text"
                                                value={nullCheck(fee, "")}
                                                onChange={this.props.handleChange}
                                            />
                                            <span className="input-group-append">
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    disabled={clearMoney(fee) === 0 ? "disabled" : false}
                                                    onClick={() => {
                                                        this.props.setState({
                                                            editfee: false,
                                                            amount: periodToggle
                                                                ? clearMoney(fee)
                                                                : clearMoney(fee) * parseInt(period)
                                                        });
                                                    }}>
                                                    Kaydet
                                                </button>
                                            </span>
                                        </div>
                                        <div className={editfee ? "d-none" : "d-block"}>
                                            {formatMoney(fee || 0) + " — AYLIK"}
                                            <span
                                                onClick={() => {
                                                    this.props.setState({ editfee: true });
                                                    $("#editfee").tooltip("hide");
                                                }}
                                                id="editfee"
                                                className="icon ml-1 cursor-pointer"
                                                title="Bu ay için aidat tutarını değiştir"
                                                data-toggle="tooltip">
                                                <i className="fa fa-pen-square" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Okula Başlama Tarihi</label>
                                        {formatDate(start_date, "LL")}
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Aidat Ödeme Günü</label>
                                        {settings.payment_day === "0"
                                            ? formatDate(start_date, "LL")
                                            : "Her ayın " + formatDate(required_payment_date, "D") + ". günü"}
                                    </div>
                                </div>
                                <div className="col"></div>
                                <div className="col-lg-2 text-right col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Yıl</label>

                                        <input type="number" className="form-control form-control-sm" value="2019" />
                                    </div>
                                </div>

                                {editfee ? (
                                    <div className="col-12">
                                        <div className="alert alert-info alert-icon alert-dismissible">
                                            <button type="button" className="close" data-dismiss="alert"></button>
                                            <i className="fe fe-alert-triangle mr-2" aria-hidden="true" />
                                            <p>
                                                <strong>Uyarı!</strong>
                                            </p>
                                            Öğrenciniz ayın ortasında katıldıysa ve siz ayın başında veya sonunda ödeme
                                            alıyorsanız, ne kadar ödemesi gerektiğini buraya girmelisiniz.
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div className="row mt-2">{this.renderMonthlyPastNew()}</div>
                            {this.renderNewPayment()}
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <button className="btn btn-success btn-icon disabled disable-overlay" disabled>
                                <i className="fe fe-lock mr-2"></i>
                                Kredi Kartı ile Ödeme Al <sup>(Yakında)</sup>
                            </button>
                            <button
                                className={`btn btn-primary ${loadingButton}`}
                                disabled={editfee ? "disabled" : false}>
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
