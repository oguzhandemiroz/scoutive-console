import React, { Component } from "react";
import List from "../../components/Groups/List";
import { Link, withRouter } from "react-router-dom";

const ComponentList = {
	all: this.props.match.params.gid
};

export class Groups extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Gruplar</h1>
				</div>
				<div className="row">
					<div className="col-lg-3 mb-4">
						<Link to="create" className="btn btn-block btn-primary mb-6">
							<i className="fe fe-plus-square mr-2" />
							Grup Ekle
						</Link>
						<List />
					</div>

					<div className="col-lg-9">
						<div className="card">
							<div className="card-body">{ComponentList[this.props.match.params.gid]}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Groups);
