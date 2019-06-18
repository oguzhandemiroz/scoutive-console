import React, { Component } from "react";
import { DailyEmployee, GeneralEmployee, Table } from "../../components/Players/List.jsx";
import { Link } from "react-router-dom";

class Players extends Component {
	render() {
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenciler</h1>
					<Link to="/app/players/add" className="btn btn-sm btn-success ml-3">
						Öğrenci Ekle
					</Link>
				</div>
				<div className="row row-cards">
					<div className="col-sm-6 col-md-4" />
				</div>
				<div className="row row-cards">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Tüm Öğrenciler</h3>
							</div>
							<div className="table-responsive employee-list">
								<Table history={this.props.history} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Players;
