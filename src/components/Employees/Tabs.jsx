import React, {Component} from "react";
import {Link} from "react-router-dom";

const tabList = [
    {
        text: "Detay",
        path: "detail",
        icon: "fa fa-info-circle"
    },
    {
        text: "Maaş Detayı",
        path: "salary-detail",
        icon: "fa fa-money-bill-wave"
    },
    {
        text: "İzin Geçmişi",
        path: "vacation",
        icon: "fa fa-coffee"
    },
    {
        text: "Yoklama Geçmişi",
        path: "rollcall-detail",
        icon: "fa fa-check-square"
    },
    {
        text: "Zaman Çizelgesi",
        path: "timeline",
        icon: "fa fa-stream"
    }
];

export class Tabs extends Component {
    render() {
        const {match, to} = this.props;
        return (
            <div className="btn-group" role="group" aria-label="Employee Tabs">
                {tabList.map((el, key) => (
                    <Link
                        to={`/app/employees/${el.path}/${to}`}
                        key={key.toString()}
                        className={`btn btn-secondary ${match.path.indexOf(el.path) > -1 ? "active" : ""}`}>
                        <i className={`${el.icon} mr-2`}></i>
                        {el.text}
                    </Link>
                ))}
            </div>
        );
    }
}

export default Tabs;
