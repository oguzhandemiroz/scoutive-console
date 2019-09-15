import React, { Component } from "react";
import c3 from "c3";
import "../../../assets/css/c3.min.css";
import sc from "../../../assets/js/sc";
import moment from "moment";
import { BalanceHistoryBudget } from "../../../services/Budget";

const chartOptions = {
    size: {
        height: 200
    },
    padding: {
        bottom: -10,
        left: -1,
        right: -1
    },
    legend: {
        padding: 0
    },
    transition: {
        duration: 0
    },
    point: {
        r: 3
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
                culling: false
            },
            padding: {
                left: 0,
                right: 0
            },
            show: false
        },
        y: {
            show: false
        }
    },
    grid: {
        x: { show: true }
    }
};

class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID")
        };
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.renderBudgetBalanceHistory();
    }

    componentDidUpdate() {
        const { list } = this.state;
        console.log(list);
        this.renderChart(list);
    }

    renderChart = data => {
        c3.generate({
            bindto: "#budget-history-report",
            data: {
                json: data,
                keys: {
                    x: "date",
                    value: ["balance"]
                },
                type: "area", // default type of chart
                colors: {
                    balance: sc.colors.yellow
                },
                names: {
                    // name of each serie
                    balance: "Günlük Değişim"
                }
            },
            ...chartOptions
        });
    };

    renderBudgetBalanceHistory = () => {
        const { uid } = this.state;
        const { bid } = this.props.match.params;
        BalanceHistoryBudget({
            uid: uid,
            filter: {
                budget_id: bid,
                created_date__gte: moment()
                    .subtract(15, "days")
                    .endOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                created_date__lte: moment()
                    .endOf("day")
                    .format("YYYY-MM-DD HH:mm:ss")
            }
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({ list: response.data });
                    this.renderChart(response.data);
                }
            }
        });
    };

    render() {
        return (
            <div className="card">
                <div className="card-body p-0">
                    <div id="budget-history-report" style={{ height: "100%" }} ref="budget-report" />
                </div>
            </div>
        );
    }
}

export default Report;
