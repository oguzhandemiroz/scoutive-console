import React, {Component} from "react";
import {ListPlayers} from "../../services/Player";
import {CreatePaymentFee} from "../../services/PlayerAction";
import {GetBudgets} from "../../services/FillSelect";
import {fullnameGenerator, getSelectValue} from "../../services/Others";
import {Toast, showSwal} from "../Alert";
import DatePicker, {registerLocale} from "react-datepicker";
import {withRouter} from "react-router-dom";
import Select, {components} from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import moment from "moment";
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

const formValid = ({formErrors, ...rest}) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

const customStyles = {
    control: styles => ({...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3})
};

const customStylesError = {
    control: styles => ({
        ...styles,
        borderColor: "#cd201f",
        borderRadius: 3,
        ":hover": {...styles[":hover"], borderColor: "#cd201f"}
    })
};

const {Option} = components;
const ImageOption = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{backgroundImage: `url(${props.data.image})`}} />
        {props.data.label}
    </Option>
);
const IconOption = props => (
    <Option {...props}>
        <span>
            <i
                className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
                style={{backgroundImage: `url(${props.data.image})`}}
            />
            {props.data.label}
            <div className="small text-muted">
                Bütçe: <b>{props.data.balance.format() + " ₺"}</b>
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
    payment_date: new Date(),
    fee: null,
    player: null,
    budget: null,
    payment_type: 0,
    loadingButton: ""
};

