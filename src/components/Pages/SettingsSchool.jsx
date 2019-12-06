import React, { Component } from "react";
import { Link } from "react-router-dom";
import General from "../../components/Pages/Settings/General";
import Notifications from "../../components/Pages/Settings/Notifications";
import Permission from "../../components/Pages/Settings/Permission";
import UsageDetail from "../../components/Pages/Settings/UsageDetail";

const lock = (
    <span className="ml-1">
        (<i className="fe fe-lock mr-0" />)
    </span>
);

const settingsMenu = [
    {
        title: "Genel",
        pathname: "/general",
        active: "general",
        icon: "fa fa-cog",
        class: "",
        lock: false
    },
    {
        title: "Güvenlik",
        pathname: "/security",
        active: "security",
        icon: "fa fa-shield-alt",
        class: "cursor-not-allowed disabled",
        lock: lock
    },
    {
        title: "SMS Şablonları",
        pathname: "/sms-templates",
        active: "sms-templates",
        icon: "fa fa-sms",
        class: "",
        lock: false
    },
    {
        title: "Bildirimler",
        pathname: "/notifications",
        active: "notifications",
        icon: "fa fa-bell",
        class: "cursor-not-allowed disabled",
        lock: lock
    },
    {
        title: "Yetkilendirme",
        pathname: "/permission",
        active: "permission",
        icon: "fa fa-user-cog",
        class: "",
        lock: false
    },
    {
        title: "Ödeme",
        pathname: "/billing",
        active: "billing",
        icon: "fa fa-credit-card",
        class: "cursor-not-allowed disabled",
        lock: lock
    },
    {
        title: "Kullanım Detayı",
        pathname: "/membership",
        active: "membership",
        icon: "fa fa-money-bill",
        class: "",
        lock: false
    }
];

const settingsComponentRender = {
    general: <General />,
    notifications: <Notifications />,
    permission: <Permission />,
    membership: <UsageDetail />
};

export class SettingsSchool extends Component {
    constructor(props) {
        super(props);

        this.state = { uid: localStorage.getItem("UID") };
    }

    renderComponent = path => {
        return settingsComponentRender[path ? path : "general"];
    };

    renderTitle = path => {
        const item = settingsMenu.find(x => x.active === path);
        return item.title;
    };

    render() {
        const { location, match } = this.props.props;
        const { uid } = this.state;
        const path = match.path + "/" + uid;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Ayarlar &mdash; {this.renderTitle(location.pathname.split("/")[4])}</h1>
                </div>
                <div className="row">
                    <div className="col-lg-9 col-md-12 col-sm-12 order-1 order-lg-0">
                        {this.renderComponent(location.pathname.split("/")[4])}
                    </div>
                    <div className="col-lg-3 col-md-12 col-sm-12 order-0 order-lg-1">
                        <div className={`dimmer`}>
                            <div className="loader" />
                            <div className="dimmer-content">
                                <div className="list-group list-group-transparent mb-0">
                                    {settingsMenu.map((el, key) => {
                                        return (
                                            <Link
                                                to={el.lock ? "" : path + el.pathname}
                                                key={key.toString()}
                                                className={`list-group-item list-group-item-action d-flex ${el.class} ${
                                                    this.props.props.location.pathname.indexOf(el.active) > -1
                                                        ? "active"
                                                        : ""
                                                }`}>
                                                <span className="icon mr-3">
                                                    <i className={el.icon} />
                                                </span>
                                                {el.title} {el.lock}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsSchool;
