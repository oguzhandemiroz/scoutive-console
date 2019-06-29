import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Logout } from "../../services/Login.jsx";
import { systemClock } from "../../services/Others";

class HeaderMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			sName: localStorage.getItem("sName") || "—",
			sImage: localStorage.getItem("sImage"),
            sPosition: localStorage.getItem("sPosition") || "—",
            systemClock: systemClock()
		};
	}

	componentDidMount() {
		setInterval(() => {
			this.setState({ systemClock: systemClock() });
		}, 1000);
	}

	render() {
		const { systemClock, uid } = this.state;
		return (
			<div id="header-menu">
				<div className="header py-4">
					<div className="container">
						<div className="d-flex">
							<Link className="header-brand" to="/app">
								<img id="ScoutiveLogo" src={logo} alt="" />
							</Link>
							<div className="d-flex order-lg-2 ml-auto">
								<div className="d-flex align-items-center">
									<span
										className="tag tag-gray-dark"
										data-original-title="Sistem Saati"
										data-toggle="tooltip">
										{systemClock}
									</span>
								</div>
								<div className="dropdown d-none d-md-flex">
									<span className="nav-link icon" data-toggle="dropdown">
										<i className="fe fe-bell" />
										<span className="nav-unread" />
									</span>
									<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
										<button className="dropdown-item d-flex">
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
										</button>
										<button className="dropdown-item d-flex">
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
										</button>
										<button className="dropdown-item d-flex">
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
										</button>
										<div className="dropdown-divider" />
										<button className="dropdown-item text-center">Mark all as read</button>
									</div>
								</div>
								<div className="dropdown">
									<span
										href="javascript:void(0)"
										className="nav-link pr-0 leading-none"
										data-toggle="dropdown">
										<span
											className="avatar"
											style={{ backgroundImage: `url(${this.state.sImage})` }}
										/>
										<span className="ml-2 d-none d-lg-block">
											<span className="text-default">{this.state.sName}</span>
											<small className="text-muted d-block mt-1">{this.state.sPosition}</small>
										</span>
									</span>
									<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
										<button
											className="dropdown-item"
											onClick={() => this.props.history.push(`/account/profile/${uid}`)}>
											<i className="dropdown-icon fe fe-user" /> Profil
										</button>
										<button className="dropdown-item" onClick={this.Logout}>
											<i className="dropdown-icon fe fe-settings" /> Ayarlar
										</button>
										<button className="dropdown-item" onClick={this.Logout}>
											<span className="float-right">
												<span className="badge badge-primary">6</span>
											</span>
											<i className="dropdown-icon fe fe-mail" /> Gelen Kutusu
										</button>
										<button className="dropdown-item" onClick={this.Logout}>
											<i className="dropdown-icon fe fe-send" /> Mesaj
										</button>
										<div className="dropdown-divider" />
										<button className="dropdown-item" onClick={this.Logout}>
											<i className="dropdown-icon fe fe-help-circle" /> Yardım
										</button>
										<button className="dropdown-item" onClick={Logout}>
											<i className="dropdown-icon fe fe-log-out" /> Çıkış yap
										</button>
									</div>
								</div>
							</div>
							<a
								href="javascript:void(0)"
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

export default withRouter(HeaderMenu);
