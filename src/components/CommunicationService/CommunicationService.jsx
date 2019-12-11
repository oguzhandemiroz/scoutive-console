import React, { Component } from "react";

export class CommunicationService extends Component {
    render() {
        return (
            <div id="communication-service" className="bg-orange">
                <div className="communication-icon">
                    <i className="fa fa-comments"></i>
                </div>
                <div className="communication-text">İletişim Servisi</div>
            </div>
        );
    }
}

export default CommunicationService;
