import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Menu extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div id="menu">
				<div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-3 ml-auto">
								<form className="input-icon my-3 my-lg-0">
									<input
										type="search"
										className="form-control header-search"
										placeholder="Ara&hellip;"
										tabIndex="1"
									/>
									<div className="input-icon-addon">
										<i className="fe fe-search" />
									</div>
								</form>
							</div>
							<div className="col-lg order-lg-first">
								<ul className="nav nav-tabs border-0 flex-column flex-lg-row">
									<li className="nav-item">
										<NavLink
											to={`${this.props.layout}/dashboard`}
											exact
											activeClassName="active"
											className="nav-link">
											<i className="fe fe-home" /> Anasayfa
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink
											to={`${this.props.layout}/employees`}
											exact
											activeClassName="active"
											className="nav-link">
											<i className="fe fe-award" /> Personeller
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink
											to={`${this.props.layout}/students`}
											exact
											activeClassName="active"
											className="nav-link">
											<i className="fe fe-users" /> Öğrenciler
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink
											to={`${this.props.layout}/rollcalls`}
											activeClassName="active"
											className="nav-link"
											data-toggle="dropdown">
											<i className="fe fe-check-square" />
											Yoklamalar
										</NavLink>
										<div className="dropdown-menu dropdown-menu-arrow">
											<NavLink
												to={`${this.props.layout}/rollcalls/student`}
												exact
												className="dropdown-item">
												Öğrenci Yoklaması
											</NavLink>
											<NavLink
												to={`${this.props.layout}/rollcalls/employee`}
												exact
												className="dropdown-item">
												Personel Yoklaması
											</NavLink>
										</div>
									</li>
									<li className="nav-item">
										<NavLink
											to={`${this.props.layout}/reports`}
											exact
											activeClassName="active"
											className="nav-link">
											<i className="fe fe-pie-chart" /> Raporlar
										</NavLink>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Menu;
