import React, { Component } from "react";
import { NavLink } from "react-router-dom";

const menu = [
	{
		li: "nav-item",
		navlink: { to: "/app/dashboard", exact: true, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-home",
		text: "Anasayfa",
		item: null
	},
	{
		li: "nav-item",
		navlink: { to: "/app/employees", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-briefcase",
		text: "Personeller",
		item: null
	},
	{
		li: "nav-item",
		navlink: { to: "/app/players", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-users",
		text: "Öğrenciler",
		item: null
	},
	{
		li: "nav-item",
		navlink: { to: "/app/groups", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-grid",
		text: "Gruplar",
		item: null
	},
	{
		li: "nav-item",
		navlink: { to: "/app/rollcalls", exact: false, activeClassName: "active", className: "nav-link" },
		dataToggle: "dropdown",
		icon: "fe fe-check-square",
		text: "Yoklamalar",
		childDividerClass: "dropdown-menu dropdown-menu-arrow",
		item: [
			{
				to: "/app/rollcalls/player",
				className: "dropdown-item",
				childText: "Öğrenci Yoklaması"
			},
			{
				to: "/app/rollcalls/employee",
				className: "dropdown-item",
				childText: "Personel Yoklaması"
			}
		]
	},
	{
		li: "nav-item",
		navlink: { to: "/app/budgets", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fa fa-coins",
		text: "Kasa ve Banka",
		item: null
	},
	{
		li: "nav-item",
		navlink: { to: "/app/accountings", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-bar-chart-2",
		text: "Gelir/Gider",
		item: null
	},
	{
		li: "nav-item cursor-not-allowed",
		navlink: {
			to: "/app/reports",
			exact: true,
			activeClassName: "active",
			className: "nav-link cursor-not-allowed disabled"
		},
		icon: "fe fe-pie-chart",
		text: "Raporlar",
		item: null,
		child: () => (
			<span className="ml-2">
				(<i className="fe fe-lock mr-0" />)
			</span>
		)
	}
];

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
									{menu.map((el, key) => {
										if (!el.item) {
											return (
												<li key={key.toString()} className={el.li}>
													<NavLink {...el.navlink}>
														<i className={el.icon} /> {el.text}
														{el.child ? el.child() : null}
													</NavLink>
												</li>
											);
										} else {
											return (
												<li key={key.toString()} className={el.li}>
													<NavLink {...el.navlink} data-toggle={el.dataToggle}>
														<i className={el.icon} /> {el.text}
													</NavLink>

													<div className={el.childDividerClass}>
														{el.item.map((el, key) => {
															return (
																<NavLink
																	key={key.toString()}
																	to={el.to}
																	className={el.className}>
																	{el.childText}
																</NavLink>
															);
														})}
													</div>
												</li>
											);
										}
									})}
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
