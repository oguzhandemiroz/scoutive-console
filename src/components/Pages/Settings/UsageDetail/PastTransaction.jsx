import React, { Component } from "react";

export class PastTransaction extends Component {
    render() {
        return (
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">
                        <i className="fa fa-shopping-cart mr-2"></i>Geçmiş 10 İşlem
                    </h4>
                </div>
                <table class="table card-table table-vcenter text-center">
                    <tbody>
                        <tr>
                            <td>
                                <i className="fa fa-sms"></i>
                            </td>
                            <td>SMS Paketi</td>
                            <td>100 Adet</td>
                            <td>01 Ocak 2019</td>
                            <td>
                                <span className="h4">50,00 ₺</span>
                            </td>
                            <td>
                                <a href="#" className="icon mr-2">
                                    <i className="fa fa-undo text-info"></i>
                                </a>
                                <a href="#" className="icon">
                                    <i className="fa fa-search"></i>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <i className="fa fa-calendar-alt"></i>
                            </td>
                            <td>Aylık Kullanım</td>
                            <td>1 Ay</td>
                            <td>01 Ocak 2019</td>
                            <td>
                                <span className="h4">150,00 ₺</span>
                            </td>
                            <td>
                                <a href="#" className="icon">
                                    <i className="fa fa-search"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default PastTransaction;
