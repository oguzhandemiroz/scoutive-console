import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { ListRollcallType } from "../../../services/Rollcalls";
import { datatable_turkish } from "../../../assets/js/core";
import { fullnameGenerator } from "../../../services/Others";
import { fatalSwal, errorSwal, Toast, showSwal } from "../../Alert.jsx";
import Inputmask from "inputmask";
import ep from "../../../assets/js/urls";
import moment from "moment";
import "moment/locale/tr";
import "../../../assets/css/datatables.responsive.css";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

const dailyType = {
	"-1": { icon: "help-circle", color: "gray", text: "Tanımsız" },
	"0": { icon: "x", color: "danger", text: "Gelmedi" },
	"1": { icon: "check", color: "success", text: "Geldi" },
	"2": { icon: "alert-circle", color: "warning", text: "T. Gün İzinli" },
	"3": { icon: "alert-circle", color: "warning", text: "Y. Gün İzinli" }
};
var statusType = {
	0: { bg: "bg-danger", title: "Pasif" },
	1: { bg: "bg-success", title: "Aktif" },
	2: { bg: "bg-azure", title: "Donuk" },
	3: { bg: "bg-indigo", title: "Deneme" }
};

var _childNodeStore = {};
function _childNodes(dt, row, col) {
	var name = row + "-" + col;

	if (_childNodeStore[name]) {
		return _childNodeStore[name];
	}

	// https://jsperf.com/childnodes-array-slice-vs-loop
	var nodes = [];
	var children = dt.cell(row, col).node().childNodes;
	for (var i = 0, ien = children.length; i < ien; i++) {
		nodes.push(children[i]);
	}

	_childNodeStore[name] = nodes;

	return nodes;
}

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
		this.renderDataTable();
	}

	renderDataTable = () => {
		const { uid } = this.state;
		const { rcid } = this.props.match.params;
		const table = $("#rollcall-list").DataTable({
			dom: '<"top"f>rt<"bottom"ilp><"clear">',
			responsive: {
				details: {
					type: "column",
					target: 2,
					renderer: function(api, rowIdx, columns) {
						var tbl = $('<table class="w-100"/>');
						var found = false;
						var data = $.map(columns, function(col, i) {
							if (col.hidden) {
								$(`<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                                <th class="w-1">${col.title}</th> 
								</tr>`)
									.append($("<td/>").append(_childNodes(api, col.rowIndex, col.columnIndex)))
									.appendTo(tbl);
								found = true;
							}
						});

						return found ? tbl : false;
					}
				}
			},
			order: [4, "asc"],
			aLengthMenu: [[30, 50, 100, -1], [30, 50, 100, "Tümü"]],
			stateSave: false,
			language: {
				...datatable_turkish,
				decimal: ",",
				thousands: "."
			},
			ajax: {
				url: ep.ROLLCALL_LIST_TYPE + "players",
				type: "POST",
				datatype: "json",
				beforeSend: function(request) {
					request.setRequestHeader("Content-Type", "application/json");
					request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
					request.setRequestHeader("Authorization", localStorage.getItem("UID"));
				},
				data: function(d) {
					return JSON.stringify({
						uid: uid,
						rollcall_id: rcid
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
				dataSrc: d => {
					console.log(d);
					if (d.status.code !== 1020) {
						errorSwal(d.status);
						return [];
					} else {
						if (d.extra_data === 2) this.props.history.goBack();
						const statusList = [];
						d.data.map(el => {
							statusList.push({
								uid: el.uid,
								status: el.daily
							});
						});
						this.setState({ statuses: statusList, rollcall: d.data });
						return d.extra_data === 2
							? []
							: d.data.filter(x => x.status === 1).filter(x => x.is_trial === 0);
					}
				}
			},
			columnDefs: [
				{
					targets: [0, 1],
					visible: false
				},
				{
					className: "control",
					orderable: false,
					targets: [2]
				},
				{
					targets: "no-sort",
					orderable: false
				},
				{
					targets: "rollcalls",
					responsivePriority: 10002,
					createdCell: (td, cellData, rowData) => {
						const status_type = {
							0: { icon: "fe-x", badge: "bg-red-light", text: "Gelmedi" },
							1: { icon: "fe-check", badge: "bg-green-light", text: "Geldi" },
							2: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Tam Gün" },
							3: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Yarın Gün" }
						};
						ReactDOM.render(
							<div>
								{cellData.rollcalls.map((el, key) => {
									return (
										<span
											key={key.toString()}
											title={
												status_type[el.status].text +
												": " +
												moment(el.rollcall_date).format("LL")
											}
											data-toggle="tooltip"
											className={`d-inline-flex justify-content-center align-items-center mr-1 badge ${status_type[el.status].badge}`}>
											<i className={`fe ${status_type[el.status].icon}`} />
										</span>
									);
								})}
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
					data: "security_id"
				},
				{
					data: null,
					defaultContent: ""
				},
				{
					data: "image",
					class: "text-center",
					render: function(data, type, row) {
						var name = row.name;
						var surname = row.surname;
						var status = row.status;
						var renderBg = row.is_trial ? statusType[3].bg : statusType[status].bg;
						var renderTitle = row.is_trial
							? statusType[status].title + " & Deneme Öğrenci"
							: statusType[status].title + " Öğrenci";
						return `<div class="avatar text-uppercase" style="background-image: url(${data || ""})">
									${data ? "" : name.slice(0, 1) + surname.slice(0, 1)}
									<span class="avatar-status ${renderBg}" data-toggle="tooltip" title="${renderTitle}"></span>
								</div>`;
					}
				},
				{
					data: "name",
					responsivePriority: 1,
					render: function(data, type, row) {
						const fullname = fullnameGenerator(data, row.surname);
						if (type === "sort" || type === "type") {
							return fullname;
						}
						if (data)
							return `<a class="text-inherit" href="/app/players/detail/${row.uid}">${fullname}</a>`;
					}
				},
				{
					data: "emergency",
					responsivePriority: 10006,
					className: "none",
					render: function(data, type, row) {
						const fullname = fullnameGenerator(row.name, row.surname);
						var elem = "";
						var j = 0;

						if (data) {
							var myselfAddedData = data;
							myselfAddedData.push({
								kinship: "Kendisi",
								name: fullname,
								phone: row.phone || ""
							});

							myselfAddedData.map(el => {
								if (el.phone !== "" && el.name !== "" && el.kinship !== "") {
									const formatPhone = el.phone
										? Inputmask.format(el.phone, { mask: "(999) 999 9999" })
										: null;
									j++;
									elem += `<a href="tel:${el.phone}" data-toggle="tooltip" data-placement="left" data-original-title="${el.kinship}: ${el.name}" class="text-inherit d-block">${formatPhone}</a> `;
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
					data: "birthday",
					responsivePriority: 10005,
					render: function(data, type, row) {
						if (type === "sort" || type === "type") {
							return data ? data.split(".")[0] : data;
						}

						if (data && data !== "") return moment(data).format("YYYY");
						else return "&mdash;";
					}
				},
				{
					data: "group",
					responsivePriority: 10004,
					render: function(data) {
						if (data && data !== "")
							return `<a class="text-inherit" href="/app/groups/detail/${data.value}">${data.label}</a>`;
						else return "&mdash;";
					}
				},
				{ data: null },
				{
					data: "note",
					render: function(data, type, row) {
						return `<div class="text-break">${data || "—"}</div>`;
					}
				},
				{
					data: "daily",
					class: "text-center",
					render: function(data, type, row) {
						return `<div
									data-toggle="tooltip"
									title="${dailyType[data].text}"
									class="text-${dailyType[data].color}"
									style="font-size: 20px">
									<i class="fe fe-${dailyType[data].icon}"/>
								</div>`;
					}
				}
			]
		});

		$.fn.DataTable.ext.errMode = "none";
		$("#rollcall-list").on("error.dt", function(e, settings, techNote, message) {
			console.log("An error has been reported by DataTables: ", message, techNote);
		});

		$("#rollcall-list").on("draw.dt", function() {
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover({
				html: true,
				trigger: "hover"
			});
		});

		table.on("responsive-display", function(e, datatable, row, showHide, update) {
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover({
				html: true,
				trigger: "hover"
			});
		});
	};

	getPaidStatus = (fee, amount) => {
		try {
			if (amount === 0) {
				return 0;
			} else {
				return amount >= fee ? 1 : 2;
			}
		} catch (e) {}
	};

	formatPaidDate = date => {
		try {
			const splitDate = date.split(",");
			const firstDate = moment(splitDate[0]);
			const secondDate = moment(splitDate[1]);
			const diff = Math.ceil(moment(secondDate).diff(moment(firstDate), "months", true));

			return `${firstDate.format("MMMM")} ${firstDate.format("YYYY")} - ${secondDate.format(
				"MMMM"
			)} ${secondDate.format("YYYY")} (${diff} aylık)`;
		} catch (e) {}
	};

	generateRollcallTotalCount = (rollcall, status, text) => {
		let total = 0;
		if (rollcall) {
			rollcall.map(el => {
				if (Array.isArray(status)) {
					if (status.indexOf(el.daily) > -1) total++;
				} else {
					if (el.daily === status) total++;
				}
			});
		}

		return (
			<h4 className="m-0">
				{total} <small>{text}</small>
			</h4>
		);
	};

	render() {
		const { rollcall } = this.state;
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
								<div className="row">
									<div class="col-sm-12 col-md-6 col-lg-3">
										<div class="card p-3 mb-2">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-green-light d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-check"></i>
												</span>
												<div className="d-flex flex-column">
													<div className="small text-muted">Toplam</div>
													<div>{this.generateRollcallTotalCount(rollcall, 1, "Geldi")}</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-sm-12 col-md-6 col-lg-3">
										<div class="card p-3 mb-2">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-red-light d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-x"></i>
												</span>
												<div className="d-flex flex-column">
													<div className="small text-muted">Toplam</div>
													<div>{this.generateRollcallTotalCount(rollcall, 0, "Gelmedi")}</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-sm-12 col-md-6 col-lg-3">
										<div class="card p-3 mb-2">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-yellow-light d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-alert-circle"></i>
												</span>
												<div className="d-flex flex-column">
													<div className="small text-muted">Toplam</div>
													<div>
														{this.generateRollcallTotalCount(rollcall, [2, 3], "İzinli")}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="col-sm-12 col-md-6 col-lg-3">
										<div class="card p-3 mb-2">
											<div class="d-flex align-items-center">
												<span class="stamp stamp-md bg-gray d-flex justify-content-center align-items-center mr-3">
													<i class="fe fe-help-circle"></i>
												</span>
												<div className="d-flex flex-column">
													<div className="small text-muted">Toplam</div>
													<div>
														{this.generateRollcallTotalCount(rollcall, -1, "Tanımsız")}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-body p-0">
								<div className="table-responsive">
									<table
										id="rollcall-list"
										className="table card-table w-100 table-vcenter table-hover datatable">
										<thead>
											<tr>
												<th>ID</th>
												<th className="w-1 no-sort">T.C.</th>
												<th className="w-1 no-sort control" />
												<th className="w-1 text-center no-sort"></th>
												<th className="name">AD SOYAD</th>
												<th className="emergency">İLETİŞİM</th>
												<th className="birthday">DOĞUM YILI</th>
												<th className="group">GRUP</th>
												<th className="w-1 text-nowrap no-sort rollcalls">SON 3 YOKLAMA</th>
												<th className="w-10 no-sort note">NOT</th>
												<th className="w-2 no-sort daily">DURUM</th>
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

export default Detail;
