import React, { Component } from "react";
import { DetailEmployee } from "../../services/Employee.jsx";
import { ListSalaries } from "../../services/EmployeeAction";
import Tabs from "../../components/Employees/Tabs";
import moment from "moment";
import PersonCard from "./PersonCard.jsx";

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
	);

export class SalaryDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			loading: "active",
			list: []
		};
	}

	componentDidMount() {
		this.getEmployeeDetail();
		this.listSalaries();
	}

	listSalaries = () => {
		const { uid, to } = this.state;
		ListSalaries({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					this.setState({ list: response.data.reverse() });
				}
			}
		});
	};

	getEmployeeDetail = () => {
		const { uid, to } = this.state;
		DetailEmployee({
			uid: uid,
			to: to
		}).then(response => {
			if (response !== null) {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					this.setState({
						...data,
						loading: ""
					});
				}
			}
		});
	};

	render() {
		const { to, list } = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personel Detay &mdash; Maaş Geçmişi</h1>
					<div className="col" />
					<div className="col-auto px-0">
						<Tabs match={match} to={to} />
					</div>
				</div>

				<div className="row">
					<PersonCard data={this.state} history={this.props.history} />

					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Maaş Geçmişi</h3>
								<button
									onClick={() => this.props.history.push("/app/employees/salary/" + to)}
									className="btn btn-sm btn-success ml-auto">
									Maaş Öde
								</button>
							</div>
							<div className="card-body">
								{list ? (
									list.length > 0 ? (
										<ul className="timeline mb-0">
											{list.map((el, key) => (
												<li className="timeline-item" key={key.toString()}>
													<div
														className={`timeline-badge ${
															el.is_future === 0 ? "bg-success" : ""
														}`}
													/>
													<div>
														<strong>{el.amount ? el.amount.format() + " ₺" : null}</strong>{" "}
														maaş ödendi
													</div>
													<div className="timeline-time">
														{moment(el.payment_date).format("DD-MM-YYYY")}
													</div>

													<div>
														{el.is_future === 1 ? (
															<button
																type="button"
																data-toggle="tooltip"
																title="Maaşı Öde"
																className="btn btn-sm btn-success btn-icon p-1">
																<i className="fa fa-money-bill-wave"></i>
															</button>
														) : null}
													</div>
												</li>
											))}
										</ul>
									) : (
										noRow()
									)
								) : (
									noRow(true)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default SalaryDetail;
