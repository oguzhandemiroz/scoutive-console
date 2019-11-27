import React, { Component } from "react";
import Area from "./General/Area";
import Payment from "./General/Payment";
import Branch from "./General/Branch";

export class General extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areas: null,
            loadingButton: ""
        };
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Genel</h3>
                </div>
                <div className="card-body">
                    <Branch />
                    <span className="mb-5 d-block"></span>
                    <Area />
                    <span className="mb-5 d-block"></span>
                    <Payment />
                </div>
            </div>
        );
    }
}

export default General;
