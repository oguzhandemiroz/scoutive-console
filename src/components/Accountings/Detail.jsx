import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DetailAccountingRecord } from "../../services/Accounting";
import { fullnameGenerator, avatarPlaceholder, nullCheck, formatDate, formatMoney } from "../../services/Others";

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            sname: localStorage.getItem("sName"),
            simage: localStorage.getItem("sImage"),
            note: null,
            loading: "active"
        };
    }

    componentDidMount() {
        this.getRecordDetail();
    }

    getRecordDetail = () => {
        const { uid } = this.state;
        const { aid } = this.props.match.params;
        DetailAccountingRecord({
            uid: uid,
            accounting_id: aid
        }).then(response => {
            if (response) {
                const status = response.status;
                const data = response.data;
                if (status.code === 1020) {
                    this.setState({ ...data, loading: "" });
                }
            }
        });
    };

    render() {
        const { amount, sname, simage, payment_date, accounting_type, record_no, person, note, loading } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title d-print-none">Gelir/Gider &mdash; İşlem Detayı</h1>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <strong>#{record_no} </strong>İşlem Detayı
                                </h3>
                                <div className="ml-auto">
                                    <button
                                        className="btn btn-sm btn-secondary btn-icon"
                                        onClick={() => window.print()}>
                                        <i className="fe fe-printer mr-1"></i>Yazdır
                                    </button>
                                </div>
                            </div>
                            <div className="row align-items-center mb-4 d-none d-print-flex">
                                <div className="col-12 mb-2 text-center pr-1">
                                    <span
                                        className="avatar avatar-xl"
                                        style={{
                                            backgroundImage: `url("${simage}")`
                                        }}></span>
                                </div>
                                <div className="col-12 text-center">
                                    <h3 className="mb-0">{sname}</h3>
                                </div>
                            </div>
                            <div className={`dimmer ${loading}`}>
                                <div className="loader" />
                                <div className="dimmer-content print-border-dark-light">
                                    <div className="card-body p-5">
                                        <div className="row">
                                            {person ? (
                                                <div className="col-lg-6 col-sm-12 col-md-6 mb-2">
                                                    <div className="example print-border-dark-lighter">
                                                        <div className="h3 text-body">Kişi Kartı</div>
                                                        <div className="row">
                                                            <div className="col-auto pr-1">
                                                                <span
                                                                    className="avatar"
                                                                    style={{
                                                                        backgroundImage: `url("${person.image}")`
                                                                    }}>
                                                                    {person.image
                                                                        ? ""
                                                                        : avatarPlaceholder(
                                                                              person.name,
                                                                              person.surname
                                                                          )}
                                                                </span>
                                                            </div>
                                                            <div className="col">
                                                                <Link to={`/app/${person.type}s/detail/${person.uid}`}>
                                                                    {fullnameGenerator(person.name, person.surname)}
                                                                </Link>
                                                                <div className="small text-muted">
                                                                    {person.type === "player" ? "Öğrenci" : "Personel"}
                                                                </div>
                                                            </div>
                                                            <div className="col-auto">
                                                                <Link
                                                                    to={`/app/${person.type}s/detail/${person.uid}`}
                                                                    data-toggle="tooltip"
                                                                    title="Görüntüle"
                                                                    className="btn btn-sm btn-secondary btn-icon d-print-none">
                                                                    <i className="fe fe-info" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div
                                                className={`${
                                                    person
                                                        ? "col-lg-6 col-sm-12 col-md-6"
                                                        : "col-lg-12 col-sm-12 col-md-6"
                                                }`}>
                                                <div className="form-group">
                                                    <label className="form-label">İşlem Numarası</label>
                                                    <div className="form-control-plaintext">#{record_no}</div>
                                                </div>
                                                <div className="form-group mb-0">
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <label className="form-label">İşlem Kategorisi</label>
                                                            <div className="form-control-plaintext">
                                                                {accounting_type ? nullCheck(accounting_type.name) : ""}
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label">İşlem Tarihi</label>
                                                            <div className="form-control-plaintext">
                                                                {formatDate(payment_date, "LL")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-5 print-border-dark-lighter">
                                        <div className="row">
                                            <div className="col-lg-7 col-sm-12 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">İşlem Açıklaması</label>
                                                    <div className="form-control-plaintext">{nullCheck(note, "")}</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-5 col-sm-12 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">İşlem Tutarı</label>
                                                    <table className="table table-bordered text-nowrap table-vcenter">
                                                        <thead>
                                                            <tr>
                                                                <th>İşlem</th>
                                                                <th>Tutar</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    {accounting_type
                                                                        ? nullCheck(accounting_type.name) + " Ödemesi"
                                                                        : ""}
                                                                </td>
                                                                <td>{formatMoney(amount)}</td>
                                                            </tr>
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <th>Toplam</th>
                                                                <td>{formatMoney(amount)}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;
