import React, { Component } from "react";
import { Link } from "react-router-dom";
import ActionButton from "./ActionButton";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import { fullnameGenerator, nullCheck, formatDate, formatPhone, formatMoney } from "../../services/Others";

const statusType = {
    0: "bg-danger",
    1: "bg-green",
    2: "bg-azure",
    3: "bg-indigo"
};

const paymentTypeText = {
    0: "AYLIK",
    1: "BURSLU",
    2: "TEK ÖDEME"
};

export class PersonCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            player: {}
        };
    }

    render() {
        const { player } = this.state;
        const { data, history } = this.props;
        return (
            <div className="col-lg-4 col-sm-12 col-md-12">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Genel Bilgiler</h3>
                    </div>
                    <div className="card-body">
                        <div className={`dimmer ${data.loading}`}>
                            <div className="loader" />
                            <div className="dimmer-content">
                                <div className="media mb-5">
                                    <span
                                        className="avatar avatar-xxl mr-4"
                                        style={{ backgroundImage: `url(${data.image})` }}>
                                        <span
                                            className={`avatar-sm avatar-status ${
                                                !data.is_trial ? statusType[data.status] : statusType[3]
                                            }`}
                                        />
                                    </span>
                                    <div className="media-body">
                                        <h4 className="m-0">{fullnameGenerator(data.name, data.surname)}</h4>
                                        <p className="text-muted mb-0">{data.position ? data.position.label : "—"}</p>
                                        <ul className="social-links list-inline mb-0 mt-2">
                                            <li className="list-inline-item">
                                                <a
                                                    className="employee_email"
                                                    href={data.email ? `mailto:${nullCheck(data.email)}` : ""}
                                                    data-original-title={nullCheck(data.email)}
                                                    data-toggle="tooltip">
                                                    <i className="fa fa-envelope" />
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a
                                                    className="employee_phone"
                                                    href={data.phone ? `tel:+90${nullCheck(data.phone)}` : ""}
                                                    data-original-title={formatPhone(data.phone)}
                                                    data-toggle="tooltip">
                                                    <i className="fa fa-phone" />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">T.C. Kimlik Numarası</label>
                                    <div className="form-control-plaintext">{nullCheck(data.security_id)}</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Aidat</label>
                                    <div className="form-control-plaintext">
                                        {data.payment_type === 1
                                            ? "BURSLU"
                                            : formatMoney(data.fee) +
                                              " — " +
                                              nullCheck(paymentTypeText[data.payment_type], "")}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Genel Puan</label>
                                    <div className="form-control-plaintext">{nullCheck(data.attributes.point)}</div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Branş</label>
                                    <div className="form-control-plaintext">
                                        {data.branch ? data.branch.label : "—"}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Grup</label>
                                    <div className="form-control-plaintext">
                                        {data.groups.length > 0 ? (
                                            data.groups.map(el => (
                                                <Link
                                                    key={el.value.toString()}
                                                    to={`/app/groups/detail/${el.value}`}
                                                    className="d-block">
                                                    {nullCheck(el.label)}
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="form-control-plaintext">&mdash;</div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Okula Başlama Tarihi</label>
                                    <div className="form-control-plaintext">{formatDate(data.start_date, "LL")}</div>
                                </div>

                                {data.end_date ? (
                                    <div className="form-group">
                                        <label className="form-label">Okuldan Ayrılma Tarihi</label>
                                        <div className="form-control-plaintext">{formatDate(data.end_date, "LL")}</div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <ActionButton
                            hide={["edit", "detail", "rollcall", "fee"]}
                            vacationButton={player =>
                                this.setState({
                                    player: player
                                })
                            }
                            groupChangeButton={player =>
                                this.setState({
                                    player: player
                                })
                            }
                            history={history}
                            dropdown={false}
                            data={{
                                to: data.to,
                                name: fullnameGenerator(data.name, data.surname),
                                is_trial: data.is_trial,
                                status: data.status,
                                group: data.group
                            }}
                            renderButton={() => (
                                <>
                                    <Link
                                        to={"/app/players/edit/" + data.to}
                                        className="btn btn-icon btn-dark btn-block">
                                        <i className="fe fe-edit mr-2" />
                                        Düzenle
                                    </Link>
                                    <button
                                        className="btn btn-icon btn-dark btn-block"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        İşlem Menüsü
                                    </button>
                                </>
                            )}
                        />

                        <Vacation data={player} history={history} />
                        <GroupChange data={player} history={history} />
                    </div>
                </div>
            </div>
        );
    }
}

export default PersonCard;
