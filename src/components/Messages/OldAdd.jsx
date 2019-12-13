import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import { ListMessageTemplates, ActivateMessageTemplate, CreateCampaign } from "../../services/Messages";
import { formValid, selectCustomStyles } from "../../assets/js/core";
import sms_activate from "../../assets/images/illustrations/sms_activate.svg";
import { GetPlayers } from "../../services/FillSelect";
import { formatDate } from "../../services/Others";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
const $ = require("jquery");

registerLocale("tr", tr);

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: null,
            loadingButton: "",
            templates: null,
            loadingButton: "",
            select_template: null,
            formErrors: {},
            select: { players: null },
            when: new Date()
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        this.listMessageTemplates();
        this.getFillSelect();
    }

    handleSubmit = () => {
        const { uid, title, players, select_template, when } = this.state;
        CreateCampaign({
            uid: uid,
            title: title,
            person_type: 1,
            persons: players.map(el => el.id),
            template_id: select_template,
            when: formatDate(when, "YYYY-MM-DD HH:mm:00")
        }).then(response => {
            if (response) {
                this.reload();
            }
        });
    };

    handleChange = e => {
        try {
            e.preventDefault();
            const { name, value } = e.target;

            this.setState({ [name]: value });
        } catch (e) {}
    };
    handleSelect = (value, name) => {
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: value ? false : true
            },
            [name]: value
        }));
    };

    handleDate = (date, name) => {
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: date ? "" : "is-invalid"
            },
            [name]: date
        }));
    };

    handleCard = template_id => {
        const { select_template } = this.state;
        if (select_template === template_id) this.setState({ select_template: null });
        else this.setState({ select_template: template_id });
    };

    listMessageTemplates = () => {
        ListMessageTemplates().then(response => {
            if (response) {
                if (response.status.code === 1020) this.setState({ templates: response.data });
            }
        });
    };

    activateTemplates = () => {
        this.setState({ loadingButton: "btn-loading" });
        ActivateMessageTemplate().then(response => {
            if (response) {
                if (response.status.code === 1020) {
                    this.setState({ loadingButton: "" });
                    this.listMessageTemplates();
                }
            }
        });
    };

    getFillSelect = () => {
        GetPlayers().then(response => {
            if (response) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        players: response
                    }
                }));
            }
        });
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    render() {
        const { templates, loadingButton, select_template, formErrors, select, when } = this.state;
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
                                        8503055215
                                        <i
                                            className="ml-1 fa fa-info-circle text-info"
                                            data-toggle="tooltip"
                                            title="0850 305 52 15"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mesaj içi Gönderici Adı</label>
                                    <div className="form-control-plaintext">
                                        Scoutive Demo
                                        <i
                                            className="ml-1 fa fa-info-circle text-info"
                                            data-toggle="tooltip"
                                            title="Değişiklik için Yönetici Onaylı Gerekli"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Kampanya Adı <span className="form-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={this.handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Gönderi Tarihi <span className="form-required">*</span>
                                    </label>
                                    <DatePicker
                                        autoComplete="off"
                                        selected={when}
                                        selectsEnd
                                        minDate={when}
                                        name="when"
                                        locale="tr"
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        showTimeInput
                                        timeInputLabel="Saat: "
                                        onChange={date => this.handleDate(date, "when")}
                                        className={`form-control ${formErrors.when}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Kişiler ve Şablon</h3>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label className="form-label">
                                        Şablon Belirle <span className="form-required">*</span>
                                    </label>
                                    <div className="row row-deck gutters-sm">
                                        {templates ? (
                                            templates.length > 0 ? (
                                                templates.map((el, key) => {
                                                    return (
                                                        <div className="col-6 col-lg-3 col-sm-6" key={key.toString()}>
                                                            <div
                                                                className={`card cursor-pointer ${
                                                                    select_template === el.template_id
                                                                        ? "card-active"
                                                                        : ""
                                                                }`}
                                                                onClick={() => this.handleCard(el.template_id)}>
                                                                <div className="card-body text-center p-4">
                                                                    <div
                                                                        className={`icon-placeholder icon-placeholder-sm bg-${el.color}-lightest`}>
                                                                        <i className={el.icon + " text-" + el.color} />
                                                                    </div>

                                                                    <div className="small font-weight-600 mt-3">
                                                                        {el.template_name}
                                                                    </div>
                                                                    {el.default ? (
                                                                        <div
                                                                            data-toggle="tooltip"
                                                                            title="Varsayılan Şablon"
                                                                            className="d-flex justify-content-start align-items-center p-2"
                                                                            style={{
                                                                                position: "absolute",
                                                                                top: 0,
                                                                                left: 0,
                                                                                right: 0
                                                                            }}>
                                                                            <i className="fa fa-star text-info small font-weight-600" />
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="col">
                                                    <div className="card">
                                                        <div className="card-body text-center">
                                                            <img
                                                                src={sms_activate}
                                                                alt="SMS Aktif Et"
                                                                style={{ width: "170px" }}
                                                            />
                                                            <h5 className="mt-5">Mesaj Şablonu Bulunamadı!</h5>
                                                            <p className="text-muted text-center">
                                                                Kampanya oluşturmak için ve mesaj gönderimi yapabilmek
                                                                için şablon oluşturmanız gerekmektedir...
                                                                <br />
                                                                Hemen varsayılan şablonları yükle!
                                                            </p>
                                                            <button
                                                                onClick={this.activateTemplates}
                                                                className={`btn btn-success btn-sm ${loadingButton}`}>
                                                                Şablonları Yükle
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <div className="loader m-auto" />
                                        )}
                                    </div>
                                    {select_template ? (
                                        <div className="alert alert-info alert-icon">
                                            <i className="fe fe-align-left"></i>
                                            <strong>Mesaj İçeriği</strong>
                                            <div>
                                                {templates.filter(x => x.template_id === select_template)[0].content}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Gönderilecek Kişiler<span className="form-required">*</span>
                                    </label>
                                    <Select
                                        isMulti
                                        onChange={val => this.handleSelect(val, "players")}
                                        options={select.players}
                                        name="players"
                                        placeholder="Seç..."
                                        styles={selectCustomStyles}
                                        isClearable={true}
                                        isSearchable={true}
                                        isDisabled={select.players ? false : true}
                                        isLoading={select.players ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    />
                                </div>
                            </div>
                            <div className="card-footer text-right" onClick={this.handleSubmit}>
                                <button className="btn btn-success">Kaydet ve Gönder</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Add;
