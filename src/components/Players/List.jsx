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
			filter: {},
			...initialState
		};
	}

	generateFilter = filterFromModal => {
		console.log("filterFromModal", filterFromModal);
		$.fn.dataTable.ext.search = [];

		Object.keys(filterFromModal).map(el => {
			$.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
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

		if (!document.getElementById("clearFilter")) {
			console.log("yok");
			$("div.filterTools").append(
				`<a href="javascript:void(0)" id="clearFilter" class="btn btn-link">Filtreyi temizle</a>`
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

	componentDidMount() {
		try {
			const { uid } = this.state;
			const table = $("#player-list").DataTable({
				dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
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
						targets: "no-sort",
						orderable: false
					},
					{
						targets: "action",
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
								return `<span class="avatar avatar-placeholder">
										<span class="avatar-status ${row.is_trial ? statusType[3] : statusType[status]}"></span>
									</span>`;
							} else {
								return `<div class="avatar" style="background-image: url(${data})">
										<span class="avatar-status ${row.is_trial ? statusType[3] : statusType[status]}"></span>
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
						render: function(data, type, row) {
							if (type === "sort" || type === "type") {
								return data;
							}
							if (data && data !== "") return data.format() + " ₺";
							else return row.is_trial ? "<i><b>DENEME</b></i>" : "<i><b>BURSLU</b></i>";
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
						render: function(data, type, row) {
							if (type === "sort" || type === "type") {
								return data ? data.split(".")[0] : data;
							}

							if (data && data !== "") return moment(data).format("DD-MM-YYYY");
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
				],
				drawCallback: function(settings) {
					var api = this.api();

					// Output the data for the visible rows to the browser's console
					console.log(api.rows({ status: 1 }).data());
				}
			});

			$("div.filterTools").html(`
                <button type="button" class="btn btn-yellow" data-toggle="modal" data-target="#playerListFilterMenu"><i class="fe fe-filter mr-2"></i>Filtre</button> 
			`);

			$("#activePlayers").on("change", function() {
				if ($(this).is(":checked")) {
					$.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
						return rowData.status === 1;
					});
				} else {
					$.fn.dataTable.ext.search.pop();
				}
				table.draw();
			});

			$("#trialPlayers").on("change", function() {
				if ($(this).is(":checked")) {
					$.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
						return rowData.is_trial === 1;
					});
				} else {
					$.fn.dataTable.ext.search.pop();
				}
				table.draw();
			});

			$.fn.DataTable.ext.errMode = "none";
			$("#player-list").on("error.dt", function(e, settings, techNote, message) {
				console.log("An error has been reported by DataTables: ", message, techNote);
			});

			$("#player-list").on("draw.dt", function() {
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
		const { vacation, group_change, data } = this.state;
		return (
			<div>
				<table
					id="player-list"
					className="table card-table w-100 table-vcenter table-striped text-nowrap datatable">
					<thead>
						<tr>
							<th>ID</th>
							<th className="w-1 no-sort">T.C.</th>
							<th className="w-1 text-center no-sort">#</th>
							<th className="w-1 name">AD SOYAD</th>
							<th className="emergency">İLETİŞİM</th>
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
				{<ListFilter filterState={this.generateFilter} />}
			</div>
		);
	}
}

export default Table;
