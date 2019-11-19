import React, { Component } from "react";
import { ListAccountingRecords } from "../../services/Accounting";
import "jquery";
import c3 from "c3";
import * as d3 from "d3";
import "../../assets/css/c3.min.css";
import sc from "../../assets/js/sc";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";

const chartOptions = {
    padding: {
        top: 15,
        bottom: -1,
        right: -1,
        left: -1
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
        },
        horizontal: true
    },
    axis: {
        x: {
            type: "category"
        },
        y: {
            tick: {
                format: d3.format(".2s")
            }
        }
    },
    grid: {
        y: {
            show: true
        }
    }
};

export class AccountingChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: null,
            error: false
        };
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.listAccountingRecord();
    }

    componentDidUpdate() {
        const { list } = this.state;
        this.renderChart(list);
    }

    getDays = () => {
        const fullDay = [];
        const weekDate = moment().startOf("week");
        _.times(weekDate.isoWeekday(), function(n) {
            fullDay.push({ payment_date: weekDate.format("DD MMMM, ddd"), incomeAmount: 0, expenseAmount: 0 }); // your format
            weekDate.add(1, "day");
        });

        return fullDay;
    };

    renderChart = data => {
        try {
            c3.generate({
                bindto: "#general-stacked-report", // id of chart wrapper
                data: {
                    json: data,
                    keys: {
                        x: "payment_date",
                        value: ["incomeAmount", "expenseAmount"]
                    },
                    type: "line", // default type of chart
                    //groups: [["incomeAmount", "expenseAmount"]],
                    colors: {
                        incomeAmount: sc.colors["green"],
                        expenseAmount: sc.colors["red"]
                    },
                    names: {
                        x: "İşlem Tarihi",
                        incomeAmount: "Gelir",
                        expenseAmount: "Gider"
                    }
                },
                ...chartOptions
            });
        } catch (e) {
            this.setState({ error: true });
        }
    };

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
                    const grouped = _(data)
                        .groupBy("payment_date")
                        .map((objs, key) => {
                            console.log(key);
                            return {
                                payment_date: moment(key).format("DD MMMM, ddd"),
                                incomeAmount: _.sumBy(
                                    _(objs)
                                        .filter(x => x.type === 1)
                                        .value(),
                                    "amount"
                                ),
                                expenseAmount:
                                    _.sumBy(
                                        _(objs)
                                            .filter(x => x.type === 0)
                                            .value(),
                                        "amount"
                                    ) * -1
                            };
                        })
                        .value();

                    this.getDays();
                    this.setState({ list: grouped });

                    this.renderChart(
                        _.sortBy(
                            _.values(
                                _.merge(_.keyBy(this.getDays(), "payment_date"), _.keyBy(grouped, "payment_date"))
                            ),
                            "payment_date"
                        )
                    );
                }
            }
        });
    };

    render() {
        const { error } = this.state;
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Bu Haftanın Gelir/Gider Grafiği</h3>
                    </div>
                    <div className="card-body p-0">
                        <div id="general-stacked-report">
                            {error ? (
                                <div className="text-center p-5 text-muted font-italic">
                                    Bir hata oluştu. Üzerinde çalışıyoruz. Lütfen daha sonra tekrar deneyin...
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountingChart;
