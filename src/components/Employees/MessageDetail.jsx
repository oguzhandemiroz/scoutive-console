import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DetailEmployee } from "../../services/Employee.jsx";
import { nullCheck, formatPhone, formatDate } from "../../services/Others";
import { GetSettings } from "../../services/School";
import MessagesNotActivate from "../NotActivate/Messages";
import { ListPersonMessages } from "../../services/Messages";
import Tabs from "../Employees/Tabs";
import PersonCard from "./PersonCard.jsx";
import _ from "lodash";
const $ = require("jquery");

const messageType = {
    1: { text: "Eposta", icon: "fa fa-envelope-open-text" },
    2: { text: "SMS", icon: "fa fa-sms" }
};

export class MessageDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            loading: "active",
            messages: null,
            pageCount: null,
            activePage: 1
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: "hover"
        });
    }

    componentDidMount() {
        this.getEmployeeDetail();
        GetSettings().then(resSettings => {
            this.setState({
                sms_active: parseInt(resSettings.settings.sms_active)
            });

            if (resSettings.settings.sms_active) {
                this.listPersonMessages();
            }
        });
    }

    getEmployeeDetail = () => {
        const { uid, to } = this.state;
        DetailEmployee({
            uid: uid,
            to: to
        }).then(response => {
            if (response !== null) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    this.setState({
                        ...data,
                        loading: ""
                    });
                }
            }
        });
    };

    listPersonMessages = () => {
        const { uid, to } = this.state;
        ListPersonMessages({
            uid: uid,
            to: to,
            person_type: 2
        }).then(response => {
            if (response) {
                if (response.status.code === 1020) {
                    this.setState({ messages: response.data, pageCount: Math.round(response.data.length / 2) });
                }
            }
        });
    };

    renderPagination = () => {
        const { pageCount, activePage } = this.state;
        if (pageCount === 0) return null;
        if (pageCount !== null) {
            return (
                <nav aria-label="Page navigation example">
                    <ul className="pagination mb-0 justify-content-center pagination-sm">
                        <li className={`page-item ${activePage === 1 ? "disabled" : ""}`}>
                            <button onClick={this.prevPage} className="page-link" aria-label="Geri">
                                <span aria-hidden="true" title="Geri">
                                    &laquo;
                                </span>
                                <span className="sr-only">Geri</span>
                            </button>
                        </li>
                        {_.range(1, pageCount + 1).map(el => (
                            <li key={el.toString()} className={`page-item ${el === activePage ? "active" : ""}`}>
                                <button onClick={() => this.handlePagination(el)} className="page-link">
                                    {el}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${activePage === pageCount ? "disabled" : ""}`}>
                            <button onClick={this.nextPage} className="page-link" aria-label="İleri">
                                <span aria-hidden="true" title="İleri">
                                    &raquo;
                                </span>
                                <span className="sr-only">İleri</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            );
        } else {
            return (
                <div className="spinner-border spinner-border-sm text-blue" role="status">
                    <span className="sr-only">yükleniyor&hellip;</span>
                </div>
            );
        }
    };

    nextPage = () => {
        const { activePage } = this.state;
        this.setState({ activePage: activePage + 1 });
    };

    handlePagination = page => {
        this.setState({ activePage: page });
    };

    prevPage = () => {
        const { activePage } = this.state;
        this.setState({ activePage: activePage - 1 });
    };

    getPaginatedItems = (items, page, pageSize) => {
        var pg = page || 1,
            pgSize = pageSize || 100,
            offset = (pg - 1) * pgSize,
            pagedItems = _.drop(items, offset).slice(0, pgSize);
        return {
            page: pg,
            pageSize: pgSize,
            total: items.length,
            total_pages: Math.ceil(items.length / pgSize),
            data: pagedItems
        };
    };

    render() {
        const { to, sms_active, messages, activePage } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Personel Detay &mdash; Mesaj Geçmişi</h1>
                    <div className="col" />
                    <div className="col-auto px-0">
                        <Tabs match={match} to={to} />
                    </div>
                </div>
                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />
                    {sms_active ? (
                        <div className="col-lg-8 col-sm-12 col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Mesaj Geçmişi</h3>
                                    <div className="ml-auto">{this.renderPagination()}</div>
                                </div>
                                <div className="card-body">
                                    {messages ? (
                                        this.getPaginatedItems(messages, activePage, 2).data.length > 0 ? (
                                            this.getPaginatedItems(messages, activePage, 2).data.map((el, key) => {
                                                const {
                                                    campaign,
                                                    template,
                                                    to,
                                                    message_type,
                                                    content,
                                                    send_date,
                                                    operator,
                                                    status,
                                                    sender_name,
                                                    sender
                                                } = el;
                                                const badgeColor =
                                                    status.code === "0"
                                                        ? "warning"
                                                        : status.code === "1"
                                                        ? "success"
                                                        : "danger";
                                                const messageText =
                                                    status.code === "0"
                                                        ? "kuyrukta"
                                                        : status.code === "1"
                                                        ? "iletildi"
                                                        : "iletilemedi";

                                                return (
                                                    <div className="card-tabs" key={key.toString()}>
                                                        <ul className="nav nav-tabs">
                                                            <li className="nav-item">
                                                                <a
                                                                    href={`#tab-top-${key}-message`}
                                                                    className="nav-link active"
                                                                    data-toggle="tab">
                                                                    {template ? (
                                                                        <div
                                                                            title={template.template_name}
                                                                            data-toggle="tooltip"
                                                                            className={`icon-placeholder icon-placeholder-xxs bg-${template.color}-lightest mr-2`}>
                                                                            <i
                                                                                className={
                                                                                    template.icon +
                                                                                    " icon-placeholder-i text-" +
                                                                                    template.color
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ) : null}
                                                                    {campaign ? campaign.title : "Özel Mesaj"}
                                                                </a>
                                                            </li>
                                                            <li className="nav-item">
                                                                <a
                                                                    href={`#tab-top-${key}-sender`}
                                                                    className="nav-link"
                                                                    data-toggle="tab">
                                                                    Gönderici Detay
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content">
                                                            <div
                                                                id={`tab-top-${key}-message`}
                                                                className="card tab-pane active show">
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    Mesaj Tipi
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    <i
                                                                                        className={
                                                                                            "mr-2 " +
                                                                                            messageType[message_type]
                                                                                                .icon
                                                                                        }
                                                                                    />
                                                                                    {messageType[message_type].text}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    Alıcı Numarası
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    {formatPhone(to)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    İletilen İçerik
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    {content}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    Operatör
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    {operator}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    İletilen Tarih
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    {formatDate(send_date, "LL")}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group">
                                                                                <label className="form-label">
                                                                                    Durum
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    <span
                                                                                        className={`badge badge-${badgeColor}`}
                                                                                        data-toggle="popover"
                                                                                        data-content={`
                                                                                    <p><strong>Durum Açıklaması:</strong></p>
                                                                                    <span class='text-${badgeColor}'>${status.description}</span>
                                                                                `}>
                                                                                        {messageText}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {campaign ? (
                                                                        <div className="row">
                                                                            <div className="col-lg-12">
                                                                                <Link
                                                                                    className="font-italic"
                                                                                    to={
                                                                                        "/app/messages/detail/" +
                                                                                        campaign.campaign_id
                                                                                    }>
                                                                                    Gönderilen Mesajı Görüntüle...
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div id={`tab-top-${key}-sender`} className="card tab-pane">
                                                                <div className="card-body">
                                                                    <div className="row">
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group mb-0">
                                                                                <label className="form-label">
                                                                                    Mesaj Başlığı (Gönderici Adı)
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    {"+90 " + formatPhone(sender)}
                                                                                    <i
                                                                                        className="ml-1 fa fa-info-circle text-info"
                                                                                        data-toggle="tooltip"
                                                                                        title={formatPhone(sender)}></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-6">
                                                                            <div className="form-group mb-0">
                                                                                <label className="form-label">
                                                                                    Mesaj İçi Gönderici Adı
                                                                                </label>
                                                                                <div className="form-control-plaintext">
                                                                                    {nullCheck(sender_name)}
                                                                                    <i
                                                                                        className="ml-1 fa fa-info-circle text-info"
                                                                                        data-toggle="tooltip"
                                                                                        title="Değişiklik İçin Yönetici Onayı Gerekli"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-muted text-center font-italic">
                                                Bu öğrenciye her hangi bir mesaj gönderimi yapılmamıştır...
                                            </div>
                                        )
                                    ) : (
                                        <div className="loader mx-auto my-2"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-lg-8 col-sm-12 col-md-12">
                            <MessagesNotActivate
                                content={() => (
                                    <p className="text-muted text-center">
                                        Mesaj servisiniz aktif olmadığı için, mesaj geçmişlerini görüntüleyemiyorsunuz.
                                        <br />
                                        Yetkililer ile iletişime geç hemen aktifleştir!
                                    </p>
                                )}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default MessageDetail;
