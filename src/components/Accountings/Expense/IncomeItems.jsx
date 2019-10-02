import React, { Component } from "react";
import c3 from "c3";
import "../../../assets/css/c3.min.css";
import { ListAccountingRecords } from "../../../services/Accounting";
import _ from "lodash";

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
			value: function(value, ratio, id, index) {
				return value.format() + " ₺";
			}
		}
	},
	empty: {
		label: {
			text: "Veri bulunamadı"
		}
	}
};

export class IncomeItems extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			loading: true
		};
	}

	componentDidMount() {
		this.listRecords();
	}

	componentDidUpdate() {
		const { data } = this.state;
		this.renderChart(data);
	}

	listRecords = () => {
		const { uid } = this.state;
		ListAccountingRecords({
			uid: uid,
			filter: { type: 0, accounting_type__gt: 3 }
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					this.setState({ data: response.data, loading: false });
					this.renderChart(response.data);
				}
			}
		});
	};

	renderChart(data) {
		const processed_data = _(data)
			.groupBy("accounting_type")
			.map((objs, key) => {
				return { [key]: _.sumBy(_(objs).value(), "amount") };
			})
			.value();

		const keys = _(data)
			.map("accounting_type")
			.uniq()
			.value();

		console.log(processed_data, keys);
		c3.generate({
			bindto: "#income-items",
			data: {
				json: processed_data,
				keys: {
					value: keys
				},
				type: "pie" // default type of chart
			},
			...chartOptions
		});
	}

	render() {
		const { loading } = this.state;
		return (
			<div className="card">
				<div
					className="card-body p-3 text-center d-flex flex-column justify-content-center"
					style={{ height: 330 }}>
					<div className="h5">Gider Kalemleri Dağılımı</div>
					{loading ? (
						<div
							className="text-muted font-italic d-flex justify-content-center align-items-center"
							style={{ height: 260 }}>
							<div className="loader"></div>
						</div>
					) : (
						<div id="income-items" style={{ height: 260 }} />
					)}
				</div>
			</div>
		);
	}
}

export default IncomeItems;
