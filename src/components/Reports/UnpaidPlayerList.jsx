import React, { Component } from "react";
import { Link } from "react-router-dom";
import { UnpaidPlayers } from "../../services/Report";
import { fullnameGenerator, avatarPlaceholder } from "../../services/Others";
import moment from "moment";

const $ = require("jquery");

const noRow = loading =>
    loading ? (
        <div className={`dimmer active p-3 mb-5`}>
            <div className="loader" />
            <div className="dimmer-content" />
        </div>
    ) : (
        <div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
    );

export class UnpaidPlayerList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: null,
            count: 0
        };
    }

    componentDidMount() {
        this.getUnpaidPlayers();
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    getUnpaidPlayers = () => {
        UnpaidPlayers().then(response => {
            const data = response.data;
            const status = response.status;
            if (status.code === 1020) {
                this.setState({
                    list: data,
                    count: data.length
                });
            }
        });
    };

    render() {
        const { list, count } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Ödeme Yapmayanlar</h1>
                </div>
                <div className="row row-cards">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-status bg-danger" />
                            <div className="card-header">
                                <div className="card-title">Ödeme Yapmayanlar</div>
                            </div>
                            <div className="card-body pb-1">
                                {list
                                    ? list.length > 0
                                        ? list.map((el, key) => {
                                            const fullname = fullnameGenerator(el.name, el.surname)
                                              const count = moment(new Date(), "YYYY-MM-DD").diff(
                                                  moment(el.required_payment_date, "YYYY-MM-DD"),
                                                  "days"
                                              );
                                              let badgeColor = "badge-secondary";
                                              switch (true) {
                                                  case count <= 7:
                                                      badgeColor = "bg-red-light";
                                                      break;
                                                  case count >= 7 && count <= 30:
                                                      badgeColor = "bg-red";
                                                      break;
                                                  case count >= 30:
                                                      badgeColor = "bg-red-dark";
                                                      break;
                                                  default:
                                                      badgeColor = "badge-secondary";
                                                      break;
                                              }
                                              return (
                                                  <div className="row mb-4 pb-4">
                                                      <div className="col-auto px-2">
                                                          <span
                                                              className="avatar avatar-md"
                                                              style={{ backgroundImage: `url(${el.image})` }}>
                                                              {el.image ? "" : avatarPlaceholder(el.name, el.surname)}
                                                          </span>
                                                      </div>
                                                      <div className="col px-1">
                                                          <div className="text-body font-weight-600">
                                                              {fullnameGenerator(el.name, el.surname)}
                                                          </div>
                                                          <span
                                                              className="small text-muted"
                                                              data-toggle="popover"
                                                              data-placement="top"
                                                              data-content={
                                                                  "Ödemesi Gereken Tarih: " +
                                                                  moment(el.required_payment_date).format("LL")
                                                              }>
                                                              <span
                                                                  class={`badge mr-1 ${badgeColor} px-2 py-1`}
                                                                  style={{ fontSize: 12 }}>
                                                                  Ödemesi
                                                                  <strong
                                                                      className="font-weight-bolder"
                                                                      style={{ fontSize: 13 }}>
                                                                      &nbsp;{count}&nbsp;gün&nbsp;
                                                                  </strong>
                                                                  gecikmiş!
                                                              </span>
                                                          </span>
                                                          <div className="small text-muted mt-1">
                                                              Tutar: <strong>{el.fee.format() + " ₺"}</strong>, Ödenen:{" "}
                                                              <strong>{el.amount.format() + " ₺"}</strong>
                                                          </div>

                                                          <div className="small text-muted">
                                                              Kalan tutar:{" "}
                                                              <strong className="text-body">
                                                                  {(el.fee - el.amount).format() + " ₺"}
                                                              </strong>
                                                          </div>
                                                      </div>
                                                      <div className="col-auto">
                                                          <div className="dropdown">
                                                              <button
                                                                  type="button"
                                                                  id="player-action"
                                                                  className="btn btn-sm btn-gray-dark btn-block dropdown-toggle"
                                                                  data-toggle="dropdown"
                                                                  aria-haspopup="true"
                                                                  aria-expanded="false">
                                                                  İşlem
                                                              </button>
                                                              <div className="dropdown-menu dropdown-menu-right">
                                                                  <a
                                                                      className="dropdown-item disabled text-azure"
                                                                      href="javascript:void(0)">
                                                                      <i className="dropdown-icon fa fa-user text-azure" />
                                                                      {fullname}
                                                                  </a>
                                                                  <div role="separator" className="dropdown-divider" />
                                                                  <Link
                                                                      to={"/app/players/payment/" + el.uid}
                                                                      className="dropdown-item">
                                                                      <i className="dropdown-icon fa fa-hand-holding-usd" />{" "}
                                                                      Ödeme Al
                                                                  </Link>
                                                                  <Link
                                                                      to={"/app/players/detail/" + el.uid}
                                                                      className="dropdown-item cursor-not-allowed disabled">
                                                                      <i className="dropdown-icon fa fa-exclamation-triangle"></i>{" "}
                                                                      Ödeme İkazı
                                                                      <span className="ml-1">
                                                                          (<i className="fe fe-lock mr-0" />)
                                                                      </span>
                                                                  </Link>
                                                                  <div role="separator" className="dropdown-divider" />
                                                                  <Link
                                                                      to={"/app/players/fee-detail/" + el.uid}
                                                                      className="dropdown-item">
                                                                      <i className="dropdown-icon fa fa-receipt" /> Tüm
                                                                      Aidat Bilgisi
                                                                  </Link>
                                                                  <Link
                                                                      to={"/app/players/detail/" + el.uid}
                                                                      className="dropdown-item">
                                                                      <i className="dropdown-icon fa fa-info-circle" />{" "}
                                                                      Tüm Bilgileri
                                                                  </Link>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              );
                                          })
                                        : noRow()
                                    : noRow(true)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UnpaidPlayerList;
