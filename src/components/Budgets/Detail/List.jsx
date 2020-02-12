import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListAccountingRecords } from "../../../services/Accounting";
import { formatMoney, formatDate } from "../../../services/Others";
import "moment/locale/tr";
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

export class List extends Component {
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
        const { bid } = this.props.match.params;
        ListAccountingRecords({
            uid: uid,
            filter: {
                budget_id: bid
            },
            count: 15
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
        const { bid } = this.props.match.params;
        const { list } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Son 15 İşlem</h3>
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
                                <th>Kasa/Banka</th>
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
                                              <td>{el.amount ? formatMoney(el.amount) : "0,00 ₺"}</td>
                                              <td className="w-1 text-nowrap">{formatDate(el.payment_date, "LL")}</td>
                                              <td className="w-1 text-nowrap">{formatDate(el.created_date, "LL")}</td>
                                              <td className="text-break">{el.budget.budget_name}</td>
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
                                <td colSpan="7" className="text-right font-italic">
                                    <Link to={"/app/budgets/detail/list/" + bid}>
                                        Tümünü görüntüle <i className="fe fe-arrow-right"></i>
                                    </Link>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

export default List;
