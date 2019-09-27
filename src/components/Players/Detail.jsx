import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DetailPlayer } from "../../services/Player.jsx";
import Tabs from "../../components/Players/Tabs";
import PersonCard from "./PersonCard";
import moment from "moment";
import { formatPhone, nullCheck, formatDate } from "../../services/Others.jsx";

const genderToText = {
	0: "Erkek",
	1: "Kız"
};

const footToText = {
	0: "Sağ & Sol",
	1: "Sağ",
	2: "Sol"
};

export class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			loading: "active",
			attributes: { body_height: null, body_weight: null }
		};
	}

	componentDidMount() {
		this.detailPlayer();
	}

	detailPlayer = () => {
		const { uid, to } = this.state;
		DetailPlayer({ uid: uid, to: to }).then(response => {
			if (response !== null) {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					delete data.uid;
					this.setState({ ...data, loading: "" });
				}
			}
		});
	};

	render() {
		const {
			to,
			email,
			phone,
			birthday,
			address,
			gender,
			blood,
			emergency,
			foot,
			note,
			attributes,
			loading
		} = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Detay</h1>
					<div className="col" />
					<div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
				</div>

				<div className="row">
					<PersonCard data={this.state} history={this.props.history} />
					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Detay Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loading}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row">
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">Email</label>
													<div className="form-control-plaintext">{nullCheck(email)}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Telefonu</label>
													<div className="form-control-plaintext">{formatPhone(phone)}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Doğum Tarihi</label>
													<div className="form-control-plaintext">{formatDate(birthday, "LL")}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Adresi</label>
													<div className="form-control-plaintext">{nullCheck(address)}</div>
												</div>
											</div>
											<div className="col-lg-6 col-md-12">
												<div className="form-group">
													<label className="form-label">Vücut Metrikleri (Boy & Kilo)</label>
													<div className="row gutters-xs">
														<div className="col-6">
															<div className="form-control-plaintext" id="body_height">
																<b>Boy: </b>
																<span>{nullCheck(attributes.body_height)}cm</span>
															</div>
														</div>
														<div className="col-6">
															<div className="form-control-plaintext" id="body_weight">
																<b>Kilo: </b>
																<span>{nullCheck(attributes.body_weight)}kg</span>
															</div>
														</div>
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Cinsiyeti</label>
													<div className="form-control-plaintext">
														{nullCheck(genderToText[gender])}
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Kan Grubu</label>
													<div className="form-control-plaintext">
														{blood ? blood.label : "—"}
													</div>
												</div>
												<div className="form-group">
													<div className="row gutters-xs">
														<div className="col-6">
															<label className="form-label">Kullandığı Ayak</label>
															<div className="form-control-plaintext">
																{nullCheck(footToText[foot])}
															</div>
														</div>
														<div className="col-6">
															<label className="form-label">Ayak Numarası</label>
															<div className="form-control-plaintext">
																{nullCheck(attributes.foot_no)}
															</div>
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
																		if (el.phone !== "")
																			return (
																				<tr key={key.toString()}>
																					<td className="pl-0 pr-0">
																						<div className="form-control-plaintext">
																							{nullCheck(el.kinship)}
																						</div>
																					</td>
																					<td>
																						<div className="form-control-plaintext">
																							{nullCheck(el.name)}
																						</div>
																					</td>
																					<td className="pl-0">
																						<div className="form-control-plaintext">
																							<a href={"tel:" + el.phone}>
																								{formatPhone(el.phone)}
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
															{Array.isArray(attributes.body_measure)
																? attributes.body_measure.map((el, key) => {
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
													<div className="form-control-plaintext">{nullCheck(note)}</div>
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
