import React, { Component } from "react";
import "jquery";
import c3 from "c3";
import * as d3 from "d3";
import "../../assets/css/c3.min.css";
import sc from "../../assets/js/sc";
import "../../assets/js/core";
import ep from "../../assets/js/urls";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { showSwal, Toast } from "../Alert";
import { DeletePlayer } from "../../services/Player";
import { fullnameGenerator } from "../../services/Others";
import Vacation from "../PlayerAction/Vacation";

const $ = require("jquery");
$.DataTable = require("datatables.net");

const chartOptions = {
	axis: {},
	legend: {
		show: true //hide legend
	},
	padding: {
		bottom: 0,
		top: 0
	},
	tooltip: {
		format: {
			value: function(value) {
				return d3.format("")(value);
			}
		}
	},
	pie: {
		label: {
			format: function(value) {
				return d3.format("")(value);
			}
		}
	}
};

class GeneralPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				// each columns data
				["coach", 7],
				["secretary", 1],
				["coordinator", 1]
			]
		};
	}
	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.renderChart();
	}
	componentDidUpdate() {
		this.renderChart();
	}

	renderChart() {
		c3.generate({
			bindto: "#general-player",
			data: {
				columns: this.state.data,
				type: "pie", // default type of chart
				colors: {
					coach: sc.colors["blue-darker"],
					secretary: sc.colors["blue"],
					coordinator: sc.colors["blue-light"]
				},
				names: {
					// name of each serie
					coach: "Antrenör",
					secretary: "Sekreter",
					coordinator: "Koordinator"
				}
			},
			...chartOptions
		});
	}
	render() {
		return (
			<div className="col-sm-6 col-md-4">
				<div className="card">
					<div className="card-body p-3 text-center">
						<div className="h5"> Genel Personel Raporu </div>
						<div
							id="general-player"
							style={{
								height: "192px"
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

class DailyPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				// each columns data
				["working", 33],
				["off", 24],
				["non-work", 12],
				["rest", 3]
			]
		};
	}
	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.renderChart();
	}
	componentDidUpdate() {
		this.renderChart();
	}

	renderChart() {
		c3.generate({
			bindto: "#daily-player",
			data: {
				columns: this.state.data,
				type: "pie", // default type of chart
				colors: {
					working: sc.colors["green"],
					off: sc.colors["orange"],
					"non-work": sc.colors["red"],
					rest: sc.colors["blue"]
				},
				names: {
					// name of each serie
					working: "Çalışıyor",
					off: "İzinli",
					"non-work": "Gelmeyen",
					rest: "Raporlu"
				}
			},
			...chartOptions
		});
	}
	render() {
		return (
			<div className="col-sm-6 col-md-4">
				<div className="card">
					<div className="card-body p-3 text-center">
						<div className="h5"> Günlük Personel Raporu </div>
						<div
							id="daily-player"
							style={{
								height: "192px"
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

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

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: {},
			vacation: false
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
				html: `<b>${name}</b> adlı öğrencinin kaydını silmek istediğinize emin misiniz?`,
				confirmButtonText: "Evet",
				cancelButtonText: "Hayır",
				cancelButtonColor: "#cd201f",
				confirmButtonColor: "#868e96",
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

	componentDidMount() {
		try {
			const UID = localStorage.getItem("UID");
			$("#player-list").DataTable({
				responsive: true,
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
						targets: "name",
						createdCell: (td, cellData, rowData) => {
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
						targets: "action",
						createdCell: (td, cellData, rowData) => {
							const fullname = fullnameGenerator(rowData.name, rowData.surname);
							const uid = rowData.uid;
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
											<a className="dropdown-item action-pay-salary" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-hand-holding-usd" /> Ödeme Al
											</a>
											<a className="dropdown-item action-warning" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-exclamation-triangle" /> Ödeme İkazı
											</a>
											<a
												className="dropdown-item action-change-password"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-hand-holding-heart" /> Burs Ver
											</a>
											<div role="separator" className="dropdown-divider" />
											<a
												className="dropdown-item action-advance-payment"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-snowflake" /> Kaydı Dondur
											</a>
											<a
												className="dropdown-item action-advance-payment"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-sync-alt" /> Kaydı Yenile
											</a>
											<button
												className="dropdown-item action-salary-raise"
												onClick={() => this.deletePlayer(uid, fullname)}>
												<i className="dropdown-icon fa fa-user-times" /> Kaydı Sil
											</button>
											<div role="separator" className="dropdown-divider" />
											<button
												className="dropdown-item action-day-off"
												onClick={() =>
													this.setState({
														vacation: true,
														data: { name: fullname, uid: uid }
													})
												}>
												<i className="dropdown-icon fa fa-coffee" /> İzin Yaz
											</button>
											<div role="separator" className="dropdown-divider" />
											<a className="dropdown-item action-permission" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-notes-medical" /> Not (Puan) Ver
											</a>
											<div role="separator" className="dropdown-divider" />
											<a className="dropdown-item action-send-message" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-paper-plane" /> Veliye Mesaj Gönder
											</a>
											<div role="separator" className="dropdown-divider" />
											<Link
												onClick={() => this.props.history.push(`/app/players/edit/${uid}`)}
												className="dropdown-item action-edit"
												to={`/app/players/edit/${uid}`}>
												<i className="dropdown-icon fa fa-pen" /> Düzenle
											</Link>
											<a className="dropdown-item action-permission" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-user-cog" /> Grup Değişikliği
											</a>
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
					url: ep.LIST_PLAYER,
					type: "POST",
					datatype: "json",
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
							var bg_class_type = {
								"0": "secondary",
								"1": "success",
								"2": "warning",
								"3": "danger",
								"4": "info"
							};
							if (data === null) {
								return (
									'<span class="avatar avatar-placeholder">' +
									'<span class="avatar-status bg-' +
									bg_class_type[status] +
									'"></span></span>'
								);
							} else {
								return (
									'<div class="avatar" style="background-image: url(' +
									data +
									')">' +
									'<span class="avatar-status bg-' +
									bg_class_type[status] +
									'"></span></div>'
								);
							}
						}
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
						data: "phone",
						render: function(data, type, row) {
							if (data && data !== "")
								return `<a href="tel:${data}" data-toggle="tooltip" data-placement="top" data-original-title="${data}" class="text-inherit">${data}</a>`;
							else return "&mdash;";
						}
					},
					{
						data: "fee",
						render: function(data, type, row) {
							if (type === "sort" || type === "type") {
								return data;
							}
							if (data && data !== "") return data.format() + " ₺";
							else return "&mdash;";
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
						data: "status",
						render: function(data, type, row) {
							var status_type = {
								"0": ["Tanımsız", "secondary"],
								"1": ["Çalışıyor", "success"],
								"2": ["İzinli", "warning"],
								"3": ["Gelmedi", "danger"],
								"4": ["Raporlu", "info"],
								"5": ["Raporlu", "info"]
							};
							return (
								'<span class="status-icon bg-' +
								status_type[data][1] +
								'"></span>' +
								status_type[data][0]
							);
						}
					}
				]
			});
			$.fn.DataTable.ext.errMode = "none";
			$("#player-list").on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			$("#player-list").on("draw.dt", function() {
				$('[data-toggle="tooltip"]').tooltip();
			});
		} catch (e) {
			fatalSwal();
		}
	}
	componentWillUnmount() {
		$(".data-table-wrapper")
			.find("table")
			.DataTable()
			.destroy(true);
	}

	render() {
		const { vacation, data } = this.state;
		return (
			<div>
				<table id="player-list" className="table card-table table-vcenter table-striped text-nowrap datatable">
					<thead>
						<tr>
							<th>ID</th>
							<th className="w-1 no-sort">T.C.</th>
							<th className="w-1 text-center no-sort">#</th>
							<th className="name">AD SOYAD</th>
							<th className="emergency">VELİ TEL.</th>
							<th className="phone">TELEFON</th>
							<th className="fee">AİDAT</th>
							<th className="point">GENEL PUAN</th>
							<th className="birthday">YAŞ</th>
							<th className="group">GRUP</th>
							<th className="no-sort action">DURUM</th>
						</tr>
					</thead>
				</table>
				{<Vacation data={data} visible={vacation} />}
			</div>
		);
	}
}

export { DailyPlayer, GeneralPlayer, Table };
