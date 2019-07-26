import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Menu extends Component {
	render() {
		console.log(this.props);
		return (
			<div id="menu">
				<div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
					<div className="container">
						<div className="row align-items-center">
							{/*<div className="col-lg-3 ml-auto">
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
							</div>*/}
							<div className="col-lg order-lg-first">
								<ul className="nav nav-tabs border-0 flex-column flex-lg-row">
									<li className="nav-item">
										<NavLink
											to="/app/dashboard"
											exact
											activeClassName="active"
											className="nav-link">
											<i className="fe fe-home" /> Anasayfa
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/app/employees" activeClassName="active" className="nav-link">
											<i className="fe fe-briefcase" /> Personeller
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/app/players" activeClassName="active" className="nav-link">
											<i className="fe fe-users" /> Öğrenciler
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/app/groups" activeClassName="active" className="nav-link">
											<i className="fe fe-grid" /> Gruplar
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink
											to="/app/rollcalls"
											activeClassName="active"
											className="nav-link"
											data-toggle="dropdown">
											<i className="fe fe-check-square" />
											Yoklamalar
										</NavLink>
										<div className="dropdown-menu dropdown-menu-arrow">
											<NavLink to="/app/rollcalls/player" exact className="dropdown-item">
												Öğrenci Yoklaması
											</NavLink>
											<NavLink to="/app/rollcalls/employee" exact className="dropdown-item">
												Personel Yoklaması
											</NavLink>
										</div>
									</li>
									<li className="nav-item">
										<NavLink to="/app/reports" exact activeClassName="active" className="nav-link">
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
