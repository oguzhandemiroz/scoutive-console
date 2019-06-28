import React, { Component } from "react";
import List from "../../components/Rollcalls/Employee/List";

export class Employee extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Personel</h1>
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
