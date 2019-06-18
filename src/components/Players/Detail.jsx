import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DetailPlayer } from "../../services/Player.jsx";

const genderToText = {
	0: "Erkek",
	1: "Kız"
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
			body: { height: "—", weight: "—" },
			onLoadedData: false
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
					stateData.fee = data.fee || "—";
					stateData.position = data.position || "—";
					stateData.branch = data.branch || "—";
					stateData.point = data.point || "—";
					stateData.gender = genderToText[data.gender] || "—";
					stateData.body.height = data.attributes.body_height || "—";
					stateData.body.weight = data.attributes.body_weight || "—";
					stateData.address = "—";
					stateData.blood = "—";
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
			blood,
			emergency,

			onLoadedData
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Detay</h1>
					<div className="col" />
					<div className="col-4">
						<select name="user" id="select-player" className="form-control custom-select" />
					</div>
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
											<div className="form-control-plaintext">{fee}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Branş</label>
											<div className="form-control-plaintext">{branch}</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer">
								<div className="d-flex justify-content-center">
									<Link to={`/app/players/edit/${to}`} className="btn btn-link btn-block">
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
													<label className="form-label">Kullandığı Ayak</label>
													<div className="form-control-plaintext">{blood}</div>
												</div>
												<div className="form-group">
													<label className="form-label">Ayak Numarası</label>
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
														<tbody />
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
														<tbody />
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
