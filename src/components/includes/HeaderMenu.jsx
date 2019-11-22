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
                <div className="header py-4 bg-scoutive">
                    <div className="container">
                        <div className="d-flex">
                            <Link className="d-flex header-brand" to="/app">
                                <img id="ScoutiveLogo" src={logo} alt="" />
                            </Link>
                            <div
                                data-original-title="Geliştirme aşamasında..."
                                data-toggle="tooltip"
                                className="d-flex justify-content-center align-items-center cursor-pointer px-4 mr-auto icon"
                                style={{
                                    borderLeftColor: "#9aa0ac",
                                    borderLeftWidth: 1,
                                    borderLeftStyle: "solid",
                                    fontSize: "1.2rem"
                                }}
                                onClick={() => console.log("Search Bitch")}>
                                <i className="fe fe-search"></i>
                            </div>
                            <div className="d-flex order-lg-2 ml-auto">
                                <div className="d-flex align-items-center">
                                    <span
                                        className="badge badge-secondary user-select-none"
                                        data-original-title="Sistem Saati"
                                        data-toggle="tooltip">
                                        {systemClock}
                                    </span>
                                </div>
                                <div className="dropdown d-none d-md-flex">
                                    <span className="nav-link icon" data-toggle="dropdown">
                                        <i className="fe fe-bell" />
                                    </span>
                                    <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow"></div>
                                </div>
                                <div className="dropdown">
                                    <span className="nav-link pr-0 leading-none" data-toggle="dropdown">
                                        <span
                                            className="avatar avatar-transparent"
                                            style={{ backgroundImage: `url(${this.state.sImage})` }}
                                        />
                                        <span className="ml-2 d-none d-lg-block">
                                            <span className="text-white">{this.state.sName}</span>
                                            <small className="text-muted d-block mt-1">{this.state.sPosition}</small>
                                        </span>
                                    </span>
                                    <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                                        <button
                                            className="dropdown-item"
                                            onClick={() => this.props.history.push(`/account/profile/${uid}`)}>
                                            <i className="dropdown-icon fe fe-user" /> Profil
                                        </button>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => this.props.history.push(`/account/settings/${uid}/general`)}>
                                            <i className="dropdown-icon fe fe-settings" /> Ayarlar
                                        </button>
                                        <button className="dropdown-item cursor-not-allowed disabled">
                                            <i className="dropdown-icon fe fe-mail" /> Gelen Kutusu
                                            <span className="ml-1">
                                                (<i className="fe fe-lock mr-0" />)
                                            </span>
                                        </button>
                                        <button className="dropdown-item cursor-not-allowed disabled">
                                            <i className="dropdown-icon fe fe-send" /> Mesaj
                                            <span className="ml-1">
                                                (<i className="fe fe-lock mr-0" />)
                                            </span>
                                        </button>
                                        <div className="dropdown-divider" />
                                        <button className="dropdown-item cursor-not-allowed disabled">
                                            <i className="dropdown-icon fe fe-help-circle" /> Yardım
                                            <span className="ml-1">
                                                (<i className="fe fe-lock mr-0" />)
                                            </span>
                                        </button>
                                        <button className="dropdown-item" onClick={Logout}>
                                            <i className="dropdown-icon fe fe-log-out" /> Çıkış yap
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <span
                                className="header-toggler d-lg-none ml-3 ml-lg-0 cursor-pointer"
                                data-toggle="collapse"
                                data-target="#headerMenuCollapse">
                                <span className="header-toggler-icon" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(HeaderMenu);
