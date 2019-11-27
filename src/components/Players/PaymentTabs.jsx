import React, { Component } from "react";
import { Link } from "react-router-dom";

const tabList = [
    {
        text: "Aidat Ödemesi",
        path: "fee",
        icon: "fa fa-hand-holding-usd"
    },
    {
        text: "Ekipman Ödemesi",
        path: "fee-detail",
        icon: "fa fa-tshirt",
        lock: true
    },
    {
        text: "Diğer Ödemeler",
        path: "vacation",
        icon: "fa fa-file-invoice-dollar",
        lock: true
    }
];

export class PaymentTabs extends Component {
    componentDidMount() {
        this.renderTabTitle();
    }

    renderTabTitle = () => {
        try {
            const { match, tabTitle } = this.props;
            const splitPath = match.path.replace("/app/players/payment/", "").split("/")[0];
            const getTabInfo = tabList.find(x => x.path === splitPath);
            tabTitle({ title: getTabInfo.text, icon: getTabInfo.icon });
        } catch (e) {}
    };

    render() {
        const { match, to } = this.props;
        const splitPath = match.path.replace("/app/players/", "").split("/")[0];

        return (
            <div className="btn-group" role="group" aria-label="Player PaymentTabs">
                {tabList.map((el, key) => (
                    <Link
                        key={key.toString()}
                        onClick={this.renderTabTitle}
                        to={`/app/players/payment/${el.path}/${to ? to : ""}`}
                        className={`btn btn-secondary ${splitPath === el.path ? "active" : ""} ${
                            el.lock ? "cursor-not-allowed disabled" : ""
                        }`}>
                        <i className={`${el.icon} mr-2`}></i>
                        {el.text}
                        {el.lock ? (
                            <span className="ml-1">
                                (<i className="fe fe-lock mr-0" />)
                            </span>
                        ) : null}
                    </Link>
                ))}
            </div>
        );
    }
}

export default PaymentTabs;
