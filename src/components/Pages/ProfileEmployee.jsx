import React, { Component } from "react";
import { DetailEmployee } from "../../services/Employee.jsx";
import { Link } from "react-router-dom";

export class Detail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			name: "—",
			email: "—",
			phone: "—",
			securityNo: "—",
			position: "—",
			branch: "—",
			address: "—",
			blood: "—",
			gender: "—",
			birthday: "—",
			body: { height: "—", weight: "—" },
			image: "",
			emergency: null,
			certificate: null,
			school: null,
			onLoadedData: false
		};
	}

	componentDidMount() {
		const { uid, to } = this.state;
		DetailEmployee({
			uid: uid,
			to: to
		}).then(response => {
			if (response !== null) {
				const status = response.status;
				const stateData = {};
				stateData.body = {};
				if (status.code === 1020) {
					const data = response.data;
					stateData.name = `${data.name || ""} ${data.surname || ""}`;
					stateData.position = data.position || "—";
					stateData.securityNo = data.security_id || "—";
					stateData.phone = data.phone || "—";
					stateData.email = data.email || "—";
					stateData.branch = data.branch || "—";
					stateData.image = data.image || "—";
					stateData.address = data.address || "—";
					stateData.gender = data.gender !== null ? data.gender : "—";
					stateData.birthday = data.birthday || "—";
					stateData.blood = data.blood || "—";
					stateData.emergency = data.emergency;
					stateData.school = data.school_history;
					stateData.certificate = data.certificates;
					stateData.body.height = data.attributes.body_height ? data.attributes.body_height : "—";
					stateData.body.weight = data.attributes.body_weight ? data.attributes.body_weight : "—";
					stateData.onLoadedData = true;

					this.setState({ ...stateData });
				}
			}
		});
	}

	render() {
		const {
			name,
			email,
			phone,
			position,
			securityNo,
			branch,
			image,
			address,
			blood,
			gender,
			birthday,
			body,
			emergency,
			school,
			certificate,
			to,
			onLoadedData
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Profil</h1>
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
												style={{ backgroundImage: `url(${image})` }}
											/>
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
															href={`tel:+90${phone}`}
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
											<label className="form-label">Branşı</label>
											<div className="form-control-plaintext">{branch}</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer">
								<div className="d-flex justify-content-center">
									<Link
										data-toggle="tooltip"
										data-original-title="Bilgilerini düzenlemek için yönetici ile iletişime geçmelisin."
										className={`btn ${!onLoadedData ? "disabled" : ""} btn-link btn-block`}>
										Bilgileri Düzenle
									</Link>
								</div>
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
													<label className="form-label">Vücut Metrikleri</label>
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
													<div className="form-control-plaintext">
														{gender === 0 ? "Erkek" : "Kadın"}
													</div>
												</div>
												<div className="form-group">
													<label className="form-label">Kan Grubu</label>
													<div className="form-control-plaintext">{blood}</div>
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
																? emergency.map((el, idx) => {
																		if (
																			(el.kinship !== "") &
																			(el.name !== "") &
																			(el.phone !== "")
																		)
																			return (
																				<tr key={idx.toString()}>
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
																							<a href={"tel:+90" + el.phone}>
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
												<label className="form-label">Okul Bilgileri</label>
												<div className="table-responsive">
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="pl-0">Başl. Yılı</th>
																<th>Bitiş Yılı</th>
																<th className="pl-0">Okul Adı</th>
															</tr>
														</thead>
														<tbody>
															{school
																? school.map((el, idx) => {
																		if (
																			(el.start !== "") &
																			(el.end !== "") &
																			(el.name !== "")
																		)
																			return (
																				<tr key={idx.toString()}>
																					<td className="pl-0 pr-0">
																						<div className="form-control-plaintext">
																							{el.start}
																						</div>
																					</td>
																					<td>
																						<div className="form-control-plaintext">
																							{el.end}
																						</div>
																					</td>
																					<td className="pl-0">
																						<div className="form-control-plaintext">
																							{el.name}
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
												<label className="form-label">Sertifikalar</label>
												<div className="table-responsive">
													<table className="table mb-0">
														<thead>
															<tr>
																<th className="pl-0">Aldığı Yıl</th>
																<th>TÜRÜ</th>
																<th className="pl-0">Aldığı Kurum</th>
															</tr>
														</thead>
														<tbody>
															{certificate
																? certificate.map((el, idx) => {
																		if (
																			(el.type !== "") &
																			(el.year !== "") &
																			(el.corporation !== "")
																		)
																			return (
																				<tr key={idx.toString()}>
																					<td className="pl-0 pr-0">
																						<div className="form-control-plaintext">
																							{el.year}
																						</div>
																					</td>
																					<td>
																						<div className="form-control-plaintext">
																							{el.type}
																						</div>
																					</td>
																					<td className="pl-0">
																						<div className="form-control-plaintext">
																							{el.corporation}
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

export default Detail;