export class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            formErrors: {
                player: "",
                fee_date: "",
                payment_date: ""
            },
            loadingData: true,
            loadingPast: true,
            pastData: null,
            select: {
                employees: null,
                budgets: null
            }
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                fee: $("[name=fee]")
            };
            Inputmask({
                alias: "try",
                ...InputmaskDefaultOptions
            }).mask(elemArray.fee);
        } catch (e) {}
    };

    componentDidMount() {
        let select = {...this.state.select};
        this.fieldMasked();
        this.listPlayers(select);
        this.listBudgets(select);
    }

    handleSubmit = e => {
        try {
            e.preventDefault();
            const {uid, player, fee, payment_date, payment_type, budget} = this.state;
			let required = {...this.state};
			delete required.pastData
            if (formValid(required)) {
                this.setState({loadingButton: "btn-loading"});
                CreatePaymentFee({
                    uid: uid,
                    to: player.value,
                    amount: parseFloat(fee.replace(",", ".")),
                    payment_date: moment(payment_date).format("YYYY-MM-DD"),
                    payment_type: payment_type,
                    budget_id: budget.value
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
                    this.setState({loadingButton: ""});
                });
            } else {
                console.error("ERROR FORM");
                let formErrors = {...this.state.formErrors};
                formErrors.fee = fee ? "" : "is-invalid";
                formErrors.player = player ? "" : "is-invalid";
                formErrors.payment_date = payment_date ? "" : "is-invalid";
                formErrors.budget = budget ? false : true;
                this.setState({formErrors});
            }
        } catch (e) {}
    };

    handleChange = e => {
        try {
            const {name, value} = e.target;
            let formErrors = {...this.state.formErrors};
            switch (name) {
                case "fee":
                    formErrors.fee = value ? "" : "is-invalid";
                    break;
                default:
                    break;
            }
            if (name === "fee") {
                this.setState({[name]: value === "0,00" ? null : value});
            } else {
                this.setState({[name]: value});
            }

            this.setState({formErrors});
        } catch (e) {}
    };

    handleDate = (date, name) => {
        let formErrors = {...this.state.formErrors};
        switch (name) {
            case "payment_date":
                formErrors[name] = date ? "" : "is-invalid";
                break;
            default:
                break;
        }

        this.setState({formErrors, [name]: date});
    };

    handleSelect = (value, name) => {
        try {
            let formErrors = {...this.state.formErrors};
            formErrors[name] = value ? false : true;

            switch (name) {
                case "player":
                    {
                        this.setState({
                            ...initialState,
                            [name]: value,
                            fee: value.fee
                                ? value.fee
                                      .format()
                                      .toString()
                                      .split(".")
                                      .join("")
                                : null
                        });
                    }
                    break;
                default:
                    this.setState({
                        [name]: value
                    });
                    break;
            }
            this.setState({formErrors});
        } catch (e) {}
    };

    listPlayers = select => {
        try {
            const {uid} = this.state;
            const to = this.props.match.params.uid;
            this.setState({loadingData: true});
            ListPlayers(uid).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        const data = response.data;
                        const selectData = [];
                        data.map(el => {
                            selectData.push({
                                value: el.uid,
                                label: fullnameGenerator(el.name, el.surname),
                                image: el.image,
                                fee: el.fee
                            });
                        });
                        select.players = selectData;
                        const getFee = to ? getSelectValue(selectData, to, "value").fee : null;
                        this.setState({
                            select,
                            loadingData: false,
                            player: to ? getSelectValue(selectData, to, "value") : initialState.player,
                            fee: to
                                ? getFee
                                    ? getFee
                                          .format()
                                          .toString()
                                          .split(".")
                                          .join("")
                                    : null
                                : null
                        });
                    }
                }
            });
        } catch (e) {}
    };

    listBudgets = select => {
        try {
            GetBudgets().then(response => {
                console.log(response);
                select.budgets = response;
                this.setState({select});
            });
        } catch (e) {}
    };

    render() {
        const {
            fee,
            budget,
            payment_date,
            player,
            select,
            formErrors,
            pastData,
            loadingData,
            loadingPast,
            loadingButton
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenciler &mdash; Ödeme Al</h1>
                    <div className="col" />
                    <div className="col-auto px-0" />
                </div>

                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-7 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fa fa-hand-holding-usd mr-2" /> Ödeme Al
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loadingData ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row mb-4">
                                            <div className="col-auto">
                                                <span
                                                    className="avatar avatar-xxl"
                                                    style={{
                                                        backgroundImage: `url(${
                                                            player ? player.image : null
                                                        })`
                                                    }}
                                                />
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
                                                        styles={
                                                            formErrors.player === true
                                                                ? customStylesError
                                                                : customStyles
                                                        }
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        autoSize
                                                        isDisabled={select.players ? false : true}
                                                        noOptionsMessage={value =>
                                                            `"${value.inputValue}" bulunamadı`
                                                        }
                                                        components={{Option: ImageOption}}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`dimmer ${player ? "" : "active"}`}>
                                            <div className="dimmer-content">
                                                <div className="form-group">
                                                    <label className="form-label">Aidat Bilgisi</label>
                                                    <div className="form-control-plaintext">
                                                        {player
                                                            ? player.fee
                                                                ? player.fee.format() + " ₺"
                                                                : "—"
                                                            : "—"}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Ödenen Tutar
                                                        <span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        name="fee"
                                                        className={`form-control ${formErrors.fee}`}
                                                        type="text"
                                                        value={fee || ""}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="form-group col-6">
                                                        <label className="form-label">
                                                            Ödenen Tarih
                                                            <span className="form-required">*</span>
                                                        </label>
                                                        <DatePicker
                                                            selected={payment_date}
                                                            selectsStart
                                                            startDate={payment_date}
                                                            name="payment_date"
                                                            locale="tr"
                                                            dateFormat="dd/MM/yyyy"
                                                            onChange={date =>
                                                                this.handleDate(date, "payment_date")
                                                            }
                                                            className={`form-control ${formErrors.payment_date}`}
                                                        />
                                                    </div>
                                                    <div className="form-group col-6">
                                                        <label className="form-label">
                                                            Kasa Hesabı{" "}
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
                                                                    ? customStylesError
                                                                    : customStyles
                                                            }
                                                            isClearable={true}
                                                            isSearchable={true}
                                                            autoSize
                                                            isDisabled={select.budgets ? false : true}
                                                            noOptionsMessage={value =>
                                                                `"${value.inputValue}" bulunamadı`
                                                            }
                                                            components={{Option: IconOption}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-right">
                                <button
                                    className={`btn btn-success ${loadingButton} ${
                                        player ? "" : "disabled disable-overlay"
                                    }`}>
                                    Ödeme Al
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header pr-3">
                                <h3 className="card-title">
                                    <i className="fa fa-history mr-2" /> Geçmiş İşlemler
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loadingPast ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        {pastData ? (
                                            pastData.length > 0 ? (
                                                <ul className="timeline mb-0">
                                                    {pastData.map((el, key) => {})}
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
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(Payment);
