import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { DetailPlayer, DeletePlayer, FreezePlayer, RefreshPlayer } from "../../services/Player.jsx";
import Tabs from "../../components/Players/Tabs";
import ActionButton from "../../components/Players/ActionButton";
import { showSwal, Toast } from "../../components/Alert";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import moment from "moment";

const genderToText = {
	0: "Erkek",
	1: "Kız"
};

const footToText = {
	0: "Sağ & Sol",
	1: "Sağ",
	2: "Sol"
};

const statusType = {
	0: "bg-danger",
	1: "bg-green",
	2: "bg-azure",
	3: "bg-indigo"
};

export class Detail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			image: "",
			name: "—",
			email: "—",
			phone: "—",
			birthday: "—",
			securityNo: "—",
			position: "—",
			point: "—",
			group: "—",
			fee: "—",
			branch: "—",
			gender: "—",
			foot: "—",
			foot_no: "—",
			branch: "—",
			note: "—",
			is_scholarship: 0,
			body_measure: null,
			emergency: null,
			is_trial: 1,
			body: { height: "—", weight: "—" },
			onLoadedData: false,
			data: {}
		};
	}

	componentDidMount() {
		const { uid, to } = this.state;
		DetailPlayer({ uid: uid, to: to }).then(response => {
			const stateData = {};
			if (response) {
				const status = response.status;
				stateData.body = {};
				if (status.code === 1020) {
					const data = response.data;
					stateData.body = {};
					stateData.name = `${data.name || ""} ${data.surname || ""}`;
					stateData.securityNo = data.security_id || "—";
					stateData.image = data.image || "—";
					stateData.email = data.email || "—";
					stateData.phone = data.phone || "—";
					stateData.birthday = data.birthday || "—";
					stateData.group = data.group || "—";
					stateData.fee = data.fee ? data.fee.format(2, 3, '.', ',') + " ₺" : "—";
					stateData.position = data.position || "—";
					stateData.branch = data.branch || "—";
					stateData.point = data.point || "—";
					stateData.gender = data.gender !== null ? genderToText[data.gender] : "—";
					stateData.body.height = data.attributes.body_height || "—";
					stateData.body.weight = data.attributes.body_weight || "—";
					stateData.address = data.address || "—";
					stateData.start_date = data.start_date ? moment(data.start_date).format("DD/MM/YYYY") : "—";
					stateData.end_date = data.end_date ? moment(data.end_date).format("DD/MM/YYYY") : null;
					stateData.blood = data.blood || "—";
					stateData.foot = data.foot !== null ? footToText[data.foot] : "—";
					stateData.foot_no = data.attributes.foot_no || "—";
					stateData.emergency = data.emergency;
					stateData.is_trial = data.is_trial;
					stateData.is_scholarship = data.is_scholarship;
					stateData.note = data.note || "—";
					stateData.status = data.status;
					stateData.body_measure = data.attributes.body_measure;
					stateData.onLoadedData = true;
				}
			}

			this.setState({ ...stateData });
		});
	}

	render() {
		const {
			to,
			image,
			name,
			email,
			phone,
			securityNo,
			point,
			position,
			group,
			fee,
			branch,
			birthday,
			address,
			body,
			gender,
			data,
			blood,
			emergency,
			body_measure,
			foot,
			foot_no,
			start_date,
			is_trial,
			note,
			is_scholarship,
			status,
			end_date,
			onLoadedData
		} = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Detay</h1>
					<div className="col" />
					<div className="col-auto px-0">{is_trial === 0 ? <Tabs match={match} to={to} /> : null}</div>
				</div>

				<div className="row">
					<div className="col-lg-4 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Genel Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
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
												<h4 className="m-0">{name}</h4>
												<p className="text-muted mb-0">{position}</p>
												<ul className="social-links list-inline mb-0 mt-2">
													<li className="list-inline-item">
														<a
															className="employee_email"
															href={`mailto:${email}`}
															data-original-title={email}
															data-toggle="tooltip">
															<i className="fa fa-envelope" />
														</a>
													</li>
													<li className="list-inline-item">
														<a
															className="employee_phone"
															href={`tel:${phone}`}
															data-original-title={phone}
															data-toggle="tooltip">
															<i className="fa fa-phone" />
														</a>
													</li>
												</ul>
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">T.C. Kimlik Numarası</label>
											<div className="form-control-plaintext">{securityNo}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Genel Puan</label>
											<div className="form-control-plaintext">{point}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Grup</label>
											<div className="form-control-plaintext">
												{typeof group === "object" ? (
													<Link to={`/app/groups/detail/${group.group_id}`}>
														{group.name}
													</Link>
												) : (
													<div className="form-control-plaintext">{group}</div>
												)}
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">Aidat</label>
											<div className="form-control-plaintext">
												{is_scholarship ? "BURSLU" : fee}
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">Branş</label>
											<div className="form-control-plaintext">{branch}</div>
										</div>

										<div className="form-group">
											<label className="form-label">Okula Başlama Tarihi</label>
											<div className="form-control-plaintext">{start_date}</div>
										</div>

										{end_date ? (
											<div className="form-group">
												<label className="form-label">Okuldan Ayrılma Tarihi</label>
												<div className="form-control-plaintext">{end_date}</div>
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
										name: name,
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
								<h3 className="card-title">Detay Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row">
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">Email</label>
													<div className="form-control-plaintext">{email}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Telefonu</label>
													<div className="form-control-plaintext">{phone}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Doğum Tarihi</label>
													<div className="form-control-plaintext">{birthday}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Adresi</label>
													<div className="form-control-plaintext">{address}</div>
												</div>
											</div>
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">Vücut Metrikleri (Boy & Kilo)</label>
													<div className="row gutters-xs">
														<div className="col-6">
															<div className="form-control-plaintext" id="body_height">
																<b>Boy: </b>
																<span>{body.height}cm</span>
															</div>
														</div>
														<div className="col-6">
															<div className="form-control-plaintext" id="body_weight">
																<b>Kilo: </b> <span>{body.weight}kg</span>
															</div>
														</div>
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Cinsiyeti</label>
													<div className="form-control-plaintext">{gender}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Kan Grubu</label>
													<div className="form-control-plaintext">{blood}</div>
												</div>
												<div className="form-group">
													<div className="row gutters-xs">
														<div className="col-6">
															<label className="form-label">Kullandığı Ayak</label>
															<div className="form-control-plaintext">{foot}</div>
														</div>
														<div className="col-6">
															<label className="form-label">Ayak Numarası</label>
															<div className="form-control-plaintext">{foot_no}</div>
														</div>
													</div>
												</div>
											</div>
											<div className="col-12 mt-3">
												<label className="form-label">Acil Durumda İletişim</label>
												<div className="table-responsive">
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="pl-0">Yakınlık</th>
																<th>Adı ve Soyadı</th>
																<th className="pl-0">Telefon</th>
															</tr>
														</thead>
														<tbody>
															{Array.isArray(emergency)
																? emergency.map((el, key) => {
																		return (
																			<tr key={key.toString()}>
																				<td className="pl-0 pr-0">
																					<div className="form-control-plaintext">
																						{el.kinship}
																					</div>
																				</td>
																				<td>
																					<div className="form-control-plaintext">
																						{el.name}
																					</div>
																				</td>
																				<td className="pl-0">
																					<div className="form-control-plaintext">
																						<a href={"tel:" + el.phone}>
																							{el.phone}
																						</a>
																					</div>
																				</td>
																			</tr>
																		);
																  })
																: null}
														</tbody>
													</table>
												</div>
											</div>
											<div className="col-12 mt-3">
												<label className="form-label">Vücut Ölçüleri</label>
												<div className="table-responsive">
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="pl-0">Tür</th>
																<th>Değer</th>
															</tr>
														</thead>
														<tbody>
															{Array.isArray(body_measure)
																? body_measure.map((el, key) => {
																		console.log(el);
																		if (el.type !== "" && el.value !== "")
																			return (
																				<tr key={key.toString()}>
																					<td className="pl-0 pr-0">
																						<div className="form-control-plaintext">
																							{el.type}
																						</div>
																					</td>
																					<td>
																						<div className="form-control-plaintext">
																							{el.value}cm
																						</div>
																					</td>
																				</tr>
																			);
																  })
																: null}
														</tbody>
													</table>
												</div>
											</div>
											<div className="col-12 mt-5">
												<div className="form-group">
													<label className="form-label">Not</label>
													<textarea
														type="text"
														row={3}
														className="form-control resize-none"
														disabled
														value={note}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Detail);
