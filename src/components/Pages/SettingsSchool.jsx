import React, {Component} from "react";
import {Link} from "react-router-dom";

const settingsMenu = [
    {
        title: "Genel",
        pathname: "/general",
        active: "general",
        icon: "fa fa-cog"
    },
    {
        title: "Bildirimler",
        pathname: "/notifications",
        active: "notifications",
        icon: "fa fa-bell"
    },
    {
        title: "Yetkilendirme",
        pathname: "/permission",
        active: "permission",
        icon: "fa fa-user-cog"
    },
    {
        title: "Kullanım Detayı",
        pathname: "/membership",
        active: "membership",
        icon: "fa fa-money-bill"
    }
];

const settingsComponentRender = {
    general: (
        <div className="card">
            <div className="card-body">
                <div className="card-status bg-gray" />
                <div className="text-wrap p-lg-6">
                    <h2 className="mt-0 mb-4">Genel</h2>
                </div>
            </div>
        </div>
    ),
    notifications: <div>Notif</div>,
    permission: <div>per</div>
};

export class SettingsSchool extends Component {
    constructor(props) {
        super(props);

        this.state = {uid: localStorage.getItem("UID")};
    }

    renderComponent = path => {
        return settingsComponentRender[path ? path : "general"];
    };

    renderTitle = path => {
        const item = settingsMenu.find(x => x.active === path);
        return item.title;
    };

    render() {
        console.log("Settings: ", this.props);
        const {location, match} = this.props.props;
        const {uid} = this.state;
        const path = match.path + "/" + uid;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        Ayarlar &mdash; {this.renderTitle(location.pathname.split("/")[4])}
                    </h1>
                </div>
                <div className="row">
                    <div className="col-lg-9">{this.renderComponent(location.pathname.split("/")[4])}</div>
                    <div className="col-lg-3 mb-4 pl-0">
                        <div className={`dimmer`}>
                            <div className="loader" />
                            <div className="dimmer-content">
                                <div className="list-group list-group-transparent mb-0">
                                    {settingsMenu.map((el, key) => {
                                        return (
                                            <Link
                                                to={path + el.pathname}
                                                key={key.toString()}
                                                className={`list-group-item list-group-item-action d-flex ${
                                                    this.props.props.location.pathname.indexOf(el.active) > -1
                                                        ? "active"
                                                        : ""
                                                }`}>
                                                <span className="icon mr-3">
                                                    <i className={el.icon} />
                                                </span>
                                                {el.title}
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
