import React, { Component } from "react";
import { ListRollcallType } from "../../../services/Rollcalls";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";

const statusType = {
	"-1": { icon: "x", color: "danger", text: "Gelmedi" },
	"0": { icon: "x", color: "danger", text: "Gelmedi" },
	"1": { icon: "check", color: "success", text: "Geldi" },
	"2": { icon: "alert-circle", color: "warning", text: "İzinli" },
	"3": { icon: "alert-circle", color: "warning", text: "İzinli" }
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

export class Detail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			players: null,
			loadingData: true
		};
	}

	componentDidMount() {
		this.renderPlayerList();
	}

	renderPlayerList = () => {
		try {
			const { uid } = this.state;
			const { rcid } = this.props.match.params;
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
								status: el.daily
							});
						});
						this.setState({ players: data, statuses: statusList });
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
					<h1 className="page-title">
						Yoklamalar &mdash; Öğrenci &mdash; Yoklama Geçmişi (#{this.props.match.params.rcid || 0})
					</h1>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-azure" />
								<h3 className="card-title">Öğrenci Listesi</h3>
								<div className="card-options">
									<span
										className="form-help bg-gray-dark text-white"
										data-toggle="popover"
										data-placement="bottom"
										data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"gelmedi"</b> şeklinde tanımlanır.</p><p><b class="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
										!
									</span>
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
												<th className="w-1 text-center">Durum</th>
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
																				if (
																					el.phone !== "" &&
																					el.name !== "" &&
																					el.kinship !== ""
																				)
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
																<td className="text-center">
																	<div
																		data-toggle="tooltip"
																		title={statusType[el.status].text}
																		className={`text-${statusType[el.status].color}`}
																		style={{ fontSize: 20 }}>
																		<i
																			className={`fe fe-${statusType[el.status].icon}`}
																		/>
																	</div>
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

export default Detail;
