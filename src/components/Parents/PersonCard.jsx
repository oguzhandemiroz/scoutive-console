import React, { Component } from "react";
import ActionButton from "./ActionButton";
import { fullnameGenerator, nullCheck, formatPhone, avatarPlaceholder } from "../../services/Others";
import { Link } from "react-router-dom";

export class PersonCard extends Component {
    render() {
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
                                    <span className="avatar avatar-xxl mr-4">
                                        {avatarPlaceholder(data.name, data.surname)}
                                    </span>
                                    <div className="media-body">
                                        <h4 className="m-0">{fullnameGenerator(data.name, data.surname)}</h4>
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
                                    <label className="form-label">Telefon</label>
                                    <div className="form-control-plaintext">
                                        <a href={`tel:+90${data.phone}`}>{formatPhone(data.phone)}</a>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <div className="form-control-plaintext">
                                        <a href={data.email ? `mailto:${nullCheck(data.email)}` : ""}>
                                            {nullCheck(data.email)}
                                        </a>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Meslek</label>
                                    <div className="form-control-plaintext">{nullCheck(data.job)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <ActionButton
                            hide={["edit", "detail"]}
                            history={history}
                            dropdown={false}
                            data={{
                                to: data.to,
                                name: fullnameGenerator(data.name, data.surname)
                            }}
                            renderButton={() => (
                                <>
                                    <Link
                                        to={"/app/persons/parents/edit/" + data.to}
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
                    </div>
                </div>
            </div>
        );
    }
}

export default PersonCard;
