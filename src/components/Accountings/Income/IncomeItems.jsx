import React, { Component } from "react";
import Chart from "react-apexcharts";
import _ from "lodash";
import { ListAccountingRecords } from "../../../services/Accounting";
import "../../../assets/css/apex.css";
import { formatMoney } from "../../../services/Others";

export class IncomeItems extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            chartOptions: {
                chart: {
                    id: "income-items",
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    position: "bottom",
                    horizontalAlign: "center",
                    fontSize: "13px"
                },
                plotOptions: {
                    pie: {
                        expandOnClick: true
                    }
                },
                tooltip: {
                    style: {
                        fontSize: "15px"
                    },
                    y: {
                        formatter: function(val) {
                            return formatMoney(val);
                        }
                    }
                },
                noData: {
                    text: "Veri yükleniyor veya bulunamadı...",
                    style: {
                        color: "#aab0b6"
                    }
                },
                series: []
            }
        };
    }

    componentDidMount() {
        this.listRecords();
    }

    listRecords = () => {
        const { uid } = this.state;
        ListAccountingRecords({
            uid: uid,
            filter: { type: 1, accounting_type__gt: 3 }
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({ data: response.data, loading: false });
                    this.renderChart(response.data);
                }
            }
        });
    };

    renderChart(data) {
        const itemNames = [];
        const dataArr = [];

        _(data)
            .groupBy("accounting_type")
            .map((objs, key) => {
                itemNames.push(key);
                dataArr.push(_.sumBy(_(objs).value(), "amount"));
            })
            .value();

        this.setState(prevState => ({
            chartOptions: {
                ...prevState.chartOptions,
                labels: itemNames,
                series: dataArr
            }
        }));
    }

    render() {
        const { chartOptions } = this.state;
        return (
            <div className="card">
                <div className="card-body pt-3 pb-1 p-0 text-center d-flex flex-column justify-content-center">
                    <div className="h5">Gelir Kalemleri Dağılımı</div>
                    <Chart options={chartOptions} series={chartOptions.series} type="pie" height={280} />
                </div>
            </div>
        );
    }
}

export default IncomeItems;
