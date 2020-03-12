import React, { Component } from "react";
import deletePlayer from "../PlayerAction/DeletePlayer";
import freezePlayer from "../PlayerAction/FreezePlayer";
import refreshPlayer from "../PlayerAction/RefreshPlayer";
import activatePlayer from "../PlayerAction/ActivatePlayer";
import { CheckPermissions } from "../../services/Others";

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
        const { to, name, status, group } = data;

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
                condition: CheckPermissions(["m_write"])
            },
            {
                name: "payment",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/players/payment/fee/${to}`)
                },
                childText: "Ödeme Al",
                child: {
                    className: "dropdown-icon fa fa-hand-holding-usd"
                },
                lock: false,
                condition: CheckPermissions(["p_write", "a_write"])
            },
            {
                name: "freeze",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => freezePlayer(uid, to, name, history)
                },
                childText: "Kaydı Dondur",
                child: {
                    className: "dropdown-icon fa fa-snowflake"
                },
                lock: false,
                condition: CheckPermissions(["p_remove"]) && status === 1
            },
            {
                name: "active",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => activatePlayer(uid, to, name, history)
                },
                childText: "Kaydı Aktifleştir",
                child: {
                    className: "dropdown-icon fa fa-redo"
                },
                lock: false,
                condition: CheckPermissions(["p_write", "p_remove"]) && status === 0
            },
            {
                name: "refresh",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => refreshPlayer(uid, to, name, history)
                },
                childText: "Kaydı Yenile",
                child: {
                    className: "dropdown-icon fa fa-sync-alt"
                },
                lock: false,
                condition: CheckPermissions(["p_write", "p_remove"]) && status === 2
            },
            {
                name: "passive",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => deletePlayer(uid, to, name, history)
                },
                childText: "Kaydı Pasifleştir",
                child: {
                    className: "dropdown-icon fa fa-user-times"
                },
                lock: false,
                condition: CheckPermissions(["p_remove"]) && status !== 0
            },
            {
                name: "vacation",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => this.props.vacationButton({ name: name, uid: to }),
                    "data-toggle": "modal",
                    "data-target": "#vacationModal"
                },
                childText: "İzin Yaz",
                child: {
                    className: "dropdown-icon fa fa-coffee"
                },
                lock: false,
                condition: CheckPermissions(["p_write"]) && status === 1
            },
            /* {
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
            }, */
            {
                name: "edit",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/players/edit/${to}`)
                },
                childText: "Düzenle",
                child: {
                    className: "dropdown-icon fa fa-pen"
                },
                lock: false,
                condition: CheckPermissions(["p_write"])
            },
            /* {
                name: "group",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () =>
                        this.props.groupChangeButton({
                            name: name,
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
            }, */
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
                condition: CheckPermissions(["p_read"])
            },
            {
                name: "fee",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/players/fee-detail/${to}`)
                },
                childText: "Aidat Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-receipt"
                },
                lock: false,
                condition: CheckPermissions(["p_read", "a_read"])
            },
            /* {
                name: "messages",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
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
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
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
                name: "rollcall",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/players/rollcall/${to}`)
                },
                childText: "Yoklama Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-calendar-check"
                },
                lock: false,
                condition: true
            }, */
            {
                name: "detail",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/players/detail/${to}`)
                },
                childText: "Tüm Bilgileri",
                child: {
                    className: "dropdown-icon fa fa-info-circle"
                },
                lock: false,
                condition: CheckPermissions(["p_read"])
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
                        {name}
                    </a>
                    <div role="separator" className="dropdown-divider" />
                    {actionMenu.map((el, key) => {
                        if (hide && hide.indexOf(el.name) > -1) return null;
                        if (el.condition) {
                            if (el.tag === "button") {
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
