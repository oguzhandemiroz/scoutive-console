import React, { Component } from "react";
import "jquery";
import c3 from "c3";
import "../../assets/css/c3.min.css";
import Select, { components } from "react-select";
import { GetBudgets } from "../../services/FillSelect";
import { Link } from "react-router-dom";
import moment from "moment";

const customStyles = {
	control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

const currencyType = {
	TRY: "₺",
	USD: "$",
	EUR: "€",
	GBP: "£"
};

const { Option } = components;
const IconOption = props => (
	<Option {...props}>
		<span>
			<i
				className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
				style={{ backgroundImage: `url(${props.data.image})` }}
			/>
			{props.data.label}
			<div className="small text-muted">
				Bütçe: <b>{props.data.balance.format() + " ₺"}</b>
			</div>
		</span>
	</Option>
);

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

class Budgets extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [30, 40, 10, 40, 12, 22, 100],
			budget: {
				label: null,
				value: "",
				type: 0,
				balance: 0
			},
			select: {
				budgets: null
			}
		};
	}

	componentDidMount() {
		let select = { ...this.state.select };
		this.listBudgets(select);
		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart();
	}

	handleSelect = (value, name) => {
		try {
			this.setState({ [name]: value });
		} catch (e) {}
	};

	listBudgets = select => {
		try {
			GetBudgets(true).then(response => {
				if (response) {
					console.log(response);
					select.budgets = response;
					if (response.length > 0) {
						this.setState({ budget: response[0] });
					}
					this.setState({ select });
				}
			});
		} catch (e) {}
	};

	renderChart() {
		c3.generate({
			bindto: "#budget",
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
		const { budget, select } = this.state;
		if (!select.budgets) return null;
		return (
			<div className="col-sm-12 col-lg-4">
				<div className="card">
					<div className={`dimmer ${select.budgets.length === 0 ? "active" : ""}`}>
						{select.budgets.length === 0 ? (
							<div
								className="d-flex justify-content-center chart-content align-items-center"
								style={{ zIndex: 99999 }}>
								<Link to="/app/budgets/add" className="btn btn-success">
									Kasa veya Banka Oluştur
								</Link>
							</div>
						) : null}
						<div className="dimmer-content">
							<div className="card-header pr-2">
								<h3 className="card-title mr-4">Hesap</h3>
								<div className="ml-auto w-75">
									<Select
										value={budget}
										onChange={val => this.handleSelect(val, "budget")}
										options={select.budgets}
										name="budget"
										placeholder="Kasa Seç..."
										styles={customStyles}
										isSearchable={true}
										autoSize
										isDisabled={select.budgets ? false : true}
										noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
										components={{ Option: IconOption }}
									/>
								</div>
							</div>
							<div className="card-body">
								<div className="card-value float-right text-muted">
									<i className={`fa fa-${budget.type === 1 ? "university" : "briefcase"}`}></i>
								</div>
								<div className="text-muted text-uppercase">{budget.label}</div>
								<h3 className="mb-1">
									{budget.balance.format() + " " + (currencyType[budget.currency] || "")}
								</h3>
								<div className="text-muted">Bakiye</div>
							</div>
							<div className="card-chart-bg">
								<div id="budget" style={{ height: "100%" }} ref="budget" />
							</div>
							<table className="table card-table">
								<tbody>
									<tr>
										<td width="1" className="pr-1">
											<i className="fe fe-dollar-sign text-muted"></i>
										</td>
										<td>Para Birimi</td>
										<td className="text-right">
											<span className="text-muted">{currencyType[budget.currency]}</span>
										</td>
									</tr>
									<tr>
										<td width="1" className="pr-1">
											<i className="fe fe-edit text-muted"></i>
										</td>
										<td>Son Güncelleme</td>
										<td className="text-right">
											<span className="text-muted">
												{budget.last_update ? moment(budget.last_update).format("LLL") : null}
											</span>
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td className="text-right" colSpan="3">
											<Link to="/app/budgets" className="font-italic">
												Kasayı Görüntüle <i className="fe fe-arrow-right"></i>
											</Link>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export { Revenue, Cost, NewUser, Budgets };
