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
			loadingData: true
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

	render() {
		const { gid, rcid } = this.props.match.params;
		const { detail, loadingData, players } = this.state;
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
									&mdash; Grup Yoklaması &mdash; {moment(rcid).format("LLL")}
								</h3>
								<div className="card-options">
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
													Öğrenciler
												</label>
												<div className="table-responsive">
													<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
														<thead>
															<tr>
																<th className="pl-0 w-1" />
																<th>Ad Soyad</th>
																<th className="w-1 text-center">İşlem</th>
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
																									el.birthday
																							  ).format("LL")
																							: "—"}
																					</div>
																				</td>
																				<td
																					className="text-center text-green"
																					style={{ fontSize: 20 }}>
																					<i className="fe fe-check" />
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
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Detail;