import React, { Component } from "react";

export class SmsUsage extends Component {
    render() {
        return (
            <>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-warning mr-3">
                                    <i className="fa fa-sms"></i>
                                </span>
                                <div>
                                    <h4 className="m-0">
                                        <a href="#">
                                            132 <small>SMS</small>
                                        </a>
                                    </h4>
                                    <small className="text-muted">Tüm zamanlar</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-success mr-3">
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <div>
                                    <h4 className="m-0">
                                        <a href="#">
                                            89 <small>Eposta</small>
                                        </a>
                                    </h4>
                                    <small className="text-muted">Tüm zamanlar</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <h4 className="mb-0">
                                <i className="fa fa-sms mr-2" />
                                SMS Kullanımı
                            </h4>
                            <button className="ml-auto btn btn-sm btn-warning cursor-not-allowed disabled" disabled>
                                <i className="fe fe-lock mr-2" />
                                Bakiye Ekle
                            </button>
                        </div>
                        <div className="mt-5">
                            <div className="d-flex justify-content-between mb-1">
                                <strong>213</strong>
                                <div>Hediye SMS</div>
                                <small className="text-muted">500</small>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{ width: "42%" }}
                                    aria-valuenow="42"
                                    aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <div className="d-flex justify-content-between mb-1">
                                <strong>82</strong>
                                <div>SMS Paketi</div>
                                <small className="text-muted">100</small>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-yellow"
                                    role="progressbar"
                                    style={{ width: "82%" }}
                                    aria-valuenow="82"
                                    aria-valuemin="0"
                                    aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SmsUsage;
