import React, { Component } from "react";
import sms_activate from "../../../../assets/images/illustrations/sms_activate.svg";
import { Link, withRouter } from "react-router-dom";
import { ListMessageTemplates, ActivateMessageTemplate } from "../../../../services/Messages";
import { GetSettings } from "../../../../services/School";
import _ from "lodash";
import Messages from "../../../NotActivate/Messages";
const $ = require("jquery");

export class SmsTemplates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: null,
            loadingButton: ""
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentWillUnmount() {
        this.setState({ loadingButton: "" });
    }

    componentDidMount() {
        this.listMessageTemplates();
        GetSettings().then(resSettings =>
            this.setState({
                sms_active: parseInt(resSettings.settings.sms_active)
            })
        );
    }

    listMessageTemplates = () => {
        ListMessageTemplates().then(response => {
            if (response) {
                if (response.status.code === 1020) this.setState({ list: response.data });
            }
        });
    };

    activateTemplates = () => {
        this.setState({ loadingButton: "btn-loading" });
        ActivateMessageTemplate().then(response => {
            if (response) {
                if (response.status.code === 1020) setTimeout(this.reload, 1000);
            }
        });
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/account/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    render() {
        const { uid, list, sms_active, loadingButton } = this.state;
        if (sms_active) {
            return (
                <div className="row row-deck">
                    {list && list.length > 0 ? (
                        <div className="col-lg-12">
                            <Link
                                className="card text-inherit text-decoration-none"
                                to={`/account/settings/sms-templates-add/${uid}`}>
                                <div className="card-status bg-green"></div>
                                <div className="card-body p-125 text-center cursor-pointer">
                                    <div className="icon-placeholder icon-placeholder-xxs bg-green-lighter">
                                        <i className="fa fa-plus text-green"></i>
                                    </div>
                                    <h5 className="d-inline-block ml-2">Yeni Şablon Oluştur</h5>
                                </div>
                            </Link>
                        </div>
                    ) : null}
                    {list ? (
                        list.length > 0 ? (
                            _.orderBy(list, ["default"], ["desc"]).map((el, key) => {
                                return (
                                    <div className="col-lg-4 col-md-6" key={key.toString()}>
                                        <div className="card">
                                            <div className="card-body text-center">
                                                <div className={`icon-placeholder bg-${el.color}-lightest`}>
                                                    <i className={el.icon + " text-" + el.color}></i>
                                                </div>
                                                <h5 className="mt-3">{el.template_name}</h5>
                                                <p className="text-muted text-truncate">{el.content}</p>
                                                <Link
                                                    to={`/account/settings/sms-templates-edit/${uid}/${el.template_id}`}
                                                    className="btn btn-sm btn-secondary ml-2">
                                                    Düzenle
                                                </Link>
                                            </div>
                                            {el.default ? (
                                                <div
                                                    className="ribbon ribbon-top ribbon-left bg-info"
                                                    data-toggle="tooltip"
                                                    title="Varsayılan Şablon">
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="card">
                                <div className="card-body text-center p-7">
                                    <img src={sms_activate} alt="SMS Aktif Et" style={{ width: "370px" }} />
                                    <h5 className="mt-5">Şablonları Yükle!</h5>
                                    <p className="text-muted text-center">
                                        Tebrikler, mesaj servisi aktif! &#127881;
                                        <br />
                                        Mesaj servisini kullanmak için hemen varsayılan şablonları yükle...
                                    </p>
                                    <button
                                        onClick={this.activateTemplates}
                                        className={`btn btn-success ${loadingButton}`}>
                                        Şablonları Yükle
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="col-12">
                            <div className="loader mx-auto"></div>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <Messages
                    content={() => (
                        <p className="text-muted text-center">
                            Mesaj servisiniz aktif olmadığı için, sms şablonlarını görüntüleyemiyorsunuz.
                            <br />
                            Yetkililer ile iletişime geç hemen aktifleştir!
                        </p>
                    )}
                />
            );
        }
    }
}

export default withRouter(SmsTemplates);
