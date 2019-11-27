import React, { Component } from "react";
import { BalanceHistoryBudget } from "../../../services/Budget";
import Chart from "react-apexcharts";
import "../../../assets/css/apex.css";
import sc from "../../../assets/js/sc";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import { formatMoney } from "../../../services/Others";

export class Report extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            chartOptions: {
                chart: {
                    id: "accounting-line-chart",
                    toolbar: {
                        show: false
                    },
                    stacked: false,
                    animations: {
                        enabled: true
                    },
                    sparkline: {
                        enabled: true
                    }
                },
                stroke: {
                    width: 2,
                    curve: "straight"
                },
                colors: [sc.colors["yellow"]],
                xaxis: {
                    type: "datetime",
                    labels: {
                        formatter: function(value, timestamp, index) {
                            return moment(new Date(timestamp)).format("DD MMMM YYYY");
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: function(value) {
                            return formatMoney(value);
                        }
                    }
                },
                noData: {
                    text: "Veri yükleniyor veya bulunamadı...",
                    style: {
                        color: "#aab0b6"
                    }
                },
                point: {
                    show: false
                },
                series: []
            }
        };
    }

    componentDidMount() {
        this.listAccountingRecord();
    }

    listAccountingRecord = () => {
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
                    const data = response.data;

                    var result = data.map(function(o) {
                        return Object.assign(
                            {
                                x: o.date,
                                y: o.balance
                            },
                            _.omit(o, "date", "balance")
                        );
                    });

                    console.log(result);
                    this.setState(prevState => ({
                        chartOptions: {
                            ...prevState.chartOptions,
                            series: [{ name: "Günlük Değişim", data: result }]
                        }
                    }));
                }
            }
        });
    };

    render() {
        const { chartOptions } = this.state;
        return (
            <div className="card-body p-0">
                <Chart options={chartOptions} series={chartOptions.series} type="area" height={120} />
            </div>
        );
    }
}

export default Report;