import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { UnpaidPlayers } from "../../services/Report";
import { fullnameGenerator, avatarPlaceholder, CheckPermissions, formatMoney } from "../../services/Others";
import moment from "moment";
import ActionButton from "../../components/Players/ActionButton";

const $ = require("jquery");

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Öğrenci" },
    1: { bg: "bg-success", title: "Aktif Öğrenci" },
    2: { bg: "bg-azure", title: "Donuk Öğrenci" }
};

const noRow = loading =>
    loading ? (
        <div className={`dimmer active p-3 mb-5`}>
            <div className="loader" />
            <div className="dimmer-content" />
        </div>
    ) : (
        <div className="text-center text-muted font-italic pb-4">Kayıt bulunamadı...</div>
    );

export class UnpaidPlayer extends Component {
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
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: "hover"
        });
    }

    getUnpaidPlayers = () => {
        UnpaidPlayers().then(response => {
            if (response) {
                const data = response.data;
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({
                        list: data.sort((a, b) => {
                            return a.required_payment_date < b.required_payment_date ? -1 : 1;
                        }),
                        count: data.length
                    });
                }
            }
        });
    };

    render() {
        const { list, count } = this.state;
        if (!CheckPermissions(["a_read", "p_read"])) {
            return null;
        }

        return (
            <div className="col-sm-12 col-lg">
                <div className="card">
                    <div className="card-body py-4">
                        <div className="card-value float-right text-muted">
                            <i className={`fa fa-hand-holding-usd ${count > 0 ? "text-danger" : ""}`} />
                        </div>
                        <h4 className="mb-1">Aidat</h4>
                        <div className="text-muted">Ödeme Yapmayanlar</div>
                    </div>
                    <div className="card-body pb-1">
                        {list
                            ? list.length > 0
                                ? list.map((el, key) => {
                                      if (key > 4) return null;
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
                                          <div className="row mb-4" key={key.toString()}>
                                              <div className="col-auto px-2">
                                                  <span
                                                      className="avatar avatar-xs"
                                                      style={{ backgroundImage: `url(${el.image})` }}>
                                                      {el.image ? "" : avatarPlaceholder(el.name, el.surname)}
                                                      <span
                                                          data-toggle="tooltip"
                                                          title={
                                                              statusType[el.status !== undefined ? el.status : 1].title
                                                          }
                                                          className={`avatar-xs avatar-status ${
                                                              statusType[el.status !== undefined ? el.status : 1].bg
                                                          }`}
                                                      />
                                                  </span>
                                              </div>
                                              <div className="col px-1">
                                                  <Link
                                                      to={"/app/players/detail/" + el.uid}
                                                      className="text-body font-weight-600 d-block">
                                                      {fullnameGenerator(el.name, el.surname)}
                                                  </Link>
                                                  <span
                                                      data-toggle="popover"
                                                      data-placement="top"
                                                      data-content={
                                                          "<b>Ödemesi Gereken Tarih: </b>" +
                                                          moment(el.required_payment_date).format("LL")
                                                      }
                                                      className={`badge mr-1 ${badgeColor} px-2 py-1`}
                                                      style={{ fontSize: 12 }}>
                                                      Ödemesi
                                                      <strong className="font-weight-bolder" style={{ fontSize: 13 }}>
                                                          &nbsp;{count}&nbsp;gün&nbsp;
                                                      </strong>
                                                      gecikmiş!
                                                  </span>
                                                  <div className="small text-muted mt-1">
                                                      Taksit Sayısı:
                                                      <strong className="text-body"> {el.count} Taksit</strong>
                                                  </div>
                                                  <div className="small text-muted">
                                                      Toplam Ödeme Tutarı:
                                                      <strong className="text-body"> {formatMoney(el.fee)}</strong>,
                                                      <br />
                                                      Toplam Ödenen Tutar:
                                                      <strong className="text-body"> {formatMoney(el.amount)}</strong>
                                                  </div>
                                                  <div className="small text-muted">
                                                      Kalan tutar:
                                                      <strong className="text-body">
                                                          {" "}
                                                          {formatMoney(el.fee - el.amount)}
                                                      </strong>
                                                  </div>
                                              </div>
                                              <div className="col-auto">
                                                  <ActionButton
                                                      hide={[
                                                          "edit",
                                                          "start",
                                                          "refresh",
                                                          "active",
                                                          "vacation",
                                                          "point",
                                                          "group",
                                                          "rollcall",
                                                          "certificate"
                                                      ]}
                                                      data={{
                                                          status: el.status,
                                                          to: el.uid,
                                                          name: fullnameGenerator(el.name, el.surname),
                                                          is_trial: 0
                                                      }}
                                                      history={this.props.history}
                                                      dropdown={true}
                                                      renderButton={() => (
                                                          <span
                                                              className="icon cursor-pointer"
                                                              data-toggle="dropdown"
                                                              aria-haspopup="true"
                                                              aria-expanded="false">
                                                              <i className="fe fe-more-vertical"></i>
                                                          </span>
                                                      )}
                                                  />
                                              </div>
                                          </div>
                                      );
                                  })
                                : noRow()
                            : noRow(true)}
                    </div>
                    {list ? (
                        list.length >= 5 ? (
                            <div className="card-footer text-right font-italic">
                                <Link to="/app/reports/unpaid/players">
                                    Tümünü görüntüle <i className="fe fe-arrow-right"></i>
                                </Link>
                            </div>
                        ) : null
                    ) : null}
                </div>
            </div>
        );
    }
}

export default withRouter(UnpaidPlayer);
