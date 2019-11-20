import React, { Component } from "react";
import c3 from "c3";
import * as d3 from "d3";
import "../../../assets/css/c3.min.css";
import sc from "../../../assets/js/sc";
import Chart from "react-apexcharts";
import "../../../assets/css/apex.css";

const chartOptions = {
    optionsMixedChart: {
        chart: {
            id: "daily-employee",
            toolbar: {
                show: false
            }
        },
        colors: [sc.colors["green"], sc.colors["red"], sc.colors["orange"], "#495057"],
        labels: ["Geldi", "Gelmedi", "İzinli", "Tanımsız"],
        legend: {
            position: "bottom",
            horizontalAlign: "center"
        }
    }
};

class DailyEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            list: []
        };
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps;
        this.generateData(data);
    }

    generateData = data => {
        const gen_data = [
            data.filter(x => x.daily === 1).length,
            data.filter(x => x.daily === 0).length,
            data.filter(x => x.daily === 2).length,
            data.filter(x => x.daily === -1).length
        ];

        console.log(gen_data);
        this.setState({ list: gen_data });
    };

    render() {
        const { list } = this.state;
        return (
            <div className="card">
                <div className="card-body p-3 text-center d-flex flex-column justify-content-center">
                    <div className="h5">Günlük Personel Raporu</div>
                    <Chart options={chartOptions.optionsMixedChart} series={list} type="pie" />
                </div>
            </div>
        );
    }
}

export default DailyEmployee;
