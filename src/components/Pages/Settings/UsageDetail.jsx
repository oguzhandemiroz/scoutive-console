import React, { Component } from "react";
import Monthly from "./UsageDetail/Monthly";
import SmsUsage from "./UsageDetail/SmsUsage";
import PastTransaction from "./UsageDetail/PastTransaction";
const $ = require("jquery");

export class UsageDetail extends Component {
    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }
    render() {
        return (
            <>
                <div className="row row-cards">
                    <div className="col-lg-6 col-md-6">
                        <Monthly />
                        <div className="alert alert-info py-4">
                            Hesap Yenilenme Tarihi<strong> &mdash; 01 Ocak 2020</strong>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <SmsUsage />
                    </div>
                    <div className="col-12">
                        <PastTransaction />
                    </div>
                </div>
            </>
        );
    }
}

export default UsageDetail;
