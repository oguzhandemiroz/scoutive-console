import React, { Component } from "react";
import { Link } from "react-router-dom";

const tabList = [
    {
        text: "Detay",
        path: "detail",
        icon: "fa fa-info-circle"
    },
    {
        text: "Aidat Geçmişi",
        path: "fee-detail",
        icon: "fa fa-receipt"
    },
    {
        text: "İzin Geçmişi",
        path: "vacation",
        icon: "fa fa-coffee"
    },
    {
        text: "Yoklama Geçmişi",
        path: "rollcall",
        icon: "fa fa-calendar-check"
    },
    {
        text: "İletişim Servisi",
        path: "messages",
        icon: "fa fa-sms"
    }
];

export class Tabs extends Component {
    render() {
        const { match, to } = this.props;
        const splitPath = match.path.replace("/app/players/", "").split("/")[0];

        return (
            <div className="btn-group" role="group" aria-label="Player Tabs">
                {tabList.map((el, key) => (
                    <Link
                        key={key.toString()}
                        to={`/app/players/${el.path}/${to}`}
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
