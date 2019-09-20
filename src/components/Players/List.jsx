import React, { Component } from "react";
import { datatable_turkish } from "../../assets/js/core";
import ep from "../../assets/js/urls";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { fullnameGenerator } from "../../services/Others";
import ListFilter from "./ListFilter";
import GroupChange from "../PlayerAction/GroupChange";
import Vacation from "../PlayerAction/Vacation";
import ActionButton from "../Players/ActionButton";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";
import "../../assets/css/datatables.responsive.css";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

const dailyType = {
	"-1": ["Tanımsız", "secondary"],
	"0": ["Gelmedi", "danger"],
	"1": ["Geldi", "success"],
	"2": ["T. Gün İzinli", "warning"],
	"3": ["Y. Gün İzinli", "warning"]
};

const statusType = {
	0: { bg: "bg-danger", title: "Pasif" },
	1: { bg: "bg-success", title: "Aktif" },
	2: { bg: "bg-azure", title: "Donuk" },
	3: { bg: "bg-indigo", title: "Deneme" }
};

const footType = {
	0: "Sağ & Sol",
	1: "Sağ",
	2: "Sol"
};

const filteredList = () => {
	if (!document.getElementById("clearFilter")) {
		$("div.filterTools").append(
			`<a href="javascript:void(0)" id="clearFilter" class="btn btn-link text-truncate">Filtreyi temizle</a>`
		);

		$(".filterTools #clearFilter").on("click", function() {
			$.fn.dataTable.ext.search = [];
			$("#player-list")
				.DataTable()
				.draw();
			$(this).remove();
		});
	}

	$("#player-list")
		.DataTable()
		.draw();

	$("#playerListFilterMenu").modal("hide");
};

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: {},
			filter: {}
		};
	}

	generateFilter = filterFromModal => {
		console.log("filterFromModal", filterFromModal);
		$.fn.dataTable.ext.search = [];

		Object.keys(filterFromModal).map(el => {
			$.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
				if (settings.nTable.id !== "player-list") return true;
				if (["status", "group", "is_trial"].indexOf(el) > -1) {
					return filterFromModal[el] ? (filterFromModal[el].indexOf(rowData[el]) > -1 ? true : false) : true;
				} else if (el === "birthday") {
					if (filterFromModal[el]) {
						var first = parseInt(filterFromModal[el].first);
						var second = parseInt(filterFromModal[el].second);
						var age = parseInt(rowData[el]) || 0; // use data for the age column

						if (
							(isNaN(first) && isNaN(second)) ||
							(isNaN(first) && age <= second) ||
							(first <= age && isNaN(second)) ||
							(first <= age && age <= second)
						) {
							return true;
						}
						return false;
					}
					return true;
				} else {
					if (filterFromModal[el]) {
						switch (filterFromModal[el].condition) {
							case ">":
								return parseInt(rowData[el]) > parseInt(filterFromModal[el].value);
							case ">=":
								return parseInt(rowData[el]) >= parseInt(filterFromModal[el].value);
							case "<":
								return parseInt(rowData[el]) < parseInt(filterFromModal[el].value);
							case "<=":
								return parseInt(rowData[el]) <= parseInt(filterFromModal[el].value);
							case "===":
								return parseInt(rowData[el]) === parseInt(filterFromModal[el].value);
							case "!==":
								return parseInt(rowData[el]) !== parseInt(filterFromModal[el].value);
							default:
								return true;
						}
					} else return true;
				}
			});
		});

		filteredList();
		$("#playerListFilterMenu").modal("hide");
	};

	componentDidMount() {
		try {
			const { uid } = this.state;
			const table = $("#player-list").DataTable({
				dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
				responsive: {
					details: {
						type: "column",
						target: 2,
						renderer: function(api, rowIdx, columns) {
							var data = $.map(columns, function(col, i) {
								return col.hidden
									? `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
									<th class="w-1">${col.title}</th> 
									<td>${col.data}</td>
								</tr>`
									: ``;
							}).join("");

							return data ? $('<table class="w-100"/>').append(data) : false;
						}
					}
				},
				fixedHeader: true,
				order: [4, "asc"],
				aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
				stateSave: false, // change true
				language: {
					...datatable_turkish,
					decimal: ",",
					thousands: "."
				},
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
							fatalSwal(true);
						}
					},
					dataSrc: function(d) {
						console.log(d);
						$.fn.dataTable.ext.search = [];
						if (d.status.code !== 1020) {
							errorSwal(d.status);
							return [];
						} else return d.data;
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
						targets: "action",
						responsivePriority: 2,
						createdCell: (td, cellData, rowData) => {
							const fullname = fullnameGenerator(rowData.name, rowData.surname);
							const { uid, group, status, is_trial } = rowData;
							ReactDOM.render(
								<BrowserRouter>
									<ActionButton
										vacationButton={data =>
											this.setState({
												data: data
											})
										}
										groupChangeButton={data =>
											this.setState({
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
											<button
												type="button"
												id="player-action"
												className="btn btn-sm btn-secondary btn-block dropdown-toggle"
												data-toggle="dropdown"
												aria-haspopup="true"
												aria-expanded="false">
												İşlem
											</button>
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
						data: "fee",
						responsivePriority: 10009,
						render: function(data, type, row) {
							const { is_trial, is_scholarship } = row;
							if (type === "sort" || type === "type") {
								return data;
							}

							if (!is_trial && !is_scholarship & (data !== null)) {
								return data.format(2, 3, ".", ",") + " ₺";
							} else if (is_trial) {
								return "<b>DENEME</b>";
							} else if (is_scholarship) {
								return "<b>BURSLU</b>";
							} else if (data === null) {
								return "&mdash;";
							} else {
								return "&mdash;";
							}
						}
					},
					{
						data: "point",
						responsivePriority: 10010,
						className: "none",
						render: function(data) {
							if (data && data !== "") return data;
							else return "&mdash;";
						}
					},
					{
						data: "foot",
						responsivePriority: 10011,
						className: "none",
						render: function(data) {
							if (data && data !== "") return footType[data];
							else return "&mdash;";
						}
					},
					{
						data: "position",
						responsivePriority: 10012,
						className: "none",
						render: function(data) {
							if (data && data !== "") return data.name;
							else return "&mdash;";
						}
					},
					{
						data: "birthday",
						responsivePriority: 10008,
						render: function(data, type, row) {
							if (type === "sort" || type === "type") {
								return data ? data.split(".")[0] : data;
							}

							if (data && data !== "") return moment(data).format("LL");
							else return "&mdash;";
						}
					},
					{
						data: "group",
						responsivePriority: 10007,
						render: function(data) {
							if (data && data !== "") return data;
							else return "&mdash;";
						}
					},
					{
						data: "daily",
						responsivePriority: 10001,
						render: function(data, type, row) {
							return `<span class="status-icon bg-${dailyType[data][1]}"></span> ${dailyType[data][0]}`;
						}
					},
					{
						data: null
					}
				],

				initComplete: function() {
					$.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
						if (settings.nTable.id !== "player-list") return true;
						return rowData["status"] === 1 ? true : false;
					});
					filteredList();
				}
			});

			$("div.filterTools").html(`
                <button type="button" class="btn btn-yellow" data-toggle="modal" data-target="#playerListFilterMenu"><i class="fe fe-filter mr-2"></i>Filtre</button> 
			`);

			$.fn.DataTable.ext.errMode = "none";
			table.on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			table.on("draw.dt", function() {
				$('[data-toggle="tooltip"]').tooltip();
			});
		} catch (e) {
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
		const { data } = this.state;
		return (
			<div>
				<table
					id="player-list"
					className="table card-table w-100 table-vcenter table-striped text-nowrap datatable dataTable">
					<thead>
						<tr>
							<th>ID</th>
							<th className="no-sort">T.C.</th>
							<th className="w-1 no-sort control" />
							<th className="w-1 text-center no-sort">#</th>
							<th className="w-1 name">AD SOYAD</th>
							<th className="emergency">İLETİŞİM</th>
							<th className="fee">AİDAT</th>
							<th className="point">GENEL PUAN</th>
							<th className="foot">KULLANDIĞI AYAK</th>
							<th className="position">MEVKİİ</th>
							<th className="birthday">YAŞ</th>
							<th className="group">GRUP</th>
							<th className="daily">DURUM</th>
							<th className="no-sort action" />
						</tr>
					</thead>
				</table>
				<Vacation data={data} history={this.props.history} />
				<GroupChange data={data} history={this.props.history} />
				<ListFilter filterState={this.generateFilter} />
			</div>
		);
	}
}

export default Table;
