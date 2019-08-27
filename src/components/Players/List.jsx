import React, { Component } from "react";
import { datatable_turkish } from "../../assets/js/core";
import ep from "../../assets/js/urls";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { showSwal, Toast } from "../Alert";
import { DeletePlayer, FreezePlayer, RefreshPlayer } from "../../services/Player";
import { fullnameGenerator } from "../../services/Others";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons/js/buttons.colVis";
const $ = require("jquery");
$.DataTable = require("datatables.net-buttons");

var dailyType = {
	"-1": ["Tanımsız", "secondary"],
	"0": ["Gelmedi", "danger"],
	"1": ["Geldi", "success"],
	"2": ["T. Gün İzinli", "warning"],
	"3": ["Y. Gün İzinli", "warning"]
};

var statusType = {
	0: "bg-gray",
	1: "bg-success",
	2: "bg-azure",
	3: "bg-indigo"
};

const initialState = {
	vacation: false,
	group_change: false
};

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: {},
			...initialState
		};
	}

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	deletePlayer = (to, name) => {
		try {
			const { uid } = this.state;
			showSwal({
				type: "warning",
				title: "Emin misiniz?",
				html: `<b>${name}</b> adlı öğrencinin <b>kaydını silmek</b> istediğinize emin misiniz?`,
				confirmButtonText: "Evet",
				cancelButtonText: "Hayır",
				cancelButtonColor: "#868e96",
				confirmButtonColor: "#cd201f",
				showCancelButton: true,
				reverseButtons: true
			}).then(result => {
				if (result.value) {
					DeletePlayer({
						uid: uid,
						to: to
					}).then(response => {
						if (response) {
							const status = response.status;
							if (status.code === 1020) {
								Toast.fire({
									type: "success",
									title: "İşlem başarılı..."
								});
								setTimeout(() => this.reload(), 1000);
							}
						}
					});
				}
			});
		} catch (e) {}
	};

	freezePlayer = (to, name) => {
		try {
			const { uid } = this.state;
			showSwal({
				type: "warning",
				title: "Emin misiniz?",
				html: `<b>${name}</b> adlı öğrencinin <b>kaydını dondurmak</b> istediğinize emin misiniz?`,
				confirmButtonText: "Evet",
				cancelButtonText: "Hayır",
				cancelButtonColor: "#868e96",
				confirmButtonColor: "#cd201f",
				showCancelButton: true,
				reverseButtons: true
			}).then(result => {
				if (result.value) {
					FreezePlayer({
						uid: uid,
						to: to
					}).then(response => {
						if (response) {
							const status = response.status;
							if (status.code === 1020) {
								Toast.fire({
									type: "success",
									title: "İşlem başarılı..."
								});
								setTimeout(() => this.reload(), 1000);
							}
						}
					});
				}
			});
		} catch (e) {}
	};

	refreshPlayer = (to, name) => {
		try {
			const { uid } = this.state;
			showSwal({
				type: "warning",
				title: "Emin misiniz?",
				html: `<b>${name}</b> adlı öğrencinin <b>kaydını yenilemek</b> istediğinize emin misiniz?`,
				confirmButtonText: "Evet",
				cancelButtonText: "Hayır",
				cancelButtonColor: "#868e96",
				confirmButtonColor: "#cd201f",
				showCancelButton: true,
				reverseButtons: true
			}).then(result => {
				if (result.value) {
					RefreshPlayer({
						uid: uid,
						to: to
					}).then(response => {
						if (response) {
							const status = response.status;
							if (status.code === 1020) {
								Toast.fire({
									type: "success",
									title: "İşlem başarılı..."
								});
								setTimeout(() => this.reload(), 1000);
							}
						}
					});
				}
			});
		} catch (e) {}
	};

	componentDidMount() {
		try {
			const UID = localStorage.getItem("UID");
			const table = $("#player-list").DataTable({
				dom: '<"top"f>rt<"bottom"ilp><"clear">',
				/*buttons: [
					{
						text: "My button",
						className: "btn btn-secondary",
						action: function(e, dt, node, config) {
							$.fn.dataTable.ext.search = [];
							$.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
								if (dt.ajax.json().data[dataIndex].status === 1) return true;
								else return false;
							});
							dt.draw();
						}
					}
				],*/
				responsive: true,
				fixedHeader: true,
				order: [3, "asc"],
				aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
				stateSave: false, // change true
				language: {
					...datatable_turkish,
					decimal: ",",
					thousands: "."
				},
				columnDefs: [
					{
						targets: [0, 1],
						visible: false
					},
					{
						targets: "no-sort",
						orderable: false
					},
					{
						targets: "action",
						createdCell: (td, cellData, rowData) => {
							const fullname = fullnameGenerator(rowData.name, rowData.surname);
							const { uid, group, status } = rowData;
							ReactDOM.render(
								<BrowserRouter>
									<div className="dropdown btn-block" id="action-dropdown">
										<button
											type="button"
											id="player-action"
											className="btn btn-sm btn-secondary btn-block dropdown-toggle"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false">
											İşlem
										</button>
										<div
											className="dropdown-menu dropdown-menu-right"
											aria-labelledby="player-action"
											x-placement="top-end">
											<a className="dropdown-item disabled text-azure" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-user text-azure" />
												{fullname}
											</a>
											<div role="separator" className="dropdown-divider" />

											<Link
												onClick={() => this.props.history.push(`/app/players/payment/${uid}`)}
												className="dropdown-item action-pay-salary"
												to={`/app/players/payment/${uid}`}>
												<i className="dropdown-icon fa fa-hand-holding-usd" /> Ödeme Al
											</Link>
											{status === 1 ? (
												<div>
													<a
														className="dropdown-item action-warning"
														href="javascript:void(0)">
														<i className="dropdown-icon fa fa-exclamation-triangle" /> Ödeme
														İkazı
													</a>
													<a
														className="dropdown-item action-change-password"
														href="javascript:void(0)">
														<i className="dropdown-icon fa fa-hand-holding-heart" /> Burs
														Ver
													</a>
												</div>
											) : null}
											<div role="separator" className="dropdown-divider" />
											{status === 1 ? (
												<button
													className="dropdown-item action-advance-payment"
													onClick={() => this.freezePlayer(uid, fullname)}>
													<i className="dropdown-icon fa fa-snowflake" /> Kaydı Dondur
												</button>
											) : status === 2 ? (
												<button
													className="dropdown-item action-advance-payment"
													onClick={() => this.refreshPlayer(uid, fullname)}>
													<i className="dropdown-icon fa fa-sync-alt" /> Kaydı Yenile
												</button>
											) : null}
											<button
												className="dropdown-item action-salary-raise"
												onClick={() => this.deletePlayer(uid, fullname)}>
												<i className="dropdown-icon fa fa-user-times" /> Kaydı Sil
											</button>
											<div role="separator" className="dropdown-divider" />
											{status === 1 ? (
												<div>
													<button
														className="dropdown-item action-day-off"
														onClick={() =>
															this.setState({
																...initialState,
																vacation: true,
																data: { name: fullname, uid: uid }
															})
														}>
														<i className="dropdown-icon fa fa-coffee" /> İzin Yaz
													</button>
													<div role="separator" className="dropdown-divider" />
													<a
														className="dropdown-item action-permission"
														href="javascript:void(0)">
														<i className="dropdown-icon fa fa-notes-medical" /> Not (Puan)
														Ver
													</a>
													<div role="separator" className="dropdown-divider" />
													<a
														className="dropdown-item action-send-message"
														href="javascript:void(0)">
														<i className="dropdown-icon fa fa-paper-plane" /> Veliye Mesaj
														Gönder
													</a>
													<div role="separator" className="dropdown-divider" />
													<Link
														onClick={() =>
															this.props.history.push(`/app/players/edit/${uid}`)
														}
														className="dropdown-item action-edit"
														to={`/app/players/edit/${uid}`}>
														<i className="dropdown-icon fa fa-pen" /> Düzenle
													</Link>
													<button
														className="dropdown-item action-permission"
														onClick={() =>
															this.setState({
																...initialState,
																group_change: true,
																data: { name: fullname, uid: uid, group: group }
															})
														}>
														<i className="dropdown-icon fa fa-user-cog" /> Grup Değişikliği
													</button>
												</div>
											) : null}
											<a
												className="dropdown-item action-all-salary-info"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-id-card-alt" /> Öğrenci Belgesi
											</a>
											<a
												className="dropdown-item action-all-salary-info"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-receipt" /> Tüm Aidat Bilgisi
											</a>
											<Link
												onClick={() => this.props.history.push(`/app/players/detail/${uid}`)}
												to={`/app/players/detail/${uid}`}
												className="dropdown-item action-all-info">
												<i className="dropdown-icon fa fa-info-circle" /> Tüm Bilgileri
											</Link>
										</div>
									</div>
								</BrowserRouter>,
								td
							);
						}
					}
				],
				ajax: {
					url: ep.PLAYER_LIST,
					type: "POST",
					datatype: "json",
					beforeSend: function(request) {
						request.setRequestHeader("Content-Type", "application/json");
						request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
						request.setRequestHeader("Authorization", localStorage.getItem("UID"));
					},
					data: function(d) {
						return JSON.stringify({
							uid: UID
						});
					},
					contentType: "application/json",
					complete: function(res) {
						try {
							console.log(res);
							if (res.responseJSON.status.code !== 1020) {
								if (res.status !== 200) fatalSwal();
								else errorSwal(res.responseJSON.status);
							}
						} catch (e) {
							fatalSwal(true);
						}
					},
					dataSrc: function(d) {
						console.log(d);
						if (d.status.code !== 1020) {
							errorSwal(d.status);
							return [];
						} else return d.data;
					}
				},
				columns: [
					{
						data: "uid"
					},
					{
						data: "security_id"
					},
					{
						data: "image",
						class: "text-center",
						render: function(data, type, row) {
							var status = row.status;
							if (data === null) {
								return `<span class="avatar avatar-placeholder">
										<span class="avatar-status ${row.is_trial ? statusType[3] : statusType[status]}"></span>
									</span>`;
							} else {
								return `<div class="avatar" style="background-image: url(${data})">
										<span class="avatar-status ${statusType[status]}"></span>
									</div>`;
							}
						}
					},
					{
						data: "name",
						class: "w-1",
						render: function(data, type, row) {
							const fullname = fullnameGenerator(data, row.surname);
							if (type === "sort" || type === "type") {
								return fullname;
							}
							if (data)
								return `<a class="text-inherit" data-toggle="tooltip" data-placement="top" data-original-title="${fullname}" 
								href="/app/players/detail/${row.uid}">${fullname}</a>`;
						}
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
						data: "fee",
						render: function(data, type, row) {
							if (type === "sort" || type === "type") {
								return data;
							}
							if (data && data !== "") return data.format() + " ₺";
							else return "<i><b>BURSLU</b></i>";
						}
					},
					{
						data: "point",
						render: function(data) {
							if (data && data !== "") return data;
							else return "&mdash;";
						}
					},
					{
						data: "birthday",
						render: function(data) {
							if (data && data !== "") return data;
							else return "&mdash;";
						}
					},
					{
						data: "group",
						render: function(data) {
							if (data && data !== "") return data;
							else return "&mdash;";
						}
					},
					{
						data: "daily",
						render: function(data, type, row) {
							return (
								'<span class="status-icon bg-' + dailyType[data][1] + '"></span>' + dailyType[data][0]
							);
						}
					},
					{
						data: null
					}
				]
			});

			$("#player-list tbody").on("click", "tr", el => {
				var data = table.row(el.currentTarget).data();
				//console.log(el.currentTarget)
				//this.props.history.push("/app/players/detail/" + data.uid);
			});

			$("div.toolbar").html("<b>Custom tool bar! Text/images etc.</b>");

			$.fn.DataTable.ext.errMode = "none";
			$("#player-list").on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			$("#player-list").on("draw.dt", function() {
				console.log("draw.dt");
				$('[data-toggle="tooltip"]').tooltip();
				/*$.fn.dataTable.ext.search = [];
				$.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
					if (table.ajax.json().data[dataIndex].status === 1) return true;
					else return false;
				});*/
			});
		} catch (e) {
			//fatalSwal(true);
			console.log("e", e);
		}
	}

	componentWillUnmount() {
		$(".data-table-wrapper")
			.find("table")
			.DataTable()
			.destroy(true);
	}

	render() {
		const { vacation, group_change, data } = this.state;
		return (
			<div>
				<table id="player-list" className="table card-table table-vcenter table-striped text-nowrap datatable">
					<thead>
						<tr>
							<th>ID</th>
							<th className="w-1 no-sort">T.C.</th>
							<th className="w-1 text-center no-sort">#</th>
							<th className="w-1 name">AD SOYAD</th>
							<th className="emergency">VELİ TEL.</th>
							<th className="fee">AİDAT</th>
							<th className="point">GENEL PUAN</th>
							<th className="birthday">YAŞ</th>
							<th className="group">GRUP</th>
							<th className="status">DURUM</th>
							<th className="no-sort action" />
						</tr>
					</thead>
				</table>
				{<Vacation data={data} visible={vacation} history={this.props.history} />}
				{<GroupChange data={data} visible={group_change} history={this.props.history} />}
			</div>
		);
	}
}

export default Table;
