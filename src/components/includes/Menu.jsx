import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class Menu extends Component {
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
										<NavLink to="/" exact activeClassName="active" className="nav-link">
											<i className="fe fe-home" /> Anasayfa
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/employees" activeClassName="active" className="nav-link">
											<i className="fe fe-award" /> Personeller
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/students" activeClassName="active" className="nav-link">
											<i className="fe fe-users" /> Öğrenciler
										</NavLink>
									</li>
									<li className="nav-item">
										<NavLink
											to="/rollcalls"
											activeClassName="active"
											className="nav-link"
											data-toggle="dropdown">
											<i className="fe fe-check-square" />
											Yoklamalar
										</NavLink>
										<div className="dropdown-menu dropdown-menu-arrow">
											<NavLink to="/rollcalls/student" className="dropdown-item">
												Öğrenci Yoklaması
											</NavLink>
											<NavLink to="/rollcalls/employee" className="dropdown-item">
												Personel Yoklaması
											</NavLink>
										</div>
									</li>
									<li className="nav-item">
										<NavLink to="/reports" activeClassName="active" className="nav-link">
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
