import React, { Component } from "react";
import sc from "../../../assets/js/sc";
import Chart from "react-apexcharts";
import "../../../assets/css/apex.css";

class TotalPlayerCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            chartOptions: {
                chart: {
                    id: "daily-player",
                    toolbar: {
                        show: false
                    }
                },
                colors: [sc.colors["green"], sc.colors["red"], sc.colors["azure"], sc.colors["indigo"]],
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
        const gen_data = [
            data.filter(x => x.status === 1 && x.is_trial === 0).length,
            data.filter(x => x.status === 0 && x.is_trial === 0).length,
            data.filter(x => x.status === 2 && x.is_trial === 0).length,
            data.filter(x => x.is_trial === 1).length
        ];

        this.setState(prevState => ({
            chartOptions: {
                ...prevState.chartOptions,
                labels: ["Aktif", "Pasif", "Donuk", "Ön Kayıt"],
                series: gen_data
            }
        }));
    };

    render() {
        const { chartOptions } = this.state;
        return (
            <div className="card">
                <div className="card-body pt-3 pb-1 p-0 text-center d-flex flex-column justify-content-center">
                    <div className="h5">Genel Öğrenci Raporu</div>
                    <Chart options={chartOptions} series={chartOptions.series} type="pie" height={230} />
                </div>
            </div>
        );
    }
}

export default TotalPlayerCount;
