import React, { Component } from "react";
import { Banks } from "../../services/FillSelect";
import { CreateBudget } from "../../services/Budget";
import Select, { components } from "react-select";
import { Link, withRouter } from "react-router-dom";
import Inputmask from "inputmask";
import { formValid, selectCustomStyles, selectCustomStylesError } from "../../assets/js/core";
import { spaceTrim, clearMoney } from "../../services/Others";
const $ = require("jquery");

const currencies = [
    {
        value: "TRY",
        label: "Türk Lirasi",
        icon: "lira-sign",
        sign: "₺"
    },
    {
        value: "USD",
        label: "Amerikan Doları",
        icon: "dollar-sign",
        sign: "$"
    },
    {
        value: "EUR",
        label: "Euro",
        icon: "euro-sign",
        sign: "€"
    },
    {
        value: "GBP",
        label: "İngiliz Sterlini",
        icon: "pound-sign",
        sign: "£"
    }
];

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
const IconOption = props => (
    <Option {...props}>
        <span>
            <i className={`mr-3 fa fa-${props.data.icon}`} />
            {props.data.label}
        </span>
    </Option>
);

const initialState = {
    bank: null,
    bank_branch: null,
    bank_account_number: null,
    iban: null
};

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            budget_name: null,
            budget_type: 0,
            balance: "0",
            currency: null,
            note: null,
            formErrors: {
                budget_name: "",
                currency: "",
                bank: ""
            },
            select: {
                banks: null,
                currencies: currencies
            },
            loadingButton: ""
        };
    }

    fieldMasked = () => {
        Inputmask({ alias: "try", ...InputmaskDefaultOptions, suffix: "" }).mask($("[name=balance]"));
    };

    componentDidMount() {
        this.fieldMasked();
        let select = { ...this.state.select };
        Banks().then(response => {
            select.banks = response;
            this.setState({ select });
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            uid,
            budget_name,
            budget_type,
            balance,
            currency,
            bank,
            bank_branch,
            bank_account_number,
            iban,
            note,
            formErrors
        } = this.state;
        const requiredData = {};

        requiredData.budget_name = budget_name;
        requiredData.currency = currency;
        if (budget_type) requiredData.bank = bank;
        requiredData.formErrors = formErrors;

        if (formValid(requiredData)) {
            this.setState({ loadingButton: "btn-loading" });
            CreateBudget({
                uid: uid,
                budget_name: spaceTrim(budget_name),
                budget_type: budget_type,
                currency: currency.value,
                balance: clearMoney(balance),
                note: note,
                bank_id: bank ? parseInt(bank.value) : null,
                bank_branch: bank_branch,
                bank_account_number: bank_account_number,
                iban: iban
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1021) {
                        this.props.history.push("/app/budgets");
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            let formErrors = { ...this.state.formErrors };
            formErrors.budget_name = spaceTrim(budget_name) && budget_name.length <= 30 ? "" : "is-invalid";
            formErrors.currency = currency ? false : true;
            if (budget_type) formErrors.bank = bank ? false : true;
            this.setState({ formErrors });
        }
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "budget_name":
                formErrors.budget_name = spaceTrim(value) && value.length <= 30 ? "" : "is-invalid";
                break;
            case "currency":
                formErrors.currency = value ? "" : "is-invalid";
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: value });
    };

    handleSelect = (value, name) => {
        let formErrors = { ...this.state.formErrors };
        formErrors[name] = value ? false : true;

        this.setState({ formErrors, [name]: value });
    };

    handleRadio = e => {
        const { value, name } = e.target;
        if (parseInt(value)) {
            setTimeout(
                () =>
                    Inputmask({
                        mask: "AA99 9999 9999 9999 9999 99",
                        ...InputmaskDefaultOptions,
                        placeholder: ""
                    }).mask($("[name=iban]")),
                100
            );
        }
        this.setState({ [name]: parseInt(value), ...initialState });
    };

    render() {
        const { bank, currency, budget_type, select, formErrors, loadingButton } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Kasa ve Bankalar</h1>
                </div>
                <div className="row">
                    <div className="col">
                        <form className="card" onSubmit={this.handleSubmit}>
                            <div className="card-header">
                                <h3 className="card-title">Yeni Oluştur</h3>
                            </div>

                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">
                                        Hesap Adı <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.budget_name}`}
                                        onChange={this.handleChange}
                                        name="budget_name"
                                        maxLength="30"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Hesap Türü <span className="form-required">*</span>
                                    </label>
                                    <div className="selectgroup w-100">
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="budget_type"
                                                value="0"
                                                checked={!budget_type ? true : false}
                                                onChange={this.handleRadio}
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Kasa</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="radio"
                                                name="budget_type"
                                                value="1"
                                                checked={budget_type ? true : false}
                                                onChange={this.handleRadio}
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Banka</span>
                                        </label>
                                    </div>
                                </div>

                                {budget_type ? (
                                    <div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Banka<span className="form-required">*</span>
                                                <Select
                                                    value={bank}
                                                    onChange={val => this.handleSelect(val, "bank")}
                                                    options={select.banks}
                                                    name="bank"
                                                    placeholder="Banka Seç..."
                                                    styles={
                                                        formErrors.bank === true
                                                            ? selectCustomStylesError
                                                            : selectCustomStyles
                                                    }
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    autoSize
                                                    isDisabled={select.banks ? false : true}
                                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                />
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Banka Şubesi</label>
                                            <input
                                                type="text"
                                                name="bank_branch"
                                                className="form-control"
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Hesap Numarası</label>
                                            <input
                                                type="text"
                                                name="bank_account_number"
                                                className="form-control"
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">IBAN</label>
                                            <input
                                                type="text"
                                                name="iban"
                                                className="form-control"
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                <div className="form-group">
                                    <label className="form-label">
                                        Para Birimi<span className="form-required">*</span>
                                        <Select
                                            value={currency}
                                            onChange={val => this.handleSelect(val, "currency")}
                                            options={select.currencies}
                                            name="currency"
                                            placeholder="Para Birimi Seç..."
                                            styles={
                                                formErrors.currency === true
                                                    ? selectCustomStylesError
                                                    : selectCustomStyles
                                            }
                                            isClearable={true}
                                            isSearchable={true}
                                            autoSize
                                            isDisabled={select.currencies ? false : true}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            components={{ Option: IconOption }}
                                        />
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Açılış Bakiyesi</label>
                                    <input
                                        type="text"
                                        name="balance"
                                        className="form-control"
                                        onChange={this.handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Not</label>
                                    <textarea
                                        className="form-control"
                                        name="note"
                                        onChange={this.handleChange}
                                        rows="1"
                                        onChange={this.handleChange}
                                        maxLength="255"
                                        placeholder="Not.."></textarea>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <Link to="/app/budgets" className="btn btn-link">
                                    İptal
                                </Link>
                                <button className={`btn btn-primary ${loadingButton}`}>Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Add);
