import React, { Component } from "react";
import "jquery";
import { datatable_turkish } from "../../assets/js/core";
import ep from "../../assets/js/urls";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import { BrowserRouter, Link } from "react-router-dom";
import Vacation from "../EmployeeAction/Vacation";
import Password from "../EmployeeAction/Password";
import AdvancePayment from "../EmployeeAction/AdvancePayment";
import { fullnameGenerator } from "../../services/Others";
import ActionButton from "./ActionButton";
import ReactDOM from "react-dom";
import Inputmask from "inputmask";
const $ = require("jquery");
$.DataTable = require("datatables.net");

var dailyType = {
	"-1": ["Tanımsız", "secondary"],
	"0": ["Gelmedi", "danger"],
	"1": ["Geldi", "success"],
	"2": ["T. Gün İzinli", "warning"],
	"3": ["Y. Gün İzinli", "warning"]
};

var statusType = {
	0: "bg-danger",
	1: "bg-success",
	2: "bg-azure",
	3: "bg-indigo"
};

const initialState = {
	vacation: false,
	password: false,
	advance: false
};

class Table extends Component {
	constructor(props) {
		super(props);

		this.state = { data: {}, ...initialState };
	}

	componentDidMount() {
		try {
			const UID = localStorage.getItem("UID");
			$("#employee-list").DataTable({
				dom: '<"top"f>rt<"bottom"ilp><"clear">',
				responsive: false,
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
							const { uid, status } = rowData;

							ReactDOM.render(
								<BrowserRouter>
									<ActionButton
										advancePaymentButton={data =>
											this.setState({
												...initialState,
												advance: true,
												data: data
											})
										}
										vacationButton={data =>
											this.setState({
												...initialState,
												vacation: true,
												data: data
											})
										}
										passwordButton={data =>
											this.setState({
												...initialState,
												password: true,
												data: data
											})
										}
										history={this.props.history}
										dropdown={true}
										data={{
											to: uid,
											name: fullname,
											status: status
										}}
										renderButton={() => (
											<button
												type="button"
												id="employee-action"
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
							if (data === null) {
								return `<span class="avatar avatar-placeholder">
										<span class="avatar-status ${statusType[status]}"></span>
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
								href="/app/employees/detail/${row.uid}">${fullname}</a>`;
						}
					},
					{
						data: "phone",
						render: function(data, type, row) {
							const formatPhone = data ? Inputmask.format(data, { mask: "(999) 999 9999" }) : null;
							if (formatPhone) return `<a href="tel:${data}" class="text-inherit">${formatPhone}</a>`;
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
								'<span class="status-icon bg-' + dailyType[data][1] + '"></span>' + dailyType[data][0]
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
		const { vacation, password, advance, data } = this.state;
		return (
			<div>
				<table
					id="employee-list"
					className="table card-table table-vcenter w-100 table-striped text-nowrap datatable">
					<thead>
						<tr>
							<th>ID</th>
							<th className="w-1 no-sort">T.C.</th>
							<th className="w-1 text-center no-sort">#</th>
							<th className="w-1 name">AD SOYAD</th>
							<th className="phone">TELEFON</th>
							<th className="position">POZİSYON</th>
							<th className="salary">MAAŞ</th>
							<th className="status">DURUM</th>
							<th className="no-sort action" />
						</tr>
					</thead>
				</table>
				{<Vacation data={data} visible={vacation} history={this.props.history} />}
				{<Password data={data} visible={password} history={this.props.history} />}
				{advance ? <AdvancePayment data={data} visible={advance} history={this.props.history} /> : null}
			</div>
		);
	}
}

export default Table;
