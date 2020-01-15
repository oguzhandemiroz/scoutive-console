import React, { Component } from "react";
import { Link } from "react-router-dom";

export class ActionButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: {}
        };
    }

    renderActionButton = () => {
        const { data, renderButton, dropdown, history, hide } = this.props;
        const { to, name } = data;
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
                    to: `/app/messages/single/add/${to}/parent`,
                    onClick: () => history.push(`/app/messages/single/add/${to}/parent`)
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
                    className: "dropdown-item cursor-not-allowed disabled",
                    to: `/app/parents/payment/${to}`
                },
                childText: "Öğrenci Tanımla",
                child: {
                    className: "dropdown-icon fa fa-user-graduate"
                },
                lock: lock,
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
                    className: "dropdown-item cursor-not-allowed disabled",
                    to: `/app/parents/payment/${to}`
                },
                childText: "Ödeme Al",
                child: {
                    className: "dropdown-icon fa fa-hand-holding-usd"
                },
                lock: lock,
                condition: true
            },
            {
                divider: key => dropdownDivider(key),
                condition: true
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled"
                },
                childText: "Şifre Değiştir",
                child: {
                    className: "dropdown-icon fa fa-key"
                },
                lock: lock,
                condition: true
            },
            {
                divider: key => dropdownDivider(key),
                condition: true
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled"
                },
                childText: "Uygulama Paylaş",
                child: {
                    className: "dropdown-icon fa fa-mobile-alt"
                },
                lock: lock,
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
                        id="parent-action"
                        className="btn btn-gray-dark btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        İşlem
                    </button>
                )}
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="parent-action"
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
