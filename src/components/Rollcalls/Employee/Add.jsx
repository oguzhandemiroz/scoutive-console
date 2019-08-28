import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, withRouter } from "react-router-dom";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";
import { MakeRollcall } from "../../../services/Rollcalls";
import { CreateVacation, UpdateVacation } from "../../../services/EmployeeAction";
import { WarningModal as Modal } from "../WarningModal";
import { datatable_turkish } from "../../../assets/js/core";
import ep from "../../../assets/js/urls";
import { fatalSwal, errorSwal } from "../../Alert.jsx";
import AdvancePayment from "../../EmployeeAction/AdvancePayment";
import { fullnameGenerator } from "../../../services/Others";
const $ = require("jquery");
$.DataTable = require("datatables.net");

var statusType = {
	0: "bg-gray",
	1: "bg-success",
	2: "bg-azure",
	3: "bg-indigo"
};

const initialState = {
	advance: false
};

export class Add extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: localStorage.getItem("UID"),
			...initialState,
			employees: null,
			statuses: [],
			onLoadedData: false,
			loadingButtons: []
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

	reload = () => {
		const current = this.props.history.location.pathname;
		this.props.history.replace(`/`);
		setTimeout(() => {
			this.props.history.replace(current);
		});
	};

	renderDataTable = () => {
		const { uid } = this.state;
		const { rcid } = this.props.match.params;
		const table = $("#rollcall-list").DataTable({
			dom: '<"top"f>rt<"bottom"ilp><"clear">',
			responsive: true,
			order: [3, "asc"],
			aLengthMenu: [[30, 50, 100, -1], [30, 50, 100, "Tümü"]],
			stateSave: false, // change true
			language: {
				...datatable_turkish,
				decimal: ",",
				thousands: "."
			},
			ajax: {
				url: ep.ROLLCALL_LIST_TYPE + "employees",
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
						return d.extra_data === 1 ? [] : d.data.filter(x => x.status === 1);
					}
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
				/*{
					targets: "rollcalls",
					createdCell: (td, cellData, rowData) => {
						const status_type = {
							0: { icon: "fe-x", badge: "badge-danger" },
							1: { icon: "fe-check", badge: "badge-success" },
							2: { icon: "fe-alert-circle", badge: "badge-warning" },
							3: { icon: "fe-alert-circle", badge: "badge-warning" }
						};

						ReactDOM.render(
							<div>
								{cellData.rollcalls.reverse().map((el, key) => {
									return (
										<span
											key={key.toString()}
											title={el.rollcall_date}
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
				},*/
				{
					targets: "status",
					class: "w-1",
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
					targets: "action",
					class: "pr-4 pl-1 w-1",
					createdCell: (td, cellData, rowData) => {
						const fullname = fullnameGenerator(rowData.name, rowData.surname);
						const { uid } = rowData;
						ReactDOM.render(
							<BrowserRouter>
								<div className="dropdown btn-block" id="action-dropdown">
									<a
										href="javascript:void(0)"
										className="icon"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false">
										<i className="fe fe-more-vertical"></i>
									</a>
									<div
										className="dropdown-menu dropdown-menu-right"
										aria-labelledby="employee-action"
										x-placement="top-end">
										<a className="dropdown-item disabled text-azure" href="javascript:void(0)">
											<i className="dropdown-icon fa fa-user text-azure" />
											{fullname}
										</a>
										<div role="separator" className="dropdown-divider" />
										<Link
											onClick={() => this.props.history.push(`/app/employees/salary/${uid}`)}
											className="dropdown-item action-pay-salary"
											to={`/app/employees/salary/${uid}`}>
											<i className="dropdown-icon fa fa-money-bill-wave" /> Maaş Öde
										</Link>
										<button
											onClick={() =>
												this.setState({
													...initialState,
													advance: true,
													data: { name: fullname, uid: uid }
												})
											}
											className="dropdown-item action-advance-payment">
											<i className="dropdown-icon fa fa-hand-holding-usd" /> Avans Ver
										</button>
										<div role="separator" className="dropdown-divider" />
										<a
											className="dropdown-item action-send-message cursor-not-allowed disabled"
											href="javascript:void(0)">
											<i className="dropdown-icon fa fa-paper-plane" /> Mesaj Gönder
											<span className="ml-1">
												(<i className="fe fe-lock mr-0" />)
											</span>
										</a>
										<a
											className="dropdown-item action-warning cursor-not-allowed disabled"
											href="javascript:void(0)">
											<i className="dropdown-icon fa fa-exclamation-triangle" /> İkaz Et
											<span className="ml-1">
												(<i className="fe fe-lock mr-0" />)
											</span>
										</a>
										<div role="separator" className="dropdown-divider" />
										<Link
											onClick={() => this.props.history.push(`/app/employees/edit/${uid}`)}
											className="dropdown-item action-edit"
											to={`/app/employees/edit/${uid}`}>
											<i className="dropdown-icon fa fa-pen" /> Düzenle
										</Link>
										<a className="dropdown-item action-all-salary-info" href="javascript:void(0)">
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
									<span class="avatar-status ${row.is_trial ? statusType[3] : statusType[status]}"></span>
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
					render: function(data, type, row) {
						const fullname = fullnameGenerator(data, row.surname);
						if (type === "sort" || type === "type") {
							return fullname;
						}
						if (data)
							return `<a class="text-inherit" href="/app/employees/detail/${row.uid}">${fullname}</a>`;
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
				{ data: null },
				{ data: null }
			]
		});

		$.fn.DataTable.ext.errMode = "none";
		$("#rollcall-list").on("error.dt", function(e, settings, techNote, message) {
			console.log("An error has been reported by DataTables: ", message, techNote);
		});

		$("#rollcall-list").on("draw.dt", function() {
			console.log("draw.dt");
			$('[data-toggle="tooltip"]').tooltip();
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
						"employee"
					),
					MakeRollcall(
						{
							uid: uid,
							to: to,
							status: parseInt(type),
							rollcall_id: parseInt(rcid)
						},
						"employee"
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
					"employee"
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

	render() {
		const { advance, data } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">
						Yoklamalar &mdash; Personel &mdash; Yoklama Al (#{this.props.match.params.rcid})
					</h1>
				</div>
				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-azure" />
								<h3 className="card-title">Personel Listesi</h3>
								<div className="card-options">
									<span
										className="form-help bg-gray-dark text-white"
										data-toggle="popover"
										data-placement="bottom"
										data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"gelmedi"</b> şeklinde tanımlanır.</p><p><b className="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
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
												<th className="w-1 text-center no-sort"></th>
												<th className="name">AD SOYAD</th>
												{/* <th className="no-sort rollcalls">SON 5 YOKLAMA</th> */}
												<th className="phone">TELEFON</th>
												<th className="position">POZİSYON</th>
												<th className="w-1 no-sort status">DURUM</th>
												<th className="pr-2 w-1 no-sort action"></th>
											</tr>
										</thead>
									</table>
									{advance ? (
										<AdvancePayment data={data} visible={advance} history={this.props.history} />
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Add);
