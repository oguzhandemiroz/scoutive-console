import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { CreateRollcall, ListRollcall } from "../../../services/Rollcalls";
import { Toast, showSwal } from "../../Alert";
import moment from "moment";
import "moment/locale/tr";

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="3" className="text-center text-muted font-italic">
			{loading ? (
				<div className={`dimmer active`}>
					<div className="loader" />
					<div className="dimmer-content" />
				</div>
			) : (
				"Kayıt bulunamadı..."
			)}
		</td>
	</tr>
);

export class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			rollcallList: null,
			onLoadedData: true,
			loadingButton: false
		};
	}

	componentDidMount() {
		this.renderRollcallList();
	}

	renderRollcallList = () => {
		try {
			const { uid } = this.state;
			ListRollcall({
				uid: uid,
				type: 1
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						this.setState({ rollcallList: response.data.reverse() });
					}
				}
				this.setState({
					loadingButton: false
				});
			});
		} catch (e) {}
	};

	createRollcall = () => {
		try {
			const { uid } = this.state;
			this.setState({
				loadingButton: true
			});
			CreateRollcall({
				uid: uid,
				type: 1
			}).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						Toast.fire({
							type: "success",
							title: "İşlem başarılı..."
						});
						this.props.history.push({
							pathname: `/app/rollcalls/employee/add`,
							state: { rcid: response.rollcall_id }
						});
					} else if (status.code === 2010) {
						showSwal({
							type: "warning",
							title: "Uyarı",
							text: status.description,
							reverseButtons: true,
							showCancelButton: true,
							confirmButtonText: "Yoklamaya devam et",
							cancelButtonText: "Kapat"
						}).then(result => {
							if (result.value) {
								this.props.history.push({
									pathname: `/app/rollcalls/employee/add`,
									state: { rcid: response.rollcall_id }
								});
							}
						});
					}
				}
				this.setState({
					loadingButton: false
				});
			});
		} catch (e) {}
	};

	render() {
		const { rollcallList, onLoadedData, loadingButton } = this.state;
		return (
			<div className="card">
				<div className="card-header">
					<div className="card-status bg-azure" />
					<h3 className="card-title">Geçmiş Yoklama Listesi</h3>
					<div className="card-options">
						<button
							onClick={this.createRollcall}
							className={`btn btn-sm btn-success ${loadingButton ? "btn-loading disabled" : ""} ${
								!onLoadedData ? "btn-loading disabled" : ""
							}`}>
							Yoklama Oluştur
						</button>
					</div>
				</div>

				<div className="card-body">
					<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
						<div className="loader" />
						<div className="dimmer-content">
							<div className="table-responsive">
								<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
									<thead>
										<tr>
											<th className="pl-0 w-1" />
											<th>Yoklama Tarihi</th>
											<th className="text-center">
												Detay
												<span
													className="form-help ml-2"
													data-original-title="Gelen/Toplam"
													data-toggle="tooltip"
													data-placement="top">
													?
												</span>
											</th>
										</tr>
									</thead>
									<tbody>
										{rollcallList
											? rollcallList.length > 0
												? rollcallList.map((el, key) => {
														const redirect =
															el.status === 2
																? {
																		pathname: "/app/rollcalls/employee/add",
																		state: { rcid: el.rollcall_id }
																  }
																: {
																		pathname:
																			"/app/rollcalls/employee/detail/" +
																			el.rollcall_id
																  };
														return (
															<tr key={key.toString()}>
																<td className="text-center text-muted">
																	#{el.rollcall_id}
																</td>
																<td>
																	<span className="badge badge-danger mr-2">
																		{el.status === 2 ? "Devam ediyor" : ""}
																	</span>
																	<Link className="text-inherit" to={redirect}>
																		{moment(el.created_date).format("LLL")}
																	</Link>
																</td>
																<td className="text-center">
																	{el.came + "/" + el.total}
																</td>
															</tr>
														);
												  })
												: noRow()
											: noRow(true)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(List);
