import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";
import { ListPlayers } from "../../services/Group";

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
			players: [],
			loadingData: true
		};
	}

	componentDidMount() {
		this.renderFetch(this.props.gid);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.detail.group_id != this.props.detail.group_id) {
			this.renderFetch(nextProps.detail.group_id);
		}
	}

	renderFetch(gid) {
		try {
			this.setState({ loadingData: true });
			ListPlayers({
				uid: localStorage.getItem("UID"),
				filter: {
					group_id: parseInt(gid)
				}
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data;
						this.setState({ players: data });
					}

					this.setState({ loadingData: false });
				}
			});
		} catch (e) {}
	}

	render() {
		const { detail, gid } = this.props;
		const { players, loadingData } = this.state;
		return (
			<div>
				<div className="card-header">
					<div className="card-status bg-teal" />
					<h3 className="card-title">{detail.name || ""}</h3>
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
										<label className="form-label">Öğrenci Yaşı: </label>
										<div className="ml-2">{detail.age}</div>
									</div>
									<div className="form-inline">
										<label className="form-label">Sorumlu Antrenör: </label>
										<Link to={"/app/employees/detail/" + detail.employee.uid} className="ml-2">
											{(detail.employee.name || "") + " " + (detail.employee.surname || "")}
										</Link>
									</div>
								</div>
							</div>
							<div className="row mt-5">
								<div className="col-12 mt-3">
									<label className="form-label text-center" style={{ fontSize: "1.15rem" }}>
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
																				backgroundImage: `url(${el.image})`
																			}}
																		/>
																	</td>
																	<td>
																		<div>
																			<Link
																				className="text-inherit"
																				to={"/app/players/detail/" + el.uid}>
																				{el.name + " " + el.surname}
																			</Link>
																		</div>
																		<div className="small text-muted">
																			Doğum Tarihi:
																			{el.birthday
																				? moment(el.birthday).format("LL")
																				: "—"}
																		</div>
																	</td>
																	<td>{el.position ? el.position : "—"}</td>
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
								pathname: "/app/groups/" + gid + "/edit",
								state: { type: "edit", detailGroup: detail }
							}}
							className="btn btn-link">
							Düzenle
						</Link>
						<div className="ml-auto d-flex align-items-center">
							Oluşturma tarihi:
							<strong className="m-2 font-italic">{moment(detail.created_date).format("LLL")}</strong>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Detail;
