import React, { Component } from "react";
import Select, { components } from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import moment from "moment";
import _ from "lodash";
import { avatarPlaceholder, clearMoney, formatMoney, formatDate } from "../../../services/Others";
import { selectCustomStyles, selectCustomStylesError } from "../../../assets/js/core";
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

const noRow = loading =>
    loading ? (
        <div className={`dimmer active p-3`}>
            <div className="loader" />
            <div className="dimmer-content" />
        </div>
    ) : (
        <div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
    );

export class Monthly extends Component {
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

    // Aylık Ödeme - Geçmiş Aidat Çizelgesi
    renderMonthlyPastNew = () => {
        const { pastData } = this.props.state;
        return (
            <div className="col-12">
                <div className="form-group">
                    <label className="form-label">Geçmiş Aidat Çizelgesi (Son 12 Ay)</label>
                    <div className="installment-detail monthly-detail d-flex flex-row">
                        {pastData && pastData.length > 0 ? (
                            pastData.slice(-12).map(el => {
                                const fee = el.fee;
                                const fee_id = el.fee_id;
                                const amount = el.amount;
                                const status = el.status;
                                const required_payment_date = el.required_payment_date;
                                const type_text = formatDate(required_payment_date, "MMMM YYYY");
                                const tag_color =
                                    status !== 0
                                        ? amount >= fee
                                            ? "tag-success"
                                            : amount > 0
                                            ? "tag-warning"
                                            : ""
                                        : "tag-danger text-line-through";

                                const tooltip =
                                    status !== 0
                                        ? amount >= fee
                                            ? "Tamamlandı"
                                            : amount > 0
                                            ? "Eksik"
                                            : "Yapılmadı"
                                        : "İptal";

                                return (
                                    <span
                                        key={fee_id.toString()}
                                        className={"tag " + tag_color}
                                        data-toggle="tooltip"
                                        title={tooltip}>
                                        <div className="d-none d-lg-block">{type_text}</div>
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
                                <div className="col-lg-2">
                                    <div className="form-group">
                                        <label className="form-label">Aidat Bilgisi</label>
                                        <div className={`input-group ${editfee ? "d-flex" : "d-none"}`}>
                                            <input
                                                name="fee"
                                                className="form-control"
                                                type="text"
                                                value={fee || ""}
                                                onChange={this.handleChange}
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
                                            {formatMoney(fee) + " — AYLIK"}
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
                                <div className="col-lg-2">
                                    <div className="form-group">
                                        <label className="form-label">Okula Başlama Tarihi</label>
                                        {formatDate(start_date, "LL")}
                                    </div>
                                </div>
                                <div className="col-lg-2">
                                    <div className="form-group">
                                        <label className="form-label">Aidat Ödeme Günü</label>
                                        {settings.payment_day === "0"
                                            ? formatDate(start_date, "LL")
                                            : "Her ayın " + formatDate(required_payment_date, "D") + ". günü"}
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <button className="btn btn-outline-secondary btn-sm">
                                            Yeni Aidat Ödemesi Oluştur
                                        </button>
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

                            <div className="row">{this.renderMonthlyPastNew()}</div>
                            {/* {this.renderNewPayment()} */}
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
