import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

export class Tabs extends Component {
    render() {
        const splitPath = this.props.match.path.replace("/app/rollcalls/", "").split("/")[0];
        return (
            <div className="btn-group" role="group" aria-label="Rollcalls Tabs">
                <Link
                    to="/app/rollcalls/player"
                    className={`btn btn-secondary ${splitPath === "player" ? "active" : ""}`}>
                    <i className="fa fa-user-graduate mr-2"></i>
                    Öğrenci Yoklaması
                </Link>
                <Link
                    to="/app/rollcalls/employee"
                    className={`btn btn-secondary ${splitPath === "employee" ? "active" : ""}`}>
                    <i className="fa fa-user-tie mr-2"></i>
                    Personel Yoklaması
                </Link>
            </div>
        );
    }
}

export default withRouter(Tabs);
