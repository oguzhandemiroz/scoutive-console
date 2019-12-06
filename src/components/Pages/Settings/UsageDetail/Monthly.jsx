import React, { Component } from "react";

export class Monthly extends Component {
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="d-flex">
                        Ödenecek Tutar
                        <button className="ml-auto btn btn-sm btn-success cursor-not-allowed disabled" disabled>
                            <i className="fe fe-lock mr-2" />
                            Ödeme Yap
                        </button>
                    </div>
                    <div className="h1 text-dark">150,00 ₺</div>
                </div>
                <table className="table card-table">
                    <tbody>
                        <tr>
                            <td width="1">
                                <i className="fa fa-calendar-alt text-primary"></i>
                            </td>
                            <td>Aylık Kullanım</td>
                            <td className="text-right">
                                <span className="h4">100,00 ₺</span>
                            </td>
                        </tr>
                        <tr>
                            <td width="1">
                                <i className="fa fa-sms text-yellow"></i>
                            </td>
                            <td>SMS Paketi</td>
                            <td className="text-right">
                                <span className="h4">50,00 ₺</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Monthly;
