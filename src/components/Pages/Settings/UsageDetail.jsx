import React, { Component } from "react";
import Monthly from "./UsageDetail/Monthly";
import SmsUsage from "./UsageDetail/SmsUsage";
import PastTransaction from "./Billing/PastTransaction";
import { GetSettings, GetSchoolFees } from "../../../services/School";
import { MessagesAllTime } from "../../../services/Report";
import { formatDate } from "../../../services/Others";

const $ = require("jquery");

export class UsageDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            start: {
                settings: {
                    sms_free_balance: 500,
                    sms_extra_balance: 0
                }
            },
            school_fees: [],
            all_time_messages: {
                2: 0,
                1: 0
            },
            loading: "active"
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        GetSettings().then(resSettings => this.setState({ start: resSettings }));
        GetSchoolFees().then(response => {
            if (response) {
                this.setState({ school_fees: response.data.reverse(), loading: "" });
            }
        });
        MessagesAllTime().then(response => {
            if (response) {
                this.setState({ all_time_messages: response.data });
            }
        });
    }

    render() {
        const { start, school_fees, all_time_messages, loading } = this.state;
        return (
            <div className={`dimmer ${loading}`}>
                <div className="loader" />
                <div className="dimmer-content">
                    <div className="row row-cards">
                        <div className="col-lg-6 col-md-6">
                            <Monthly fees={school_fees} />
                            <div className="alert alert-info py-4">
                                Hesap Yenilenme Tarihi
                                <strong>
                                    {" "}
                                    &mdash;{" "}
                                    {start.settings.expiry_date
                                        ? formatDate(start.settings.expiry_date, "DD MMMM YYYY, HH:mm")
                                        : ""}
                                </strong>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <SmsUsage balance={start.settings} fees={school_fees} all_time={all_time_messages} />
                        </div>
                        <div className="col-12">
                            <PastTransaction fees={school_fees} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UsageDetail;
