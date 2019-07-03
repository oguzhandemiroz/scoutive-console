import React, { Component } from "react";
import List from "./List";
import { DetailGroup, ListPlayers } from "../../services/Group";
import { CreateRollcall } from "../../services/Rollcalls";
import { Toast, showSwal } from "../Alert";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";

const noRow = () => (
	<tr>
		<td colSpan="4" className="text-center text-muted font-italic">
			Kayıt bulunamadı...
		</td>
	</tr>
);

export class Detail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			detail: {
				name: "—",
				age: "—",
				time: "—",
				created_date: "—",
				employee: {},
				image: null
			},
			players: [],
			loadingData: true,
			onLoadedData: true,
			loadingButton: false
		};
	}

	componentDidMount() {
		const { gid } = this.props.match.params;
		this.renderGroupDetail(gid);
		this.renderPlayerList(gid);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.gid !== this.props.match.params.gid) {
			this.setState({
				loadingData: true
			});
			this.renderGroupDetail(nextProps.match.params.gid);
			this.renderPlayerList(nextProps.match.params.gid);
		}
	}

	renderGroupDetail = gid => {
		try {
			const { uid } = this.state;
			DetailGroup({
				uid: uid,
				group_id: parseInt(gid)
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						this.setState({
							detail: response.data,
							loadingData: false
						});
					}
				}
			});
		} catch (e) {}
	};

	renderPlayerList = gid => {
		try {
			const { uid } = this.state;
			ListPlayers({
				uid: uid,
				filter: {
					group_id: parseInt(gid)
				}
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data;
						this.setState({ players: data, loadingData: false });
					}
				}
			});
		} catch (e) {}
	};

	createRollcall = () => {
		try {
			const { uid } = this.state;
			const { gid } = this.props.match.params;
			this.setState({
				loadingButton: true
			});
			CreateRollcall({
				uid: uid,
				group_id: parseInt(gid),
				type: 0
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						Toast.fire({
							type: "success",
							title: "İşlem başarılı..."
						});
						this.props.history.push({
							pathname: `/app/rollcalls/player/add/${gid}`,
							state: { rcid: response.rollcall_id }
						});
					} else if (status.code === 2010) {
						showSwal({
							type: "warning",
							title: "Uyarı",
							text: status.description,
							reverseButtons: true,
							showCancelButton: true,
							confirmButtonText: "Yoklamaya devam et",
							cancelButtonText: "Kapat"
						}).then(result => {
							if (result.value) {
								this.props.history.push({
									pathname: `/app/rollcalls/player/add/${gid}`,
									state: { rcid: response.rollcall_id }
								});
							}
						});
					}
				}
				this.setState({
					loadingButton: false
				});
			});
		} catch (e) {}
	};

	render() {
		const { gid } = this.props.match.params;
		const { detail, loadingData, players, onLoadedData, loadingButton } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gruplar</h1>
				</div>
				<div className="row">
					<div className="col-lg-3 mb-4">
						<Link to="/app/groups/add" className="btn btn-block btn-secondary mb-6">
							<i className="fe fe-plus-square mr-2" />
							Grup Ekle
						</Link>
						<List match={this.props.match} />
						<div className="d-none d-lg-block mt-6">
							<Link to="/app/groups" className="text-muted float-right">
								Başa dön
							</Link>
						</div>
					</div>

					<div className="col-lg-9">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-teal" />
								<h3 className="card-title">{detail.name || ""}</h3>
								<div className="card-options">
									<button
										onClick={this.createRollcall}
										className={`btn btn-sm btn-success mr-2 ${
											loadingButton ? "btn-loading disabled" : ""
										} ${!onLoadedData ? "btn-loading disabled" : ""}`}>
										Yoklama Oluştur
									</button>
									<span
										className="tag tag-gray-dark"
										data-original-title="Antrenman Saati"
										data-offset="-35"
										data-toggle="tooltip">
										{detail.time.slice(0, -3)}
									</span>
								</div>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loadingData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row">
											<div className="col-auto">
												<span
													className="avatar avatar-xxxl"
													style={{
														border: "none",
														outline: "none",
														fontSize: ".875rem",
														backgroundImage: `url(${detail.image})`
													}}>
													{detail.image ? "" : "Logo"}
												</span>
											</div>
											<div className="col d-flex flex-column justify-content-center">
												<div className="form-inline">
													<label className="form-label">Öğrenci Yaşı: </label>
													<div className="ml-2">{detail.age}</div>
												</div>
												<div className="form-inline">
													<label className="form-label">Sorumlu Antrenör: </label>
													<Link
														to={"/app/employees/detail/" + detail.employee.uid}
														className="ml-2">
														{(detail.employee.name || "") +
															" " +
															(detail.employee.surname || "")}
													</Link>
												</div>
											</div>
										</div>
										<div className="row mt-5">
											<div className="col-12 mt-3">
												<label
													className="form-label text-center"
													style={{ fontSize: "1.15rem" }}>
													Öğrenciler
												</label>
												<div className="table-responsive">
													<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
														<thead>
															<tr>
																<th className="pl-0 w-1" />
																<th>Ad Soyad</th>
																<th>Mevkii</th>
																<th className="w-1 text-center">Genel Puan</th>
															</tr>
														</thead>
														<tbody>
															{players
																? players.length > 0
																	? players.map((el, key) => (
																			<tr key={key.toString()}>
																				<td className="text-center">
																					<div
																						className="avatar d-block"
																						style={{
																							backgroundImage: `url(${
																								el.image
																							})`
																						}}
																					/>
																				</td>
																				<td>
																					<div>
																						<Link
																							className="text-inherit"
																							to={
																								"/app/players/detail/" +
																								el.uid
																							}>
																							{el.name + " " + el.surname}
																						</Link>
																					</div>
																					<div className="small text-muted">
																						Doğum Tarihi:
																						{el.birthday
																							? moment(
																									new Date(
																										el.birthday
																									)
																							  ).format("LL")
																							: "—"}
																					</div>
																				</td>
																				<td>
																					{el.position ? el.position : "—"}
																				</td>
																				<td className="text-center">
																					{el.point ? el.point : "—"}
																				</td>
																			</tr>
																	  ))
																	: noRow()
																: noRow()}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer">
								<div className="d-flex">
									<Link
										to={{
											pathname: "/app/groups/edit/" + gid,
											state: { type: "edit", detailGroup: detail }
										}}
										className="btn btn-link">
										Düzenle
									</Link>
									<div className="ml-auto d-flex align-items-center">
										Oluşturma tarihi:
										<strong className="m-2 font-italic">
											{moment(new Date(detail.created_date)).format("LLL")}
										</strong>
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
