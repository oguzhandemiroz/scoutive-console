import React, { Component } from "react";
import { avatarPlaceholder, formatMoney, formatDate, clearMoney } from "../../../services/Others";
import { CreatePaymentFee, UpdatePaymentFee, ListFees, DeletePaymentFee } from "../../../services/PlayerAction";
import Select, { components } from "react-select";
import _ from "lodash";
import moment from "moment";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../../assets/js/core";
import { Toast, showSwal } from "../../Alert";

const { Option } = components;
const ImageOption = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
    </Option>
);

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Öğrenci" },
    1: { bg: "bg-success", title: "Aktif Öğrenci" },
    2: { bg: "bg-azure", title: "Donuk Öğrenci" }
};

export class OneTime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID")
        };
    }

    printSlip = data => {
        const { uid } = this.state;
        const { to } = this.props.state;

        const renderURL = `https://scoutive.online/api/v1/fee/slip/${uid}/${to}/${data.fee_id}`;
        window.open(renderURL, "_blank");
    };

    payInstallment = data => {
        if (data.fee_type === 1 || data.amount >= data.fee) return null;
        const { uid, to, fee, label, payment_type, budget, period } = this.props.state;
        if (fee === null) {
            Toast.fire({
                type: "error",
                title: "Tanımsız ödeme bilgisi..."
            });
            return null;
        }

        const totalDept = parseFloat((data.fee * parseInt(period) - data.amount).toFixed(2));
        showSwal({
            type: "question",
            title: "Taksit Ödemesi",
            html: `<strong>${label}</strong> adlı öğrencinin, <strong>${formatMoney(
                totalDept
            )} </strong> tutarında taksit ödemesi yapılacaktır.<hr>Ne kadarını ödemek istiyorsunuz?`,
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
                            )} </strong> tutarındaki taksidi için toplamda <strong>${formatMoney(
                                parseFloat(value)
                            )} </strong> ödeme yapılacaktır.<br><strong>${
                                budget.label
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
                                    fee_id: data.fee_id,
                                    amount: clearMoney(value),
                                    paid_date: moment().format("YYYY-MM-DD"),
                                    payment_type: payment_type,
                                    budget_id: budget.value
                                }).then(response => {
                                    if (response) {
                                        this.props.listPastPayment(to);
                                    }
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

    // Tek Ödeme ve Özet Taksit Ödeme Durumu
    renderOnetimeSummary = () => {
        const { pastData } = this.props.state;
        return (
            <div className="col-12">
                <div className="form-group">
                    <label className="form-label">Özet Taksit Ödeme Durumu</label>
                    <div className="installment-detail d-flex flex-row">
                        {pastData && pastData.length > 0 ? (
                            pastData
                                .sort((a, b) => a.required_payment_date.localeCompare(b.required_payment_date))
                                .map((el, key) => {
                                    let tag_color = "";
                                    const fee_type = el.fee_type;
                                    const fee = el.fee;
                                    const fee_id = el.fee_id;
                                    const amount = el.amount;
                                    const idx = pastData.filter(x => x.fee_type === 1).length === 0 ? key + 1 : key;
                                    const type_text = fee_type === 1 ? "Peşinat" : idx + ". Taksit";

                                    if (fee_type === 1) tag_color = "tag-primary";
                                    else if (fee_type === 2 && amount >= fee) tag_color = "tag-success";
                                    else if (amount !== 0) tag_color = "tag-warning";

                                    return (
                                        <span key={fee_id.toString()} className={"tag " + tag_color}>
                                            <div className="d-none d-lg-block">{type_text}</div>
                                        </span>
                                    );
                                })
                        ) : (
                            <span className="tag" />
                        )}
                    </div>
                    {this.renderOnetimeFinalSituation()}
                </div>
            </div>
        );
    };

    // Tek Ödeme ve Son Durum
    renderOnetimeFinalSituation = () => {
        const { pastData } = this.props.state;
        return (
            <div className="d-flex justify-content-between mt-2">
                {pastData && pastData.length > 0 ? (
                    <>
                        <div className="text-body font-italic">
                            <span className="status-icon bg-success" />
                            Şimdiye kadar <strong>{formatMoney(_.sumBy(pastData, "amount"))}</strong> ödeme yapılmıştır.
                        </div>
                        {pastData.filter(x => x.fee_type === 2 && x.fee !== x.amount).length > 0 ? (
                            <div className="text-body text-right">
                                <span className="status-icon bg-gray-lighter" />
                                Gelecek taksit tarihi &mdash;{" "}
                                <strong>
                                    {formatDate(
                                        pastData
                                            .filter(x => x.fee_type !== 1 && x.fee !== x.amount)
                                            .sort((a, b) =>
                                                a.required_payment_date.localeCompare(b.required_payment_date)
                                            )[0].required_payment_date,
                                        "LL"
                                    )}
                                </strong>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <>
                        <div className="text-body">
                            <span className="status-icon bg-success" />
                            Şimdiye kadar <strong>0,00 ₺</strong> ödeme yapılmıştır.
                        </div>
                        <div className="text-body">
                            <span className="status-icon bg-gray-lighter" />
                            Gelecek taksit tarihi &mdash; <strong>00 Ocak 0000</strong>
                        </div>
                    </>
                )}
            </div>
        );
    };

    renderOnetimeInstallmentPlan = () => {
        const { pastData } = this.props.state;
        return (
            <div className="row">
                <div className="col-12">
                    <div className="form-group">
                        <label className="form-label">Taksit Planı</label>
                        {pastData ? (
                            <div className="row row-cards row-deck">
                                {pastData
                                    .sort((a, b) => a.required_payment_date.localeCompare(b.required_payment_date))
                                    .map((el, key) => {
                                        const fee_type = el.fee_type;
                                        const fee = el.fee;
                                        const amount = el.amount;
                                        const month = el.month;
                                        const required_payment_date = el.required_payment_date;
                                        const idx = pastData.filter(x => x.fee_type === 1).length === 0 ? key + 1 : key;
                                        const type_text = fee_type === 1 ? "Peşinat" : idx + ". Taksit";

                                        let status_type = "bg-gray-lighter";
                                        let ribbon_type = "bg-dark";
                                        let status_hover = "";

                                        if (fee_type === 1) {
                                            status_type = "bg-primary";
                                            ribbon_type = "bg-primary";
                                            status_hover = "hover-primary";
                                        } else if (amount >= fee) {
                                            status_type = "bg-success";
                                            ribbon_type = "bg-success";
                                            status_hover = "hover-success";
                                        } else if (amount > 0) {
                                            status_type = "bg-warning";
                                            status_hover = "hover-warning";
                                        }

                                        return (
                                            <div className="col-lg-3 col-md-4 col-sm-6" key={key.toString()}>
                                                <div className={"card card-hover " + status_hover}>
                                                    <div className={"card-status " + status_type} />
                                                    <div className="card-body text-center">
                                                        <div className="card-category text-muted">
                                                            <div>{type_text + " Ödemesi"}</div>
                                                            <div className="text-muted small">
                                                                {fee_type === 1
                                                                    ? formatDate(required_payment_date, "MMMM YYYY")
                                                                    : this.formatPaidDate(month)}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Tutar</label>
                                                            <div className="form-control-plaintext p-0">
                                                                {fee_type === 1
                                                                    ? formatMoney(amount)
                                                                    : formatMoney(fee)}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Ödenen Tutar</label>
                                                            <div className="form-control-plaintext p-0">
                                                                {formatMoney(amount)}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Ödeme Tarihi</label>
                                                            <div className="form-control-plaintext p-0">
                                                                {formatDate(required_payment_date, "LL")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        onClick={() => this.payInstallment(el)}
                                                        className={"ribbon ribbon-left ribbon-bottom " + ribbon_type}
                                                        data-toggle="tooltip"
                                                        title={
                                                            fee_type === 1
                                                                ? "Peşinat Alındı"
                                                                : amount >= fee
                                                                ? "Ödeme Alındı"
                                                                : "Ödeme Al"
                                                        }>
                                                        <i
                                                            className={`fa fa-${
                                                                fee_type === 1
                                                                    ? "check"
                                                                    : amount >= fee
                                                                    ? "check"
                                                                    : "plus"
                                                            }`}
                                                        />
                                                    </div>
                                                    {amount > 0 ? (
                                                        <div
                                                            onClick={() => this.printSlip(el)}
                                                            className={
                                                                "ribbon ribbon-right ribbon-bottom bg-white border text-body"
                                                            }
                                                            data-toggle="tooltip"
                                                            title="Makbuz Yazdır">
                                                            <i className="fe fe-printer" />
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <div className="row row-cards row-deck">
                                <div className="col-12">
                                    <div className="loader"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { player, select, tab, image, name, surname, fee } = this.props.state;
        return (
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
                            <div className="col-12">
                                <div className="form-group">
                                    <label className="form-label">Aidat Bilgisi</label>
                                    {formatMoney(fee) + " — TEK ÖDEME"}
                                </div>
                            </div>
                        </div>
                        <div className="row">{this.renderOnetimeSummary()}</div>
                        {this.renderOnetimeInstallmentPlan()}
                    </div>
                </div>
            </div>
        );
    }
}

export default OneTime;
