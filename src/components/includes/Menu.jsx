import React, { Component } from "react";
import { NavLink } from "react-router-dom";

const menu = [
	{
		li: "nav-item",
		navlink: { to: "/app/dashboard", exact: true, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-home",
		text: "Anasayfa",
		item: null,
		condition: true
	},
	{
		li: "nav-item",
		navlink: { to: "/app/employees", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-briefcase",
		text: "Personeller",
		item: null,
		condition: true
	},
	{
		li: "nav-item",
		navlink: { to: "/app/players", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-users",
		text: "Öğrenciler",
		item: null,
		condition: true
	},
	{
		li: "nav-item",
		navlink: { to: "/app/groups", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-grid",
		text: "Gruplar",
		item: null,
		condition: true
	},
	{
		li: "nav-item",
		navlink: { to: "/app/rollcalls", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-check-square",
		text: "Yoklamalar",
		item: null,
		condition: true
	},
	{
		li: "nav-item",
		navlink: { to: "/app/budgets", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fa fa-coins",
		text: "Kasa ve Banka",
		item: null,
		condition: parseInt(localStorage.getItem("sType")) === 0
	},
	{
		li: "nav-item",
		navlink: { to: "/app/accountings", exact: false, activeClassName: "active", className: "nav-link" },
		icon: "fe fe-bar-chart-2",
		text: "Gelir/Gider",
		item: null,
		condition: true
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
		),
		condition: true
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
							<div className="col-lg order-lg-first">
								<ul className="nav nav-tabs border-0 flex-column flex-lg-row">
									{menu.map((el, key) => {
										if (el.condition) {
											return (
												<li key={key.toString()} className={el.li}>
													<NavLink {...el.navlink} data-toggle={el.dataToggle}>
														<i className={el.icon} /> {el.text}
														{el.child ? el.child() : null}
													</NavLink>
													{el.item ? (
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
													) : null}
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
