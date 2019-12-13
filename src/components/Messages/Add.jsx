import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import SmsUsage from "../Pages/Settings/UsageDetail/SmsUsage";
import { GetSettings, GetSchoolFees } from "../../services/School";
import { MessagesAllTime } from "../../services/Report";
const $ = require("jquery");

export class Add extends Component {
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
            }
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
        const { start, school_fees, all_time_messages } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Mesaj Oluştur &mdash; SMS</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages"}>
                        İletişim Merkezine Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="steps steps-lime">
                            <span className="step-item active">SMS Bilgileri</span>
                            <span className="step-item">Şablon</span>
                            <span className="step-item">Kişiler</span>
                            <span className="step-item">Onayla ve Gönder</span>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title"></h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <SmsUsage
                            balance={start.settings}
                            fees={school_fees}
                            all_time={all_time_messages}
                            allTimeHide
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Add;
