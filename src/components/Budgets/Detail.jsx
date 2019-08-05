import React, {Component} from "react";
import {GetBudget} from "../../services/Budget";
import {nullCheck} from "../../services/Others";
import {Link} from "react-router-dom";
import "jquery";
import c3 from "c3";
import "../../assets/css/c3.min.css";
import sc from "../../assets/js/sc";
import Inputmask from "inputmask";
import moment from "moment";

const budgetType = {
    "-1": {icon: "", text: "—"},
    0: {icon: "briefcase", text: "Kasa"},
    1: {icon: "university", text: "Banka"}
};

const currencyType = {
    TRY: {icon: "lira-sign", text: "TRY", sign: "₺"},
    USD: {icon: "dollar-sign", text: "USD", sign: "$"},
    EUR: {icon: "euro-sign", text: "EUR", sign: "€"},
    GBP: {icon: "pound-sign", text: "GBP", sign: "£"}
};

const chartOptions = {
    padding: {
        bottom: -1,
        left: -1,
        right: -1
    },
    legend: {
        position: "inset",
        padding: 0,
        inset: {
            anchor: "top-left",
            x: 10,
            y: 3,
            step: 10
        }
    },
    tooltip: {
        format: {
            value: function(value, ratio, id, index) {
                return value.format() + " ₺";
            }
        }
    },
    axis: {
        x: {
            type: "timeseries",
            localtime: true,
            tick: {
                fit: true,
                format: "%Y-%m-%d",
                culling: {
                    max: 5
                }
            },
            padding: {
                left: 0,
                right: 0
            },
            show: true
        }
    }
};

class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [11, 8, 15, 18, 19, 17, 23, 33],
            data2: [7, 7, 5, 7, 9, 12, 6, 8]
        };
    }
    shouldComponentUpdate() {
        return false;
    }
    componentDidMount() {
        this.renderChart();
    }
    componentDidUpdate() {
        this.renderChart();
    }

    renderChart() {
        c3.generate({
            bindto: "#budget-report",
            data: {
                x: "x",
                columns: [
                    [
                        "x",
                        "2013-01-01",
                        "2013-01-02",
                        "2013-01-03",
                        "2013-01-04",
                        "2013-01-05",
                        "2013-01-06",
                        "2013-01-07"
                    ],
                    ["data1", ...this.state.data],
                    ["data2", ...this.state.data2]
                ],
                type: "area", // default type of chart
                colors: {
                    data1: sc.colors.blue,
                    data2: sc.colors.pink
                },
                names: {
                    // name of each serie
                    data1: "Nakit Girişi",
                    data2: "Nakit Çıkışı"
                }
            },
            ...chartOptions
        });
    }

    render() {
        return <div id="budget-report" style={{height: "100%"}} ref="budget-report" />;
    }
}

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            budget_name: "—",
            budget_type: -1,
            balance: 0,
            currency: "TRY",
            note: "—",
            loadingData: true
        };
    }

    componentDidMount() {
        this.renderBudgetDetail();
    }

    renderBudgetDetail = () => {
        try {
            const {uid} = this.state;
            const {bid} = this.props.match.params;
            GetBudget({
                uid: uid,
                budget_id: bid
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        const data = response.data;
                        this.setState({...data});
                    }
                    this.setState({loadingData: false});
                }
            });
        } catch (e) {}
    };

    render() {
        const {
            bank_name,
            bank_branch,
            bank_account_number,
            iban,
            note,
            last_update,
            budget_name,
            balance,
            currency,
            budget_type,
            loadingData
        } = this.state;
        const getBudgetType = budgetType[budget_type];
        const getCurrencyType = currencyType[currency];
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Kasa ve Bankalar &mdash; {budget_name}</h1>
                    <div className="ml-auto">
                        <div className="btn-group" role="group" aria-label="Budget Money Process">
                            <button type="button" className="btn btn-sm btn-icon btn-success">
                                <i className="fe fe-plus mr-2"></i>Para Girişi
                            </button>
                            <button type="button" className="btn btn-sm btn-icon btn-danger">
                                <i className="fe fe-minus mr-2"></i>Para Çıkışı
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <div className="card">
                            <div className="card-body p-0">
                                <Report />
                            </div>
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className={`fa fa-${getBudgetType.icon} mr-2`}></i>
                                    {budget_name}
                                </h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loadingData ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="form-group mb-5">
                                            <div className="card-value float-right text-blue">+5%</div>
                                            <h3 className="mb-1">
                                                {balance.format() + " " + getCurrencyType.sign}
                                            </h3>
                                            <div className="text-muted">Bakiye</div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Hesap Türü</label>
                                            <div className="form-control-plaintext">{getBudgetType.text}</div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Para Birimi</label>
                                            <div className="form-control-plaintext">
                                                {getCurrencyType.sign} ({currency})
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Not</label>
                                            <div className="form-control-plaintext">
                                                {nullCheck(note, "—")}
                                            </div>
                                        </div>

                                        {budget_type === 1 ? (
                                            <div>
                                                <hr className="my-5" />
                                                <div className="form-group">
                                                    <label className="form-label">Banka Adı</label>
                                                    <div className="form-control-plaintext">{bank_name}</div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Banka Şubesi</label>
                                                    <div className="form-control-plaintext">
                                                        {nullCheck(bank_branch, "—")}
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Banka Hesap Numarası</label>
                                                    <div className="form-control-plaintext">
                                                        {nullCheck(bank_account_number, "—")}
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">IBAN</label>
                                                    <div className="form-control-plaintext">
                                                        {Inputmask.format(iban, {
                                                            mask: "AA99 9999 9999 9999 9999 99"
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        <hr className="my-5" />
                                        <div className="form-group">
                                            <label className="form-label">Son Güncelleme Tarihi</label>
                                            <div className="form-control-plaintext">
                                                {moment(last_update).format("LLL")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <Link to="#" className={`btn btn-link btn-block ${loadingData ? "disabled" : ""}`}>
                                    Hesabı Düzenle
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;
