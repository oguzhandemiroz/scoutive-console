import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import SmsUsage from "../Pages/Settings/UsageDetail/SmsUsage";
import { GetSettings, GetSchoolFees } from "../../services/School";
import { MessagesAllTime } from "../../services/Report";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import { formValid } from "../../assets/js/core";
import sms_activate from "../../assets/images/illustrations/sms_activate.svg";
import { ListMessageTemplates, CreateCampaign } from "../../services/Messages";
import { ListPlayers } from "../../services/Player";
import { formatDate, fullnameGenerator, avatarPlaceholder } from "../../services/Others";
import _ from "lodash";
const $ = require("jquery");

registerLocale("tr", tr);

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            steps: [
                {
                    key: "0",
                    name: "Mesaj Bilgileri",
                    title: "Mesaj Bilgileri",
                    active: true,
                    components: () => this.messagesStep()
                },
                {
                    key: "1",
                    name: "Şablon",
                    title: "Şablon Belirle",
                    active: false,
                    components: () => this.templatesStep()
                },
                {
                    key: "2",
                    name: "Kişiler",
                    title: "Gönderilecek Kişileri Seç",
                    active: false,
                    components: () => this.recipientsStep()
                },
                {
                    key: "3",
                    name: "Onayla ve Gönder",
                    title: "Onayla ve Gönder",
                    active: false,
                    components: () => this.sendStep()
                }
            ],
            players: [],
            title: null,
            when: new Date(),
            templates: null,
            select_template: null,
            loadingButton: "",
            select: {
                players: null,
                initialPlayers: null
            },
            formErrors: {
                when: "",
                title: ""
            },
            start: {
                settings: {
                    sms_free_balance: 500,
                    sms_extra_balance: 0
                }
            },
            school_fees: [],
            all_time_messages: {
                2: 0,
                1: 0
            }
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        GetSettings().then(resSettings => this.setState({ start: resSettings }));
        GetSchoolFees().then(response => {
            if (response) {
                this.setState({ school_fees: response.data.reverse(), loading: "" });
            }
        });
        MessagesAllTime().then(response => {
            if (response) {
                this.setState({ all_time_messages: response.data });
            }
        });
    }

    handleSubmit = () => {
        const { uid, title, players, select_template, when } = this.state;
        CreateCampaign({
            uid: uid,
            title: title,
            person_type: 1,
            persons: players.map(el => el),
            template_id: select_template,
            when: formatDate(when, "YYYY-MM-DD HH:mm:00")
        }).then(response => {
            if (response) {
                this.props.history.push("/app/messages");
            }
        });
    };

    handleChange = e => {
        try {
            e.preventDefault();
            const { name, value } = e.target;
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    [name]: value ? "" : "is-invalid"
                },
                [name]: value
            }));
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

    handleTemplateCard = template_id => {
        const { select_template } = this.state;
        if (select_template === template_id) this.setState({ select_template: null });
        else this.setState({ select_template: template_id });
    };

    handleCard = player_id => {
        const { players } = this.state;
        if (players.indexOf(player_id) > -1) {
            this.setState({ players: players.filter(x => x !== player_id) });
        } else {
            this.setState(prevState => ({ players: [...prevState.players, player_id] }));
        }
    };

    handleSearch = e => {
        const { value } = e.target;
        const { players } = this.state.select;

        const searched = _(players)
            .map(item => JSON.stringify(item).toLocaleLowerCase("tr-TR"))
            .value();

        const filtered = _.filter(searched, x => x.indexOf(value.toLocaleLowerCase("tr-TR")) > -1);

        const parsed = _(filtered)
            .map(objs => JSON.parse(objs))
            .value();

        const result = _(parsed)
            .map(objs => players.find(x => x.player_id === objs.player_id))
            .value();

        this.setState(prevState => ({
            select: {
                ...prevState.select,
                initialPlayers: result
            }
        }));
    };

    handleFilterRollcall = e => {
        const { value, name, checked } = e.target;
        console.log(value, name, checked);
    };

    handleNextStep = step => {
        let steps = [...this.state.steps];
        steps[step].active = false;
        steps[step + 1].active = true;
        this.setState({ steps });
    };

    handlePrevStep = step => {
        let steps = [...this.state.steps];
        steps[step].active = false;
        steps[step - 1].active = true;
        this.setState({ steps });
    };

    handleMessagesStep = () => {
        const { title, when, formErrors } = this.state;
        const required = { title: title, when: when, formErrors: { ...formErrors } };
        console.log(required);
        if (formValid(required)) {
            this.handleNextStep(0);
            this.listMessageTemplates();
        } else {
            console.error("ERROR");
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    title: title ? "" : "is-invalid",
                    when: when ? "" : "is-invalid"
                }
            }));
        }
    };

    handleTemplatesStep = () => {
        const { select_template } = this.state;
        if (select_template) {
            this.handleNextStep(1);
            this.listPlayers();
        }
    };

    handleRecipientsStep = () => {
        const { players } = this.state;
        if (players.length > 0) {
            this.handleNextStep(2);
        }
    };

    messagesStep = () => {
        const { when, title, formErrors, start } = this.state;
        return (
            <>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Mesaj Başlığı (Gönderici Adı)</label>
                                <div className="form-control-plaintext">
                                    8503055215
                                    <i
                                        className="ml-1 fa fa-info-circle text-info"
                                        data-toggle="tooltip"
                                        title="0850 305 52 15"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Mesaj İçi Gönderici Adı</label>
                                <div className="form-control-plaintext">
                                    {start.settings.sender_name}
                                    <i
                                        className="ml-1 fa fa-info-circle text-info"
                                        data-toggle="tooltip"
                                        title="Değişiklik İçin Yönetici Onayı Gerekli"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Kampanya Adı <span className="form-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    onChange={this.handleChange}
                                    className={`form-control ${formErrors.title}`}
                                    value={title || ""}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Gönderim Tarihi <span className="form-required">*</span>
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
                <div className="card-footer text-right">
                    <button type="button" onClick={this.handleMessagesStep} className="btn btn-success btn-icon">
                        Devam Et<i className="fa fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </>
        );
    };

    templatesStep = () => {
        const { templates, select_template, sms_activate, loadingButton } = this.state;
        return (
            <>
                <div className="card-body">
                    <div className="row row-deck gutters-sm">
                        {templates ? (
                            templates.length > 0 ? (
                                templates.map((el, key) => {
                                    return (
                                        <div className="col-6 col-lg-3 col-sm-6" key={key.toString()}>
                                            <div
                                                className={`card cursor-pointer ${
                                                    select_template === el.template_id ? "card-active" : ""
                                                }`}
                                                onClick={() => this.handleTemplateCard(el.template_id)}>
                                                <div className="card-body text-center p-4">
                                                    <div
                                                        className={`icon-placeholder icon-placeholder-sm bg-${el.color}-lightest`}>
                                                        <i className={el.icon + " text-" + el.color} />
                                                    </div>

                                                    <div className="small font-weight-600 mt-3">{el.template_name}</div>
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
                                            <img src={sms_activate} alt="SMS Aktif Et" style={{ width: "170px" }} />
                                            <h5 className="mt-5">Mesaj Şablonu Bulunamadı!</h5>
                                            <p className="text-muted text-center">
                                                Kampanya oluşturmak için ve mesaj gönderimi yapabilmek için şablon
                                                oluşturmanız gerekmektedir...
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
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <button type="button" onClick={() => this.handlePrevStep(1)} className="btn btn-secondary btn-icon">
                        <i className="fa fa-arrow-left mr-2"></i>Geri Dön
                    </button>
                    {select_template ? null : (
                        <div className="text-danger d-flex align-items-center">
                            <i className="fe fe-alert-circle mr-1"></i>Şablon Seçmelisiniz
                        </div>
                    )}
                    <button type="button" onClick={this.handleTemplatesStep} className="btn btn-success btn-icon">
                        Devam Et<i className="fa fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </>
        );
    };

    recipientsStep = () => {
        const { select, players } = this.state;
        return (
            <>
                <div className="card-body">
                    <div className="row">
                        <div className="col-auto">
                            <div className="form-group">
                                <label className="form-label">Arama</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Öğrenci Ara..."
                                    name="search"
                                    onChange={this.handleSearch}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label className="form-label">Filtre</label>
                                <div className="selectgroup selectgroup-pills">
                                    <label className="selectgroup-item">
                                        <input
                                            type="radio"
                                            name="filter"
                                            value="0"
                                            className="selectgroup-input"
                                            onChange={this.handleFilterRollcall}
                                        />
                                        <span className="selectgroup-button">Bugün Gelmeyenler</span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input
                                            type="checkbox"
                                            name="work_days"
                                            value="1"
                                            className="selectgroup-input"
                                            onChange={this.handleWorkDays}
                                        />
                                        <span className="selectgroup-button">Ödeme Yapmayanlar</span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input
                                            type="checkbox"
                                            name="work_days"
                                            value="1"
                                            className="selectgroup-input"
                                            onChange={this.handleWorkDays}
                                        />
                                        <span className="selectgroup-button">Bu hafta içindeki doğum günleri</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group">
                                <label className="form-label">Öğrenciler</label>
                                <div className="row row-cards row-deck">
                                    {select.initialPlayers ? (
                                        select.initialPlayers.length > 0 ? (
                                            _.orderBy(select.initialPlayers, ["recipient_parent_id"], ["desc"]).map(
                                                el => (
                                                    <div className="col-lg-4 col-md-6" key={el.player_id.toString()}>
                                                        <div
                                                            onClick={() =>
                                                                el.recipient_parent_id !== -1
                                                                    ? this.handleCard(el.player_id)
                                                                    : null
                                                            }
                                                            className={`card user-select-none cursor-pointer shadow-sm ${
                                                                players.indexOf(el.player_id) > -1 ? "card-active" : ""
                                                            } ${el.recipient_parent_id === -1 ? "card-inactive" : ""}`}>
                                                            <div className="card-body p-125 card-checkbox">
                                                                <div className="row gutters-sm align-items-center">
                                                                    <div className="col-auto">
                                                                        <span
                                                                            className="avatar avatar-md"
                                                                            style={{
                                                                                backgroundImage: `url(${el.image})`
                                                                            }}>
                                                                            {avatarPlaceholder(el.name, el.surname)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="col">
                                                                        <h5 className="mb-0">
                                                                            {fullnameGenerator(el.name, el.surname)}
                                                                        </h5>
                                                                        <span
                                                                            className="text-muted text-h6 mt-1"
                                                                            data-toggle="tooltip"
                                                                            title="Doğum Tarihi">
                                                                            {formatDate(el.birthday, "DD MMMM YYYY")}
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-auto align-self-start d-flex">
                                                                        <span
                                                                            className="badge badge-success"
                                                                            data-toggle="tooltip"
                                                                            title="Yoklama Durumu (Bugün)">
                                                                            Geldi
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="mb-3 mt-5" />
                                                                {el.recipient_parent_id === -1 ? (
                                                                    <div className="text-danger d-flex align-items-center justify-content-center">
                                                                        <i className="fe fe-alert-circle text-red mr-1"></i>
                                                                        Tanımsız iletişim bilgisi
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center">
                                                                        <div>İletişime Geçilecek Kişi</div>
                                                                        <div className="text-muted">
                                                                            {el.recipient_parent_id === 0
                                                                                ? fullnameGenerator(
                                                                                      el.name,
                                                                                      el.surname
                                                                                  ) + " (Kendisi)"
                                                                                : fullnameGenerator(
                                                                                      el.parents.find(
                                                                                          x =>
                                                                                              x.parent_id ===
                                                                                              el.recipient_parent_id
                                                                                      ).name,
                                                                                      el.parents.find(
                                                                                          x =>
                                                                                              x.parent_id ===
                                                                                              el.recipient_parent_id
                                                                                      ).surname
                                                                                  ) +
                                                                                  ` (${
                                                                                      el.parents.find(
                                                                                          x =>
                                                                                              x.parent_id ===
                                                                                              el.recipient_parent_id
                                                                                      ).kinship
                                                                                  })`}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className="text-center w-100 text-muted font-italic">
                                                Sistemde kayıtlı öğrenci bulunamadı...
                                            </div>
                                        )
                                    ) : (
                                        <div className="loader mx-auto mb-5" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                    <button type="button" onClick={() => this.handlePrevStep(2)} className="btn btn-secondary btn-icon">
                        <i className="fa fa-arrow-left mr-2"></i>Geri Dön
                    </button>
                    {players.length === 0 ? (
                        <div className="text-danger d-flex align-items-center">
                            <i className="fe fe-alert-circle mr-1"></i>En az 1 kişi seçmelisiniz
                        </div>
                    ) : null}
                    <button type="button" onClick={this.handleRecipientsStep} className="btn btn-success btn-icon">
                        Devam Et<i className="fa fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </>
        );
    };

    sendStep = () => {
        return (
            <div className="card-footer text-right">
                <button type="button" onClick={this.handleSubmit} className="btn btn-success btn-icon">
                    Onayla ve Gönder<i className="fa fa-check ml-2"></i>
                </button>
            </div>
        );
    };

    listMessageTemplates = () => {
        ListMessageTemplates().then(response => {
            if (response) {
                if (response.status.code === 1020) this.setState({ templates: response.data });
            }
        });
    };

    listPlayers = () => {
        ListPlayers().then(response => {
            if (response) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        players: response.data.filter(x => x.status !== 0),
                        initialPlayers: response.data.filter(x => x.status !== 0)
                    }
                }));
            }
        });
    };

    render() {
        const { steps, start, school_fees, all_time_messages } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Mesaj Oluştur &mdash; SMS</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages"}>
                        İletişim Merkezine Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="steps steps-lime">
                            {steps.map(el => (
                                <span key={el.key} className={`step-item ${el.active ? "active" : ""}`}>
                                    {el.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">{steps.find(x => x.active).title}</h3>
                            </div>
                            {steps.find(x => x.active).components()}
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <SmsUsage
                            balance={start.settings}
                            fees={school_fees}
                            all_time={all_time_messages}
                            allTimeHide
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Add);
