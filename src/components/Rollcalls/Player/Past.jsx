import React, { Component } from "react";
import { List as GroupList } from "./List";
import { DetailGroup, ListPlayers } from "../../../services/Group";
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
			past: []
		};
	}

	componentDidMount() {
		const { gid } = this.props.match.params;
		this.renderGroupDetail(gid);
		this.setState({
			past: [
				{
					date: "2019-06-21 19:06:57"
				}
			]
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.gid !== this.props.match.params.gid) {
			this.setState({
				loadingData: true
			});
			this.renderGroupDetail(nextProps.match.params.gid);
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

	render() {
		const { gid } = this.props.match.params;
		const { detail, loadingData, past } = this.state;
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
									<Link
										className="btn btn-sm btn-success mr-2"
										to={"/app/rollcalls/player/add/" + gid}>
										Yoklama Oluştur
									</Link>
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
													Geçmiş Yoklamalar
												</label>
												<div className="table-responsive">
													<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
														<thead>
															<tr>
																<th className="pl-0 w-1" />
																<th>Yoklama Adı</th>
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
															{past.length > 0
																? past.map((el, key) => (
																		<tr key={key.toString()}>
																			<td className="pl-3 text-center text-muted">
																				#{key + 1}
																			</td>
																			<td>
																				<div>
																					<Link
																						className="text-inherit"
																						to={`/app/rollcalls/player/detail/${gid}/${
																							el.date
																						}`}>
																						{moment(el.date).format("LLL")}
																					</Link>
																				</div>
																			</td>
																			<td className="text-center">15/19</td>
																			<td className="pr-3 text-center">
																				<Link
																					className="btn btn-sm btn-info"
																					to={`/app/rollcalls/player/detail/${gid}/${
																						el.date
																					}`}>
																					İncele
																					<i className="fe fe-arrow-right ml-2" />
																				</Link>
																			</td>
																		</tr>
																  ))
																: noRow()}
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
