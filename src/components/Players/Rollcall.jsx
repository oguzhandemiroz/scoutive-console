import React, { Component } from "react";
import { DetailPlayer } from "../../services/Player";
import { formatDate } from "../../services/Others";
import Tabs from "../../components/Players/Tabs";
import PersonCard from "./PersonCard";
const $ = require("jquery");

const noRow = loading => (
    <tr style={{ height: 80 }}>
        <td colSpan="6" className="text-center text-muted font-italic">
            {loading ? (
                <div className={`dimmer active`}>
                    <div className="loader" />
                    <div className="dimmer-content" />
                </div>
            ) : (
                "Kayıt bulunamadı..."
            )}
        </td>
    </tr>
);

export class Rollcall extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            attributes: {},
            data: {},
            groups: [],
            loading: "active"
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        this.detailPlayer();
    }

    detailPlayer = () => {
        const { uid, to } = this.state;
        DetailPlayer({ uid: uid, to: to, attribute_values: [] }).then(response => {
            if (response !== null) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    delete data.uid;
                    this.setState({ ...data, loading: "" });
                }
            }
        });
    };

    renderRollcallStatus = status => {
        const rollcallStatus = {
            0: { color: "bg-red-light", text: "Gelmedi", icon: "fe fe-x" },
            1: { color: "bg-green-light", text: "Geldi", icon: "fe fe-check" },
            2: { color: "bg-yellow-light", text: "İzinli", icon: "fe fe-alert-circle" }
        };

        return (
            <span
                className={`badge ${rollcallStatus[status].color} py-1 px-2`}
                style={{ fontSize: "100%" }}
                data-toggle="tooltip"
                title={rollcallStatus[status].text}>
                <i className={rollcallStatus[status].icon}></i>
            </span>
        );
    };

    generateRollcallTotalCount = (rollcalls, status, text) => {
        let total = 0;
        if (rollcalls) {
            Object.keys(rollcalls).map(el => {
                if (rollcalls[el].status === status) total++;
            });
        }
        return (
            <h4 className="m-0">
                {total} <small>{text}</small>
            </h4>
        );
    };

    generateRollcallDate = rollcalls => {
        if (rollcalls) {
            const dateArray = Object.keys(rollcalls);
            return (
                <small class="text-muted">
                    {formatDate(dateArray[0], "DD MMM")} &mdash; {formatDate(dateArray.slice(-1)[0], "DD MMM YYYY")}
                </small>
            );
        }
    };

    render() {
        const { to, rollcalls } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Detay &mdash; Yoklama Geçmişi</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
                </div>

                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Yoklama Geçmişi</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div class="col-sm-12 col-md-4 col-lg-4">
                                        <div class="card p-3 mb-0">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-green-light d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-check"></i>
                                                </span>
                                                <div>
                                                    {this.generateRollcallTotalCount(rollcalls, 1, "Geldi")}
                                                    {this.generateRollcallDate(rollcalls)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-4 col-lg-4">
                                        <div class="card p-3 mb-0">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-red-light d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-x"></i>
                                                </span>
                                                <div>
                                                    {this.generateRollcallTotalCount(rollcalls, 0, "Gelmedi")}
                                                    {this.generateRollcallDate(rollcalls)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-4 col-lg-4">
                                        <div class="card p-3 mb-0">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-yellow-light d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-alert-circle"></i>
                                                </span>
                                                <div>
                                                    {this.generateRollcallTotalCount(rollcalls, 2, "İzinli")}
                                                    {this.generateRollcallDate(rollcalls)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover table-outline table-vcenter text-nowrap card-table text-center">
                                        <thead>
                                            <tr>
                                                <th className="w-1">Yoklama Tarihi</th>
                                                <th className="w-1">Durum</th>
                                                <th className="w-1">Not</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rollcalls
                                                ? Object.keys(rollcalls).length > 0
                                                    ? Object.keys(rollcalls)
                                                          .reverse()
                                                          .map((el, key) => {
                                                              return (
                                                                  <tr key={key.toString()}>
                                                                      <td>{formatDate(el, "LL")}</td>
                                                                      <td>
                                                                          {this.renderRollcallStatus(
                                                                              rollcalls[el].status
                                                                          )}
                                                                      </td>
                                                                      <td>{rollcalls[el].note}</td>
                                                                  </tr>
                                                              );
                                                          })
                                                    : noRow()
                                                : noRow(true)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Rollcall;
