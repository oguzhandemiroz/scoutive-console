import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import deletePlayer from "../PlayerAction/DeletePlayer";
import freezePlayer from "../PlayerAction/FreezePlayer";
import refreshPlayer from "../PlayerAction/RefreshPlayer";
import activatePlayer from "../PlayerAction/ActivatePlayer";

export class ActionButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: {}
        };
    }

    renderActionButton = () => {
        const { uid } = this.state;
        const { data, renderButton, history, dropdown, hide } = this.props;
        const { to, name, is_trial, status, group } = data;
        const fullname = name;

        const dropdownDivider = key => <div role="separator" className="dropdown-divider" key={key.toString()} />;
        const lock = (
            <span className="ml-1">
                (<i className="fe fe-lock mr-0" />)
            </span>
        );

        const actionMenu = [
            {
                name: "parent-message",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/messages/single/add/${to}/player`,
                    onClick: () => history.push(`/app/messages/single/add/${to}/player`)
                },
                childText: "Mesaj Gönder",
                child: {
                    className: "dropdown-icon fa fa-paper-plane"
                },
                lock: false,
                condition: true
            },
            {
                divider: key => dropdownDivider(key),
                condition: true
            },
            {
                name: "payment",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/payment/fee/${to}`,
                    onClick: () => history.push(`/app/players/payment/fee/${to}`)
                },
                childText: "Ödeme Al",
                child: {
                    className: "dropdown-icon fa fa-hand-holding-usd"
                },
                lock: false,
                condition: !is_trial
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status === 0
            },
            {
                name: "payment-warning",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Ödeme İkazı")
                },
                childText: "Ödeme İkazı",
                child: {
                    className: "dropdown-icon fa fa-exclamation-triangle"
                },
                lock: lock,
                condition: !is_trial && status !== 0
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status !== 0
            },
            {
                name: "freeze",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => freezePlayer(uid, to, fullname, history)
                },
                childText: "Kaydı Dondur",
                child: {
                    className: "dropdown-icon fa fa-snowflake"
                },
                lock: false,
                condition: !is_trial && status === 1
            },
            {
                name: "start",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/players/trial/activate/${to}`)
                },
                childText: "Kaydı Başlat",
                child: {
                    className: "dropdown-icon fa fa-play-circle"
                },
                lock: false,
                condition: is_trial === 1 && status === 1
            },
            {
                name: "active",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => activatePlayer(uid, to, fullname, history)
                },
                childText: "Kaydı Aktifleştir",
                child: {
                    className: "dropdown-icon fa fa-redo"
                },
                lock: false,
                condition: !is_trial && status === 0
            },
            {
                name: "refresh",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => refreshPlayer(uid, to, fullname, history)
                },
                childText: "Kaydı Yenile",
                child: {
                    className: "dropdown-icon fa fa-sync-alt"
                },
                lock: false,
                condition: !is_trial && status === 2
            },
            {
                name: "passive",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => deletePlayer(uid, to, fullname, history)
                },
                childText: "Kaydı Pasifleştir",
                child: {
                    className: "dropdown-icon fa fa-user-times"
                },
                lock: false,
                condition: status !== 0
            },
            {
                divider: key => dropdownDivider(key),
                condition: status !== 0
            },
            {
                name: "vacation",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => this.props.vacationButton({ name: fullname, uid: to }),
                    "data-toggle": "modal",
                    "data-target": "#vacationModal"
                },
                childText: "İzin Yaz",
                child: {
                    className: "dropdown-icon fa fa-coffee"
                },
                lock: false,
                condition: !is_trial && status === 1
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status === 1
            },
            {
                name: "point",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Not (Puan) Ver")
                },
                childText: "Not (Puan) Ver",
                child: {
                    className: "dropdown-icon fa fa-notes-medical"
                },
                lock: lock,
                condition: !is_trial && status === 1
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status === 1
            },
            {
                name: "edit",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/edit/${to}`,
                    onClick: () => history.push(`/app/players/edit/${to}`)
                },
                childText: "Düzenle",
                child: {
                    className: "dropdown-icon fa fa-pen"
                },
                lock: false,
                condition: is_trial === 0
            },
            {
                name: "group",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () =>
                        this.props.groupChangeButton({
                            name: fullname,
                            uid: to,
                            group: typeof group === "string" ? group : group ? group.label : null,
                            group_id: group ? group.value : null
                        }),
                    "data-toggle": "modal",
                    "data-target": "#groupChangeModal"
                },
                childText: "Grup Değişikliği",
                child: {
                    className: "dropdown-icon fa fa-user-cog"
                },
                lock: lock,
                condition: !is_trial && status !== 0
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status !== 0
            },
            {
                name: "certificate",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Öğrenci Belgesi")
                },
                childText: "Öğrenci Belgesi",
                child: {
                    className: "dropdown-icon fa fa-id-card-alt"
                },
                lock: lock,
                condition: true
            },
            {
                name: "messages",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/messages/${to}`,
                    onClick: () => history.push(`/app/players/messages/${to}`)
                },
                childText: "İletişim Servisi",
                child: {
                    className: "dropdown-icon fa fa-sms"
                },
                lock: false,
                condition: true
            },
            {
                name: "message-detail",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/message-detail/${to}`,
                    onClick: () => history.push(`/app/players/message-detail/${to}`)
                },
                childText: "Mesaj Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-comment-dots"
                },
                lock: false,
                condition: true
            },
            {
                name: "fee",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/fee-detail/${to}`,
                    onClick: () => history.push(`/app/players/fee-detail/${to}`)
                },
                childText: "Aidat Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-receipt"
                },
                lock: false,
                condition: true
            },
            {
                name: "rollcall",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/rollcall/${to}`,
                    onClick: () => history.push(`/app/players/rollcall/${to}`)
                },
                childText: "Yoklama Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-calendar-check"
                },
                lock: false,
                condition: true
            },
            {
                name: "detail",
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/detail/${to}`,
                    onClick: () => history.push(`/app/players/detail/${to}`)
                },
                childText: "Tüm Bilgileri",
                child: {
                    className: "dropdown-icon fa fa-info-circle"
                },
                lock: false,
                condition: true
            }
        ];

        return (
            <div className={`btn-block ${dropdown ? "dropdown" : "dropup"}`} id="action-dropdown">
                {renderButton ? (
                    renderButton()
                ) : (
                    <button
                        type="button"
                        id="player-action"
                        className="btn btn-gray-dark btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        İşlem
                    </button>
                )}
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="player-action"
                    x-placement="top-end">
                    <a className="dropdown-item disabled text-azure">
                        <i className="dropdown-icon fa fa-user text-azure" />
                        {fullname}
                    </a>
                    <div role="separator" className="dropdown-divider" />
                    {actionMenu.map((el, key) => {
                        if (hide && hide.indexOf(el.name) > -1) return null;
                        if (el.condition) {
                            if (el.tag === "Link") {
                                return (
                                    <Link {...el.elementAttr} key={key.toString()}>
                                        <i {...el.child} /> {el.childText}
                                        {el.lock}
                                    </Link>
                                );
                            } else if (el.tag === "button") {
                                return (
                                    <button {...el.elementAttr} key={key.toString()}>
                                        <i {...el.child} /> {el.childText}
                                        {el.lock}
                                    </button>
                                );
                            } else {
                                return el.divider(key);
                            }
                        }
                    })}
                </div>
            </div>
        );
    };

    render() {
        return <>{this.renderActionButton()}</>;
    }
}

export default ActionButton;
