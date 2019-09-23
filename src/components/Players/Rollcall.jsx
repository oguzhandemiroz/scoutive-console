import React, { Component } from "react";
import { DetailPlayer } from "../../services/Player";
import { fullnameGenerator, formatDate, formatMoney, nullCheck } from "../../services/Others";
import { Link } from "react-router-dom";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import Tabs from "../../components/Players/Tabs";
import ActionButton from "../../components/Players/ActionButton";
const $ = require("jquery");

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="6" className="text-center text-muted font-italic">
			{loading ? (
				<div className={`dimmer active`}>
					<div className="loader" />
					<div className="dimmer-content" />
				</div>
			) : (
				"Kayıt bulunamadı..."
			)}
		</td>
	</tr>
);

const statusType = {
	0: "bg-danger",
	1: "bg-green",
	2: "bg-azure",
	3: "bg-indigo"
};

export class Rollcall extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			data: {},
			loading: "active"
		};
	}

	componentDidMount() {
		this.getPlayerDetail();
	}

	componentDidUpdate() {
		$('[data-toggle="tooltip"]').tooltip();
	}

	getPlayerDetail = () => {
		const { uid, to } = this.state;
		DetailPlayer({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				const data = response.data;
				if (status.code === 1020) {
					delete data.uid;
					this.setState({ ...data });
				}
				this.setState({ loading: "" });
			}
		});
	};

	renderRollcallStatus = status => {
		const rollcallStatus = {
			0: { color: "bg-red-light", text: "Gelmedi", icon: "fe fe-x" },
			1: { color: "bg-green-light", text: "Geldi", icon: "fe fe-check" },
			2: { color: "bg-yellow-light", text: "Y. Gün İzinli", icon: "fe fe-alert-circle" },
			3: { color: "bg-yellow-light", text: "T. Gün İzinli", icon: "fe fe-alert-circle" }
		};

		return (
			<span
				className={`badge ${rollcallStatus[status].color} py-1 px-2`}
				style={{ fontSize: "100%" }}
				data-toggle="tooltip"
				title={rollcallStatus[status].text}>
				<i className={rollcallStatus[status].icon}></i>
			</span>
		);
	};

	generateRollcallTotalCount = (rollcalls, status, text) => {
		let total = 0;
		if (rollcalls) {
			Object.keys(rollcalls).map(el => {
				if (Array.isArray(status)) {
					if (status.indexOf(rollcalls[el].status) > -1) total++;
				} else {
					if (rollcalls[el].status === status) total++;
				}
			});
		}
		return (
			<h4 className="m-0">
				{total} <small>{text}</small>
			</h4>
		);
	};

	generateRollcallDate = rollcalls => {
		if (rollcalls) {
			const dateArray = Object.keys(rollcalls);
			return (
				<small class="text-muted">
					{formatDate(dateArray[0], "DD MMM")} &mdash; {formatDate(dateArray.slice(-1)[0], "DD MMM YYYY")}
				</small>
			);
		}
	};

	render() {
		const {
			to,
			name,
			surname,
			security_id,
			position,
			fee,
			is_scholarship,
			point,
			branch,
			start_date,
			end_date,
			email,
			phone,
			group,
			image,
			data,
			is_trial,
			status,
			rollcalls,
			loading
		} = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Detay &mdash; Yoklama Geçmişi</h1>
					<div className="col" />
					<div className="col-auto px-0">
						<Tabs match={match} to={to} />
					</div>
				</div>

				<div className="row">
					<div className="col-lg-4 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Genel Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loading}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="media mb-5">
											<span
												className="avatar avatar-xxl mr-4"
												style={{ backgroundImage: `url(${image})` }}>
												<span
													className={`avatar-sm avatar-status ${
														is_trial ? statusType[3] : statusType[status]
													}`}
												/>
											</span>
											<div className="media-body">
												<h4 className="m-0">{fullnameGenerator(name, surname)}</h4>
												<p className="text-muted mb-0">{nullCheck(position)}</p>
												<ul className="social-links list-inline mb-0 mt-2">
													<li className="list-inline-item">
														<a
															disabled
															className="employee_email"
															href={
																email
																	? `mailto:${nullCheck(email)}`
																	: "javascript:void(0);"
															}
															data-original-title={nullCheck(email)}
															data-toggle="tooltip">
															<i className="fa fa-envelope" />
														</a>
													</li>
													<li className="list-inline-item">
														<a
															className="employee_phone"
															href={
																phone
																	? `tel:${nullCheck(phone)}`
																	: "javascript:void(0);"
															}
															data-original-title={nullCheck(phone)}
															data-toggle="tooltip">
															<i className="fa fa-phone" />
														</a>
													</li>
												</ul>
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">T.C. Kimlik Numarası</label>
											<div className="form-control-plaintext">{security_id}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Genel Puan</label>
											<div className="form-control-plaintext">{point}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Grup</label>
											<div className="form-control-plaintext">
												{group ? (
													<Link to={`/app/groups/detail/${group.group_id}`}>
														{group.name}
													</Link>
												) : (
													<div className="form-control-plaintext">
														{nullCheck(group)}
													</div>
												)}
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">Aidat</label>
											<div className="form-control-plaintext">
												{is_scholarship ? "BURSLU" : formatMoney(fee)}
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">Branş</label>
											<div className="form-control-plaintext">{nullCheck(branch)}</div>
										</div>

										<div className="form-group">
											<label className="form-label">Okula Başlama Tarihi</label>
											<div className="form-control-plaintext">{formatDate(start_date)}</div>
										</div>

										{end_date ? (
											<div className="form-group">
												<label className="form-label">Okuldan Ayrılma Tarihi</label>
												<div className="form-control-plaintext">{formatDate(end_date)}</div>
											</div>
										) : null}
									</div>
								</div>
							</div>
							<div className="card-footer">
								<ActionButton
									vacationButton={data =>
										this.setState({
											data: data
										})
									}
									groupChangeButton={data =>
										this.setState({
											data: data
										})
									}
									history={this.props.history}
									dropdown={false}
									data={{
										to: to,
										name: fullnameGenerator(name, surname),
										is_trial: is_trial,
										status: status,
										group: group
									}}
								/>

								<Vacation data={data} history={this.props.history} />
								<GroupChange data={data} history={this.props.history} />
							</div>
						</div>
					</div>

					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Yoklama Geçmişi</h3>
								<button
									onClick={() => this.props.history.push("/app/rollcalls/player")}
									className="btn btn-sm btn-success ml-auto">
									Yoklama Oluştur
								</button>
							</div>
							<div className="card-body">
								<div className="row">
									<div class="col-sm-12 col-md-4 col-lg-4">
										<div class="card p-3 mb-0">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-green-light d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-check"></i>
												</span>
												<div>
													{this.generateRollcallTotalCount(rollcalls, 1, "Geldi")}
													{this.generateRollcallDate(rollcalls)}
												</div>
											</div>
										</div>
									</div>
									<div class="col-sm-12 col-md-4 col-lg-4">
										<div class="card p-3 mb-0">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-red-light d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-x"></i>
												</span>
												<div>
													{this.generateRollcallTotalCount(rollcalls, 0, "Gelmedi")}
													{this.generateRollcallDate(rollcalls)}
												</div>
											</div>
										</div>
									</div>
									<div class="col-sm-12 col-md-4 col-lg-4">
										<div class="card p-3 mb-0">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-yellow-light d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-alert-circle"></i>
												</span>
												<div>
													{this.generateRollcallTotalCount(rollcalls, [2, 3], "İzinli")}
													{this.generateRollcallDate(rollcalls)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover table-outline table-vcenter text-nowrap card-table text-center">
										<thead>
											<tr>
												<th className="w-1">Yoklama Tarihi</th>
												<th className="w-1">Durum</th>
												<th className="w-1">Not</th>
											</tr>
										</thead>
										<tbody>
											{rollcalls
												? Object.keys(rollcalls).length > 0
													? Object.keys(rollcalls)
															.reverse()
															.map((el, key) => {
																return (
																	<tr key={key.toString()}>
																		<td>{formatDate(el, "LL")}</td>
																		<td>
																			{this.renderRollcallStatus(
																				rollcalls[el].status
																			)}
																		</td>
																		<td>{rollcalls[el].note}</td>
																	</tr>
																);
															})
													: noRow()
												: noRow(true)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Rollcall;
