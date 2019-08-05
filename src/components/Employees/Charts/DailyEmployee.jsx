import React, { Component } from "react";
import c3 from "c3";
import * as d3 from "d3";
import "../../../assets/css/c3.min.css";
import sc from "../../../assets/js/sc";

const chartOptions = {
	axis: {},
	legend: {
		show: true //hide legend
	},
	padding: {
		bottom: 0,
		top: 0
	},
	tooltip: {
		format: {
			value: function(value) {
				return d3.format("")(value);
			}
		}
	},
	pie: {
		label: {
			format: function(value) {
				return d3.format("")(value);
			}
		}
	},
	empty: {
		label: {
			text: "Veri bulunamadı"
		}
	}
};

class DailyEmployee extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			came: ["1"],
			vacation: ["2"],
			not_came: ["0"],
			none: ["-1"],
			noData: true
		};
	}
	
	componentWillReceiveProps(nextProps) {
		const { data } = nextProps;
		this.listEmployees(data);
	}

	componentDidUpdate() {
		this.renderChart();
	}

	listEmployees = data => {
		const dataObj = {
			"0": 0,
			"1": 0,
			"2": 0,
			"-1": 0
		};
		data.map(el => {
			dataObj[el.daily] = dataObj[el.daily] + 1;
		});
		Object.keys(dataObj).map(el => {
			switch (el) {
				case "0":
					this.setState({ not_came: ["0", dataObj[el]] });
					break;
				case "1":
					this.setState({ came: ["1", dataObj[el]] });
					break;
				case "2":
					this.setState({ vacation: ["2", dataObj[el]] });
					break;
				case "-1":
					this.setState({ none: ["-1", dataObj[el]] });
					break;
				default:
					break;
			}
		});
		this.renderChart();
		this.setState({ noData: false });
	};

	renderChart() {
		const { came, vacation, not_came, none } = this.state;
		c3.generate({
			bindto: "#daily-employee",
			data: {
				columns: [[...came], [...vacation], [...not_came], [...none]],
				type: "pie", // default type of chart
				colors: {
					"1": sc.colors["green"],
					"2": sc.colors["orange"],
					"0": sc.colors["red"],
					"-1": "#495057"
				},
				names: {
					// name of each serie
					"1": "Geldi",
					"2": "İzinli",
					"0": "Gelmedi",
					"-1": "Tanımsız"
				}
			},
			...chartOptions
		});
	}
	render() {
		const { noData } = this.state;
		return (
			<div className="col-sm-6 col-md-4">
				<div className="card">
					<div className="card-body p-3 text-center">
						<div className="h5">Günlük Personel Raporu</div>
						{noData ? (
							<div
								className="text-muted font-italic d-flex justify-content-center"
								style={{
									height: "192px"
								}}>
								<div className="loader"></div>
							</div>
						) : (
							<div
								id="daily-employee"
								style={{
									height: "192px"
								}}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default DailyEmployee;