import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class Menu extends Component {
	render() {
		return (
			<div id="menu">
				<div class="header collapse d-lg-flex p-0" id="headerMenuCollapse">
					<div class="container">
						<div class="row align-items-center">
							<div class="col-lg-3 ml-auto">
								<form class="input-icon my-3 my-lg-0">
									<input
										type="search"
										class="form-control header-search"
										placeholder="Ara&hellip;"
										tabindex="1"
									/>
									<div class="input-icon-addon">
										<i class="fe fe-search" />
									</div>
								</form>
							</div>
							<div class="col-lg order-lg-first">
								<ul class="nav nav-tabs border-0 flex-column flex-lg-row">
									<li class="nav-item">
										<NavLink to="/" exact activeClassName="active" className="nav-link">
											<i class="fe fe-home" /> Anasayfa
										</NavLink>
									</li>
									<li class="nav-item">
										<NavLink to="/employees" activeClassName="active" className="nav-link">
											<i class="fe fe-award" /> Personeller
										</NavLink>
									</li>
									<li class="nav-item">
										<NavLink to="/students" activeClassName="active" className="nav-link">
											<i class="fe fe-users" /> Öğrenciler
										</NavLink>
									</li>
									<li class="nav-item">
										<NavLink
											to="/rollcalls"
											activeClassName="active"
											className="nav-link"
											data-toggle="dropdown">
											<i class="fe fe-check-square" />
											Yoklamalar
										</NavLink>
										<div class="dropdown-menu dropdown-menu-arrow">
											<NavLink to="/rollcalls/student" className="dropdown-item">
												Öğrenci Yoklaması
											</NavLink>
											<NavLink to="/rollcalls/employee" className="dropdown-item">
												Personel Yoklaması
											</NavLink>
										</div>
									</li>
									<li class="nav-item">
										<NavLink to="/reports" activeClassName="active" className="nav-link">
											<i class="fe fe-pie-chart" /> Raporlar
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
