import React, { Component } from "react";
import { ListPlayers } from "../../services/Player";
import Tabs from "./PaymentTabs";
import { CreatePaymentFee, ListFees } from "../../services/PlayerAction";
import { GetBudgets } from "../../services/FillSelect";
import { fullnameGenerator, formatMoney, clearMoney } from "../../services/Others";
import { Toast, showSwal } from "../Alert";
import { withRouter } from "react-router-dom";
import { formValid } from "../../assets/js/core";
import moment from "moment";
import _ from "lodash";
import Inputmask from "inputmask";
import { GetSettings } from "../../services/School";
import Scholarship from "./Payment/Scholarship";
import UnSelected from "./Payment/UnSelected";
import Monthly from "./Payment/Monthly";
import OneTime from "./Payment/OneTime";
const $ = require("jquery");

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

const initialState = {
    fee_date: new Date(),
    paid_date: new Date(),
    month: { label: moment().format("MMMM"), value: moment().format("M") },
    payment_type: 0,
    period: 1,
    loadingButton: ""
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

    feePaymentAlert = () => {
        try {
            const { label, amount } = this.state;
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
                    return (
                        <OneTime
                            state={this.state}
                            handleSelect={this.handleSelect}
                            listPastPayment={this.listPastPayment}
                            setState={value => this.setState(value)}
                        />
                    );
                default:
                    break;
            }
        } else {
            return <UnSelected state={this.state} handleSelect={this.handleSelect} />;
        }
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
