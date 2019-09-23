import React, { Component } from "react";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { CreateAdvancePayment, ListAdvancePayments } from "../../services/EmployeeAction";
import { GetBudgets } from "../../services/FillSelect";
import { Toast } from "../Alert";
import Select, { components } from "react-select";
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

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

const noRow = loading => (
    <tr style={{ height: 80 }}>
        <td colSpan="5" className="text-center text-muted font-italic">
            {loading ? (
                <div className={`dimmer active`}>
                    <div className="loader" />
                    <div className="dimmer-content" />
                </div>
            ) : (
                "Kayıt bulunamadı..."
            )}
        </td>
    </tr>
);

const customStyles = {
    control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

const customStylesError = {
    control: styles => ({
        ...styles,
        borderColor: "#cd201f",
        borderRadius: 3,
        ":hover": { ...styles[":hover"], borderColor: "#cd201f" }
    })
};

const { Option } = components;
const IconOption = props => (
    <Option {...props}>
        <span>
            <i
                className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
                style={{ backgroundImage: `url(${props.data.image})` }}
            />
            {props.data.label}
            <div className="small text-muted">
                Bütçe: <b>{props.data.balance.format() + " ₺"}</b>
            </div>
        </span>
    </Option>
);

const initialState = {
    amount: null,
    startDate: new Date(),
    note: null,
    budget: null
};

export class AdvancePayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            data: {},
            formErrors: {
                startDate: "",
                amount: ""
            },
            select: {
                budgets: null
            },
            list: [],
            loadingData: false,
            loadingButton: ""
        };
    }

    componentDidMount() {
        let select = { ...this.state.select };
        this.listBudgets(select);

        if (document.querySelectorAll("#advance-payment-past-tab.active").length > 0)
            this.renderAdvancePaymentList(this.props.data.uid);

        this.fieldMasked();
        this.setState({ ...this.props });
    }

    componentWillReceiveProps(nextProps) {
        let select = { ...this.state.select };
        this.listBudgets(select);

        if (document.querySelectorAll("#advance-payment-past-tab.active").length > 0)
            this.renderAdvancePaymentList(nextProps.data.uid);

        this.fieldMasked();
        this.setState({ ...nextProps, ...initialState });
    }

    listBudgets = select => {
        try {
            GetBudgets().then(response => {
                try {
                    select.budgets = response;
                    if (response.length > 0) {
                        this.setState({ budget: response.find(x => x.default === 1) });
                    }
                    this.setState({ select });
                } catch (e) {}
            });
        } catch (e) {}
    };

    handleSubmit = e => {
        e.preventDefault();
        const { uid, amount, budget, startDate, data, note, formErrors } = this.state;
        const requiredData = {};
        requiredData.amount = amount;
        requiredData.startDate = startDate;
        requiredData.budget = budget ? budget.value : null;
        requiredData.formErrors = formErrors;

        if (formValid(requiredData)) {
            this.setState({ loadingButton: "btn-loading" });
            CreateAdvancePayment({
                uid: uid,
                to: data.uid,
                amount: parseFloat(amount.replace(",", ".")),
                advance_date: moment(startDate).format("YYYY-MM-DD"),
                note: note,
                budget_id: budget.value
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        Toast.fire({
                            type: "success",
                            title: "İşlem Başarılı..."
                        });
                        setTimeout(() => this.reload(), 1000);
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            console.error("ERROR FORM");
            let formErrors = { ...this.state.formErrors };
            formErrors.amount = amount ? "" : "is-invalid";
            formErrors.budget = budget ? false : true;
            this.setState({ formErrors });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "amount":
                formErrors.amount = value ? "" : "is-invalid";
                break;
            default:
                break;
        }

        if (name === "amount") {
            this.setState({ [name]: value === "0,00" ? null : value });
        } else {
            this.setState({ [name]: value });
        }

        this.setState({ formErrors });
    };

    handleDate = (date, name) => {
        let formErrors = { ...this.state.formErrors };

        formErrors.startDate = date ? "" : "is-invalid";

        this.setState({ formErrors, [name]: date });
    };

    handleSelect = (value, name) => {
        try {
            let formErrors = { ...this.state.formErrors };
            formErrors[name] = value ? false : true;
            console.log(value, name);
            this.setState({ formErrors, [name]: value });
        } catch (e) {}
    };

    renderAdvancePaymentList = to => {
        try {
            const { uid } = this.state;
            this.setState({ loadingData: true });
            ListAdvancePayments({
                uid: uid,
                to: to
            }).then(response => {
                console.log(response);
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) this.setState({ list: response.data });
                }

                this.setState({ loadingData: false });
            });
        } catch (e) {}
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    fieldMasked = () => {
        try {
            console.log("e");
            const elemArray = {
                amount: $("[name=amount]")
            };
            Inputmask({
                alias: "try",
                ...InputmaskDefaultOptions
            }).mask(elemArray.amount);
        } catch (e) {}
    };

    render() {
        const { select, budget, startDate, amount, note, loadingButton, list, data, formErrors } = this.state;
        return (
            <div
                className="modal fade employeeActionModal"
                id="advancePaymentModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <nav className="employeeActionNav">
                                <div className="nav nav-tabs" role="tablist">
                                    <a
                                        className="nav-item nav-link active"
                                        id="advance-payment-create-tab"
                                        data-toggle="tab"
                                        href="#advance-payment-create"
                                        role="tab"
                                        aria-controls="nav-home"
                                        aria-selected="true">
                                        <i className="fa fa-hand-holding-usd mr-2" /> Avans Ver
                                    </a>
                                    <a
                                        onClick={() => this.renderAdvancePaymentList(this.props.data.uid)}
                                        className="nav-item nav-link"
                                        id="advance-payment-past-tab"
                                        data-toggle="tab"
                                        href="#advance-payment-past"
                                        role="tab"
                                        aria-controls="nav-profile"
                                        aria-selected="false">
                                        <i className="fa fa-list-ul mr-2" />
                                        Verilen Avanslar
                                    </a>
                                </div>
                            </nav>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="tab-content" id="nav-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="advance-payment-create"
                                role="tabpanel"
                                aria-labelledby="advance-payment-create-tab">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label className="form-label">Personel Bilgisi:</label>
                                            <div className="form-control-plaintext">
                                                <Link to={`/app/employees/detail/${data.uid}`}>{data.name}</Link>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Avans Verilen Tarih
                                                <span className="form-required">*</span>
                                            </label>

                                            <DatePicker
                                                autoComplete="off"
                                                selected={startDate}
                                                selectsStart
                                                startDate={startDate}
                                                name="startDate"
                                                locale="tr"
                                                dateFormat="dd/MM/yyyy"
                                                onChange={date => this.handleDate(date, "startDate")}
                                                className={`form-control ${formErrors.startDate}`}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Avans Tutarı
                                                <span className="form-required">*</span>
                                            </label>
                                            <input
                                                name="amount"
                                                className={`form-control ${formErrors.amount}`}
                                                type="text"
                                                value={amount || ""}
                                                onChange={this.handleChange}
                                            />
                                        </div>

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
                                                styles={formErrors.budget === true ? customStylesError : customStyles}
                                                isClearable={true}
                                                isSearchable={true}
                                                autoSize
                                                isDisabled={select.budgets ? false : true}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                                components={{ Option: IconOption }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Not
                                                <span className="form-label-small">{note ? note.length : 0}/255</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="note"
                                                onChange={this.handleChange}
                                                rows="1"
                                                maxLength="255"
                                                placeholder="Not.."></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer text-right">
                                        <button type="submit" className={`ml-auto btn btn-success ${loadingButton}`}>
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="advance-payment-past"
                                role="tabpanel"
                                aria-labelledby="advance-payment-past-tab">
                                <div className="modal-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-outline table-vcenter card-table">
                                            <thead>
                                                <tr>
                                                    <th className="w-1 px-3"></th>
                                                    <th className="w-1">Avans Tarihi</th>
                                                    <th className="w-1">Tutar</th>
                                                    <th className="w-1">Durum</th>
                                                    <th className="w-1 pr-3">Not</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.length > 0
                                                    ? list.map((el, key) => {
                                                          return (
                                                              <tr key={key.toString()}>
                                                                  <td className="text-muted px-3">#{key + 1}</td>
                                                                  <td>
                                                                      {moment(el.advance_date).format("DD/MM/YYYY")}
                                                                  </td>
                                                                  <td>{el.amount.format()} ₺</td>
                                                                  <td>
                                                                      <span
                                                                          className={`badge badge-${
                                                                              el.paid_amount >= el.amount
                                                                                  ? "success"
                                                                                  : "default"
                                                                          }`}>
                                                                          {el.paid_amount >= el.amount
                                                                              ? "Ödedi"
                                                                              : "Ödemedi"}
                                                                      </span>
                                                                  </td>
                                                                  <td className="text-muted pr-3">{el.note}</td>
                                                              </tr>
                                                          );
                                                      })
                                                    : noRow()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdvancePayment;
