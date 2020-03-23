import React, { Component } from "react";
import Monthly from "../UsageDetail/Monthly";
import PastTransaction from "./PastTransaction";
import Banks from "./Banks";
import { GetSettings, GetSchoolFees } from "../../../../services/School";
import { formatDate } from "../../../../services/Others";

export class Billing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            start: {
                settings: {
                    sms_free_balance: 0,
                    sms_extra_balance: 0
                }
            },
            school_fees: [],
            loading: "active"
        };
    }

    componentDidMount() {
        GetSettings().then(resSettings => this.setState({ start: resSettings }));
        GetSchoolFees().then(response => {
            if (response) {
                this.setState({ school_fees: response.data.reverse(), loading: "" });
            }
        });
    }

    render() {
        const { start, school_fees } = this.state;
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <Monthly fees={school_fees} disablePayButton />
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
                    <div className="col-12">
                        <Banks />
                    </div>
                    <div className="col-12">
                        <PastTransaction fees={school_fees} />
                    </div>
                </div>
            </>
        );
    }
}

export default Billing;
