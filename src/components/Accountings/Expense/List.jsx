import React, { Component } from "react";
import ReactDOM from "react-dom";
import { datatable_turkish } from "../../../assets/js/core";
import ep from "../../../assets/js/urls";
import { nullCheck } from "../../../services/Others";
import "../../../assets/css/datatables.responsive.css";
import { fatalSwal, errorSwal } from "../../Alert.jsx";
import { Link, BrowserRouter } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

export class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID")
		};
	}

	componentDidMount() {
		const { uid } = this.state;
		$(this.refs.expensetable).DataTable({
			dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
			responsive: false,
			aLengthMenu: [[50, 100, -1], [50, 100, "Tümü"]],
			stateSave: false, // change true
			language: {
				...datatable_turkish,
				decimal: ",",
				thousands: "."
			},
			order: [0, "asc"],
			ajax: {
				url: ep.ACCOUNTING_LIST,
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
						filter: { type: 0 }
					});
				},
				contentType: "application/json",
				complete: function(res) {
					try {
						if (res.responseJSON.status.code !== 1020) {
							if (res.status !== 200) fatalSwal();
							else errorSwal(res.responseJSON.status);
						}
					} catch (e) {
						fatalSwal(true);
					}
				},
				dataSrc: function(d) {
					$.fn.dataTable.ext.search = [];
					if (d.status.code !== 1020) {
						errorSwal(d.status);
						return [];
					} else return d.data;
				}
			},
			columns: [
				{
					data: "accounting_id",
					class: "w-1",
					render: function(data, type, row, meta) {
						if (type === "sort" || type === "type") {
							return meta.row;
						}
						return `<div class="text-muted">#${data}</div>`;
					}
				},
				{
					data: "accounting_type",
					render: function(data, type, row) {
						return `${data}<div class="small text-muted text-break">${nullCheck(row.note, "")}</div>`;
					}
				},
				{
					data: "amount",
					render: function(data, type, row) {
						if (type === "sort" || type === "type") {
							return data;
						}
						if (data !== null && data !== "") return data.format(2, 3, ".", ",") + " ₺";
					}
				},
				{
					data: "payment_date",
					render: function(data, type, row) {
						if (type === "sort" || type === "type") {
							return moment(data, "YYYY-MM-DD").unix();
						}
						return `<td class="text-nowrap">${moment(data).format("LL")}</td>`;
					}
				},
				{
					data: null
				},
				{
					data: null
				}
			],
			columnDefs: [
				{
					targets: "no-sort",
					orderable: false
				},
				{
					targets: "budget",
					createdCell: (td, cellData, rowData) => {
						ReactDOM.render(
							<BrowserRouter>
								<Link
									onClick={() =>
										this.props.history.push("/app/budgets/detail/" + cellData.budget.budget_id)
									}
									to={`/app/budgets/detail/${cellData.budget.budget_id}`}
									className="text-inherit">
									{cellData.budget.budget_name}
								</Link>
							</BrowserRouter>,
							td
						);
					}
				},
				{
					targets: "detail",
					class: "w-1",
					createdCell: (td, cellData, rowData) => {
						ReactDOM.render(
							<BrowserRouter>
								<Link
									onClick={() =>
										this.props.history.push("/app/accountings/detail/" + rowData.accounting_id)
									}
									to={`/app/accountings/detail/${rowData.accounting_id}`}
									className="icon">
									<i className="fe fe-eye"></i>
								</Link>
							</BrowserRouter>,
							td
						);
					}
				}
			]
		});
	}

	render() {
		return (
			<div className="card">
				<div className="card-header">
					<h3 className="card-title">Tüm Gider İşlemleri</h3>
				</div>
				<div className="table-responsive">
					<table
						ref="expensetable"
						className="table card-table w-100 table-vcenter table-striped text-nowrap datatable">
						<thead>
							<tr>
								<th className="accounting_id">#</th>
								<th className="accounting_type">İşlem</th>
								<th className="amount">Tutar</th>
								<th className="payment_date">Tarih</th>
								<th className="budget no-sort">Kasa/Banka</th>
								<th className="detail no-sort w-1"></th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		);
	}
}

export default List;
