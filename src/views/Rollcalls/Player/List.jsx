import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { List as GroupList } from "../../../components/Rollcalls/List";

export class List extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Öğrenciler</h1>
				</div>

				<div className="row">
					<div className="col-lg-3 mb-4">
						<div className="card">
							<div className="card-header justify-content-center" style={{ minHeight: 2 }}>
								Gruplar
							</div>
						</div>
						<GroupList />
					</div>
					<div className="col-lg-9">
						<div className="card">
							<div className="card-header" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(List);
