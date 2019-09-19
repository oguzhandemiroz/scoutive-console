import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { MakeRollcall, SetNoteRollcall, DeleteRollcall } from "../../../services/Rollcalls";
import { CreateVacation, UpdateVacation } from "../../../services/PlayerAction";
import { fullnameGenerator } from "../../../services/Others";
import { WarningModal as Modal } from "../WarningModal";
import { datatable_turkish } from "../../../assets/js/core";
import { fatalSwal, errorSwal, Toast, showSwal } from "../../Alert.jsx";
import GroupChange from "../../PlayerAction/GroupChange";
import Vacation from "../../PlayerAction/Vacation";
import ep from "../../../assets/js/urls";
import ActionButton from "../../Players/ActionButton";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";
import "../../../assets/css/datatables.responsive.css";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

var statusType = {
	0: { bg: "bg-danger", title: "Pasif" },
	1: { bg: "bg-success", title: "Aktif" },
	2: { bg: "bg-azure", title: "Donuk" },
	3: { bg: "bg-indigo", title: "Deneme" }
};

const initialState = {
	vacation: false,
	group_change: false
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

export class Add extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			players: null,
			counter: 0,
			statuses: [],
			loadingButtons: [],
			data: {}
		};
	}

	componentDidMount() {
		this.renderDataTable();
	}

	componentWillUnmount() {
		$(".data-table-wrapper")
			.find("table")
			.DataTable()
			.destroy(true);
	}

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
			stateSave: false, // change true
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
						if (d.extra_data === 1) this.props.history.goBack();
						const statusList = [];
						d.data.map(el => {
							statusList.push({
								uid: el.uid,
								status: el.daily
							});
						});
						this.setState({ statuses: statusList });
						return d.extra_data === 1
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
				},
				{
					targets: "fees",
					responsivePriority: 10001,
					createdCell: (td, cellData, rowData) => {
						const status_type = {
							0: { icon: "fe-x", badge: "bg-red-light", text: "Ödenmedi", color: "text-danger" },
							1: { icon: "fe-check", badge: "bg-green-light", text: "Ödendi", color: "text-success" },
							2: {
								icon: "fe-alert-circle",
								badge: "bg-yellow-light",
								text: "Eksik Ödendi",
								color: "text-warning"
							}
						};

						ReactDOM.render(
							<div>
								{cellData.fees.map((el, key) => {
									return (
										<span
											key={key.toString()}
											data-placement="top"
											data-content={`
												<p>${this.formatPaidDate(el.month)}</p>
												<b class="${status_type[this.getPaidStatus(el.fee, el.amount)].color}">
													${status_type[this.getPaidStatus(el.fee, el.amount)].text}
												</b>
												<hr class="my-2"/>
												<b>Ödemesi Gereken:</b> ${el.fee.format() + " ₺"} <br>
												<b>Ödenen:</b> ${el.amount.format() + " ₺"} <br>
												<hr class="my-1"/>
												<b>Borç:</b> ${(el.fee - el.amount).format() + " ₺"} <br>
											`}
											data-toggle="popover"
											className={`d-inline-flex justify-content-center align-items-center mr-1 badge ${status_type[this.getPaidStatus(el.fee, el.amount)].badge}`}>
											<i
												className={`fe ${status_type[this.getPaidStatus(el.fee, el.amount)].icon}`}
											/>
										</span>
									);
								})}
							</div>,
							td
						);
					}
				},
				{
					targets: "status",
					responsivePriority: 2,
					class: "w-1 pr-0",
					createdCell: (td, cellData, rowData) => {
						const { uid } = rowData;
						const { statuses, loadingButtons } = this.state;
						ReactDOM.render(
							<div>
								<button
									onClick={el => this.takeRollcall(uid, 1, el)}
									title="Geldi"
									data-toggle="tooltip"
									className={`btn btn-icon btn-sm ${
										statuses.find(x => x.uid === uid).status === 1
											? "disable-overlay btn-success"
											: "btn-secondary"
									} ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
									<i className="fe fe-check" />
								</button>

								<span data-toggle="tooltip" title="İzinli">
									<button
										data-toggle="dropdown"
										className={`btn btn-icon btn-sm ${
											statuses.find(x => x.uid === uid).status === 2 ||
											statuses.find(x => x.uid === uid).status === 3
												? "btn-warning"
												: "btn-secondary"
										} mx-2 ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
										<i className="fe fe-alert-circle" />
									</button>
									<div className="dropdown-menu">
										<button onClick={el => this.takeRollcall(uid, 2, el)} className="dropdown-item">
											Tam Gün
										</button>
										<button onClick={el => this.takeRollcall(uid, 3, el)} className="dropdown-item">
											Yarım Gün
										</button>
									</div>
								</span>

								<button
									onClick={el => this.takeRollcall(uid, 0, el)}
									title="Gelmedi"
									data-toggle="tooltip"
									className={`btn btn-icon btn-sm ${
										statuses.find(x => x.uid === uid).status === 0
											? "disable-overlay btn-danger"
											: "btn-secondary"
									} ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
									<i className="fe fe-x" />
								</button>
							</div>,
							td
						);
					}
				},
				{
					targets: "note",
					responsivePriority: 10003,
					class: "py-1 text-center",
					createdCell: (td, cellData, rowData) => {
						const { uid, name, surname, note, daily } = rowData;
						ReactDOM.render(
							<BrowserRouter>
								{daily !== -1 ? (
									<span
										onClick={() => this.removeRollcallStatus(uid)}
										className="icon cursor-pointer"
										data-toggle="tooltip"
										title="Yoklamayı Kaldır">
										<i className="fe fe-x" />
									</span>
								) : null}
								<span
									onClick={() => this.setRollcallNote(fullnameGenerator(name, surname), uid)}
									className="icon cursor-pointer ml-2"
									data-toggle="tooltip"
									title={note ? "Not: " + note : "Not Gir"}>
									<i className={`fe fe-edit ${note ? "text-orange" : ""}`} />
								</span>
							</BrowserRouter>,
							td
						);
					}
				},
				{
					targets: "action",
					responsivePriority: 10003,
					class: "pr-4 pl-1 w-1",
					createdCell: (td, cellData, rowData) => {
						const fullname = fullnameGenerator(rowData.name, rowData.surname);
						const { uid, group, status, is_trial } = rowData;
						ReactDOM.render(
							<BrowserRouter>
								<ActionButton
									vacationButton={data =>
										this.setState({
											...initialState,
											vacation: true,
											data: data
										})
									}
									groupChangeButton={data =>
										this.setState({
											...initialState,
											group_change: true,
											data: data
										})
									}
									history={this.props.history}
									dropdown={true}
									data={{
										to: uid,
										name: fullname,
										is_trial: is_trial,
										status: status,
										group: group
									}}
									renderButton={() => (
										<a
											href="javascript:void(0)"
											className="icon"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false">
											<i className="fe fe-more-vertical"></i>
										</a>
									)}
								/>
							</BrowserRouter>,
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
							return `<a class="text-inherit" href="/app/groups/detail/${data.group_id}">${data.name}</a>`;
						else return "&mdash;";
					}
				},
				{ data: null },
				{ data: null },
				{ data: null },
				{ data: null },
				{ data: null }
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

	takeRollcall = (to, type, that) => {
		try {
			/*
				- type 0 -> gelmedi
				- type 1 -> geldi
				- type 2 -> izinli
			*/

			const element = that.currentTarget;

			const { uid, loadingButtons } = this.state;
			const { rcid } = this.props.match.params;

			this.setState({ loadingButtons: [...loadingButtons, to] });
			this.addButtonLoading(element, type);

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
							this.changeStatus(element, type);
						}
						this.removeButtonLoading(element, type);
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
						this.removeButtonLoading(element, type);
						this.changeStatus(element, type);
					}
				});
			}
		} catch (e) {}
	};

	addButtonLoading = (element, type) => {
		if (type === 2 || type === 3) {
			$(element)
				.parent()
				.siblings("button")
				.addClass("btn-loading");
			$(element)
				.parent()
				.siblings("button")
				.parent()
				.siblings()
				.map(function() {
					if (this.tagName === "SPAN") {
						$("button", this).addClass("btn-loading");
					} else {
						$(this).addClass("btn-loading");
					}
				});
		} else {
			$(element).addClass("btn-loading");
			$(element)
				.siblings()
				.map(function() {
					if (this.tagName === "SPAN") {
						$("button", this).addClass("btn-loading");
					} else {
						$(this).addClass("btn-loading");
					}
				});
		}
	};

	removeButtonLoading = (element, type) => {
		if (type === 2 || type === 3) {
			$(element)
				.parent()
				.siblings("button")
				.removeClass("btn-loading");
			$(element)
				.parent()
				.siblings("button")
				.parent()
				.siblings()
				.map(function() {
					if (this.tagName === "SPAN") {
						$("button", this)
							.removeClass("btn-loading")
							.removeClass("disable-overlay");
					} else {
						$(this)
							.removeClass("btn-loading")
							.removeClass("disable-overlay");
					}
				});
		} else {
			$(element).removeClass("btn-loading");
			$(element)
				.siblings()
				.map(function() {
					if (this.tagName === "SPAN") {
						$("button", this)
							.removeClass("btn-loading")
							.removeClass("disable-overlay");
					} else {
						$(this)
							.removeClass("btn-loading")
							.removeClass("disable-overlay");
					}
				});
		}
	};

	changeStatus = (element, type) => {
		const status_type = {
			0: "btn-danger",
			1: "btn-success",
			2: "btn-warning",
			3: "btn-warning",
			x: "btn-secondary"
		};
		if (type === 2 || type === 3) {
			$(element)
				.parent()
				.siblings("button")
				.removeClass(status_type.x)
				.addClass(status_type[type]);

			$(element)
				.parent()
				.siblings("button")
				.parent()
				.siblings()
				.map(function() {
					if (this.tagName === "SPAN") {
						$("button", this)
							.removeClass(status_type[2])
							.addClass(status_type.x);
					} else {
						$(this)
							.removeClass(status_type[0])
							.addClass(status_type.x);
					}
				});
		} else {
			$(element)
				.removeClass(status_type.x)
				.addClass(status_type[type])
				.addClass("disable-overlay");

			$(element)
				.siblings()
				.map(function() {
					if (this.tagName === "SPAN") {
						$("button", this)
							.removeClass(status_type[2])
							.addClass(status_type.x);
					} else {
						$(this)
							.removeClass(status_type[0])
							.addClass(status_type.x);
					}
				});
		}
	};

	setRollcallNote = (name, to) => {
		const { uid } = this.state;
		const { rcid } = this.props.match.params;
		showSwal({
			type: "info",
			title: "Not Giriniz",
			html: `<b>${name}</b> adlı öğrenci için not giriniz:`,
			confirmButtonText: "Onayla",
			showCancelButton: true,
			cancelButtonText: "İptal",
			confirmButtonColor: "#467fcf",
			cancelButtonColor: "#868e96",
			reverseButtons: true,
			input: "text",
			inputPlaceholder: "...",
			inputAttributes: {
				max: 100
			},
			inputValidator: value => {
				return new Promise(resolve => {
					if (value.length > 0 && value.length <= 100) {
						SetNoteRollcall(
							{
								uid: uid,
								to: to,
								rollcall_id: rcid,
								note: value
							},
							"player"
						).then(response => {
							if (response) {
								if (response.status.code === 1020) {
									Toast.fire({
										type: "success",
										title: "Not ekleme başarılı!"
									});
								} else {
									Toast.fire({
										type: "danger",
										title: "Not ekleme başarısız!"
									});
								}
								setTimeout(this.reload, 1000);
							}
						});
					} else {
						resolve("Hatalı değer!");
					}
				});
			}
		});
	};

	removeRollcallStatus = to => {
		const { uid } = this.state;
		const { rcid } = this.props.match.params;
		DeleteRollcall({ uid: uid, to: to, rollcall_id: rcid }, "player").then(response =>
			setTimeout(this.reload, 1000)
		);
	};

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	render() {
		const { data, vacation, group_change } = this.state;
		console.log(vacation, group_change);
		return (
			<div className="container">
				<Modal />
				<div className="page-header">
					<h1 className="page-title">
						Yoklamalar &mdash; Öğrenci &mdash; Yoklama Al (#{this.props.match.params.rcid})
					</h1>
				</div>
				<div className="row row-cards">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-teal" />
								<h3 className="card-title">Öğrenci Listesi</h3>
								<div className="card-options">
									<span
										className="form-help bg-gray-dark text-white"
										data-toggle="popover"
										data-placement="bottom"
										data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"Tanımsız"</b> şeklinde tanımlanır.</p><p><b className="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
										!
									</span>
									<Modal />
								</div>
							</div>
							<div className="card-body pt-0">
								<div className="table-responsive">
									<table
										id="rollcall-list"
										className="table card-table w-100 table-vcenter table-hover text-nowrap datatable">
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
												<th className="no-sort rollcalls">SON 3 YOKLAMA</th>
												<th className="no-sort fees">SON 3 ÖDEME</th>
												<th className="w-1 pr-0 no-sort status">DURUM</th>
												<th className="pr-2 no-sort note"></th>
												<th className="pr-0 w-1 no-sort action"></th>
											</tr>
										</thead>
									</table>

									{<GroupChange data={data} visible={group_change} history={this.props.history} />}
									{<Vacation data={data} visible={vacation} history={this.props.history} />}
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
