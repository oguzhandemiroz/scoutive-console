import React, { Component } from "react";
import Table from "../../components/Employees/List.jsx";
import TotalSalary from "../../components/Employees/Charts/TotalSalary";
import DailyEmployee from "../../components/Employees/Charts/DailyEmployee";
import GeneralEmployee from "../../components/Employees/Charts/GeneralEmployee";
import { Link, withRouter } from "react-router-dom";
import { ListEmployees } from "../../services/Employee";

class Employees extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			data: []
		};
	}

	componentDidMount() {
		this.renderEmployeeList();
	}

	renderEmployeeList = () => {
		const { uid } = this.state;
		ListEmployees(uid).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) this.setState({ data: response.data });
			}
		});
	};

	render() {
		const { data } = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personeller</h1>
					<Link to="/app/employees/add" className="btn btn-sm btn-success ml-auto">
						Personel Ekle
					</Link>
				</div>
				<div className="row row-cards">
					<div className="col-sm-6 col-md-4">
						<DailyEmployee data={data} />
					</div>
					<div className="col-sm-6 col-md-4">
						<GeneralEmployee data={data} />
					</div>
					<div className="col-sm-6 col-md-4">
						<TotalSalary data={data} />
					</div>
				</div>
				<div className="row row-cards">
					<div className="col">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Tüm Personeller</h3>
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

export default withRouter(Employees);
