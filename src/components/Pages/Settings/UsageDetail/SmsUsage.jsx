import React, { Component } from "react";
import _ from "lodash";

export class SmsUsage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            extra_sms_balance: 0
        };
    }

    componentDidMount() {
        const { fees } = this.props;
        this.getExtraSMS(fees);
    }

    componentWillReceiveProps(nextProps) {
        const { fees } = this.props;
        if (fees !== nextProps.fees) {
            this.getExtraSMS(nextProps.fees);
        }
    }

    getExtraSMS = fees => {
        this.setState({
            extra_sms_balance: _.sumBy(
                _(fees)
                    .flatMap("package")
                    .groupBy("type")
                    .value().SMS,
                "count"
            )
        });
    };

    render() {
        const { balance, all_time } = this.props;
        const { extra_sms_balance } = this.state;
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
                                            {all_time["2"]} <small>SMS</small>
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
                                            {all_time["1"] || 0} <small>Eposta</small>
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
                                <strong>{balance.sms_free_balance}</strong>
                                <div>Hediye SMS</div>
                                <small className="text-muted">500</small>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{ width: (balance.sms_free_balance / 500) * 100 + "%" }}></div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <div className="d-flex justify-content-between mb-1">
                                <strong>{balance.sms_extra_balance}</strong>
                                <div>SMS Paketi</div>
                                <small className="text-muted">{extra_sms_balance}</small>
                            </div>
                            <div className="progress progress-sm">
                                <div
                                    className="progress-bar bg-yellow"
                                    role="progressbar"
                                    style={{
                                        width: (balance.sms_extra_balance / extra_sms_balance) * 100 + "%"
                                    }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SmsUsage;
