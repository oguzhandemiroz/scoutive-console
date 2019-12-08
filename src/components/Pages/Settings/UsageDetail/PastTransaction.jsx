import React, { Component } from "react";
import { formatDate, formatMoney } from "../../../../services/Others";

const noRow = () => (
    <tr>
        <td colSpan="4" className="text-center text-muted font-italic">
            Kayıt bulunamadı...
        </td>
    </tr>
);

const item = {
    SMS: {
        countType: "Adet"
    },
    MONTHLY: {
        countType: "Ay"
    }
};

export class PastTransaction extends Component {
    render() {
        const { fees } = this.props;
        return (
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">
                        <i className="fa fa-shopping-cart mr-2"></i>Geçmiş İşlemler
                    </h4>
                </div>
                <table className="table card-table table-vcenter text-center">
                    <tbody>
                        {fees.length > 0
                            ? fees.map((el, key) => {
                                  return (
                                      <tr key={key.toString()}>
                                          <td>{el.package.title}</td>
                                          <td>{el.package.count + " " + item[el.package.type].countType}</td>
                                          <td>{formatDate(el.created_date, "LL")}</td>
                                          <td>
                                              <span className="h4">
                                                  {el.package.fee === 0 ? "ÜCRETSİZ" : formatMoney(el.package.fee)}
                                              </span>
                                          </td>
                                          <td>
                                              {el.fee === el.amount ? (
                                                  <div className="badge badge-success">ÖDENDİ</div>
                                              ) : (
                                                  <div className="badge badge-danger">ÖDENMEDİ</div>
                                              )}
                                          </td>
                                          <td>
                                              {el.package.type !== "MONTHLY" ? (
                                                  <a href="#" className="icon mr-2">
                                                      <i className="fa fa-undo"></i>
                                                  </a>
                                              ) : null}
                                              <a href="#" className="icon">
                                                  <i className="fa fa-search"></i>
                                              </a>
                                          </td>
                                      </tr>
                                  );
                              })
                            : noRow()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default PastTransaction;
