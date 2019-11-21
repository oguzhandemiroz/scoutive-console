import React, { Component } from "react";
import { BalanceHistoryBudget } from "../../../services/Budget";
import Chart from "react-apexcharts";
import "../../../assets/css/apex.css";
import sc from "../../../assets/js/sc";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import { formatMoney } from "../../../services/Others";

export class AccountingChart extends Component {
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

export default AccountingChart;

/* 


import React, { Component } from "react";
import c3 from "c3";
import "../../../assets/css/c3.min.css";
import sc from "../../../assets/js/sc";
import moment from "moment";
import { BalanceHistoryBudget } from "../../../services/Budget";

const chartOptions = {
	size: {
		height: 100
	},
	padding: {
		bottom: -10,
		left: -1,
		right: -1
	},
	legend: {
		show: false
	},
	transition: {
		duration: 0
	},
	point: {
		r: 2
	},
	tooltip: {
		format: {
			value: function(value, ratio, id, index) {
				return value.format(2, 3, '.', ',') + " ₺";
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
			<div className="card-body p-0">
				<div id="budget-history-report" style={{ height: "100%" }} ref="budget-report" />
			</div>
		);
	}
}

export default Report;
 */
