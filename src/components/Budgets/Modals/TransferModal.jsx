import React, { Component } from "react";
import Inputmask from "inputmask";
import { TransferBudget } from "../../../services/Budget";
import { selectCustomStyles, formValid, selectCustomStylesError } from "../../../assets/js/core";
import Select, { components } from "react-select";
import { GetBudgets } from "../../../services/FillSelect";
import { clearMoney } from "../../../services/Others";
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

const { Option } = components;
const BudgetIconOption = props => (
    <Option {...props}>
        <span>
            <i
                className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
                style={{ backgroundImage: `url(${props.data.image})` }}
            />
            {props.data.label}
            <div className="small text-muted">
                Bütçe: <b>{props.data.balance.format(2, 3, ".", ",") + " ₺"}</b>
            </div>
        </span>
    </Option>
);

export class TransferModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            amount: null,
            from_budget: null,
            to_budget: null,
            select: {
                budgets: null
            },
            formErrors: {
                note: "",
                from_budget: "",
                to_budget: ""
            },
            loadingButton: ""
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                amount: $("[name=amount]")
            };
            Inputmask({
                alias: "try",
                ...InputmaskDefaultOptions
            }).mask(elemArray.amount);
        } catch (e) {}
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    componentDidMount() {
        this.fieldMasked();
        this.listBudgets();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { uid, amount, note, from_budget, to_budget } = this.state;

        if (formValid(this.state)) {
            this.setState({ loadingButton: "btn-loading" });
            TransferBudget({
                uid: uid,
                from_budget_id: from_budget.value,
                to_budget_id: to_budget.value,
                amount: clearMoney(amount),
                note: note
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) setTimeout(() => this.reload(), 750);
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    from_budget: from_budget ? false : true,
                    to_budget: to_budget ? false : true,
                    amount: amount ? "" : "is-invalid"
                }
            }));
        }
    };

    handleChange = e => {
        const { name, value } = e.target;

        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: value ? (value === "0,00" ? "is-invalid" : "") : "is-invalid"
            },
            [name]: value === "0,00" ? null : value
        }));
    };

    handleSelect = (value, name) => {
        if (name === "from_budget") {
            this.setState({ to_budget: null });
        }
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: value ? false : true
            },
            [name]: value
        }));
    };

    listBudgets = () => {
        try {
            console.log(this.props.bid);
            GetBudgets().then(response => {
                if (response) {
                    this.setState(prevState => ({
                        select: {
                            // object that we want to update
                            ...prevState.select, // keep all other key-value pairs
                            budgets: response // update the value of specific key
                        },
                        from_budget: response.find(x => x.value === parseInt(this.props.bid))
                    }));
                }
            });
        } catch (e) {}
    };

    render() {
        const { select, from_budget, to_budget, formErrors, loadingButton } = this.state;
        return (
            <div>
                <div className="modal fade" id="transferModal" tabIndex="-1" role="dialog">
                    <form className="modal-dialog" role="document" onSubmit={this.handleSubmit}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    <i className="fa fa-exchange-alt mr-2 text-azure" />
                                    Kasa/Banka &mdash; Hesaplar Arası Transfer
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group col-12">
                                        <label className="form-label">
                                            Gönderen Hesap <span className="form-required">*</span>
                                        </label>
                                        <Select
                                            value={from_budget}
                                            onChange={val => this.handleSelect(val, "from_budget")}
                                            options={select.budgets}
                                            name="from_budget"
                                            placeholder="Kasa/Banka Seç..."
                                            styles={
                                                formErrors.from_budget ? selectCustomStylesError : selectCustomStyles
                                            }
                                            isSearchable={true}
                                            isDisabled={select.budgets ? false : true}
                                            isLoading={select.budgets ? false : true}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            components={{ Option: BudgetIconOption }}
                                            autoSize
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label className="form-label">
                                            Alıcı Hesap <span className="form-required">*</span>
                                        </label>
                                        <Select
                                            value={to_budget}
                                            onChange={val => this.handleSelect(val, "to_budget")}
                                            options={
                                                from_budget
                                                    ? select.budgets.filter(x => x.value !== from_budget.value)
                                                    : select.budgets
                                            }
                                            name="to_budget"
                                            placeholder="Kasa/Banka Seç..."
                                            styles={formErrors.to_budget ? selectCustomStylesError : selectCustomStyles}
                                            isSearchable={true}
                                            isDisabled={select.budgets ? false : true}
                                            isLoading={select.budgets ? false : true}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            components={{ Option: BudgetIconOption }}
                                            autoSize
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label className="form-label">
                                            Aktarılacak Tutar <span className="form-required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formErrors.amount}`}
                                            name="amount"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label className="form-label">Not:</label>
                                        <textarea
                                            onChange={this.handleChange}
                                            className="form-control resize-none"
                                            name="note"
                                            placeholder="Not..."
                                            maxLength="100"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className={`btn btn-azure ${loadingButton}`}>
                                    Tamamla
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default TransferModal;
