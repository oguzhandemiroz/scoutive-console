import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CheckPermissions } from "../../services/Others";

const tabList = [
    {
        text: "Detay",
        path: "detail",
        icon: "fa fa-info-circle",
        condition: true
    },
    {
        text: "Mesaj Geçmişi",
        path: "message-detail",
        icon: "fa fa-comment-dots",
        condition: CheckPermissions(["m_read"])
    }
];

export class Tabs extends Component {
    render() {
        const { match, to } = this.props;
        const splitPath = match.path.replace("/app/persons/parents/", "").split("/")[0];

        return (
            <div className="btn-group" role="group" aria-label="Parent Tabs">
                {tabList.map((el, key) => {
                    if (el.condition) {
                        return (
                            <Link
                                key={key.toString()}
                                to={`/app/persons/parents/${el.path}/${to}`}
                                className={`btn btn-secondary ${splitPath === el.path ? "active" : ""}`}>
                                <i className={`${el.icon} mr-2`}></i>
                                {el.text}
                            </Link>
                        );
                    }
                })}
            </div>
        );
    }
}

export default Tabs;
