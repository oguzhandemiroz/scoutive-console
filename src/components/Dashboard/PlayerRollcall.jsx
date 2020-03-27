import React, { Component } from "react";
import { ListRollcallType, ActiveRollcall } from "../../services/Rollcalls";
import { CheckPermissions } from "../../services/Others";

export class PlayerRollcall extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            rollcall: null
        };
    }

    componentDidMount() {
        this.getPlayerRollcallDetail();
    }

    getPlayerRollcallDetail = () => {
        const { uid } = this.state;
        ActiveRollcall(
            {
                uid: uid
            },
            "players"
        ).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    if (response.data.length > 0) {
                        ListRollcallType({ uid: uid, rollcall_id: response.data[0].rollcall_id }, "players").then(
                            responseList => {
                                if (responseList) {
                                    const status = responseList.status;
                                    if (status.code === 1020) this.setState({ rollcall: responseList.data });
                                }
                            }
                        );
                    }
                }
            }
        });
    };

    generateRollcallTotalCount = (rollcall, status, text) => {
        let total = 0;
        if (rollcall) {
            rollcall.map(el => {
                if (el.daily === status) total++;
            });
        }

        return (
            <h4 className="m-0">
                {total} <small>{text}</small>
            </h4>
        );
    };

    render() {
        const { rollcall } = this.state;

        if (!CheckPermissions(["r_read"])) {
            return null;
        }

        return (
            <>
                <h4 className="text-muted font-weight-normal">Öğrenci Yoklama Durumu</h4>
                <div className="row row-cards">
                    <div className="col-sm-12 col-md-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-green-light d-flex justify-content-center align-items-center mr-3">
                                    <i className="fe fe-check" style={{ fontSize: "1.25rem" }}></i>
                                </span>
                                <div className="d-flex flex-column">
                                    <div className="small text-muted">Toplam</div>
                                    <div>{this.generateRollcallTotalCount(rollcall, 1, "Geldi")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-red-light d-flex justify-content-center align-items-center mr-3">
                                    <i className="fe fe-x" style={{ fontSize: "1.25rem" }}></i>
                                </span>
                                <div className="d-flex flex-column">
                                    <div className="small text-muted">Toplam</div>
                                    <div>{this.generateRollcallTotalCount(rollcall, 0, "Gelmedi")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-yellow-light d-flex justify-content-center align-items-center mr-3">
                                    <i className="fe fe-alert-circle" style={{ fontSize: "1.25rem" }}></i>
                                </span>
                                <div className="d-flex flex-column">
                                    <div className="small text-muted">Toplam</div>
                                    <div>{this.generateRollcallTotalCount(rollcall, 2, "İzinli")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-gray d-flex justify-content-center align-items-center mr-3">
                                    <i className="fe fe-help-circle" style={{ fontSize: "1.25rem" }}></i>
                                </span>
                                <div className="d-flex flex-column">
                                    <div className="small text-muted">Toplam</div>
                                    <div>{this.generateRollcallTotalCount(rollcall, -1, "Tanımsız")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default PlayerRollcall;
