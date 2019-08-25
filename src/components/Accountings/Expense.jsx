import React, {Component} from "react";
import {Link} from "react-router-dom";

export class Expense extends Component {
    render() {
        return (
            <div className="col-lg-6 col-sm-12">
                <div className="page-header">
                    <h1 className="page-title">
                        <i className="fe fe-trending-down mr-2 text-red"></i>Gider
                    </h1>
                    <button className="btn btn-sm ml-auto btn-danger">Gider Oluştur</button>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Son 5 İşlem</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table card-table table-striped table-vcenter">
                            <thead>
                                <tr>
                                    <th>İşlem</th>
                                    <th>Tutar</th>
                                    <th>Tarih</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Su Faturası</td>
                                    <td>127,00 ₺</td>
                                    <td className="text-nowrap" title="10/10/2019">
                                        8 gün önce
                                    </td>
                                    <td className="w-1">
                                        <a href="#" className="icon">
                                            <i className="fe fe-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Top</td>
                                    <td>52,00 ₺</td>
                                    <td className="text-nowrap" title="10/10/2019">
                                        17 gün önce
                                    </td>
                                    <td className="w-1">
                                        <a href="#" className="icon">
                                            <i className="fe fe-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4" className="text-right font-italic">
                                        <Link to="#">
                                            Tümünü görüntüle <i className="fe fe-arrow-right"></i>
                                        </Link>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Expense;
