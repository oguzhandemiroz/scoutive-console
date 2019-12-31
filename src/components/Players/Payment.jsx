import React, { Component } from "react";
import { ListPlayers } from "../../services/Player";
import Tabs from "./PaymentTabs";
import { CreatePaymentFee, UpdatePaymentFee, ListFees, DeletePaymentFee } from "../../services/PlayerAction";
import { GetBudgets } from "../../services/FillSelect";
import {
    fullnameGenerator,
    getSelectValue,
    formatMoney,
    clearMoney,
    avatarPlaceholder,
    formatDate
} from "../../services/Others";
import { Toast, showSwal } from "../Alert";
import DatePicker, { registerLocale } from "react-datepicker";
import { withRouter } from "react-router-dom";
import Select, { components } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../assets/js/core";
import tr from "date-fns/locale/tr";
import moment from "moment";
import _ from "lodash";
import Inputmask from "inputmask";
import { GetSettings } from "../../services/School";
import Scholarship from "./Payment/Scholarship";
import UnSelected from "./Payment/UnSelected";
import Monthly from "./Payment/Monthly";
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

const { Option } = components;
const ImageOption = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
    </Option>
);
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

const initialState = {
    fee_date: new Date(),
    paid_date: new Date(),
    month: { label: moment().format("MMMM"), value: moment().format("M") },
    payment_type: 0,
    period: 1,
    loadingButton: ""
};

const paymentTypeText = {
    0: "AYLIK",
    1: "BURSLU",
    2: "TEK ÖDEME"
};

