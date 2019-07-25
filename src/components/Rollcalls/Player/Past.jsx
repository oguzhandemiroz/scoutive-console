import React, { Component } from "react";
import { List as GroupList } from "./List";
import { DetailGroup, ListPlayers } from "../../../services/Group";
import { ListRollcall, CreateRollcall } from "../../../services/Rollcalls";
import { Toast, showSwal } from "../../Alert";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="4" className="text-center text-muted font-italic">
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

export class Past extends Component {
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
			loadingData: true,
			rollcallList: null,
			onLoadedData: true,
			loadingButton: false
		};
	}

	componentDidMount() {
		const { gid } = this.props.match.params;
		this.renderGroupDetail(gid);
		this.renderRollcallList(gid);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.gid !== this.props.match.params.gid) {
			this.setState({
				loadingData: true
			});
			this.renderGroupDetail(nextProps.match.params.gid);
			this.renderRollcallList(nextProps.match.params.gid);
		}
	}

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

	renderRollcallList = gid => {
		try {
			const { uid } = this.state;
			ListRollcall({
				uid: uid,
				group_id: gid,
				type: 0
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						this.setState({ rollcallList: response.data.reverse() });
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
		const { detail, loadingData, rollcallList, onLoadedData, loadingButton } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Öğrenciler</h1>
				</div>
				<div className="row">
					<div className="col-lg-3 mb-4">
						<div className="card">
							<div className="card-header justify-content-center" style={{ minHeight: 2 }}>
								Gruplar
							</div>
						</div>
						<GroupList match={this.props.match} />
					</div>
					<div className="col-lg-9">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-teal" />
								<h3 className="card-title">
									<Link className="font-weight-600" to={`/app/groups/detail/${gid}`}>
										{detail.name || ""}
									</Link>{" "}
									&mdash; Geçmiş Yoklama Listesi
								</h3>
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
													<label className="form-label">Grup Yaş Aralığı: </label>
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
													Geçmiş Yoklamalar
												</label>
												<div className="table-responsive">
													<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
														<thead>
															<tr>
																<th className="pl-0 w-1" />
																<th>Yoklama Tarihi</th>
																<th className="text-center">
																	Detay
																	<span
																		className="form-help ml-2"
																		data-original-title="Gelen/Toplam"
																		data-toggle="tooltip"
																		data-placement="top">
																		?
																	</span>
																</th>
																<th className="pr-3 w-1 text-center">İncele</th>
															</tr>
														</thead>
														<tbody>
															{rollcallList
																? rollcallList.length > 0
																	? rollcallList.map((el, key) => {
																			const redirect =
																				el.status === 2
																					? {
																							pathname:
																								"/app/rollcalls/player/add/" +
																								gid,
																							state: {
																								rcid: el.rollcall_id
																							}
																					  }
																					: {
																							pathname: `/app/rollcalls/player/detail/${gid}/${el.rollcall_id}`
																					  };
																			return (
																				<tr key={key.toString()}>
																					<td className="pl-3 text-center text-muted">
																						#{rollcallList.length - key}
																					</td>
																					<td>
																						<span className="badge badge-danger mr-2">
																							{el.status === 2
																								? "Devam ediyor"
																								: ""}
																						</span>
																						<Link
																							className="text-inherit"
																							to={redirect}>
																							{moment(
																								el.created_date
																							).format("LLL")}
																						</Link>
																					</td>
																					<td className="text-center">
																						{el.came + "/" + el.total}
																					</td>
																					<td className="pr-3">
																						<Link
																							to={redirect}
																							className={`btn btn-sm btn-block btn-${
																								el.status === 1
																									? "secondary"
																									: "info"
																							}`}>
																							{el.status === 1
																								? "İncele"
																								: "Devam et"}
																						</Link>
																					</td>
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
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Past;
