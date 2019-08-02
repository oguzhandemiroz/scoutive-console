import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import List from "../../components/Budgets/List";

export class Budgets extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Kasa ve Bankalar</h1>
					<Link to="/app/employees/add" className="btn btn-sm btn-success ml-3">
						Yeni Oluştur
					</Link>
				</div>

				<div className="row row-cards">
					<div className="col-lg-4 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div className="card-value float-right text-muted">
									<i className={`fa fa-briefcase`}></i>
								</div>
								<h3 className="mb-1">144.578,97 ₺</h3>
								<div className="text-muted">Kasalar Toplamı</div>
							</div>
						</div>
					</div>

					<div className="col-lg-4 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div className="card-value float-right text-muted">
									<i className={`fa fa-university`}></i>
								</div>
								<h3 className="mb-1">4.257,44 ₺</h3>
								<div className="text-muted">Bankalar Toplamı</div>
							</div>
						</div>
					</div>

					<div className="col-lg-4 col-sm-12">
						<div className="card">
							<div className="card-body">
								<div className="card-value float-right text-muted">
									<i className={`fa fa-coins`}></i>
								</div>
								<h3 className="mb-1">‭148.836,41‬ ₺</h3>
								<div className="text-muted">Nakit Toplamı</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row row-cards">
					<div className="col">
						<div className="card">
							<div className="table-responsive employee-list">
								<List history={this.props.history} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Budgets);
