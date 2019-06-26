import React, { Component } from "react";
import { Link } from "react-router-dom";

export class List extends Component {
	constructor(props) {
		super(props);

		this.state = {
			onLoadedData: true,
			loadingButton: false
		};
	}

	render() {
		const { onLoadedData, loadingButton } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Personel</h1>
				</div>

				<div className="row">
					<div className="col-lg-12">
						<div className="card">
							<div className="card-header">
								<div className="card-status bg-azure" />
								<h3 className="card-title">Geçmiş Yoklama Listesi</h3>
								<div className="card-options">
									<Link
										to="/app/rollcalls/employee/add"
										onClick={this.completeRollcall}
										className={`btn btn-sm btn-success ${loadingButton ? "btn-loading disabled" : ""} ${
											!onLoadedData ? "btn-loading disabled" : ""
										}`}>
										Yoklama Oluştur
									</Link>
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
														<th>Yoklama Adı</th>
														<th className="text-center">Detay</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="text-center text-muted">#1</td>
														<td>
															<Link
																className="text-inherit"
																to={`/app/rollcalls/employee/detail/1`}>
																26 Haziran 2019
															</Link>
														</td>
														<td className="text-center">32/35</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default List;