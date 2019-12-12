import React, { Component } from "react";

export class CommunicationService extends Component {
    render() {
        return (
            <div id="communication-service" className="bg-orange">
                <div className="communication-icon">
                    <i className="fa fa-satellite"></i>
                </div>
                <div className="communication-text">İletişim Merkezi</div>
            </div>
        );
    }
}

export default CommunicationService;
