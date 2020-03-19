import React, { Component } from "react";
import Sessions from "./Sessions";

export class Securty extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Güvenlik</h3>
                </div>
                <div className="card-body">
                    <Sessions />
                </div>
            </div>
        );
    }
}

export default Securty;
