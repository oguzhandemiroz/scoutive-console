import React, { Component } from "react";
import "jquery";
import c3 from "c3";
import * as d3 from "d3";
import "../../assets/css/c3.min.css";
import sc from "../../assets/js/sc";
import "../../assets/js/core";
import ep from "../../assets/js/urls";
import { fatalSwal } from "../Alert.jsx";

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
	componentDidMount() {
		const UID = localStorage.getItem("UID");
		$("#player-list").DataTable({
			responsive: true,
			order: [0, "desc"],
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
					console.log(res);
					if (res.status !== 200 && !res.responseJSON) fatalSwal();
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
					data: "name",
					render: function(data, type, row) {
						var fullname = data + " " + (row.surname || "");
						return `<a href="/app/players/detail/${
							row.uid
						}" style="max-width:160px;" data-toggle="tooltip" data-placement="top" data-original-title="${fullname}" class="text-truncate d-block text-inherit">${fullname}</a>`;
					}
				},
				{
					data: "parent",
					render: function(data, type, row) {
						return `<a href="tel:${data ||
							"..."}" data-toggle="tooltip" data-placement="top" data-original-title="${data ||
							"..."}" class="text-inherit">${data || "..."}</a>`;
					}
				},
				{
					data: "phone_gsm",
					render: function(data, type, row) {
						return `<a href="tel:${data ||
							"..."}" data-toggle="tooltip" data-placement="top" data-original-title="${data ||
							"..."}" class="text-inherit">${data || "..."}</a>`;
					}
				},
				{
					data: "fee",
					render: function(data, type, row) {
						return "100 ₺";
					}
				},
				{
					data: "point"
				},
				{
					data: "birthday"
				},
				{
					data: "group_name",
					render: () => "U-11"
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
							'<span class="status-icon bg-' + status_type[data][1] + '"></span>' + status_type[data][0]
						);
					}
				},
				{
					data: "action",
					render: function(data, type, row) {
						var fullname = row["name"] + " " + (row["surname"] || "");
						return `<div class="dropdown btn-block" id="action-dropdown">
                            <button type="button" id="player-action" class="btn btn-sm btn-secondary btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                İşlem
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="player-action" x-placement="top-end">
                                <a class="dropdown-item disabled text-azure" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-user text-azure"></i>${fullname}
                                </a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item action-pay-salary" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-hand-holding-usd"></i> Ödeme Al
                                </a>
                                <a class="dropdown-item action-warning" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-exclamation-triangle"></i> Ödeme İkazı
                                </a>
                                <a class="dropdown-item action-change-password" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-hand-holding-heart"></i> Burs Ver
                                </a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item action-advance-payment" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-snowflake"></i> Kaydı Dondur
                                </a>
                                <a class="dropdown-item action-advance-payment" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-sync-alt"></i> Kaydı Yenile
                                </a>
                                <a class="dropdown-item action-salary-raise" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-user-times"></i> Kaydı Sil
                                </a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item action-day-off" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-coffee"></i> İzin Yaz
                                </a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item action-permission" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-notes-medical"></i> Not (Puan) Ver
                                </a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item action-send-message" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-paper-plane"></i> Veliye Mesaj Gönder
                                </a>
                                <div role="separator" class="dropdown-divider"></div>
                                <a class="dropdown-item action-edit" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-pen"></i> Düzenle
                                </a>
                                <a class="dropdown-item action-permission" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-user-cog"></i> Grup Değişikliği
                                </a>
                                <a class="dropdown-item action-all-salary-info" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-id-card-alt"></i> Öğrenci Belgesi
                                </a>
                                <a class="dropdown-item action-all-salary-info" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-receipt"></i> Tüm Aidat Bilgisi
                                </a>
                                <a class="dropdown-item action-all-info" href="javascript:void(0)">
                                    <i class="dropdown-icon fa fa-info-circle"></i> Tüm Bilgileri
                                </a>
                            </div>
                        </div>`;
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
	}
	componentWillUnmount() {
		$(".data-table-wrapper")
			.find("table")
			.DataTable()
			.destroy(true);
	}
	shouldComponentUpdate() {
		return false;
	}
	render() {
		return (
			<table id="player-list" className="table card-table table-vcenter table-striped text-nowrap datatable">
				<thead>
					<tr>
						<th>ID</th>
						<th className="w-1 no-sort">T.C.</th>
						<th className="w-1 text-center no-sort">#</th>
						<th>AD SOYAD</th>
						<th>VELİ TEL.</th>
						<th>TELEFON</th>
						<th>AİDAT</th>
						<th>GENEL PUAN</th>
						<th>YAŞ</th>
						<th>GRUP</th>
						<th>DURUM</th>
						<th className="no-sort" />
					</tr>
				</thead>
			</table>
		);
	}
}

export { DailyPlayer, GeneralPlayer, Table };
