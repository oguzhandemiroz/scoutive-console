import React, { Component } from "react";
import List from "../../components/Rollcalls/Employee/List";
import { Link } from "react-router-dom";

export class Employee extends Component {
	render() {
		const splitPath = this.props.match.path.replace("/app/rollcalls/", "").split("/")[0];
		console.log(this.props, splitPath);
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Personel</h1>
					<div className="col" />
					<div className="col-auto px-0">
						<div className="btn-group" role="group" aria-label="Rollcalls Tabs">
							<Link
								to="/app/rollcalls/employee"
								className={`btn btn-secondary ${splitPath === "employee" ? "active" : ""}`}>
								<i className="fe fe-briefcase mr-2"></i>
								Personel Yoklaması
							</Link>
							<Link
								to="/app/rollcalls/player"
								className={`btn btn-secondary ${splitPath === "player" ? "active" : ""}`}>
								<i className="fe fe-users mr-2"></i>
								Öğrenci Yoklaması
							</Link>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-lg-12">
						<List />
					</div>
				</div>
			</div>
		);
	}
}

export default Employee;
