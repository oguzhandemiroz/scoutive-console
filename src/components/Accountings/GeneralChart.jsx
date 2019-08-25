import React, {Component} from "react";
import "jquery";
import c3 from "c3";
import "../../assets/css/c3.min.css";
import sc from "../../assets/js/sc";

const chartOptions = {
    grid: {
        y: {
            lines: [{value: 0}]
        }
    },
    padding: {
        top: 15,
        bottom: -1,
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
                format: "%d-%m-%Y"
            },
            show: true
        }
    },
    zoom: {
        enabled: true,
    },
    bar: {
        width: 40
    }
};

export class GeneralChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data1: [11, 8, 15, 18, 19, 17, 23, 33, 19, 17, 23, 33],
            data2: [-7, -7, -5, -7, -9, -12, -6, -8, -7, -9, -12, 0]
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

    renderChart = () => {
        const {data1, data2} = this.state;
        c3.generate({
            bindto: "#general-stacked-report", // id of chart wrapper
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
                        "2013-01-07",
                        "2013-01-08",
                        "2013-01-09",
                        "2013-01-10",
                        "2013-01-11",
                        "2013-01-12"
                    ],
                    ["data1", ...data1],
                    ["data2", ...data2]
                ],
                type: "bar", // default type of chart
                groups: [["data1", "data2"]],
                colors: {
                    data1: sc.colors["blue"],
                    data2: sc.colors["pink"]
                },
                names: {
                    // name of each serie
                    data1: "Gelir",
                    data2: "Gider"
                }
            },
            ...chartOptions
        });
    };

    render() {
        return (
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Detaylı Gelir/Gider Grafiği</h3>
                    </div>
                    <div className="card-body p-0">
                        <div id="general-stacked-report"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GeneralChart;
