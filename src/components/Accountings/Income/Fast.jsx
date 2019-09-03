import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
export class Fast extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gelir &mdash; Hızlı İşlem</h1>
				</div>

				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-12 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className="fa fa-plus-square mr-2" /> Hızlı İşlem
								</h3>
							</div>
							<div className="card-body">
								<div className="row">
									<div className="col-12">
										<div className="form-group">
											<label class="form-label">
												İşlem Türü <span className="form-required">*</span>
											</label>
											<input type="text" className="form-control" />
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label class="form-label">
												İşlem Açıklaması <span className="form-required">*</span>
											</label>
											<input type="text" name="note" className="form-control" />
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label class="form-label">
												İşlem Tarihi <span className="form-required">*</span>
											</label>
											<input type="text" name="note" className="form-control" />
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label class="form-label">
												Tutar <span className="form-required">*</span>
											</label>
											<input type="text" name="amount" className="form-control" />
										</div>
									</div>
									<div className="col-sm-12 col-md-6 col-lg-6">
										<div className="form-group">
											<label class="form-label">
												Kasa Hesabı <span className="form-required">*</span>
											</label>
											<input type="text" name="budget" className="form-control" />
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer d-flex justify-content-between align-items-center">
								<Link to={`/app/accountings`}>
									<i className="fe fe-arrow-left" /> Geri dön
								</Link>
								<button className="btn btn-success">Kaydet</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(Fast);
