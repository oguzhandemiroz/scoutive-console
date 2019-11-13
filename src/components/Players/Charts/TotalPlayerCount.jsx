import React, { Component } from "react";
import c3 from "c3";
import * as d3 from "d3";
import "../../../assets/css/c3.min.css";
import sc from "../../../assets/js/sc";

const chartOptions = {
	axis: {
		x: {
			type: "category"
		}
	},
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

export class TotalPlayerCount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			total: 0,
			passive: 0,
			active: 0,
			freeze: 0,
			trial: 0,
			noData: true
		};
	}

	componentWillReceiveProps(nextProps) {
		const { data } = nextProps;
		this.generateCounts(data);
	}

	componentDidUpdate() {
		this.renderChart();
	}

	generateCounts = data => {
		let passive = [];
		let active = [];
		let freeze = [];
		let trial = [];

		passive = data.filter(x => x.status === 0 && x.is_trial === 0);
		active = data.filter(x => x.status === 1 && x.is_trial === 0);
		freeze = data.filter(x => x.status === 2 && x.is_trial === 0);
		trial = data.filter(x => x.is_trial === 1);

		this.setState({
			total: data.length,
			passive: passive.length,
			active: active.length,
			freeze: freeze.length,
			trial: trial.length,
			noData: false
		});
	};

	renderChart() {
		const { total, active, freeze, passive, trial } = this.state;
		c3.generate({
			bindto: "#total-player-count",
			data: {
				json: [{ active: active, passive: passive, freeze: freeze, trial: trial }],
				keys: {
					value: ["active", "passive", "freeze", "trial"]
				},
				type: "pie",
				colors: {
					//total: "#495057",
					active: sc.colors["green"],
					passive: sc.colors["red"],
					freeze: sc.colors["azure"],
					trial: sc.colors["indigo"]
				},
				names: {
					// name of each serie
					//total: "Toplam",
					active: "Aktif",
					passive: "Pasif",
					freeze: "Donuk",
					trial: "Ön Kayıt"
				}
			},
			...chartOptions
		});
	}

	render() {
		const { noData } = this.state;
		return (
			<div className="card">
				<div
					className="card-body p-3 text-center d-flex flex-column justify-content-center"
					style={{ height: 280 }}>
					<div className="h5">Genel Öğrenci Raporu</div>
					{noData ? (
						<div
							className="text-muted font-italic d-flex justify-content-center align-items-center"
							style={{ height: 210 }}>
							<div className="loader"></div>
						</div>
					) : (
						<div id="total-player-count" style={{ height: 210 }} />
					)}
				</div>
			</div>
		);
	}
}

export default TotalPlayerCount;
