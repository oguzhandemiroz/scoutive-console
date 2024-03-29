import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { GetMessageTemplate, UpdateMessageTemplate } from "../../../../services/Messages";
import { nullCheck, spaceTrim } from "../../../../services/Others";
import { formValid } from "../../../../assets/js/core";

const $ = require("jquery");

export class SmsTemplatesEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            detail: {
                content: ""
            },
            formErrors: {
                content: "",
                template_name: ""
            },
            contentLength: "",
            cost: 1,
            loadingButton: ""
        };
    }

    componentDidUpdate() {
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: "hover"
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        const { uid } = this.state;
        if (this.props.history.location.pathname.split("/").length > 5) {
            const template_id = this.props.history.location.pathname.split("/").slice(-1)[0];
            this.getMessageTemplate(template_id);
        } else this.props.history.push(`/account/settings/sms-templates/${uid}`);
    }

    componentWillUnmount() {
        this.setState({ loadingButton: "" });
    }

    handleSubmit = () => {
        const { uid, detail } = this.state;
        if (formValid(this.state)) {
            UpdateMessageTemplate({
                uid: uid,
                ...detail,
                content: spaceTrim(detail.content),
                template_name: spaceTrim(detail.template_name)
            }).then(response => {
                if (response) {
                    if (response.status.code === 1022) this.reload();
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    content: spaceTrim(detail.content) ? "" : "is-invalid",
                    template_name: spaceTrim(detail.template_name) ? "" : "is-invalid"
                }
            }));
        }
    };

    handleChange = e => {
        const { value, name } = e.target;
        if (name === "content") {
            const contentCheck = value
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
                .replace(/\r?\n/g, " |");
            this.setState({
                contentLength: contentCheck,
                cost: this.checkMessageCost(contentCheck)
            });
        }
        this.setState(prevState => ({
            detail: {
                ...prevState.detail,
                [name]: name === "content" ? value.slice(0, 883) : value
            },
            formErrors: {
                ...prevState.formErrors,
                [name]: spaceTrim(value) ? "" : "is-invalid"
            }
        }));
    };

    getMessageTemplate = id => {
        const { uid } = this.state;
        GetMessageTemplate({
            uid: uid,
            template_id: id
        }).then(response => {
            if (response) {
                if (response.status.code === 1020) {
                    const contentCheck = response.data.content
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
                        .replace(/\r?\n/g, " |");
                    this.setState({
                        detail: response.data,
                        contentLength: contentCheck,
                        cost: this.checkMessageCost(contentCheck)
                    });
                }
            }
        });
    };

    checkMessageCost = content => {
        if (content.length >= 736) return 6;
        if (content.length >= 588) return 5;
        if (content.length >= 440) return 4;
        if (content.length >= 292) return 3;
        if (content.length >= 151) return 2;
        if (content.length >= 0) return 1;
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/account/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    render() {
        const { uid, detail, contentLength, cost, formErrors, loadingButton } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Şablon Düzenle</h3>
                    <div className="card-options">
                        <Link to={`/account/settings/sms-templates/${uid}`} className="btn btn-link">
                            Şablonlara Geri Dön
                        </Link>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-auto">
                            <div className={`icon-placeholder bg-${detail.color}-lightest`}>
                                <i className={detail.icon + " text-" + detail.color}></i>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Şablon Adı</label>
                                {detail.default ? (
                                    <>
                                        {nullCheck(detail.template_name)}
                                        <i
                                            className="fa fa-star text-info ml-1"
                                            data-toggle="tooltip"
                                            title="Varsayılan Şablon"></i>
                                    </>
                                ) : (
                                    <input
                                        name="template_name"
                                        onChange={this.handleChange}
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${formErrors.template_name}`}
                                        value={nullCheck(detail.template_name, "")}
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Mesaj İçeriği <span className="form-required">*</span>
                                    <span className="float-right text-muted">
                                        <span
                                            className="form-help mr-2 bg-dark"
                                            data-toggle="popover"
                                            data-placement="top"
                                            data-content='
                                            <div class="row">
                                                <div class="col">
                                                    <strong>Karakter</strong>
                                                </div>
                                                <div class="col">
                                                    <strong>Maliyet</strong>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col">0-150</div>
                                                <div class="col">1</div>
                                            </div>
                                            <div class="row">
                                                <div class="col">151-291</div>
                                                <div class="col">2</div>
                                            </div>
                                            <div class="row">
                                                <div class="col">292-439</div>
                                                <div class="col">3</div>
                                            </div>
                                            <div class="row">
                                                <div class="col">440-587</div>
                                                <div class="col">4</div>
                                            </div>
                                            <div class="row">
                                                <div class="col">588-735</div>
                                                <div class="col">5</div>
                                            </div>
                                            <div class="row">
                                                <div class="col">736-883</div>
                                                <div class="col">6</div>
                                            </div>'
                                            data-original-title="Mesaj Karakterleri ve Maliyet"
                                            title="">
                                            ?
                                        </span>
                                        <span data-toggle="tooltip" title="Mesaj Karakteri ve Maliyeti">
                                            {contentLength.length} ({cost})
                                        </span>
                                    </span>
                                </label>
                                <textarea
                                    className={`form-control resize-none ${formErrors.content}`}
                                    name="content"
                                    rows="2"
                                    placeholder="Şablon İçeriği..."
                                    onChange={this.handleChange}
                                    value={detail.content}
                                />
                            </div>
                            <div className="alert alert-info alert-dismissible">
                                {" "}
                                <button type="button" className="close" data-dismiss="alert"></button>
                                <p>
                                    Mesaj içeriğinde Türkçe karakter içeren harf bulunuyorsa karakter hesaplamada
                                    <strong> 2 karakter</strong> harcar.
                                    <br /> Sistemdeki Türkçe karakterler:<strong> ç, ğ, ı, ş, Ğ, İ, Ş</strong>
                                </p>
                                Mesaj karakterlerini ve Maliyeti, <span className="form-help mx-1 bg-dark">?</span>{" "}
                                kısmından görüntüleyebilirsiniz.
                            </div>
                            <button
                                type="button"
                                onClick={this.handleSubmit}
                                className={`btn btn-success ${loadingButton}`}>
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SmsTemplatesEdit);
