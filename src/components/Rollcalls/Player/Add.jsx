import React, { Component } from "react";
import { List as GroupList } from "./List";
import { DetailGroup } from "../../../services/Group";
import { ListRollcallType, MakeRollcall } from "../../../services/Rollcalls";
import { WarningModal as Modal } from "../WarningModal";
import { CreateVacation, UpdateVacation } from "../../../services/PlayerAction";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";

const statusType = {
	1: "check",
	2: "alert-circle",
	3: "btn-error"
};

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="5" className="text-center text-muted font-italic">
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

export class Add extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			players: null,
			statuses: [],
			loadingButtons: []
		};
	}

	componentDidMount() {
		this.renderPlayerList();
	}

	renderPlayerList = () => {
		try {
			const { uid } = this.state;
			const { rcid } = this.props.location.state;
			ListRollcallType(
				{
					uid: uid,
					rollcall_id: rcid
				},
				"players"
			).then(response => {
				if (response) {
					const data = response.data;
					const status = response.status;
					const dataList = [];
					const statusList = [];
					if (status.code === 1020) {
						data.map(el => {
							statusList.push({
								uid: el.uid,
								status: el.status
							});
						});
						this.setState({ players: data, statuses: statusList });
					}
				}
			});
		} catch (e) {}
	};

	takeRollcall = (to, type) => {
		try {
			/*
				- type 0 -> gelmedi
				- type 1 -> geldi
				- type 2 -> izinli
			*/
			const { uid, loadingButtons } = this.state;
			const { rcid } = this.props.location.state;
			console.log({
				uid: uid,
				to: to,
				status: parseInt(type),
				rollcall_id: parseInt(rcid)
			});
			this.setState({ loadingButtons: [...loadingButtons, to] });
			if (type === 2 || type === 3) {
				Promise.all([
					CreateVacation(
						{
							uid: uid,
							to: to,
							start: moment(new Date()).format("YYYY-MM-DD"),
							end: moment(new Date()).format("YYYY-MM-DD"),
							day: type === 2 ? 1 : 0.5,
							no_cost: 0
						},
						"player"
					),
					MakeRollcall(
						{
							uid: uid,
							to: to,
							status: parseInt(type),
							rollcall_id: parseInt(rcid)
						},
						"player"
					)
				]).then(([responseVacation, responseRollcall]) => {
					if (responseVacation && responseRollcall) {
						const vacationStatus = responseVacation.status;
						const rollcallStatus = responseRollcall.status;
						if (rollcallStatus.code === 1020) {
							if (vacationStatus.code === 1037) {
								UpdateVacation({
									uid: uid,
									vacation_id: responseVacation.data.vacation_id,
									update: {
										start: moment(new Date()).format("YYYY-MM-DD"),
										end: moment(new Date()).format("YYYY-MM-DD"),
										day: type === 2 ? 1 : 0.5,
										no_cost: 0
									}
								});
							}
							this.changeStatus(to, type);
						}
						this.removeButtonLoading(to);
					}
				});
			} else {
				MakeRollcall(
					{
						uid: uid,
						to: to,
						status: parseInt(type),
						rollcall_id: parseInt(rcid)
					},
					"player"
				).then(response => {
					if (response) {
						this.removeButtonLoading(to);
						this.changeStatus(to, type);
					}
				});
			}
		} catch (e) {}
	};

	removeButtonLoading = key => {
		const { loadingButtons } = this.state;
		const filteredButtons = loadingButtons.filter(x => x !== key);
		this.setState({ loadingButtons: filteredButtons });
	};

	changeStatus = (uid, type) => {
		const { statuses } = this.state;
		const filteredStatuses = statuses.filter(x => x.uid !== uid);
		filteredStatuses.push({
			uid: uid,
			status: type
		});
		this.setState({ statuses: filteredStatuses });
	};

	render() {
		const { gid } = this.props.match.params;
		const { detail, loadingData, players, statuses, loadingButtons } = this.state;
		return (
			<div className="container">
				<Modal />
				<div className="page-header">
					<h1 className="page-title">
						Yoklamalar &mdash; Öğrenci &mdash; Yoklama Al (#{this.props.location.state.rcid})
					</h1>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-teal" />
								<h3 className="card-title">Öğrenci Listesi</h3>
								<div className="card-options">
									<span
										className="form-help bg-gray-dark text-white"
										data-toggle="popover"
										data-placement="bottom"
										data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"gelmedi"</b> şeklinde tanımlanır.</p><p><b className="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
										!
									</span>
									<Modal />
								</div>
							</div>

							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
										<thead>
											<tr>
												<th className="pl-0 w-1" />
												<th>Ad Soyad</th>
												<th>Telefon</th>
												<th>Veli İletişim</th>
												<th className="pr-3 w-1 text-center">Durum</th>
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
																</td>
																<td>
																	{el.phone ? (
																		<a href={`tel:${el.phone}`} title={el.phone}>
																			{el.phone}
																		</a>
																	) : (
																		"—"
																	)}
																</td>
																<td>
																	{el.emergency
																		? el.emergency.map((el, key) => {
																				return (
																					<div key={key.toString()}>
																						<div className="small text-muted">
																							{el.kinship
																								? el.kinship
																								: "—"}
																						</div>
																						<a
																							href={`tel:${el.phone}`}
																							title={`${el.kinship}`}>
																							{el.phone}
																						</a>
																					</div>
																				);
																		  })
																		: "—"}
																</td>
																<td className="pr-3 text-center">
																	<button
																		onClick={() => this.takeRollcall(el.uid, 1)}
																		title="Geldi"
																		data-toggle="tooltip"
																		className={`btn btn-icon btn-sm ${
																			statuses.find(x => x.uid === el.uid)
																				.status === 1
																				? "disable-overlay btn-success"
																				: "btn-secondary"
																		} ${
																			loadingButtons.find(x => x === el.uid)
																				? "btn-loading"
																				: ""
																		}`}>
																		<i className="fe fe-check" />
																	</button>

																	<button
																		data-toggle="dropdown"
																		title="İzinli"
																		className={`btn btn-icon btn-sm ${
																			statuses.find(x => x.uid === el.uid)
																				.status === 2 ||
																			statuses.find(x => x.uid === el.uid)
																				.status === 3
																				? "btn-warning"
																				: "btn-secondary"
																		} mx-2 ${
																			loadingButtons.find(x => x === el.uid)
																				? "btn-loading"
																				: ""
																		}`}>
																		<i className="fe fe-alert-circle" />
																	</button>
																	<div className="dropdown-menu">
																		<button
																			onClick={() => this.takeRollcall(el.uid, 2)}
																			className="dropdown-item">
																			Tam Gün
																		</button>
																		<button
																			onClick={() => this.takeRollcall(el.uid, 3)}
																			className="dropdown-item">
																			Yarım Gün
																		</button>
																	</div>

																	<button
																		onClick={() => this.takeRollcall(el.uid, 0)}
																		title="Gelmedi"
																		data-toggle="tooltip"
																		className={`btn btn-icon btn-sm ${
																			statuses.find(x => x.uid === el.uid)
																				.status === 0
																				? "disable-overlay btn-danger"
																				: "btn-secondary"
																		} ${
																			loadingButtons.find(x => x === el.uid)
																				? "btn-loading"
																				: ""
																		}`}>
																		<i className="fe fe-x" />
																	</button>
																</td>
															</tr>
													  ))
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

export default Add;
