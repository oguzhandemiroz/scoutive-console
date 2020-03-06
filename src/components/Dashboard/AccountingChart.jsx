import React, { Component } from "react";
import { ListAccountingRecords } from "../../services/Accounting";
import { CheckPermissions } from "../../services/Others";
import Chart from "react-apexcharts";
import "../../assets/css/apex.css";
import sc from "../../assets/js/sc";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import { formatMoney } from "../../services/Others";

export class AccountingChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            notPermission: false,
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
                    height: 280
                },
                stroke: {
                    width: 2
                },
                colors: [sc.colors["green"], sc.colors["red"]],
                grid: {
                    strokeDashArray: 5,
                    borderColor: "#f0f0f0",
                    position: "back"
                },
                markers: {
                    size: 4,
                    strokeWidth: 2,
                    fillOpacity: 0,
                    strokeOpacity: 0,
                    hover: {
                        size: 6
                    }
                },
                yaxis: {
                    show: false
                },
                xaxis: {
                    type: "category",
                    labels: {
                        hideOverlappingLabels: true,
                        style: {
                            colors: "#9aa0ac"
                        }
                    },
                    axisBorder: {
                        color: "#9aa0ac",
                        height: 0.4
                    },
                    tickPlacement: "on",
                    tooltip: {
                        enabled: false
                    }
                },
                tooltip: {
                    y: {
                        formatter: function(value) {
                            return formatMoney(value);
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    position: "top",
                    horizontalAlign: "left",
                    floating: true,
                    offsetX: -2,
                    offsetY: 7
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
        this.listAccountingRecord();
    }

    listAccountingRecord = () => {
        const { uid } = this.state;
        ListAccountingRecords({
            uid: uid,
            filter: {
                payment_date__gte: moment()
                    .startOf("week")
                    .format("YYYY-MM-DD"),
                payment_date__lte: moment()
                    .endOf("week")
                    .format("YYYY-MM-DD"),
                accounting_type_id__gt: 2
            }
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    const generated_data = [
                        {
                            name: "Gelir",
                            data: [
                                ..._(data)
                                    .groupBy("payment_date")
                                    .toPairs()
                                    .sortBy(0)
                                    .fromPairs()
                                    .map((objs, key) => {
                                        console.log(key);
                                        return {
                                            x: moment(key).format("DD MMMM, ddd"),
                                            y: _.sumBy(
                                                _(objs)
                                                    .filter(x => x.type === 1)
                                                    .value(),
                                                "amount"
                                            )
                                        };
                                    })
                                    .value()
                            ]
                        },
                        {
                            name: "Gider",
                            data: [
                                ..._(data)
                                    .groupBy("payment_date")
                                    .toPairs()
                                    .sortBy(0)
                                    .fromPairs()
                                    .map((objs, key) => {
                                        return {
                                            x: moment(key).format("DD MMMM, ddd"),
                                            y:
                                                _.sumBy(
                                                    _(objs)
                                                        .filter(x => x.type === 0)
                                                        .value(),
                                                    "amount"
                                                ) * 1
                                        };
                                    })
                                    .value()
                            ]
                        }
                    ];

                    this.setState(prevState => ({
                        chartOptions: {
                            ...prevState.chartOptions,
                            series: generated_data
                        }
                    }));
                }
            } else {
                this.setState({ notPermission: true });
            }
        });
    };

    render() {
        const { chartOptions, notPermission } = this.state;
        if (!CheckPermissions(["a_read"]) && notPermission) {
            return null;
        }

        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Bu Haftanın Gelir/Gider Grafiği</h3>
                    </div>
                    <div className="card-body p-0">
                        <Chart options={chartOptions} series={chartOptions.series} type="area" height="280" />
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountingChart;
