import React, { Component } from "react";
import { Link } from "react-router-dom";
import General from "../../components/Pages/Settings/General";
import Notifications from "../../components/Pages/Settings/Notifications";
import Permissions from "./Settings/Permissions";
import UsageDetail from "../../components/Pages/Settings/UsageDetail";
import SmsTemplates from "./Settings/SmsTemplates/SmsTemplates";
import SmsTemplatesEdit from "./Settings/SmsTemplates/SmsTemplatesEdit";
import SmsTemplatesAdd from "./Settings/SmsTemplates/SmsTemplatesAdd";

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
        class: "",
        lock: false
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
        title: "SMS Şablonları — Düzenle",
        pathname: "/sms-templates-edit",
        active: "sms-templates-edit",
        icon: "fa fa-sms",
        class: "",
        lock: false,
        hide: true
    },
    {
        title: "SMS Şablonları — Yeni Oluştur",
        pathname: "/sms-templates-add",
        active: "sms-templates-add",
        icon: "fa fa-sms",
        class: "",
        lock: false,
        hide: true
    },
    {
        title: "Bildirimler",
        pathname: "/notifications",
        active: "notifications",
        icon: "fa fa-bell",
        class: "cursor-not-allowed disabled",
        lock: lock,
        hide: true
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
        class: "",
        lock: false
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
    permission: <Permissions />,
    membership: <UsageDetail />,
    "sms-templates": <SmsTemplates />,
    "sms-templates-edit": <SmsTemplatesEdit />,
    "sms-templates-add": <SmsTemplatesAdd />
};

export class SettingsSchool extends Component {
    constructor(props) {
        super(props);

        this.state = { uid: localStorage.getItem("UID") };
    }

    renderComponent = path => {
        return settingsComponentRender[path ? path.params.branch : "general"];
    };

    renderTitle = path => {
        const item = settingsMenu.find(x => x.active === path.params.branch);
        return item.title;
    };

    render() {
        const { match } = this.props.props;
        const { uid } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Ayarlar &mdash; {this.renderTitle(match)}</h1>
                </div>
                <div className="row">
                    <div className="col-lg-9 col-md-12 col-sm-12 order-1 order-lg-0">{this.renderComponent(match)}</div>
                    <div className="col-lg-3 col-md-12 col-sm-12 order-0 order-lg-1">
                        <div className={`dimmer`}>
                            <div className="loader" />
                            <div className="dimmer-content">
                                <div className="list-group list-group-transparent mb-0">
                                    {settingsMenu.map((el, key) => {
                                        if (el.hide) return null;
                                        return (
                                            <Link
                                                to={el.lock ? "" : `/account/settings${el.pathname}/${uid}`}
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
