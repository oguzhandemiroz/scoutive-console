import React, { Component } from "react";
import ReactDOM from "react-dom";
import { WarningModal as Modal } from "../WarningModal";
import { ListRollcallType, MakeRollcall } from "../../../services/Rollcalls";
import { CreateVacation, UpdateVacation } from "../../../services/PlayerAction";
import { fullnameGenerator } from "../../../services/Others";
import { BrowserRouter, Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";
import ep from "../../../assets/js/urls";
import { errorSwal, fatalSwal } from "../../Alert";

const $ = require("jquery");
$.DataTable = require("datatables.net");

const statusType = {
	1: "check",
	2: "alert-circle",
	3: "btn-error"
};

const datatable_turkish = {
	sDecimal: ",",
	sEmptyTable: "Tabloda herhangi bir veri mevcut değil",
	sInfo: "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
	sInfoEmpty: "Kayıt yok",
	sInfoFiltered: "(_MAX_ kayıt içerisinden bulunan)",
	sInfoPostFix: "",
	sInfoThousands: ".",
	sLengthMenu: "Sayfada _MENU_ kayıt göster",
	sLoadingRecords: "Yükleniyor...",
	sProcessing: "İşleniyor...",
	sSearch: "Ara: ",
	sZeroRecords: "Eşleşen kayıt bulunamadı",
	oPaginate: {
		sFirst: "İlk",
		sLast: "Son",
		sNext: "Sonraki",
		sPrevious: "Önceki"
	},
	oAria: {
		sSortAscending: ": artan sütun sıralamasını aktifleştir",
		sSortDescending: ": azalan sütun sıralamasını aktifleştir"
	},
	select: {
		rows: {
			_: "%d kayıt seçildi",
			"0": "",
			"1": "1 kayıt seçildi"
		}
	}
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
		this.dataPlayerList();
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

	dataPlayerList = () => {
		try {
			const { gid } = this.props.match.params;
			const { uid, detail, loadingData, players, statuses, loadingButtons } = this.state;
			const { rcid } = this.props.location.state;
			$("#rollcall-player-list").DataTable({
				responsive: true,
				order: [2, "asc"],
				aLengthMenu: [[50, 100, -1], [50, 100, "Tümü"]],
				language: {
					...datatable_turkish,
					decimal: ",",
					thousands: "."
				},
				ajax: {
					url: ep.ROLLCALL_LIST_TYPE + "players",
					type: "POST",
					datatype: "json",
					contentType: "application/json",
					beforeSend: function(request) {
						request.setRequestHeader("Content-Type", "application/json");
						request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
						request.setRequestHeader("Authorization", uid);
					},
					data: function(d) {
						return JSON.stringify({
							uid: uid,
							rollcall_id: rcid
						});
					},
					dataSrc: function(d) {
						if (d.status.code !== 1020) {
							errorSwal(d.status);
							return [];
						} else {
							const statusList = [];
							d.data.map(el => {
								statusList.push({
									uid: el.uid,
									status: el.status
								});
							});
							this.setState({ statuses: statusList });
							return d.data;
						}
					}.bind(this)
				},
				columnDefs: [
					{
						targets: [0],
						visible: false
					},
					{
						targets: "no-sort",
						orderable: false
					},
					{
						targets: "name",
						createdCell: (td, cellData, rowData) => {
							console.log(cellData);
							const fullname = fullnameGenerator(cellData, rowData.surname);
							ReactDOM.render(
								<BrowserRouter>
									<Link
										onClick={() => this.props.history.push("/app/players/detail/" + rowData.uid)}
										to={"/app/players/detail/" + rowData.uid}
										className="text-truncate d-block text-inherit"
										style={{ maxWidth: "160px" }}
										data-toggle="tooltip"
										data-placement="top"
										data-original-title={fullname}>
										{fullname}
									</Link>
								</BrowserRouter>,
								td
							);
						}
					},
					{
						targets: "image",
						createdCell: function(td, cellData) {
							console.log(cellData);
							ReactDOM.render(
								<div
									className="avatar d-block"
									style={{
										backgroundImage: `url(${cellData})`
									}}
								/>,
								td
							);
						}
					},
					{
						targets: "state",
						createdCell: function(td, cellData, rowData) {
							console.log(statuses);
							ReactDOM.render(
								<div>
									<button
										onClick={() => this.takeRollcall(rowData.uid, 1)}
										title="Geldi"
										data-toggle="tooltip"
										className={`btn btn-icon btn-sm ${
											rowData.status === 1 ? "disable-overlay btn-success" : "btn-secondary"
										} ${loadingButtons.find(x => x === rowData.uid) ? "btn-loading" : ""}`}>
										<i className="fe fe-check" />
									</button>

									<button
										data-toggle="dropdown"
										title="İzinli"
										className={`btn btn-icon btn-sm ${
											rowData.status === 2 || rowData.status === 3
												? "btn-warning"
												: "btn-secondary"
										} mx-2 ${loadingButtons.find(x => x === rowData.uid) ? "btn-loading" : ""}`}>
										<i className="fe fe-alert-circle" />
									</button>
									<div className="dropdown-menu">
										<button
											onClick={() => this.takeRollcall(rowData.uid, 2)}
											className="dropdown-item">
											Tam Gün
										</button>
										<button
											onClick={() => this.takeRollcall(rowData.uid, 3)}
											className="dropdown-item">
											Yarım Gün
										</button>
									</div>

									<button
										onClick={() => this.takeRollcall(rowData.uid, 0)}
										title="Gelmedi"
										data-toggle="tooltip"
										className={`btn btn-icon btn-sm ${
											rowData.status === 0 ? "disable-overlay btn-danger" : "btn-secondary"
										} ${loadingButtons.find(x => x === rowData.uid) ? "btn-loading" : ""}`}>
										<i className="fe fe-x" />
									</button>
								</div>,
								td
							);
						}
					}
				],
				columns: [
					{
						data: "uid"
					},
					{
						data: "image"
					},
					{
						data: "name"
					},
					{
						data: "emergency",
						render: function(data, type, row) {
							var elem = "";
							var j = 0;
							if (data) {
								data.map(el => {
									if (el.phone !== "" && el.name !== "" && el.kinship !== "") {
										j++;
										elem += `<a href="tel:${el.phone}" data-toggle="tooltip" data-placement="left" data-original-title="${el.kinship}" class="text-inherit d-block">${el.phone}</a> `;
									}
								});
							} else {
								elem = "&mdash;";
							}
							if (j === 0) elem = "&mdash;";
							return elem;
						}
					},
					{
						data: "group",
						render: function(data) {
							if (data) return data.name;
							else return "&mdash;";
						}
					}
				]
			});

			$.fn.DataTable.ext.errMode = "none";
			$("#rollcall-player-list").on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			$("#rollcall-player-list").on("draw.dt", function() {
				$('[data-toggle="tooltip"]').tooltip();
			});
		} catch (e) {
			fatalSwal();
		}
	};

	componentWillUnmount() {
		$(".data-table-wrapper")
			.find("table")
			.DataTable()
			.destroy(true);
	}

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
									<table
										id="rollcall-player-list"
										className="table table-hover table-outline table-vcenter text-nowrap card-table datatable mb-0">
										<thead>
											<tr>
												<th className="uid pl-0 w-1 no-sort" />
												<th className="image pl-0 w-1 no-sort" />
												<th className="name">Ad Soyad</th>
												<th className="emergency no-sort">Veli İletişim</th>
												<th className="state pr-3 w-1 text-center no-sort">Durum</th>
											</tr>
										</thead>
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
