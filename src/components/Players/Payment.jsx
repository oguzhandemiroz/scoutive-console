import React, { Component } from "react";
import { ListPlayers } from "../../services/Player";
import Tabs from "./PaymentTabs";
import { CreatePaymentFee, UpdatePaymentFee, ListFees } from "../../services/PlayerAction";
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

const noRow = loading =>
    loading ? (
        <div className={`dimmer active p-3`}>
            <div className="loader" />
            <div className="dimmer-content" />
        </div>
    ) : (
        <div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
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
        this.generateMonthList();
        this.listPlayers();
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
                necessary_fee,
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
                            fee: clearMoney(fee),
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
            const to = this.props.match.params.uid;
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
                                required_payment_date: el.start_date,
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
                            ...thisplayer[0],
                            necessary_fee: to ? thisplayer[0].fee : null
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

    formatPaidDate = date => {
        try {
            const splitDate = date.split(",");
            const firstDate = moment(splitDate[0]);
            const secondDate = moment(splitDate[1]);
            const diff = Math.ceil(moment(secondDate).diff(moment(firstDate), "days", true));

            return `${firstDate.format("MMMM")} ${firstDate.format("YYYY")} - ${secondDate.format(
                "MMMM"
            )} ${secondDate.format("YYYY")} (${diff} günlük)`;
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

    feePaymentAlert = () => {
        try {
            const { label, fee } = this.state;
            return showSwal({
                type: "warning",
                title: "Uyarı",
                html: `Aidat ödemesi yapmadan önce <b>Geçmiş İşlemler</b>'i kontrol et. 
					Tamamlanmamış ödeme var ise yeni bir ödeme <u>alınmayacaktır.</u> Ödemeleri tamamladıktan sonra devam edebilirsin.
					<hr>
					<b>${label}</b> adlı öğrencinin <b>${formatMoney(fee)}</b> ödemesi alınacaktır.`,
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

    // Aylık Ödeme Tipi
    renderMonthly = () => {
        const {
            fee,
            budget,
            paid_date,
            player,
            month,
            period,
            select,
            formErrors,
            loadingButton,
            editfee,
            tab,
            amount,
            image,
            name,
            surname,
            start_date,
            required_payment_date
        } = this.state;
        return (
            <>
                <div className="col-lg-7 col-sm-12 col-md-12">
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
                                        {avatarPlaceholder(name, surname)}
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
                                            isLoading={select.players ? false : true}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            components={{ Option: ImageOption }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-4">
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
                                                        this.setState({
                                                            editfee: false,
                                                            amount: clearMoney(fee) * parseInt(period)
                                                        });
                                                    }}>
                                                    Kaydet
                                                </button>
                                            </span>
                                        </div>
                                        <div className={`form-control-plaintext ${editfee ? "d-none" : "d-block"}`}>
                                            {formatMoney(fee) + " — " + paymentTypeText[0]}
                                            <span
                                                onClick={() => {
                                                    this.setState({ editfee: true });
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

                                <div className="col-sm-12 col-md-12 col-lg-4">
                                    <div className="form-group">
                                        <label className="form-label">Okula Başlama Tarihi</label>
                                        <div className="form-control-plaintext">{formatDate(start_date, "LL")}</div>
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-12 col-lg-4">
                                    <div className="form-group">
                                        <label className="form-label">Aidat Ödeme Günü</label>

                                        <div className="form-control-plaintext">
                                            {"Her ayın " + moment(required_payment_date).format("D") + ". günü"}
                                        </div>
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

                                <div className="col-10">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Ödeme Yapılacak Ay
                                            <span className="form-required">*</span>
                                        </label>
                                        <Select
                                            value={month}
                                            onChange={val => this.handleSelect(val, "month")}
                                            options={select.months}
                                            name="month"
                                            placeholder="Ay Seç..."
                                            styles={selectCustomStyles}
                                            isSearchable={true}
                                            autoSize
                                            isDisabled={select.months ? false : true}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        />
                                    </div>
                                </div>

                                <div className="col-2">
                                    <div className="form-group">
                                        <label className="form-label">Dönem</label>
                                        <input
                                            name="period"
                                            className="form-control"
                                            type="number"
                                            min="1"
                                            max="24"
                                            value={period || ""}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="alert alert-warning p-3">
                                        <strong className="mr-1">Ödemesi Gereken Tutar:</strong>
                                        {period + " ay için, "}
                                        <strong>{formatMoney(clearMoney(fee) * parseInt(period))}</strong>
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Ödenen Tutar
                                            <span className="form-required">*</span>
                                        </label>
                                        <input
                                            name="amount"
                                            className="form-control"
                                            type="text"
                                            value={formatMoney(amount) || ""}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-sm-12 col-md-12 col-lg-6">
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

                                <div className="col-sm-12 col-md-12 col-lg-6">
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
                                            styles={
                                                formErrors.budget === true
                                                    ? selectCustomStylesError
                                                    : selectCustomStyles
                                            }
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
                {this.renderMonthlyPast()}
            </>
        );
    };

    // Burslu Öğrenci
    renderScholarship = () => {
        const { player, select, tab, image, name, surname } = this.state;
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
                                    {avatarPlaceholder(name, surname)}
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
                                <div className="alert alert-icon alert-warning mb-0" role="alert">
                                    <i className="fa fa-graduation-cap mr-2" aria-hidden="true"></i>
                                    <strong className="d-block">Burslu öğrenci seçtiniz!</strong>
                                    Burslu öğrenciler aidat ödemelerinden muaf tutulur.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Tek Ödeme Ödeme Tipi
    renderOnetime = () => {
        const { player, select, tab, image, name, surname } = this.state;
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
                                    {avatarPlaceholder(name, surname)}
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
                            {this.renderOnetimeSummary()}
                            {this.renderOnetimeFinalSituation()}
                        </div>
                        {this.renderOnetimeInstallmentPlan()}
                    </div>
                </div>
            </div>
        );
    };

    // Öğrenci Seç Ekranı
    renderSelectPlayer = () => {
        const { player, select, tab } = this.state;
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
                                        isLoading={select.players ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        components={{ Option: ImageOption }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-icon alert-danger mb-0" role="alert">
                            <i className="fa fa-user-check mr-2" aria-hidden="true"></i>
                            <strong className="d-block">Öğrenci Seç!</strong>
                            İşlem yapabilmek için bir öğrenci seç...
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Yüklenme Ekranı
    renderLoading = () => {
        const { tab } = this.state;
        const { match } = this.props;
        if (!match.params.uid) return this.renderSelectPlayer();
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
                    return this.renderMonthly();
                case 1:
                    return this.renderScholarship();
                case 2:
                    return this.renderOnetime();
                default:
                    break;
            }
        } else {
            return this.renderSelectPlayer();
        }
    };

    // Aylık Ödeme Tipi Geçmiş İşlemler
    renderMonthlyPast = () => {
        const { pastData } = this.state;
        return (
            <div className="col-lg-5 col-sm-12 col-md-12">
                <div className="card">
                    <div className="card-header pr-3">
                        <h3 className="card-title">
                            <i className="fa fa-history mr-2" /> Geçmiş İşlemler
                        </h3>
                    </div>
                    <div className="card-body">
                        {pastData ? (
                            pastData.length > 0 ? (
                                <ul className="timeline mb-0">
                                    {pastData.map(el => {
                                        if (el.fee > el.amount) {
                                            return (
                                                <li className="timeline-item" key={el.fee_id.toString()}>
                                                    <div className="timeline-badge bg-warning" />
                                                    <div>
                                                        <strong>{formatMoney(el.fee)}</strong>
                                                        &nbsp;ödemenin, <br />
                                                        <strong className="text-blue">{formatMoney(el.amount)}</strong>
                                                        &nbsp;ödemesi yapıldı.
                                                        <br />
                                                        <strong className="text-red">
                                                            {formatMoney(el.fee - el.amount)}
                                                        </strong>
                                                        &nbsp;borcu kaldı.
                                                        <div className="small text-muted">
                                                            {this.formatPaidDate(el.month)}
                                                        </div>
                                                    </div>
                                                    <div className="timeline-time">
                                                        <i
                                                            onClick={() => this.completeFee(el)}
                                                            data-toggle="tooltip"
                                                            data-title="Ödemeyi Tamamla"
                                                            className="fa fa-plus-circle text-primary cursor-pointer product-price"></i>
                                                        <i
                                                            onClick={() => console.log("iptal")}
                                                            data-toggle="tooltip"
                                                            data-title="Ödemeyi İptal Et"
                                                            className="fa fa-times-circle text-danger ml-1 cursor-pointer product-price"></i>
                                                    </div>
                                                </li>
                                            );
                                        } else {
                                            return (
                                                <li className="timeline-item" key={el.fee_id.toString()}>
                                                    <div className="timeline-badge bg-success" />
                                                    <div>
                                                        <strong>{formatMoney(el.amount)}</strong>
                                                        &nbsp;ödendi
                                                        <div className="small text-muted">
                                                            {this.formatPaidDate(el.month)}
                                                        </div>
                                                    </div>
                                                    <div className="timeline-time">
                                                        <i
                                                            data-toggle="tooltip"
                                                            data-title="Ödeme Başarılı"
                                                            className="fa fa-check-circle text-success product-price"></i>
                                                        <i
                                                            onClick={() => console.log("iptal")}
                                                            data-toggle="tooltip"
                                                            data-title="Ödemeyi İptal Et"
                                                            className="fa fa-times-circle text-danger ml-1 cursor-pointer product-price"></i>
                                                    </div>
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            ) : (
                                noRow()
                            )
                        ) : (
                            noRow(true)
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Tek Ödeme ve Özet Taksit Ödeme Durumu
    renderOnetimeSummary = () => {
        const { pastData } = this.state;
        return (
            <div className="col-lg-8 col-md-6 col-sm-12">
                <div className="form-group">
                    <label className="form-label">Özet Taksit Ödeme Durumu</label>
                    <div className="installment-detail d-flex flex-row">
                        {pastData ? (
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
                                    else if (fee_type === 2 && fee === amount) tag_color = "tag-success";
                                    else if (amount !== 0) tag_color = "tag-warning";

                                    return (
                                        <span key={fee_id.toString()} className={"tag " + tag_color}>
                                            {type_text}
                                        </span>
                                    );
                                })
                        ) : (
                            <span className="tag" />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Tek Ödeme ve Son Durum
    renderOnetimeFinalSituation = () => {
        const { pastData } = this.state;
        return (
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="form-group">
                    <label className="form-label">Son Durum</label>
                    {pastData ? (
                        <>
                            <div className="text-body">
                                <span className="status-icon bg-success" />
                                Şimdiye kadar <strong>{formatMoney(_.sumBy(pastData, "amount"))}</strong> ödeme
                                yapılmıştır.
                            </div>
                            <div className="text-body">
                                <span className="status-icon bg-gray-lighter" />
                                Gelecek taksit tarihi &mdash;{" "}
                                <strong>
                                    {formatDate(
                                        pastData
                                            .filter(x => x.amount === 0)
                                            .sort((a, b) =>
                                                a.required_payment_date.localeCompare(b.required_payment_date)
                                            )[0].required_payment_date,
                                        "LL"
                                    )}
                                </strong>
                            </div>
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
                                <div className="col-lg-3">
                                    <div className="card card-hover hover-primary">
                                        <div className="card-status bg-primary"></div>
                                        <div className="card-body text-center">
                                            <div className="card-category text-muted">Peşinat Ödemesi</div>
                                            <div className="form-group">
                                                <label className="form-label">Tutar</label>
                                                <div className="form-control-plaintext p-0">500,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödenen Tutar</label>
                                                <div className="form-control-plaintext p-0">500,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödeme Tarihi</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Kapsadığı Ay</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                        </div>
                                        <div className="ribbon ribbon-left ribbon-bottom">
                                            <i className="fa fa-check" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="card card-hover hover-success">
                                        <div className="card-status bg-success"></div>
                                        <div className="card-body text-center">
                                            <div className="card-category text-muted">1. Taksit Ödemesi</div>
                                            <div className="form-group">
                                                <label className="form-label">Tutar</label>
                                                <div className="form-control-plaintext p-0">500,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödenen Tutar</label>
                                                <div className="form-control-plaintext p-0">500,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödeme Tarihi</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Kapsadığı Ay</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                        </div>
                                        <div className="ribbon bg-green ribbon-left ribbon-bottom">
                                            <i className="fa fa-check" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="card card-hover hover-warning">
                                        <div className="card-status bg-warning"></div>
                                        <div className="card-body text-center">
                                            <div className="card-category text-muted">2. Taksit Ödemesi</div>
                                            <div className="form-group">
                                                <label className="form-label">Tutar</label>
                                                <div className="form-control-plaintext p-0">500,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödenen Tutar</label>
                                                <div className="form-control-plaintext p-0">150,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödeme Tarihi</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Kapsadığı Ay</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                        </div>
                                        <div className="ribbon bg-green ribbon-left ribbon-bottom">Ödeme Al</div>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="card card-hover">
                                        <div className="card-status bg-gray-lighter"></div>
                                        <div className="card-body text-center">
                                            <div className="card-category text-muted">3. Taksit Ödemesi</div>
                                            <div className="form-group">
                                                <label className="form-label">Tutar</label>
                                                <div className="form-control-plaintext p-0">500,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödenen Tutar</label>
                                                <div className="form-control-plaintext p-0">0,00₺</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Ödeme Tarihi</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Kapsadığı Ay</label>
                                                <div className="form-control-plaintext p-0">29/12/2019</div>
                                            </div>
                                        </div>
                                        <div className="ribbon bg-green ribbon-left ribbon-bottom">Ödeme Al</div>
                                    </div>
                                </div>
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
