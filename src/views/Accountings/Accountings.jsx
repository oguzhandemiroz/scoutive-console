import React, { Component } from "react";

export class Accountings extends Component {
	render() {
		return (
			<div className="container" style={{ marginTop: "-1.5rem" }}>
				<div className="row row-cards">
					<div className="col-lg-6 col-sm-12">
						<div className="page-header">
							<h1 className="page-title">
								<i className="fe fe-trending-up mr-2 text-green"></i>Gelir
							</h1>
							<button className="btn btn-sm ml-auto btn-success">Gelir Oluştur</button>
						</div>
						<div className="card">
							<div className="card-header">
								<h3 class="card-title">Son 15 İşlem</h3>
							</div>
							<div class="table-responsive">
								<table class="table card-table table-striped table-vcenter">
									<thead>
										<tr>
											<th>İşlem</th>
											<th>Tutar</th>
											<th>Tarih</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Bağış</td>
											<td>10.000,00 ₺</td>
											<td class="text-nowrap" title="10/10/2019">
												5 gün önce
											</td>
											<td class="w-1">
												<a href="#" class="icon">
													<i class="fe fe-eye"></i>
												</a>
											</td>
										</tr>
										<tr>
											<td>Kira</td>
											<td>5.350,00 ₺</td>
											<td class="text-nowrap" title="10/10/2019">
												10 gün önce
											</td>
											<td class="w-1">
												<a href="#" class="icon">
													<i class="fe fe-eye"></i>
												</a>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div className="col-lg-6 col-sm-12">
						<div className="page-header">
							<h1 className="page-title">
								<i className="fe fe-trending-down mr-2 text-red"></i>Gider
							</h1>
							<button className="btn btn-sm ml-auto btn-danger">Gider Oluştur</button>
						</div>
						<div className="card">
							<div className="card-header">
								<h3 class="card-title">Son 15 İşlem</h3>
							</div>
							<div class="table-responsive">
								<table class="table card-table table-striped table-vcenter">
									<thead>
										<tr>
											<th>İşlem</th>
											<th>Tutar</th>
											<th>Tarih</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Su Faturası</td>
											<td>127,00 ₺</td>
											<td class="text-nowrap" title="10/10/2019">
												8 gün önce
											</td>
											<td class="w-1">
												<a href="#" class="icon">
													<i class="fe fe-eye"></i>
												</a>
											</td>
										</tr>
										<tr>
											<td>Top</td>
											<td>52,00 ₺</td>
											<td class="text-nowrap" title="10/10/2019">
												17 gün önce
											</td>
											<td class="w-1">
												<a href="#" class="icon">
													<i class="fe fe-eye"></i>
												</a>
											</td>
										</tr>
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

export default Accountings;
