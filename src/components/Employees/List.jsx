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
import Vacation from "../EmployeeAction/Vacation";
import { fullnameGenerator } from "../../services/Others";
const $ = require("jquery");
$.DataTable = require("datatables.net");

var statusType = {
	"-1": ["Tanımsız", "secondary"],
	"0": ["Gelmedi", "danger"],
	"1": ["Geldi", "success"],
	"2": ["İzinli", "warning"],
	"3": ["İzinli", "warning"]
};

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

class GeneralEmployee extends Component {
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
			bindto: "#general-employee",
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
							id="general-employee"
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

class DailyEmployee extends Component {
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
			bindto: "#daily-employee",
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
							id="daily-employee"
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

		this.state = { data: {}, vacation: false };
	}

	componentDidMount() {
		try {
			const UID = localStorage.getItem("UID");
			$("#employee-list").DataTable({
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
										onClick={() => this.props.history.push("/app/employees/detail/" + rowData.uid)}
										to={"/app/employees/detail/" + rowData.uid}
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
											id="employee-action"
											className="btn btn-sm btn-secondary btn-block dropdown-toggle"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false">
											İşlem
										</button>
										<div
											className="dropdown-menu dropdown-menu-right"
											aria-labelledby="employee-action"
											x-placement="top-end">
											<a className="dropdown-item disabled text-azure" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-user text-azure" />
												{fullname}
											</a>
											<div role="separator" className="dropdown-divider" />
											<a className="dropdown-item action-pay-salary" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-money-bill-wave" /> Maaş Öde
											</a>
											<a
												className="dropdown-item action-advance-payment"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-hand-holding-usd" /> Avans Ver
											</a>
											<a className="dropdown-item action-salary-raise" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-coins" /> Zam Yap
											</a>
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
											<a className="dropdown-item action-send-message" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-paper-plane" /> Mesaj Gönder
											</a>
											<a className="dropdown-item action-warning" href="javascript:void(0)">
												<i className="dropdown-icon fa fa-exclamation-triangle" /> İkaz Et
											</a>
											<div role="separator" className="dropdown-divider" />
											<Link
												onClick={() => this.props.history.push(`/app/employees/edit/${uid}`)}
												className="dropdown-item action-edit"
												to={`/app/employees/edit/${uid}`}>
												<i className="dropdown-icon fa fa-pen" /> Düzenle
											</Link>
											<a
												className="dropdown-item action-change-password"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-key" /> Şifre Değiştir
											</a>
											<a
												className="dropdown-item action-all-salary-info"
												href="javascript:void(0)">
												<i className="dropdown-icon fa fa-receipt" /> Tüm Maaş Bilgisi
											</a>
											<Link
												onClick={() => this.props.history.push(`/app/employees/detail/${uid}`)}
												to={`/app/employees/detail/${uid}`}
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
					url: ep.LIST_EMPLOYEE,
					type: "POST",
					beforeSend: function(request) {
						request.setRequestHeader("Content-Type", "application/json");
						request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
						request.setRequestHeader("Authorization", localStorage.getItem("UID"));
					},
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
							fatalSwal();
						}
					},
					dataSrc: function(d) {
						console.log("dataSrc", d);
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
						data: "phone",
						render: function(data, type, row) {
							if (data && data !== "")
								return `<a href="tel:${data}" data-toggle="tooltip" data-placement="top" data-original-title="${data}" class="text-inherit">${data}</a>`;
							else return "&mdash;";
						}
					},
					{
						data: "email",
						render: function(data, type, row) {
							if (data && data !== "")
								return `<a href="mailto:${data}" data-toggle="tooltip" data-placement="top" data-original-title="${data}" class="text-truncate w-9 d-block text-inherit">${data}</a>`;
							else return "&mdash;";
						}
					},
					{
						data: "position"
					},
					{
						data: "salary",
						render: function(data, type, row) {
							if (type === "sort" || type === "type") {
								return data;
							} else {
								var convert = typeof data === "number" ? data.format() : data;
								convert = convert ? convert + " ₺" : "&mdash;";
								return convert;
							}
						}
					},
					{
						data: "daily",
						render: function(data, type, row) {
							return (
								'<span class="status-icon bg-' + statusType[data][1] + '"></span>' + statusType[data][0]
							);
						}
					},
					{
						data: null
					}
				]
			});

			$.fn.DataTable.ext.errMode = "none";
			$("#employee-list").on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			$("#employee-list").on("draw.dt", function() {
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
				<table
					id="employee-list"
					className="table card-table table-vcenter table-striped text-nowrap datatable">
					<thead>
						<tr>
							<th>ID</th>
							<th className="w-1 no-sort">T.C.</th>
							<th className="w-1 text-center no-sort">#</th>
							<th className="name">AD SOYAD</th>
							<th className="phone">TELEFON</th>
							<th className="email">EMAIL</th>
							<th className="position">POZİSYON</th>
							<th className="salary">MAAŞ</th>
							<th className="status">DURUM</th>
							<th className="no-sort action" />
						</tr>
					</thead>
				</table>
				{<Vacation data={data} visible={vacation} />}
			</div>
		);
	}
}

export { DailyEmployee, GeneralEmployee, Table };
