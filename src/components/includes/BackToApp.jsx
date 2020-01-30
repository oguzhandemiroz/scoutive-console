import React, { Component } from "react";
import { Link } from "react-router-dom";

export class BackToApp extends Component {
    render() {
        return (
            <div id="menu">
                <div className="header py-4">
                    <div className="container">
                        <div className="d-flex align-items-center">
                            <Link to="/app" className="h4 mb-0">
                                <i className="fa fa-external-link-square-alt fa-flip-horizontal mr-2"></i>Scoutive'e
                                Geri Dön
                            </Link>
                            <div className="d-flex ml-auto">
                                <button onClick={() => window.print()} className="btn btn-sm btn-secondary">
                                    <i className="fe fe-printer mr-1"></i>Yazdır
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BackToApp;
