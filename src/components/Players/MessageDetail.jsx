import React, { Component } from "react";
import Select, { components } from "react-select";
import { DetailPlayer } from "../../services/Player";
import { fullnameGenerator, nullCheck, formatPhone } from "../../services/Others";
import { selectCustomStyles } from "../../assets/js/core";
import Tabs from "../../components/Players/Tabs";
import PersonCard from "./PersonCard";

export class MessageDetail extends Component {
    render() {
        const { to, recipient, select, loadingButton } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Detay &mdash; Mesaj Geçmişi</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
                </div>

                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />
                </div>

                <div className="col-lg-8 col-sm-12 col-md-12"></div>
            </div>
        );
    }
}

export default MessageDetail;
