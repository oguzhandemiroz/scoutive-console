import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
const $ = require("jquery");

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Kampanya Oluştur</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages"}>
                        İletişim Merkezine Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Kampanya Bilgileri</h3>
                            </div>
                            <div className="card-body">
                                <div className="row mb-5">
                                    <div className="col text-center">
                                        <div className={`icon-placeholder bg-${"gray"}-lightest`}>
                                            <i className={"fa fa-file" + " text-" + "gray"}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gönderici Adı</label>
                                    <div className="form-control-plaintext">
                                        0 850 800 1234
                                        <i
                                            className="ml-1 fa fa-info-circle text-info"
                                            data-toggle="tooltip"
                                            title="Değişiklik için Yönetici Onaylı Gerekir"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mesaj içi Gönderici Adı</label>
                                    <div className="form-control-plaintext">
                                        Scoutive Demo
                                        <i
                                            className="ml-1 fa fa-info-circle text-info"
                                            data-toggle="tooltip"
                                            title="Değişiklik için Yönetici Onaylı Gerekir"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Gönderilecekler ve Şablon</h3>
                            </div>
                            <div className="card-body"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Add;
