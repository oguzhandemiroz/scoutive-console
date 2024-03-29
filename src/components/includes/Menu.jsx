import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { CheckPermissions } from "../../services/Others";

const menu = [
    {
        li: "nav-item",
        navlink: { to: "/app/dashboard", exact: true, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-home",
        text: "Anasayfa",
        item: null,
        condition: true
    },
    {
        li: "nav-item dropdown",
        navlink: { to: "/app/persons", exact: false, activeClassName: "active", className: "nav-link" },
        dataToggle: "dropdown",
        childDividerClass: "dropdown-menu dropdown-menu-arrow",
        icon: "fa fa-user-friends mr-2",
        text: "Kişiler",
        item: [
            {
                to: "/app/persons/parents",
                className: "dropdown-item",
                activeClassName: "active",
                childText: "Veliler",
                icon: "fa fa-user",
                condition: CheckPermissions(["p_read", "p_write", "p_remove"], "||")
            },
            {
                to: "/app/persons/employees",
                className: "dropdown-item",
                activeClassName: "active",
                childText: "Personeller",
                icon: "fa fa-user-tie",
                condition: CheckPermissions(["e_read", "e_write", "e_remove"], "||")
            }
        ],
        condition: CheckPermissions(["e_read", "e_write", "e_remove", "p_read", "p_write"], "||")
    },
    {
        li: "nav-item",
        navlink: { to: "/app/players", exact: false, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-user-graduate",
        text: "Öğrenciler",
        item: null,
        condition: CheckPermissions(["p_read", "p_write", "p_remove"], "||")
    },
    {
        li: "nav-item",
        navlink: { to: "/app/groups", exact: false, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-th",
        text: "Gruplar",
        item: null,
        condition: CheckPermissions(["g_read", "g_write", "g_remove"], "||")
    },
    /* {
        li: "nav-item cursor-not-allowed",
        navlink: {
            to: "/app/training",
            exact: true,
            activeClassName: "active",
            className: "nav-link cursor-not-allowed disabled"
        },
        icon: "fa fa-running",
        text: "Antrenman",
        item: null,
        child: () => (
            <span className="ml-2">
                (<i className="fe fe-lock mr-0" />)
            </span>
        ),
        condition: true
    }, */
    {
        li: "nav-item",
        navlink: { to: "/app/rollcalls", exact: false, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-clock",
        text: "Yoklamalar",
        item: null,
        condition: CheckPermissions(["r_read", "r_write", "r_remove"], "||")
    },
    {
        li: "nav-item",
        navlink: { to: "/app/budgets", exact: false, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-coins",
        text: "Kasa ve Banka",
        item: null,
        condition: CheckPermissions(["a_read", "a_write", "a_remove"], "||")
    },
    {
        li: "nav-item",
        navlink: { to: "/app/accountings", exact: false, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-calculator",
        text: "Gelir/Gider",
        item: null,
        condition: CheckPermissions(["a_read", "a_write", "a_remove"], "||")
    },
    {
        li: "nav-item",
        navlink: { to: "/app/messages", exact: false, activeClassName: "active", className: "nav-link" },
        icon: "fa fa-satellite-dish",
        text: "İletişim Merkezi",
        item: null,
        condition: CheckPermissions(["m_read", "m_write", "m_remove"], "||")
    }
    /* {
        li: "nav-item cursor-not-allowed",
        navlink: {
            to: "/app/reports",
            exact: true,
            activeClassName: "active",
            className: "nav-link cursor-not-allowed disabled"
        },
        icon: "fa fa-chart-pie",
        text: "Raporlar",
        item: null,
        child: () => (
            <span className="ml-2">
                (<i className="fe fe-lock mr-0" />)
            </span>
        ),
        condition: true
    } */
];

{
    /* <ContentLoader
speed={1.5}
width={600}
height={55}
viewBox="0 0 600 55"
backgroundColor="#f3f3f3"
foregroundColor="#999fac">
<circle cx="10" cy="27.5" r="10" />
<rect x="25" y="23.5" rx="4" ry="4" width="70" height="8" />
<circle cx="130" cy="27.5" r="10" />
<rect x="145" y="23.5" rx="4" ry="4" width="70" height="8" />
<circle cx="250" cy="27.5" r="10" />
<rect x="265" y="23.5" rx="4" ry="4" width="70" height="8" />
<circle cx="370" cy="27.5" r="10" />
<rect x="385" y="23.5" rx="4" ry="4" width="70" height="8" />
<circle cx="490" cy="27.5" r="10" />
<rect x="505" y="23.5" rx="4" ry="4" width="70" height="8" />
</ContentLoader> 
*/
}

class Menu extends Component {
    render() {
        return (
            <div id="menu">
                <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg order-lg-first">
                                {
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
                                                                {el.item.map((ch, k) => {
                                                                    if (ch.condition) {
                                                                        return (
                                                                            <NavLink
                                                                                key={k.toString()}
                                                                                to={ch.to}
                                                                                activeClassName={ch.activeClassName}
                                                                                className={ch.className}>
                                                                                <i className={ch.icon} /> {ch.childText}
                                                                            </NavLink>
                                                                        );
                                                                    }
                                                                })}
                                                            </div>
                                                        ) : null}
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;
