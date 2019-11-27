import React, { Component } from "react";
import _ from "lodash";
import Chart from "react-apexcharts";
import "../../../assets/css/apex.css";

class GeneralEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            chartOptions: {
                chart: {
                    id: "general-employee",
                    toolbar: {
                        show: false
                    }
                },
                legend: {
                    position: "bottom",
                    horizontalAlign: "center",
                    fontSize: "13px"
                },
                dataLabels: {
                    formatter: function(val, opts) {
                        return opts.w.globals.series[opts.seriesIndex];
                    }
                },
                plotOptions: {
                    pie: {
                        expandOnClick: true
                    }
                },
                tooltip: {
                    style: {
                        fontSize: "15px"
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

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps;
        this.generateData(data);
    }

    generateData = data => {
        const employeeNames = [];
        const dataArr = [];

        _(data)
            .groupBy("position")
            .map((objs, key) => {
                employeeNames.push(key);
                dataArr.push(_(objs).size());
            })
            .value();

        this.setState(prevState => ({
            chartOptions: {
                ...prevState.chartOptions,
                labels: employeeNames,
                series: dataArr
            }
        }));
    };

    render() {
        const { chartOptions } = this.state;
        return (
            <div className="card">
                <div className="card-body pt-3 pb-1 p-0 text-center d-flex flex-column justify-content-center">
                    <div className="h5"> Genel Personel Raporu </div>
                    <Chart options={chartOptions} series={chartOptions.series} type="pie" height={230} />
                </div>
            </div>
        );
    }
}

export default GeneralEmployee;
