import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { DetailCampaign } from "../../services/Messages";
import { nullCheck, formatDate } from "../../services/Others";
import { GetSettings } from "../../services/School";
import ListRecipient from "./ListRecipient";
import _ from "lodash";
import moment from "moment";

const statusType = {
    "-1": { bg: "badge-info", title: "Yükleniyor..." },
    0: { bg: "badge-danger", title: "İptal" },
    1: { bg: "badge-warning", title: "Kuyrukta" },
    2: { bg: "badge-success", title: "Tamamlandı" },
    3: { bg: "badge-secondary", title: "Durduruldu" },
    4: { bg: "badge-danger", title: "Yetersiz Bakiye" },
    5: { bg: "badge-danger", title: "Başarısız" },
    6: { bg: "badge-danger", title: "Başarısız" },
    999: { bg: "badge-orange", title: "Devam Ediyor" }
};

const isActiveStatus = {
    "-1": "Tüm Kayıtlar",
    0: "Pasif Kayıtlar",
    1: "Aktif Kayıtlar",
    2: "Dondurulmuş Kayıtlar"
};

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            cid: props.match.params.cid,
            start: {
                settings: {}
            },
            status: -1
        };
    }

    componentDidMount() {
        GetSettings().then(resSettings => this.setState({ start: resSettings }));
        this.getCampaignDetail();
    }

    selectedTemplate = () => {
        const { template } = this.state;
        if (template) {
            return (
                <div className="card">
                    <div className="card-body p-125">
                        <div className="font-weight-600">
                            <div className={`icon-placeholder icon-placeholder-xxs bg-${template.color}-lightest mr-2`}>
                                <i className={template.icon + " text-" + template.color} />
                            </div>
                            {template.template_name}
                        </div>
                        <div className="mb-2 mt-1">{template.content}</div>
                        <div className="small text-muted">
                            Karakter Sayısı: {this.getMessageLength(template.content)}
                        </div>
                        <div className="small text-muted">Maliyet: {this.checkMessageCost(template.content)}</div>
                    </div>
                </div>
            );
        } else {
            return <div className="loader m-auto" />;
        }
    };

    getCampaignDetail = () => {
        const { uid, cid } = this.state;
        DetailCampaign({
            uid: uid,
            campaign_id: cid
        }).then(response => {
            if (response) {
                this.setState({ ...response.data });
            }
        });
    };

    deliveryCost = () => {
        const { template, persons } = this.state;
        return (
            <div className="form-group">
                <label className="form-label">Toplam Gönderim Maliyeti</label>
                {template
                    ? this.checkMessageCost(template.content) *
                      persons.filter(x => x.message.status.code === "1").length
                    : "0"}
            </div>
        );
    };

    previewMessage = () => {
        const { template, start, when } = this.state;
        if (template) {
            return (
                <div className="card bg-indigo-lighter">
                    <div className="card-body text-indigo p-125">
                        <div className="row gutters-sm">
                            <div className="col">
                                <span className="float-right">{formatDate(when, "HH:mm")}</span>
                                <div className="text-h3 font-weight-600">+90 (850) 305 52 15</div>
                                <div>{start.settings.sender_name},</div>
                                <div className="mt-3">{template.content}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className="loader m-auto mb-4" />;
        }
    };

    summaryReport = () => {
        const { when, persons, template } = this.state;
        if (template) {
            let cost = this.checkMessageCost(template.content);
            return (
                <div className="card bg-azure-lighter">
                    <div className="card-body text-azure-dark p-125">
                        <p>
                            <strong> {formatDate(when, "DD MMMM YYYY, HH:mm")} </strong>tarihinde
                            <strong> {template.template_name} </strong> adlı şablon ile
                            <strong> {persons.length} </strong>kişiye mesaj (SMS) gönderimi yapılmıştır.
                        </p>
                        Mesajın birim maliyeti
                        <strong> {cost} </strong>
                        olup, bakiyenizden
                        <strong> {cost * persons.length} </strong>
                        hak düşürülmüştür.
                    </div>
                </div>
            );
        } else {
            return <div className="loader m-auto" />;
        }
    };

    segmentDetail = () => {
        const { segment } = this.state;
        if (segment) {
            const replaceIsActive = segment.values.is_active.replace(/[()]/g, "").split(",");
            return (
                <>
                    <div className="hr-text hr-text-center mt-1">Segment Detayları</div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <label className="form-label">Segment Adı</label>
                                <div className="form-control-plaintext">{segment.segment_name}</div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <label className="form-label">Kayıt Tipi</label>
                                <div className="form-control-plaintext">
                                    {segment.values.is_trial ? "Ön Kayıtlar" : "Normal Öğrenciler"}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <label className="form-label">Kayıt Durumu</label>
                                <div className="form-control-plaintext">
                                    {segment.values.is_active === "(0,1,2)"
                                        ? isActiveStatus["-1"]
                                        : replaceIsActive.map(x => isActiveStatus[x]).join(", ")}
                                </div>
                            </div>
                        </div>
                        {segment.static_segment_id === 4 ? (
                            <div className="col-lg-3 col-md-6">
                                <div className="form-group">
                                    <label className="form-label">
                                        Kaç Gün Gecikmiş?
                                        <span className="mx-2">
                                            <span
                                                className="form-help"
                                                data-toggle="popover"
                                                data-placement="top"
                                                data-content="Ödeme zamanı gelen ve X gündür ödeme yapmayan öğrencilere mesaj gönderir">
                                                ?
                                            </span>
                                        </span>
                                    </label>
                                    <div className="form-control-plaintext">{segment.values.passed_day}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </>
            );
        } else return null;
    };

    checkMessageCost = content => {
        const contentLength = content
            .replace(/\u00c2/g, "Â|")
            .replace(/\u00e2/g, "â|")
            .replace(/\u00fb/g, "û|")
            .replace(/\u0131/g, "ı|")
            .replace(/\u00e7/g, "ç|")
            .replace(/\u011e/g, "Ğ|")
            .replace(/\u011f/g, "ğ|")
            .replace(/\u0130/g, "İ|")
            .replace(/\u015e/g, "Ş|")
            .replace(/\u015f/g, "ş|")
            .replace(/\r?\n/g, " |").length;
        if (contentLength >= 736) return 6;
        if (contentLength >= 588) return 5;
        if (contentLength >= 440) return 4;
        if (contentLength >= 292) return 3;
        if (contentLength >= 151) return 2;
        if (contentLength >= 0) return 1;
    };

    getMessageLength = content => {
        return content
            .replace(/\u00c2/g, "Â|")
            .replace(/\u00e2/g, "â|")
            .replace(/\u00fb/g, "û|")
            .replace(/\u0131/g, "ı|")
            .replace(/\u00e7/g, "ç|")
            .replace(/\u011e/g, "Ğ|")
            .replace(/\u011f/g, "ğ|")
            .replace(/\u0130/g, "İ|")
            .replace(/\u015e/g, "Ş|")
            .replace(/\u015f/g, "ş|")
            .replace(/\r?\n/g, " |").length;
    };

    render() {
        const { start, title, when, created_date, end_date, working_days, status, persons, segment } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Mesaj Görüntüle &mdash; {nullCheck(title)}</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages"}>
                        İletişim Merkezine Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Mesaj Detayları</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Mesaj Başlığı (Gönderici Adı)</label>
                                            <div className="form-control-plaintext">
                                                +90 (850) 305 52 15
                                                <i
                                                    className="ml-1 fa fa-info-circle text-info"
                                                    data-toggle="tooltip"
                                                    title="0850 305 52 15"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Mesaj İçi Gönderici Adı</label>
                                            <div className="form-control-plaintext">
                                                {nullCheck(start.settings.sender_name)}
                                                <i
                                                    className="ml-1 fa fa-info-circle text-info"
                                                    data-toggle="tooltip"
                                                    title="Değişiklik İçin Yönetici Onayı Gerekli"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Mesajın Durumu</label>
                                            {segment && segment.segment_id && status === 1 ? (
                                                <span className={`badge ${statusType[999].bg}`}>
                                                    {statusType[999].title}
                                                </span>
                                            ) : (
                                                <span className={`badge ${statusType[status].bg}`}>
                                                    {statusType[status].title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Mesaj Adı</label>
                                            <div className="form-control-plaintext">
                                                {segment && segment.segment_id ? (
                                                    <span className="badge badge-primary mr-2">OTOMATİK</span>
                                                ) : null}
                                                {nullCheck(title)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Çalışma Günleri</label>
                                            <div className="form-control-plaintext">
                                                {_.sortBy(working_days)
                                                    .map(x => moment.weekdays(parseInt(x)))
                                                    .join(", ")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-control-plaintext">{this.deliveryCost()}</div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Oluşturma Tarihi</label>
                                            <div className="form-control-plaintext">
                                                {formatDate(created_date, "DD MMMM YYYY, HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Başlama Tarihi</label>
                                            <div className="form-control-plaintext">
                                                {formatDate(when, "DD MMMM YYYY, HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">Sonlanma Tarihi</label>
                                            <div className="form-control-plaintext">
                                                {formatDate(end_date, "DD MMMM YYYY, HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.segmentDetail()}
                                <div className="hr-text hr-text-center mt-1">Şablon, Önizleme, Özet</div>
                                <div className="row row-deck row-cards">
                                    <div className="col-lg-4">{this.selectedTemplate()}</div>
                                    <div className="col-lg-4">{this.previewMessage()}</div>
                                    <div className="col-lg-4">{this.summaryReport()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Kişiler</h3>
                            </div>
                            <div>
                                <ListRecipient recipients={persons} history={this.props.history} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Detail);
