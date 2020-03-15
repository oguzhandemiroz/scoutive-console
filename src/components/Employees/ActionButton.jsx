import React, { Component } from "react";
import deleteEmployee from "../EmployeeAction/DeleteEmployee";
import activateEmployee from "../EmployeeAction/ActivateEmployee";
import { CheckPermissions } from "../../services/Others";

export class ActionButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID")
        };
    }

    renderActionButton = () => {
        const { uid } = this.state;
        const { data, renderButton, history, dropdown } = this.props;
        const { to, name, status } = data;

        const dropdownDivider = key => <div role="separator" className="dropdown-divider" key={key.toString()} />;
        const lock = (
            <span className="ml-1">
                (<i className="fe fe-lock mr-0" />)
            </span>
        );

        const actionMenu = [
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/messages/single/add/${to}/employee`)
                },
                childText: "Mesaj Gönder",
                child: {
                    className: "dropdown-icon fa fa-paper-plane"
                },
                lock: false,
                condition: CheckPermissions(["m_write"])
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/persons/employees/salary/${to}`)
                },
                childText: "Maaş Öde",
                child: {
                    className: "dropdown-icon fa fa-money-bill-wave"
                },
                lock: false,
                condition: CheckPermissions(["a_write"]) && status
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => this.props.advancePaymentButton({ name: name, uid: to }),
                    "data-toggle": "modal",
                    "data-target": "#advancePaymentModal"
                },
                childText: "Avans Ver",
                child: {
                    className: "dropdown-icon fa fa-hand-holding-usd"
                },
                lock: false,
                condition: CheckPermissions(["a_write"]) && status
            },
            {
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
                condition: CheckPermissions(["a_write", "e_write"]) && status
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => activateEmployee(uid, to, name, history)
                },
                childText: "İşe Tekrar Al",
                child: {
                    className: "dropdown-icon fa fa-redo"
                },
                lock: false,
                condition: CheckPermissions(["e_write", "e_remove"]) && !status
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => deleteEmployee(uid, to, name, history)
                },
                childText: "İşten Çıkar",
                child: {
                    className: "dropdown-icon fa fa-minus-circle"
                },
                lock: false,
                condition: CheckPermissions(["e_remove"]) && status
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/persons/employees/edit/${to}`)
                },
                childText: "Düzenle",
                child: {
                    className: "dropdown-icon fa fa-pen"
                },
                lock: false,
                condition: CheckPermissions(["e_write"])
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => this.props.passwordButton({ name: name, uid: uid }),
                    "data-toggle": "modal",
                    "data-target": "#passwordModal"
                },
                childText: "Şifre Değiştir",
                child: {
                    className: "dropdown-icon fa fa-key"
                },
                lock: lock,
                condition: CheckPermissions(["e_write"])
            },
            /* {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/persons/employees/salary-detail/${to}`)
                },
                childText: "Maaş Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-receipt"
                },
                lock: false,
                condition: true
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/persons/employees/rollcall/${to}`)
                },
                childText: "Yoklama Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-calendar-check"
                },
                lock: false,
                condition: true
            },
            {
                name: "message-detail",
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/persons/employees/message-detail/${to}`)
                },
                childText: "Mesaj Geçmişi",
                child: {
                    className: "dropdown-icon fa fa-comment-dots"
                },
                lock: false,
                condition: true
            }, */
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => history.push(`/app/persons/employees/detail/${to}`)
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
                        id="employee-action"
                        className="btn btn-gray-dark btn-block dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        İşlem
                    </button>
                )}
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="employee-action"
                    x-placement="top-end">
                    <a className="dropdown-item disabled text-azure">
                        <i className="dropdown-icon fa fa-user text-azure" />
                        {name}
                    </a>
                    <div role="separator" className="dropdown-divider" />
                    {actionMenu.map((el, key) => {
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
