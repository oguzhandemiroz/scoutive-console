import React, { Component } from "react";
import { CreatedPlayers } from "../../../services/Report";
import c3 from "c3";
import "../../../assets/css/c3.min.css";
import sc from "../../../assets/js/sc";
import moment from "moment";

const chartOptions = {
    size: {
        height: 64
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
            title: function(x) {
                return moment(x, "YYYY-MM-DD").format("LL");
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
            padding: {
                bottom: 0
            },
            show: false,
            tick: {
                outer: false
            }
        }
    },
    grid: {
        focus: {
            show: true
        }
    }
};

export class DailyCreatedPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            list: null,
            todayCount: 0,
            yesterdayCount: 0
        };
    }

    componentDidMount() {
        this.listPlayerRecord();
    }

    componentDidUpdate() {
        const { list } = this.state;
        if (list !== null) {
            this.renderChart(list);
        }
    }

    renderChart(data) {
        c3.generate({
            bindto: "#daily-players",
            data: {
                type: "area",
                json: data,
                keys: {
                    x: "created_date",
                    value: ["count"]
                },
                names: {
                    x: "Oluşturma Tarihi",
                    count: "Toplam"
                },
                colors: {
                    count: sc.colors.blue
                }
            },
            ...chartOptions
        });
    }

    listPlayerRecord = () => {
        const { uid } = this.state;
        CreatedPlayers({
            uid: uid,
            start_date: moment()
                .subtract(14, "days")
                .endOf("day")
                .format("YYYY-MM-DD H:mm:ss"),
            end_date: moment()
                .endOf("day")
                .format("YYYY-MM-DD H:mm:ss")
        }).then(response => {
            if (response) {
                const data = response.data;
                const status = response.status;
                if (status.code === 1020) {
                    let today = data.find(x => x.created_date === moment().format("YYYY-MM-DD"));
                    let yesterday = data.find(
                        x =>
                            x.created_date ===
                            moment()
                                .subtract(1, "days")
                                .format("YYYY-MM-DD")
                    );

                    let todayCount = today ? today.count : 0;
                    let yesterdayCount = yesterday ? yesterday.count : 0;

                    this.setState({
                        list: data,
                        todayCount: todayCount,
                        yesterdayCount: yesterdayCount
                    });

                    this.renderChart(data);
                }
            }
        });
    };

    render() {
        const { list, todayCount } = this.state;
        return (
            <div
                className={`dimmer ${list ? "" : "active"}`}
                style={{ borderTopWidth: 1, borderTopColor: "rgba(0, 40, 100, 0.12)", borderTopStyle: "solid" }}>
                <div className="loader"></div>
                <div className="dimmer-content">
                    <div className="card-body pt-4">
                        <div className="card-value float-right text-muted">
                            <i className="fe fe-users" />
                        </div>
                        <h3 className="mb-1">{todayCount}</h3>
                        <div className="text-muted">Bugün Eklenen Öğrenci</div>
                    </div>
                    <div className="card-chart-bg">
                        <div id="daily-players" style={{ height: "100%" }} ref="daily-players" />
                    </div>
                </div>
            </div>
        );
    }
}

export default DailyCreatedPlayer;
