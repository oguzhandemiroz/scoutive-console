import React, { Component } from "react";
import List from "../../components/Rollcalls/Employee/List";
import Tabs from "../../components/Rollcalls/Tabs";
import { Link } from "react-router-dom";

export class Employee extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Yoklamalar &mdash; Personel</h1>
					<div className="col" />
					<div className="col-auto px-0">
						<Tabs />
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