export class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: this.props.match.params.uid,
            ...initialState,
            formErrors: {
                player: "",
                fee_date: "",
                paid_date: ""
            },
            loadingData: true,
            loadingPast: true,
            pastData: null,
            budget: null,
            select: {
                employees: null,
                budgets: null,
                months: null
            },
            tab: {
                title: "Ödeme Al",
                icon: "fa-hand-holding-usd"
            },
            editfee: false
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

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
        if (!$("[name=fee]").attr("im-insert") && !$("[name=amount]").attr("im-insert")) {
            this.fieldMasked();
        }
    }

    componentDidMount() {
        const { to } = this.state;
        GetSettings().then(resSettings => {
            this.setState({
                settings: resSettings.settings
            });
            this.listPlayers();
        });
        this.generateMonthList();
        this.listBudgets();
        if (to) this.listPastPayment(to);
        else this.setState({ pastData: [] });
    }

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {
                uid,
                to,
                fee,
                paid_date,
                period,
                month,
                payment_type,
                player,
                note,
                budget,
                value,
                required_payment_date,
                amount
            } = this.state;

            let required = {
                fee: fee,
                amount: amount,
                period: period,
                budget: budget,
                paid_date: paid_date
            };

            if (formValid(required)) {
                this.feePaymentAlert().then(re => {
                    if (re.value) {
                        this.setState({ loadingButton: "btn-loading" });
                        CreatePaymentFee({
                            uid: uid,
                            to: value,
                            fee: clearMoney(fee) * parseInt(period),
                            amount: clearMoney(amount),
                            required_payment_date: moment(required_payment_date)
                                .month(parseInt(month.value) - 1)
                                .format("YYYY-MM-DD"),
                            payment_end_date: moment(required_payment_date)
                                .month(parseInt(month.value) - 1)
                                .add(period, "month")
                                .format("YYYY-MM-DD"),
                            paid_date: moment(paid_date).format("YYYY-MM-DD"),
                            payment_type: payment_type,
                            budget_id: budget.value,
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
                            this.setState({ loadingButton: "" });
                            this.listPastPayment(to);
                        });
                    }
                });
            } else {
                console.error("ERROR FORM");
                let formErrors = { ...this.state.formErrors };
                formErrors.player = player ? "" : "is-invalid";
                formErrors.paid_date = paid_date ? "" : "is-invalid";
                formErrors.budget = budget ? false : true;
                this.setState({ formErrors });
            }
        } catch (e) {}
    };

    handleChange = e => {
        try {
            const { name, value } = e.target;
            const { fee } = this.state;
            let formErrors = { ...this.state.formErrors };
            switch (name) {
                case "period":
                    this.setState({ formErrors, [name]: value, amount: clearMoney(fee) * parseInt(value) });
                    break;
                default:
                    this.setState({ formErrors, [name]: value });
                    break;
            }
        } catch (e) {}
    };

    handleDate = (date, name) => {
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "paid_date":
                formErrors[name] = date ? "" : "is-invalid";
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: date });
    };

    handleSelect = (value, name) => {
        try {
            let formErrors = { ...this.state.formErrors };
            formErrors[name] = value ? false : true;
            switch (name) {
                case "player":
                    {
                        this.setState({
                            ...initialState,
                            ...value,
                            [name]: value,
                            to: value.value
                        });
                        this.listPastPayment(value.value);
                        this.props.history.push("/app/players/payment/fee/" + value.value);
                    }
                    break;
                default:
                    this.setState({
                        [name]: value
                    });
                    break;
            }
            this.setState({ formErrors });
        } catch (e) {}
    };

    listPlayers = () => {
        try {
            const { to, settings } = this.state;
            console.log(settings);
            ListPlayers().then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        const data = response.data.filter(x => x.is_trial === 0);
                        const players = [];

                        data.map(el => {
                            let playerdata = { ...el };
                            delete playerdata.uid;

                            players.push({
                                value: el.uid,
                                label: fullnameGenerator(el.name, el.surname),
                                required_payment_date:
                                    parseInt(settings.payment_day) <= 0
                                        ? el.start_date
                                        : moment()
                                              .date(settings.payment_day)
                                              .format("YYYY-MM-DD"),
                                amount: el.fee,
                                ...playerdata
                            });
                        });

                        const thisplayer = players.filter(x => x.value === to) || {};

                        console.log(thisplayer);

                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                players: players
                            },
                            player: thisplayer[0],
                            ...thisplayer[0]
                        }));
                    }
                }
            });
        } catch (e) {}
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

    listPastPayment = to => {
        const { uid } = this.state;
        this.setState({ pastData: null });
        ListFees({
            uid: uid,
            to: to
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({ pastData: response.data.reverse() });
                }
            }
        });
    };

    generateMonthList = () => {
        const months = moment.months();
        const monthsForSelect = [];
        months.map((el, key) => {
            monthsForSelect.push({
                value: moment()
                    .month(el)
                    .format("M"),
                label: el
            });
        });

        this.setState(prevState => ({
            month: { label: moment().format("MMMM"), value: moment().format("M") },
            select: {
                ...prevState.select,
                months: monthsForSelect
            }
        }));
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

    completeFee = data => {
        const { uid, to, fee, label, payment_type, budget } = this.state;
        if (fee === null) {
            Toast.fire({
                type: "error",
                title: "Tanımsız ödeme bilgisi..."
            });
            return null;
        }
        const totalDept = data.fee - data.amount;
        showSwal({
            type: "question",
            title: "Ödeme Tutarı",
            html: `<strong>${label}</strong> adlı öğrencinin, <strong>${formatMoney(
                totalDept
            )} </strong> tutarında borcu bulunmaktadır.<hr>Ne kadarını ödemek istiyorsunuz?`,
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
                            )} </strong> ödeme yapılacaktır.<br><strong>${
                                budget.label
                            }</strong> adlı kasa hesabına yatırılacaktır.<br>Onaylıyor musunuz?`,
                            confirmButtonText: "Onaylıyorum",
                            cancelButtonText: "İptal",
                            confirmButtonColor: "#467fcf",
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
                                        this.listPastPayment(to);
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

    deleteFee = data => {
        const { uid, to, fee, label, payment_type, budget } = this.state;
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
            html: `<strong>${label}</strong> adlı öğrencinin, <strong>${this.formatPaidDate(
                data.month
            )}</strong> tarihleri arasındaki ödemesi silinecektir.<br>Onaylıyor musunuz?`,
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
                    fee_id: data.fee_id
                }).then(response => {
                    if (response) {
                        this.listPastPayment(to);
                    }
                });
            }
        });
    };

    feePaymentAlert = () => {
        try {
            const { label, amount, period } = this.state;
            return showSwal({
                type: "warning",
                title: "Uyarı",
                html: `Aidat ödemesi yapmadan önce <b>Geçmiş İşlemler</b>'i kontrol et. 
					Tamamlanmamış ödeme var ise yeni bir ödeme <u>alınmayacaktır.</u> Ödemeleri tamamladıktan sonra devam edebilirsin.
					<hr>
					<b>${label}</b> adlı öğrencinin <b>${formatMoney(amount)}</b> ödemesi alınacaktır.`,
                confirmButtonText: "Devam et",
                cancelButtonText: "Kontrol et",
                confirmButtonColor: "#cd201f",
                cancelButtonColor: "#467fcf",
                showCancelButton: true,
                reverseButtons: true
            });
        } catch (e) {
            console.log(e);
        }
    };

    payInstallment = data => {
        if (data.fee_type === 1 || data.amount >= data.fee) return null;
        const { uid, to, fee, label, payment_type, budget, period } = this.state;
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
                            confirmButtonColor: "#467fcf",
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
                                        this.listPastPayment(to);
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

    // Tek Ödeme Ödeme Tipi
    renderOnetime = () => {
        const { player, select, tab, image, name, surname, fee } = this.state;
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
                            <div className="col-auto">
                                <span
                                    className="avatar avatar-xxl"
                                    style={{
                                        backgroundImage: `url(${image})`
                                    }}>
                                    {image ? null : avatarPlaceholder(name, surname)}
                                </span>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label className="form-label">
                                        Öğrenci
                                        <span className="form-required">*</span>
                                    </label>
                                    <Select
                                        value={player}
                                        onChange={val => this.handleSelect(val, "player")}
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
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label className="form-label">Aidat Bilgisi</label>
                                    {formatMoney(fee) + " — " + paymentTypeText[2]}
                                </div>
                            </div>
                        </div>
                        <div className="row">{this.renderOnetimeSummary()}</div>
                        {this.renderOnetimeInstallmentPlan()}
                    </div>
                </div>
            </div>
        );
    };

    // Yüklenme Ekranı
    renderLoading = () => {
        const { tab } = this.state;
        const { match } = this.props;
        if (!match.params.uid) return <UnSelected state={this.state} handleSelect={this.handleSelect} />;
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className={`fa ${tab.icon} mr-2`} /> {tab.title}
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="dimmer active p-3">
                            <div className="loader" />
                            <div className="dimmer-content" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Ödeme Tipine göre Render
    renderForPaymentType = () => {
        const { payment_type } = this.state;
        const { match } = this.props;
        if (match.params.uid) {
            switch (payment_type) {
                case 0:
                    return (
                        <Monthly
                            history={this.props.history}
                            state={this.state}
                            handleSelect={this.handleSelect}
                            handleChange={this.handleChange}
                            handleDate={this.handleDate}
                            handleSelect={this.handleSelect}
                            setState={value => this.setState(value)}
                        />
                    );
                case 1:
                    return <Scholarship state={this.state} handleSelect={this.handleSelect} />;
                case 2:
                    return this.renderOnetime();
                default:
                    break;
            }
        } else {
            return <UnSelected state={this.state} handleSelect={this.handleSelect} />;
        }
    };

    // Tek Ödeme ve Özet Taksit Ödeme Durumu
    renderOnetimeSummary = () => {
        const { pastData } = this.state;
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
        const { pastData } = this.state;
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
        const { pastData } = this.state;
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
        const { to, value } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenciler &mdash; Ödeme Al</h1>
                    <div className="col" />
                    <div className="col-auto px-0">
                        {<Tabs match={match} to={to} tabTitle={value => this.setState({ tab: value })} />}
                    </div>
                </div>

                <form className="row" onSubmit={this.handleSubmit}>
                    {value ? this.renderForPaymentType() : this.renderLoading()}
                </form>
            </div>
        );
    }
}

export default withRouter(Payment);
