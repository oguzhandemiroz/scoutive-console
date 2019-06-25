import React, { Component } from "react";
import { getCookie, setCookie } from "../../assets/js/core";
const $ = require("jquery");

export class EmployeesRollcalls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			employees: [1, 2]
		};
	}

	componentDidMount() {
		if (getCookie("RollcallsAgree") !== "OK") $("#myModal").modal();
	}

	agree = () => {
		setCookie("RollcallsAgree", "OK", 1, "D");
    };
    
	render() {
		const { employees } = this.state;
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
								<h3 className="card-title">Personel Listesi</h3>
								<div className="card-options">
									<span
										className="form-help bg-gray-dark text-white"
										data-toggle="popover"
										data-placement="bottom"
										data-content='<p>Yoklama yapılırken, sisteme "geldi" veya "izinli" olarak giriş yapabilirsiniz.</p><p>İşaretlenmemiş olanlar, yoklama tamamlandığında sisteme otomatik olarak <b>"gelmedi"</b> şeklinde giriş yapar.</p><p><b className="text-red">Not:</b> Yoklamayı gün sonunda tamamlayınız. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
										!
									</span>
									<div className="modal fade" tabIndex="-1" role="dialog" id="myModal">
										<div className="modal-dialog" role="document">
											<div className="modal-content">
												<div className="modal-header">
													<h5 className="modal-title text-dark">Uyarı!</h5>
													<button
														type="button"
														className="close"
														data-dismiss="modal"
														aria-label="Close"
													/>
												</div>
												<div className="modal-body text-dark" style={{ fontSize: 16 }}>
													<p>
														Yoklama yapılırken, sisteme <b>"geldi"</b> veya <b>"izinli"</b>{" "}
														olarak giriş yapabilirsiniz.
													</p>
													<p>
														İşaretlenmemiş olanlar, yoklama tamamlandığında sisteme otomatik
														olarak <b>"gelmedi"</b> şeklinde giriş yapar.
													</p>
													<p>
														<b className="text-red">Not:</b> Yoklamayı gün sonunda
														tamamlayınız. Tamamlanan yoklamalarda değişiklik{" "}
														<b>
															<u>yapılamaz.</u>
														</b>
													</p>
												</div>
												<div className="modal-footer">
													<button
														onClick={this.agree}
														type="button"
														className="btn btn-primary"
														data-dismiss="modal">
														Anladım
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
										<thead>
											<tr>
												<th className="pl-0 w-1" />
												<th>Ad Soyad</th>
												<th>Pozisyon</th>
												<th className="w-1">İşlem</th>
											</tr>
										</thead>
										<tbody>
											{employees
												? employees.length > 0
													? employees.map((el, key) => (
															<tr key={key.toString()}>
																<td className="text-center">
																	<div className="avatar d-block" />
																</td>
																<td>&mdash;</td>
																<td>&mdash;</td>
																<td>
																	<a
																		href="#"
																		data-original-title="Geldi"
																		data-toggle="tooltip"
																		className="btn btn-icon btn-sm btn-success">
																		<i className="fe fe-check" />
																	</a>
																	<a
																		href="#"
																		data-original-title="İzinli"
																		data-toggle="tooltip"
																		className="btn btn-icon btn-sm btn-warning ml-2">
																		<i className="fe fe-alert-circle" />
																	</a>
																</td>
															</tr>
													  ))
													: null
												: null}
										</tbody>
									</table>
								</div>
							</div>
							<div className="card-footer">
								<div className="d-flex justify-content-end align-items-center">
									<button type="submit" className={`btn btn-primary`}>
										Yoklamalayı Tamamla
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EmployeesRollcalls;
