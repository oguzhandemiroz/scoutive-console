import React, { Component } from "react";
import "jquery";
import c3 from "c3";
import "../../assets/css/c3.min.css";

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
        show: false
    },
    tooltip: {
        format: {
            title: function(x) {
                return "";
            }
        }
    },
    axis: {
        y: {
            padding: {
                bottom: 0
            },
            show: false,
            tick: {
                outer: false
            }
        },
        x: {
            padding: {
                left: 0,
                right: 0
            },
            show: false
        }
    },
    grid: {
        focus: {
            show: true
        }
    }
};

class Revenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [5, 7, 12, 8, 3, 1, 0]
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
            bindto: "#revenue",
            color: {
                pattern: ["#5eba00"]
            },
            data: {
                names: {
                    data1: "Gelir"
                },
                columns: [["data1", ...this.state.data]],
                type: "area"
            },
            ...chartOptions
        });
    }
    render() {
        return (
            <div className="col-12 col-sm-6 col-lg-4">
                <div className="card">
                    <div className="card-body">
                        <div className="card-value float-right text-blue">+32%</div>
                        <h3 className="mb-1">9.865,78₺</h3>
                        <div className="text-muted">Gelir</div>
                    </div>
                    <div className="card-chart-bg">
                        <div id="revenue" style={{ height: "100%" }} ref="revenue" />
                    </div>
                </div>
            </div>
        );
    }
}

class Cost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 3, 0, 0, 0, 0, 2]
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
            bindto: "#cost",
            data: {
                names: {
                    data1: "Gider"
                },
                columns: [["data1", ...this.state.data]],
                type: "area"
            },
            color: {
                pattern: ["#e74c3c"]
            },
            ...chartOptions
        });
    }
    render() {
        return (
            <div className="col-12 col-sm-6 col-lg-4">
                <div className="card">
                    <div className="card-body">
                        <div className="card-value float-right text-blue">+1%</div>
                        <h3 className="mb-1">-1.247,96₺</h3>
                        <div className="text-muted">Gider</div>
                    </div>
                    <div className="card-chart-bg">
                        <div id="cost" style={{ height: "100%" }} ref="cost" />
                    </div>
                </div>
            </div>
        );
    }
}

class NewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [30, 40, 10, 40, 12, 22, 100]
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
            bindto: "#new-users",
            data: {
                names: {
                    data1: ""
                },
                columns: [["data1", ...this.state.data]],
                type: "area"
            },
            color: {
                pattern: ["#f1c40f"]
            },
            ...chartOptions
        });
    }
    render() {
        return (
            <div className="col-12 col-sm-6 col-lg-4">
                <div className="card">
                    <div className="card-body">
                        <div className="card-value float-right text-blue">+15%</div>
                        <h3 className="mb-1">3</h3>
                        <div className="text-muted">Yeni Kayıt</div>
                    </div>
                    <div className="card-chart-bg">
                        <div id="new-users" style={{ height: "100%" }} ref="new-users" />
                    </div>
                </div>
            </div>
        );
    }
}

export { Revenue, Cost, NewUser };
