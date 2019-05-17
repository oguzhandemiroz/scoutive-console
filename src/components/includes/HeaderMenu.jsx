import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

class HeaderMenu extends Component {
	render() {
		return (
			<div id="header-menu">
				<div className="header py-4">
					<div className="container">
						<div className="d-flex">
							<Link className="header-brand" to="/">
								<img id="ScoutiveLogo" src={logo} alt="" />
							</Link>
							<div className="d-flex order-lg-2 ml-auto">
								<div className="dropdown d-none d-md-flex">
									<a className="nav-link icon" data-toggle="dropdown">
										<i className="fe fe-bell" />
										<span className="nav-unread" />
									</a>
									<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
										<a href="#" className="dropdown-item d-flex">
											<span
												className="avatar mr-3 align-self-center"
												style={{
													backgroundImage: "url(demo/faces/male/41.jpg)"
												}}
											/>
											<div>
												<strong>Nathan</strong> pushed new commit: Fix page load performance
												issue.
												<div className="small text-muted">10 minutes ago</div>
											</div>
										</a>
										<a href="#" className="dropdown-item d-flex">
											<span
												className="avatar mr-3 align-self-center"
												style={{
													backgroundImage: "url(demo/faces/female/1.jpg)"
												}}
											/>
											<div>
												<strong>Alice</strong> started new task: Tabler UI design.
												<div className="small text-muted">1 hour ago</div>
											</div>
										</a>
										<a href="#" className="dropdown-item d-flex">
											<span
												className="avatar mr-3 align-self-center"
												style={{
													backgroundImage: "url(demo/faces/female/18.jpg)"
												}}
											/>
											<div>
												<strong>Rose</strong> deployed new version of NodeJS REST Api V3
												<div className="small text-muted">2 hours ago</div>
											</div>
										</a>
										<div className="dropdown-divider" />
										<a href="#" className="dropdown-item text-center">
											Mark all as read
										</a>
									</div>
								</div>
								<div className="dropdown">
									<a href="#" className="nav-link pr-0 leading-none" data-toggle="dropdown">
										<span className="avatar" id="schoolLogo" />
										<span className="ml-2 d-none d-lg-block">
											<span className="text-default" id="schoolName">
												...
											</span>
											<small className="text-muted d-block mt-1">Sahibi</small>
										</span>
									</a>
									<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
										<a className="dropdown-item" href="../../profile.html">
											<i className="dropdown-icon fe fe-user" /> Profil
										</a>
										<a className="dropdown-item" href="#">
											<i className="dropdown-icon fe fe-settings" /> Ayarlar
										</a>
										<a className="dropdown-item" href="#">
											<span className="float-right">
												<span className="badge badge-primary">6</span>
											</span>
											<i className="dropdown-icon fe fe-mail" /> Gelen Kutusu
										</a>
										<a className="dropdown-item" href="#">
											<i className="dropdown-icon fe fe-send" /> Mesaj
										</a>
										<div className="dropdown-divider" />
										<a className="dropdown-item" href="#">
											<i className="dropdown-icon fe fe-help-circle" /> Yardım
										</a>
										<a className="dropdown-item" href="javascript:sc.request.logout();">
											<i className="dropdown-icon fe fe-log-out" /> Çıkış yap
										</a>
									</div>
								</div>
							</div>
							<a
								href="#"
								className="header-toggler d-lg-none ml-3 ml-lg-0"
								data-toggle="collapse"
								data-target="#headerMenuCollapse">
								<span className="header-toggler-icon" />
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default HeaderMenu;
