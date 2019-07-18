import React, { Component } from "react";
import List from "../../components/Groups/List";
import All from "../../components/Groups/All";
import { Link, withRouter } from "react-router-dom";

export class Groups extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gruplar</h1>
				</div>
				<div className="row">
					<div className="col-lg-3 mb-4">
						<Link to="/app/groups/add" className="btn btn-block btn-secondary mb-6">
							<i className="fe fe-plus-square mr-2" />
							Grup Ekle
						</Link>
						<List match={this.props.match} />
						<div className="d-none d-lg-block mt-6">
							<Link to="/app/groups" className="text-muted float-right">
								Başa dön
							</Link>
						</div>
					</div>

					<div className="col-lg-9">
						<div className="card">
							<All />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Groups);