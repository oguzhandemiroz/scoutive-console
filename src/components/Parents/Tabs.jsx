import React, { Component } from "react";
import { Link } from "react-router-dom";

const tabList = [
    {
        text: "Detay",
        path: "detail",
        icon: "fa fa-info-circle"
    },
    {
        text: "Mesaj Geçmişi",
        path: "message-detail",
        icon: "fa fa-comment-dots"
    }
];

export class Tabs extends Component {
    render() {
        const { match, to } = this.props;
        const splitPath = match.path.replace("/app/parents/", "").split("/")[0];

        return (
            <div className="btn-group" role="group" aria-label="Parent Tabs">
                {tabList.map((el, key) => (
                    <Link
                        key={key.toString()}
                        to={`/app/parents/${el.path}/${to}`}
                        className={`btn btn-secondary ${splitPath === el.path ? "active" : ""}`}>
                        <i className={`${el.icon} mr-2`}></i>
                        {el.text}
                    </Link>
                ))}
            </div>
        );
    }
}

export default Tabs;
