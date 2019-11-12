import React, { Component } from "react";
import ep from "../../assets/js/urls";
import "../../assets/js/core";
import { datatable_turkish } from "../../assets/js/core";
import { GetParentPlayers } from "../../services/Parent";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import { BrowserRouter, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { fullnameGenerator, nullCheck, formatDate, formatMoney } from "../../services/Others";
import ActionButton from "../Parents/ActionButton";
import Inputmask from "inputmask";
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

export class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID")
		};
	}

	componentDidMount() {
		try {
			const { uid } = this.state;
			$("#parent-list").DataTable({
				dom: '<"top"f>rt<"bottom"ilp><"clear">',
				responsive: {
					details: {
						type: "column",
						target: 1,
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
				order: [2, "asc"],
				aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "Tümü"]],
				stateSave: false, // change true
				language: {
					...datatable_turkish,
					decimal: ",",
					thousands: "."
				},
				ajax: {
					url: ep.PARENT_LIST,
					type: "POST",
					beforeSend: function(request) {
						request.setRequestHeader("Content-Type", "application/json");
						request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
						request.setRequestHeader("Authorization", uid);
					},
					datatype: "json",
					data: function(d) {
						return JSON.stringify({
							uid: uid
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
				columnDefs: [
					{
						targets: [0],
						visible: false
					},
					{
						className: "control",
						orderable: false,
						targets: [1]
					},
					{
						targets: "no-sort",
						orderable: false
					},
					{
						targets: "name",
						responsivePriority: 1,
						render: function(data, type, row) {
							const fullname = fullnameGenerator(data, row.surname);
							if (type === "sort" || type === "type") {
								return fullname;
							}
						},
						createdCell: (td, cellData, rowData) => {
							const { uid, name, surname } = rowData;
							const fullname = fullnameGenerator(name, surname);
							ReactDOM.render(
								<BrowserRouter>
									<Link
										className="text-inherit font-weight-600"
										to={"/app/parents/detail/" + uid}
										onClick={() => this.props.history.push(`/app/parents/detail/${uid}`)}>
										{fullname}
									</Link>
								</BrowserRouter>,
								td
							);
						}
					},
					{
						targets: "players",
						responsivePriority: 3,
						createdCell: (td, cellData, rowData) => {
							const { parent_id } = rowData;
							ReactDOM.render(
								<button
									onClick={el => this.getParentPlayers(el, parent_id)}
									className="btn btn-secondary btn-sm btn-icon">
									<i className="fa fa-user-graduate mr-1" /> Öğrencisi
								</button>,
								td
							);
						}
					},
					{
						targets: "action",
						class: "text-right",
						responsivePriority: 2,
						createdCell: (td, cellData, rowData) => {
							const fullname = fullnameGenerator(rowData.name, rowData.surname);
							const { uid } = rowData;
							ReactDOM.render(
								<BrowserRouter>
									<ActionButton
										history={this.props.history}
										dropdown={true}
										data={{
											to: uid,
											name: fullname
										}}
										renderButton={() => (
											<>
												<Link
													to={"/app/parents/detail/" + uid}
													className="btn btn-icon btn-sm btn-secondary"
													data-toggle="tooltip"
													onClick={() =>
														this.props.history.push(`/app/parents/detail/${uid}`)
													}
													title="Görüntüle">
													<i className="fe fe-eye" />
												</Link>
												<Link
													to={"/app/parents/edit/" + uid}
													className="btn btn-icon btn-sm btn-secondary mx-1"
													data-toggle="tooltip"
													onClick={() => this.props.history.push(`/app/parents/edit/${uid}`)}
													title="Düzenle">
													<i className="fe fe-edit" />
												</Link>
												<a
													title="İşlem Menüsü"
													href="javascript:void(0)"
													className="btn btn-icon btn-sm btn-secondary"
													data-toggle="dropdown"
													aria-haspopup="true"
													aria-expanded="false">
													<i className="fe fe-menu" />
												</a>
											</>
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
						data: "security_id"
					},
					{
						data: null,
						defaultContent: ""
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
								return `<a class="text-inherit font-weight-600" href="/app/parents/detail/${row.uid}">${fullname}</a>`;
						}
					},
					{
						data: "phone",
						responsivePriority: 10001,
						render: function(data, type, row) {
							const formatPhone = data ? Inputmask.format(data, { mask: "(999) 999 9999" }) : null;
							if (formatPhone) return `<a href="tel:+90${data}">${formatPhone}</a>`;
							else return "&mdash;";
						}
					},
					{
						data: "email",
						responsivePriority: 10007,
						render: function(data, type, row) {
							if (data) return `<a href="mailto:+${data}">${data}</a>`;
							else return "&mdash;";
						}
					},
					{
						data: "job",
						className: "none",
						responsivePriority: 10011,
						render: function(data, type, row) {
							return data || "&mdash;";
						}
					},
					{
						data: null
					},
					{
						data: null
					}
				]
			});

			$.fn.DataTable.ext.errMode = "none";
			$("#parent-list").on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			$("#parent-list").on("draw.dt", function() {
				$('[data-toggle="tooltip"]').tooltip();
				$('[data-toggle="popover"]').popover({
					html: true,
					trigger: "hover"
				});
			});
		} catch (e) {
			//fatalSwal();
			console.log("e", e);
		}
	}

	componentWillUnmount() {
		$(".data-table-wrapper")
			.find("table")
			.DataTable()
			.destroy(true);
	}

	getParentPlayers = (el, parent_id) => {
		const { uid } = this.state;
		const element = el.currentTarget;
		const that = this;
		this.addButtonLoading(element);
		GetParentPlayers({ uid: uid, parent_id: parent_id }).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					that.showPlayers(element, data);
				}
			}
		});
	};

	addButtonLoading = element => {
		$(element).addClass("btn-loading");
	};

	removeButtonLoading = element => {
		$(element).removeClass("btn-loading");
	};

	showPlayers = (element, data) => {
		const $parent = $(element).parent();
		if (data.length === 0) {
			$parent.html(`<div class="text-muted font-italic">Öğrenci bulunamadı...</div>`);
		} else {
			$parent.empty();
			data.map(el => {
				const fullname = fullnameGenerator(el.name, el.surname);
				$parent.append(`
                    <a href="/app/players/detail/${el.uid}"
                    class="text-inherit" 
                    data-toggle="popover" 
                    data-placement="top" 
                    data-content='
                        <p class="text-azure font-weight-600 h6">${fullname}
                            <span class="text-muted ml-1">
                                (${el.security_id})
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Aidat</strong>
                            <span class="text-muted">
                                ${this.renderFeeType(el)}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Grubu</strong>
                            <span class="text-muted">
                                ${nullCheck(el.group)}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Doğum Günü</strong>
                            <span class="text-muted">
                                ${formatDate(el.birthday, "LL")}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Kayıt Durumu</strong> 
                            <span class="text-${dailyType[el.daily].color}">
                                <span class="status-icon ${
									el.is_trial ? statusType[3].bg : statusType[el.status].bg
								} mr-1"/>
                                ${el.is_trial ? statusType[3].title : statusType[el.status].title}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Yoklama Durumu (Bugün)</strong> 
                            <span class="text-${dailyType[el.daily].color}">
                                ${dailyType[el.daily].text}
                            </span>
                        </p>
                    '>
                        ${fullname}
                    </a>
                    <br/>
                `);
			});

			$('[data-toggle="popover"]').popover({
				html: true,
				trigger: "hover"
			});
		}
	};

	renderFeeType = data => {
		if (!data.is_trial && !data.is_scholarship & (data.fee !== null)) {
			return formatMoney(data.fee);
		} else if (data.is_trial) {
			return "DENEME";
		} else if (data.is_scholarship) {
			return "BURSLU";
		} else if (data.fee === null) {
			return "&mdash;";
		} else {
			return "&mdash;";
		}
	};

	render() {
		return (
			<div>
				<table
					id="parent-list"
					className="table table-hover w-100 card-table table-vcenter text-nowrap datatable table-striped">
					<thead>
						<tr>
							<th className="security no-sort">T.C. KİMLİK NO</th>
							<th className="w-1 no-sort control" />
							<th className="name">ADI SOYADI</th>
							<th className="phone">TELEFON</th>
							<th className="email">EMAİL</th>
							<th className="job">MESLEK</th>
							<th className="players no-sort w-1">ÖĞRENCİSİ</th>
							<th className="w-1 action no-sort"></th>
						</tr>
					</thead>
				</table>
			</div>
		);
	}
}

export default List;
