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
	}
};

class GeneralEmployee extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			noData: true,
			data: []
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
		const employeeNames = [];
		const dataArr = [];
		const dataObj = {};
		data.map(el => {
			if (!employeeNames.find(x => x[el.position] === el.position)) {
				employeeNames.push({ [el.position]: el.position });
			}
			dataObj[el.position] = (dataObj[el.position] ? dataObj[el.position] : 0) + 1;
		});

		Object.keys(dataObj).map(el => {
			dataArr.push([el, dataObj[el]]);
		});

		this.setState({ data: dataArr, noData: false });
		this.renderChart(employeeNames);
	};

	renderChart(names) {
		c3.generate({
			bindto: "#general-employee",
			data: {
				columns: this.state.data,
				type: "pie", // default type of chart
				names: names
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
						<div className="h5"> Genel Personel Raporu </div>
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
								id="general-employee"
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

export default GeneralEmployee;
