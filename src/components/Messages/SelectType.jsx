import React, { Component } from "react";
import { Link } from "react-router-dom";

export class SelectType extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Mesaj Oluştur &mdash; Mesaj Tipi Seç</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages"}>
                        İletişim Merkezine Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Mesaj Tipi Seç</h3>
                            </div>
                            <div className="card-body pb-0">
                                <div className="row row-deck justify-content-center">
                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                        <Link className="card card-link" to="#">
                                            <div className="card-body text-center">
                                                <div className="icon-placeholder icon-placeholder-lg bg-dark">
                                                    <i className="fa fa-user text-white-75"></i>
                                                </div>
                                                <div className="mt-4 h4 text-body">Tekil Mesaj Oluştur</div>
                                                <p className="text-muted">
                                                    Tek bir kişiye, şablon mesajı veya özel mesaj gönder!
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                        <Link className="card card-link" to="#">
                                            <div className="card-body text-center">
                                                <div className="icon-placeholder icon-placeholder-lg bg-dark">
                                                    <i className="fa fa-users text-white-75"></i>
                                                </div>
                                                <div className="mt-4 h4 text-body">Toplu Mesaj Oluştur</div>
                                                <p className="text-muted">Birden fazla kişiye şablon mesajı gönder!</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                        <Link className="card card-link" to="#">
                                            <div className="card-body text-center">
                                                <div className="icon-placeholder icon-placeholder-lg bg-dark">
                                                    <i className="fa fa-history text-white-75"></i>
                                                </div>
                                                <div className="mt-4 h4 text-body">Otomatik Mesaj Oluştur</div>
                                                <p className="text-muted">
                                                    Segment oluştur ve segmente uyan kişilere otomatik mesaj gönder!
                                                </p>
                                            </div>
                                        </Link>
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

export default SelectType;
