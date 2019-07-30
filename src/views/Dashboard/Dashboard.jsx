import React, { Component } from "react";
import { Revenue, Cost, NewUser } from "../../components/Dashboard/dashboard";

class Dashboard extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Genel Durum</h1>
				</div>
				<div className="row row-cards">
					<Revenue />
					<Cost />
					<div className="col-sm-12 col-lg-4">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Bütçe</h3>
							</div>
							<div class="card-body">
								<div class="card-value float-right text-muted">
                                    <i className="fa fa-university"></i>
                                </div>
								<h3 class="mb-1">4.203,00 ₺</h3>
								<div class="text-muted">Bakiye</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
