import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { CreateMessageTemplate } from "../../../../services/Messages";
import { nullCheck } from "../../../../services/Others";
import { formValid } from "../../../../assets/js/core";

const initialState = {
    iconError: false,
    colorError: false
};

export class SmsTemplatesAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            template_name: null,
            content: null,
            color: null,
            icon: null,
            formErrors: {
                content: "",
                template_name: "",
                icon: "",
                color: ""
            },
            contentLength: "",
            cost: 1,
            loadingButton: ""
        };
    }

    handleSubmit = () => {
        const { uid, template_name, content, color, icon } = this.state;
        this.setState({ ...initialState });
        if (content.trim() && formValid(this.state)) {
            this.setState({ loadingButton: "btn-loading" });

            CreateMessageTemplate({
                uid: uid,
                title: null,
                template_name: template_name,
                content: content.trim(),
                color: color,
                icon: icon,
                type: 2
            }).then(response => {
                if (response) {
                    this.setState({ loadingButton: "" });
                    if (response.status.code === 1020)
                        this.props.history.push(`/account/settings/sms-templates/${uid}`);
                }
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    content: content.trim() ? "" : "is-invalid",
                    template_name: template_name ? "" : "is-invalid"
                },
                iconError: icon ? false : true,
                colorError: color ? false : true
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
            [name]: name === "content" ? value.slice(0, 883) : value,
            formErrors: {
                ...prevState.formErrors,
                [name]: value.trim() ? "" : "is-invalid"
            }
        }));
    };

    handleRadio = e => {
        const { name, value } = e.target;
        switch (name) {
            case "color":
                this.setState({ colorError: false });
                break;
            case "icon":
                this.setState({ iconError: false });
                break;
            default:
                break;
        }
        this.setState({ [name]: value });
    };

    checkMessageCost = content => {
        if (content.length >= 736) return 6;
        if (content.length >= 588) return 5;
        if (content.length >= 440) return 4;
        if (content.length >= 292) return 3;
        if (content.length >= 151) return 2;
        if (content.length >= 0) return 1;
    };

    render() {
        const { uid, iconError, colorError, contentLength, cost, formErrors, loadingButton } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Yeni Şablon Oluştur</h3>
                    <div className="card-options">
                        <Link to={`/account/settings/sms-templates/${uid}`} className="btn btn-link">
                            Şablonlara Geri Dön
                        </Link>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="form-label">
                                    Şablon Adı <span className="form-required">*</span>
                                </label>
                                <input
                                    name="template_name"
                                    onChange={this.handleChange}
                                    maxLength="100"
                                    type="text"
                                    className={`form-control ${formErrors.template_name}`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Şablon Rengi <span className="form-required">*</span>
                                </label>
                                <div className="row gutters-xs">
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Gri">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="gray"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-gray"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Mavi">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="blue"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-blue"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Yeşil">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="green"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-green"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Sarı">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="yellow"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-yellow"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Kırmızı">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="red"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-red"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Mor">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="purple"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-purple"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Çivit Mavisi">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="indigo"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-indigo"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Pembe">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="pink"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-pink"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Çim Rengi">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="lime"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-lime"></span>
                                        </label>
                                    </div>
                                    <div className="col-auto">
                                        <label className="colorinput" data-toggle="tooltip" title="Turuncu">
                                            <input
                                                name="color"
                                                type="radio"
                                                value="orange"
                                                className="colorinput-input"
                                                onChange={this.handleRadio}
                                            />
                                            <span className="colorinput-color bg-orange"></span>
                                        </label>
                                    </div>
                                </div>
                                {colorError ? (
                                    <div className="text-danger d-flex align-items-center">
                                        <i className="fe fe-alert-circle mr-1"></i>Renk Seçmelisiniz
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Şablon İkonu <span className="form-required">*</span>
                                </label>
                                <div className="selectgroup selectgroup-pills">
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Hoşgeldin">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-handshake"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-handshake"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Bilgilendirme">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-info"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-info"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Duyuru">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-bullhorn"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-bullhorn"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Yoklama">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-clock"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-clock"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Personel Yoklama">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-business-time"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-business-time"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Ödeme Başarılı">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-file-invoice-dollar"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-file-invoice-dollar"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Ödeme Geçikmiş">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-hand-holding-usd"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-hand-holding-usd"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Doğum Günü">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-birthday-cake"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-birthday-cake"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Uyarı/Hatırlatıcı">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-bell"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-bell"></i>
                                        </span>
                                    </label>
                                    <label className="selectgroup-item" data-toggle="tooltip" title="Antrenman">
                                        <input
                                            type="radio"
                                            name="icon"
                                            value="fa fa-running"
                                            className="selectgroup-input"
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-running"></i>
                                        </span>
                                    </label>
                                </div>
                                {iconError ? (
                                    <div className="text-danger d-flex align-items-center">
                                        <i className="fe fe-alert-circle mr-1"></i>İkon Seçmelisiniz
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
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
                                />
                            </div>
                        </div>
                    </div>
                    <div className="alert alert-info alert-dismissible">
                        {" "}
                        <button type="button" className="close" data-dismiss="alert"></button>
                        <p>
                            Mesaj içeriğinde Türkçe karakter içeren harf bulunuyorsa karakter hesaplamada
                            <strong> 2 karakter</strong> harcar.
                            <br /> Sistemdeki Türkçe karakterler:<strong> ç, ğ, ı, ş, Ğ, İ, Ş</strong>
                        </p>
                        Mesaj karakterlerini ve Maliyeti, <span className="form-help mx-1 bg-dark">?</span> kısmından
                        görüntüleyebilirsiniz.
                    </div>
                    <button type="button" onClick={this.handleSubmit} className={`btn btn-success ${loadingButton}`}>
                        Oluştur
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(SmsTemplatesAdd);
