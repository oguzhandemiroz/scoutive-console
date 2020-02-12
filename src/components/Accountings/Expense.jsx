import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListAccountingRecords } from "../../services/Accounting";
import { formatMoney, formatDate } from "../../services/Others";
const $ = require("jquery");

const noRow = loading => (
    <tr style={{ height: 80 }}>
        <td colSpan="5" className="text-center text-muted font-italic">
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

export class Expense extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: null
        };
    }

    componentDidMount() {
        this.listAccountingRecord();
    }

    listAccountingRecord = () => {
        const { uid } = this.state;
        ListAccountingRecords({
            uid: uid,
            filter: { type: 0, accounting_type_id__gt: 2 },
            count: 5
        }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({ list: response.data });
                    $('[data-toggle="tooltip"]').tooltip();
                    /** Initialize popovers */
                    $(function() {
                        $('[data-toggle="popover"]').popover({
                            html: true,
                            trigger: "hover"
                        });
                    });
                }
            }
        });
    };

    render() {
        const { list } = this.state;
        return (
            <div className="col-lg-6 col-sm-12">
                <div className="page-header">
                    <h1 className="page-title">
                        <i className="fe fe-trending-down mr-2 text-red"></i>Gider
                    </h1>
                    <div className="input-group w-auto ml-auto">
                        <div className="input-group-append">
                            <Link to="/app/accountings/expense/fast" className="btn btn-sm btn-danger">
                                <i className="fa fa-minus-square mr-1"></i> Gider Oluştur
                            </Link>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm dropdown-toggle dropdown-toggle-split"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                <span className="sr-only">Toggle Dropdown</span>
                            </button>
                            <div className="dropdown-menu">
                                <Link
                                    to="/app/accountings/expense/invoice"
                                    className="dropdown-item cursor-not-allowed disabled">
                                    <i className="dropdown-icon fa fa-receipt"></i> Fatura
                                    <span className="ml-2">
                                        (<i className="fe fe-lock mr-0" />)
                                    </span>
                                </Link>
                                <Link to="/app/players/payment/fee" className="dropdown-item">
                                    <i className="dropdown-icon fa fa-money-bill-wave"></i> Maaş Ödemesi
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Son 5 İşlem</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table card-table table-striped table-vcenter table-bordered">
                            <thead>
                                <tr>
                                    <th className="pl-3 text-center">#</th>
                                    <th>İşlem</th>
                                    <th>Tutar</th>
                                    <th>Ödeme Tarihi</th>
                                    <th>İşlem Tarihi</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {list
                                    ? list.map((el, key) => {
                                          return (
                                              <tr key={key.toString()}>
                                                  <td className="w-1 pl-3 text-muted text-center">#{el.record_no}</td>
                                                  <td>
                                                      {el.accounting_type}
                                                      {el.note ? (
                                                          <span
                                                              className="ml-1 form-help d-inline-flex justify-content-center align-items-center"
                                                              data-toggle="popover"
                                                              data-content={`<p><strong>İşlem Notu</strong></p>${el.note}`}>
                                                              <i className="fe fe-info"></i>
                                                          </span>
                                                      ) : null}
                                                  </td>
                                                  <td>{el.amount ? formatMoney(el.amount * -1) : "0,00 ₺"}</td>
                                                  <td className="w-1 text-nowrap">
                                                      {formatDate(el.payment_date, "LL")}
                                                  </td>
                                                  <td className="w-1 text-nowrap">
                                                      {formatDate(el.created_date, "LL")}
                                                  </td>
                                                  <td className="w-1 pr-3">
                                                      <Link
                                                          to={"/app/accountings/detail/" + el.accounting_id}
                                                          className="icon">
                                                          <i className="fe fe-eye"></i>
                                                      </Link>
                                                  </td>
                                              </tr>
                                          );
                                      })
                                    : noRow(true)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="6" className="text-right font-italic">
                                        <Link to="/app/accountings/expense/list">
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
