import React, { Component } from "react";
import { ListAccountingRecords } from "../../services/Accounting";
import Chart from "react-apexcharts";
import "../../assets/css/apex.css";
import sc from "../../assets/js/sc";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import { formatMoney, CheckPermissions } from "../../services/Others";
import NotPermissions from "../../components/NotActivate/NotPermissions";

export class GeneralChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            chartOptions: {
                chart: {
                    id: "general-accounting",
                    toolbar: {
                        show: false
                    },
                    stacked: false,
                    animations: {
                        enabled: true
                    },
                    height: 320
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
                        },
                        rotate: -45,
                        rotateAlways: true
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

    getDays = () => {
        const data = [];
        const monthDate = moment().startOf("month");
        _.times(monthDate.daysInMonth(), function(n) {
            data.push({ x: monthDate.format("DD MMM"), y: 0 }); // your format
            monthDate.add(1, "day");
        });

        return data;
    };

    generateData = (data, type) => {
        return _(data)
            .groupBy("payment_date")
            .map((objs, key) => {
                return {
                    x: moment(key).format("DD MMM"),
                    y: _.sumBy(
                        _(objs)
                            .filter(x => x.type === type)
                            .value(),
                        "amount"
                    )
                };
            })
            .value();
    };

    listAccountingRecord = () => {
        const { uid } = this.state;
        ListAccountingRecords({
            uid: uid,
            filter: {
                payment_date__gte: moment()
                    .startOf("month")
                    .format("YYYY-MM-DD"),
                payment_date__lte: moment()
                    .endOf("month")
                    .format("YYYY-MM-DD"),
                accounting_type_id__gt: 3
            }
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    const gen_data = [
                        {
                            name: "Gelir",
                            data: _.values(
                                _.merge(_.keyBy(this.getDays(), "x"), _.keyBy(this.generateData(data, 1), "x"))
                            )
                        },
                        {
                            name: "Gider",
                            data: _.values(
                                _.merge(_.keyBy(this.getDays(), "x"), _.keyBy(this.generateData(data, 0), "x"))
                            )
                        }
                    ];

                    this.setState(prevState => ({
                        chartOptions: {
                            ...prevState.chartOptions,
                            series: gen_data
                        }
                    }));
                }
            }
        });
    };

    render() {
        const { chartOptions } = this.state;
        if (!CheckPermissions(["a_read"])) {
            return (
                <NotPermissions
                    title="Üzgünüz 😣"
                    imageAlt="Yetersiz Yetki"
                    content={() => (
                        <p className="text-muted text-center">
                            Gelir/Gideri görüntülemek için yetkiniz bulunmamaktadır.
                            <br />
                            Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime geçiniz...
                        </p>
                    )}
                />
            );
        }

        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Bu Ayın Detaylı Gelir/Gider Grafiği</h3>
                    </div>
                    <div className="card-body p-0">
                        <Chart options={chartOptions} series={chartOptions.series} type="area" height="320" />
                    </div>
                </div>
            </div>
        );
    }
}

export default GeneralChart;
