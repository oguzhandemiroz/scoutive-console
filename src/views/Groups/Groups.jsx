import React, { Component } from "react";

export class Groups extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gruplar</h1>
				</div>
				<div className="row">
					<div className="col-lg-3 mb-4">
						<a href="#" className="btn btn-block btn-primary mb-6">
							<i className="fe fe-plus-square mr-2" />
							Grup Ekle
						</a>
						<div className="list-group list-group-transparent mb-0">
							<a href="#" className="list-group-item list-group-item-action active">
								<span className="icon mr-3">
									<i className="fe fe-grid" />
								</span>
								U-17
							</a>
							<a href="#" className="list-group-item list-group-item-action">
								<span className="icon mr-3">
									<i className="fe fe-grid" />
								</span>
								U-11
							</a>
							<a href="#" className="list-group-item list-group-item-action">
								<span className="icon mr-3">
									<i className="fe fe-grid" />
								</span>
								U-15
							</a>
							<a href="#" className="list-group-item list-group-item-action">
								<span className="icon mr-3">
									<i className="fe fe-grid" />
								</span>
								U-13
							</a>
						</div>
					</div>

					<div className="col-lg-9">
						<div className="card">
							<div className="card-body" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Groups;
