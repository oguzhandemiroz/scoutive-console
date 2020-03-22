import React, { Component } from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../../../services/Others";
import _ from "lodash";

export class Monthly extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            monthly: "0,00 ₺",
            sms: 0,
            total: 0
        };
    }

    componentDidMount() {
        const { fees } = this.props;
        this.getMontlyValue(fees);
        this.getSMSValue(fees);
    }

    componentWillReceiveProps(nextProps) {
        const { fees } = this.props;
        if (fees !== nextProps.fees) {
            this.getMontlyValue(nextProps.fees);
            this.getSMSValue(nextProps.fees);
        }
    }

    getMontlyValue = fees => {
        const getAmount = fees.filter(x => x.package.type === "MONTHLY")[0];
        if (getAmount) {
            this.setState(prevState => ({
                monthly: getAmount.package.fee === 0 ? "ÜCRETSİZ" : formatMoney(getAmount),
                total: prevState.total + getAmount.package.fee
            }));
        }
    };

    getSMSValue = fees => {
        const getAmount = fees.filter(x => x.package.type === "SMS");
        if (getAmount) {
            const smsAmount =
                _.sumBy(
                    _(fees)
                        .filter(x => x.package.type === "SMS")
                        .value(),
                    "fee"
                ) -
                _.sumBy(
                    _(fees)
                        .filter(x => x.package.type === "SMS")
                        .value(),
                    "amount"
                );
            this.setState(prevState => ({
                sms: smsAmount,
                total: prevState.total + smsAmount
            }));
        }
    };

    render() {
        const { monthly, sms, total, uid } = this.state;
        const { disablePayButton } = this.props;
        return (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        Ödenecek Tutar
                        {!disablePayButton && (
                            <Link to={`/account/settings/billing/${uid}`} className="ml-auto btn btn-sm btn-success">
                                Ödeme Yap
                            </Link>
                        )}
                    </div>
                    <div className="h1 text-dark">{formatMoney(total)}</div>
                </div>
                <table className="table card-table">
                    <tbody>
                        <tr>
                            <td width="1">
                                <i className="fa fa-calendar-alt text-primary"></i>
                            </td>
                            <td>Aylık Kullanım</td>
                            <td className="text-right">
                                <span className="h4">{monthly}</span>
                            </td>
                        </tr>
                        <tr>
                            <td width="1">
                                <i className="fa fa-sms text-yellow"></i>
                            </td>
                            <td>SMS Paketi</td>
                            <td className="text-right">
                                <span className="h4">{formatMoney(sms)}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Monthly;
