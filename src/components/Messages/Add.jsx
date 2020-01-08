import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Select, { components } from "react-select";
import sms_activate_image from "../../assets/images/illustrations/sms_activate.svg";
import SmsUsage from "../Pages/Settings/UsageDetail/SmsUsage";
import { GetSettings, GetSchoolFees } from "../../services/School";
import { MessagesAllTime, UnpaidPlayers, ListBirthdays } from "../../services/Report";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import { formValid, selectCustomStyles, selectCustomStylesError } from "../../assets/js/core";
import {
    ListMessageTemplates,
    CreateCampaign,
    SendTestMessages,
    ActivateMessageTemplate
} from "../../services/Messages";
import { ListEmployees } from "../../services/Employee";
import { ListPlayers } from "../../services/Player";
import { formatDate, fullnameGenerator, avatarPlaceholder, formatPhone } from "../../services/Others";
import _ from "lodash";
const $ = require("jquery");

registerLocale("tr", tr);

const dailyType = {
    "-1": ["Tanımsız", "secondary"],
    "0": ["Gelmedi", "danger"],
    "1": ["Geldi", "success"],
    "2": ["T. Gün İzinli", "warning"],
    "3": ["Y. Gün İzinli", "warning"]
};

const { Option } = components;
const ImageOptionEmployee = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
        <div className="small text-muted mt-1">
            Telefon: <b className="text-dark font-weight-600">{formatPhone(props.data.phone)}</b>
        </div>
    </Option>
);

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
                    components: () => this.sendPreviewStep()
                }
            ],
            players: [],
            title: null,
            when: new Date(),
            templates: null,
            select_template: null,
            loadingButton: "",
            loadingTestButton: "",
            employee: null,
            select: {
                players: null,
                initialPlayers: null,
                unpaidList: null,
                employees: null
            },
            formErrors: {
                when: "",
                title: "",
                employee: ""
            },
            start: {
                settings: {
                    sms_free_balance: 500,
                    sms_extra_balance: 0
                },
                employee: {
                    detail: {}
                }
            },
            school_fees: [],
            all_time_messages: {
                2: 0,
                1: 0
            },
            undefined_contact_toggle: true,
            selectSender: 0
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
        $(function() {
            $('[data-toggle="popover"]').popover({
                html: true,
                trigger: "hover"
            });
        });
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
        this.developLoad();
    }

    handleSubmit = () => {
        const { uid, title, players, select_template, when } = this.state;
        CreateCampaign({
            uid: uid,
            title: title,
            person_type: 1,
            persons: players.map(el => el),
            template_id: select_template,
            when: formatDate(when, "YYYY-MM-DD HH:mm:00"),
            working_days: [0, 1, 2, 3, 4, 5, 6]
        }).then(response => {
            if (response) {
                this.props.history.push("/app/messages");
            }
        });
    };

    handleSendTestMessage = () => {
        const { uid, employee, selectSender, select_template } = this.state;
        if (selectSender === 0) {
            this.setState({ loadingTestButton: "btn-loading" });
            SendTestMessages({
                uid: uid,
                to: uid,
                template_id: select_template
            }).then(response => {
                this.setState({ loadingTestButton: "" });
                $("#sendTestMessageModal").modal("hide");
            });
        } else if (selectSender === 1 && employee) {
            this.setState({ loadingTestButton: "btn-loading" });
            SendTestMessages({
                uid: uid,
                to: employee.value,
                template_id: select_template
            }).then(response => {
                this.setState({ loadingTestButton: "" });
                $("#sendTestMessageModal").modal("hide");
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    employee: employee ? false : true
                }
            }));
        }
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

    handleRadio = e => {
        const { name, value } = e.target;
        const { select, uid } = this.state;
        if (name === "selectSender" && parseInt(value) === 1) {
            if (!select.employees) {
                ListEmployees(uid).then(response => {
                    if (response) {
                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                employees: response.data.map(el => {
                                    return {
                                        value: el.uid,
                                        label: fullnameGenerator(el.name, el.surname),
                                        image: el.image,
                                        phone: el.phone,
                                        email: el.email
                                    };
                                })
                            }
                        }));
                    }
                });
            }
        } else if (name === "selectSender" && parseInt(value) === 0) {
            this.setState({ employee: null });
        }
        this.setState({ [name]: parseInt(value) });
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

    handleUndefinedContact = e => {
        const { select } = this.state;
        const { checked, name } = e.target;
        const result = checked ? select.players.filter(x => x.recipient_parent_id !== -1) : select.players;
        this.setState(prevState => ({
            select: {
                ...prevState.select,
                initialPlayers: result
            },
            players: [],
            [name]: checked,
            filter: null
        }));
    };

    handleFilterRollcall = e => {
        const { select } = this.state;
        const { value, name, checked } = e.target;
        const result = checked ? select.players.filter(x => x.daily === 0) : select.players;
        this.setState(prevState => ({
            select: {
                ...prevState.select,
                initialPlayers: result
            },
            players: [],
            undefined_contact_toggle: false,
            [name]: checked ? parseInt(value) : null
        }));
    };

    handleFilterUnpaid = e => {
        const { select } = this.state;
        const { value, name, checked } = e.target;

        if (!select.unpaidList) {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    initialPlayers: null
                }
            }));

            UnpaidPlayers().then(response => {
                if (response) {
                    if (response.status.code === 1020) {
                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                initialPlayers: _.map(response.data, (x, key) =>
                                    select.players.find(y => y.uid === x.uid)
                                ),
                                unpaidList: response.data
                            }
                        }));
                    } else {
                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                initialPlayers: select.players
                            }
                        }));
                    }
                }
            });
        } else {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    initialPlayers: checked
                        ? _.map(select.unpaidList, x => select.players.find(y => y.uid === x.uid))
                        : select.players
                }
            }));
        }

        this.setState({
            players: [],
            undefined_contact_toggle: false,
            [name]: checked ? parseInt(value) : null
        });
    };

    handleFilterBirthday = e => {
        const { select } = this.state;
        const { value, name, checked } = e.target;

        if (!select.birthdayList) {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    initialPlayers: null
                }
            }));
            ListBirthdays().then(response => {
                if (response) {
                    if (response.status.code === 1020) {
                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                initialPlayers: _.map(response.data.players, (x, key) =>
                                    select.players.find(y => y.uid === x.uid)
                                ),
                                birthdayList: response.data.players
                            }
                        }));
                    } else {
                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                initialPlayers: select.players
                            }
                        }));
                    }
                }
            });
        } else {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    initialPlayers: checked
                        ? _.map(select.birthdayList, x => select.players.find(y => y.uid === x.uid))
                        : select.players
                }
            }));
        }

        this.setState({
            players: [],
            undefined_contact_toggle: false,
            [name]: checked ? parseInt(value) : null
        });
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

    selectAllPlayers = () => {
        const { select } = this.state;
        const result = select.initialPlayers.filter(x => x.recipient_parent_id !== -1).map(x => x.player_id);
        this.setState({ players: result });
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
                                    +90 (850) 305 52 15
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
                                    Mesaj Adı <span className="form-required">*</span>
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
                                                data-placement="top"
                                                data-toggle="popover"
                                                data-content={`<p><strong>Şablon İçeriği</strong></p>${el.content}`}
                                                className={`card cursor-pointer ${
                                                    select_template === el.template_id ? "card-active" : ""
                                                }`}
                                                onClick={() => this.handleTemplateCard(el.template_id)}>
                                                <div className="card-body text-center p-4">
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
                                                    <div
                                                        className={`icon-placeholder icon-placeholder-sm bg-${el.color}-lightest`}>
                                                        <i className={el.icon + " text-" + el.color} />
                                                    </div>

                                                    <div className="small font-weight-600 mt-3">{el.template_name}</div>
                                                    <div className="small text-muted">
                                                        Karakter Sayısı: {this.getMessageLength(el.content)}
                                                    </div>
                                                    <div className="small text-muted">
                                                        Maliyet: {this.checkMessageCost(el.content)}
                                                    </div>
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
                                                src={sms_activate_image}
                                                alt="SMS Aktif Et"
                                                style={{ width: "170px" }}
                                            />
                                            <h5 className="mt-5">Mesaj Şablonu Bulunamadı!</h5>
                                            <p className="text-muted text-center">
                                                Mesaj gönderimi yapabilmek için şablon oluşturmanız gerekmektedir...
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
        const { select, players, undefined_contact_toggle, filter } = this.state;
        return (
            <>
                <div className="card-body pb-0">
                    <div className="row mb-5">
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
                            <span>
                                <label className="custom-control custom-checkbox custom-control-inline">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        name="undefined_contact_toggle"
                                        onChange={this.handleUndefinedContact}
                                        checked={undefined_contact_toggle}
                                    />
                                    <span className="custom-control-label">Tanımsız İletişim Bilgisi Gizle</span>
                                </label>
                            </span>
                        </div>
                        <div className="col">
                            <div className="form-group mb-0">
                                <label className="form-label">Filtre</label>
                                <div className="selectgroup selectgroup-pills">
                                    <label className="selectgroup-item">
                                        <input
                                            type="checkbox"
                                            name="filter"
                                            value="0"
                                            className="selectgroup-input"
                                            onChange={this.handleFilterRollcall}
                                            checked={filter === 0}
                                        />
                                        <span className="selectgroup-button">Bugün Gelmeyenler</span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input
                                            type="checkbox"
                                            name="filter"
                                            value="1"
                                            className="selectgroup-input"
                                            onChange={this.handleFilterUnpaid}
                                            checked={filter === 1}
                                        />
                                        <span className="selectgroup-button">Ödeme Yapmayanlar</span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input
                                            type="checkbox"
                                            name="filter"
                                            value="2"
                                            className="selectgroup-input"
                                            onChange={this.handleFilterBirthday}
                                            checked={filter === 2}
                                        />
                                        <span className="selectgroup-button">Bu hafta içindeki doğum günleri</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group mb-0">
                                <label className="form-label mb-3">
                                    Öğrenciler
                                    <ol
                                        className="float-right breadcrumb breadcrumb-dots font-weight-normal"
                                        aria-label="breadcrumbs">
                                        <li className="breadcrumb-item">
                                            <span
                                                className="text-primary btn-link cursor-pointer"
                                                onClick={this.listPlayers}>
                                                Yenile
                                            </span>
                                        </li>
                                        <li class="breadcrumb-item">
                                            {players.length > 0 ? (
                                                <span
                                                    className="text-primary btn-link cursor-pointer"
                                                    onClick={() => this.setState({ players: [] })}>
                                                    Tüm Seçimleri Kaldır ({players.length} Seçili)
                                                </span>
                                            ) : (
                                                <span
                                                    className="text-primary btn-link cursor-pointer"
                                                    onClick={this.selectAllPlayers}>
                                                    Listenen Tüm Kişileri Seç
                                                </span>
                                            )}
                                        </li>
                                    </ol>
                                </label>
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
                                                            {el.recipient_parent_id === -1 ? (
                                                                <Link
                                                                    to={"/app/players/messages/" + el.uid}
                                                                    target="_blank"
                                                                    className="btn btn-primary btn-sm pointer-events"
                                                                    style={{
                                                                        borderBottomRightRadius: 0,
                                                                        borderBottomLeftRadius: 0
                                                                    }}>
                                                                    İletişim Bilgisini Düzenle
                                                                </Link>
                                                            ) : null}
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
                                                                            className={`badge badge-${
                                                                                dailyType[el.daily][1]
                                                                            }`}
                                                                            data-toggle="tooltip"
                                                                            title="Yoklama Durumu (Bugün)">
                                                                            {dailyType[el.daily][0]}
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
                                            <div className="text-center w-100 text-muted font-italic pb-7">
                                                Kayıt bulunamadı...
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

    sendPreviewStep = () => {
        const { start, school_fees, all_time_messages } = this.state;
        return (
            <>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="h2 text-body">Genel Özet</div>
                            <div className="row">
                                <div className="col-lg-6">{this.selectedTemplate()}</div>
                                <div className="col-lg-6">
                                    {this.deliveryCost()}
                                    {this.deliveryRecipient()}
                                </div>
                            </div>

                            {this.summaryReport()}
                        </div>
                        <div className="col-lg-4">
                            <div className="h2 text-body">Önizleme</div>
                            {this.previewMessage()}
                            <div className="h2 text-body">Bakiye Detayları</div>
                            <SmsUsage
                                balance={start.settings}
                                fees={school_fees}
                                all_time={all_time_messages}
                                allTimeHide
                            />
                        </div>
                    </div>
                </div>
                {this.sendTestMessageModal()}
                <div className="card-footer">
                    <button
                        type="button"
                        onClick={() => this.handlePrevStep(3)}
                        className="btn btn-secondary btn-icon mr-auto">
                        <i className="fa fa-arrow-left mr-2"></i>Geri Dön
                    </button>
                    <div className="float-right">
                        <button
                            onClick={this.openTestModal}
                            type="button"
                            data-toggle="modal"
                            data-target="#sendTestMessageModal"
                            className="btn btn-info btn-icon mr-2">
                            Test Mesajı Gönder<i className="fa fa-flask ml-2"></i>
                        </button>
                        <button type="button" onClick={this.handleSubmit} className="btn btn-success btn-icon">
                            Onayla ve Gönder<i className="fa fa-check ml-2"></i>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    selectedTemplate = () => {
        const { select_template, templates } = this.state;
        if (templates) {
            let template = templates.find(x => x.template_id === select_template);
            return (
                <div className="form-group">
                    <label className="form-label">Seçili Şablon</label>
                    <div className="card">
                        <div className="card-body p-125">
                            <div className={`icon-placeholder icon-placeholder-sm bg-${template.color}-lightest`}>
                                <i className={template.icon + " text-" + template.color} />
                            </div>

                            <div className="font-weight-600 mt-3">{template.template_name}</div>
                            <div className="mb-2 mt-1">{template.content}</div>
                            <div className="small text-muted">
                                Karakter Sayısı: {this.getMessageLength(template.content)}
                            </div>
                            <div className="small text-muted">Maliyet: {this.checkMessageCost(template.content)}</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className="loader m-auto" />;
        }
    };

    deliveryCost = () => {
        const { players, select_template, templates } = this.state;
        return (
            <div className="form-group">
                <label className="form-label">Gönderim Maliyeti</label>
                {templates
                    ? this.checkMessageCost(templates.find(x => x.template_id === select_template).content) *
                      players.length
                    : "0"}
            </div>
        );
    };

    deliveryRecipient = () => {
        const { players, select } = this.state;
        if (select.players) {
            let getPlayers = players.map(el => select.players.find(x => x.player_id === el));
            return (
                <div className="form-group">
                    <label className="form-label">Gönderim Yapılacak Kişiler ({players.length} Kişi)</label>
                    <div className="tags">
                        {getPlayers.map(el => (
                            <Link
                                to={"/app/players/messages/" + el.uid}
                                target="_blank"
                                className="tag"
                                key={el.player_id.toString()}>
                                {fullnameGenerator(el.name, el.surname)}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        } else {
            return <div className="loader m-auto" />;
        }
    };

    previewMessage = margin => {
        const { select_template, templates, start, when } = this.state;
        if (templates) {
            let template = templates.find(x => x.template_id === select_template);
            return (
                <div className={"card bg-indigo-lighter " + (margin ? "mb-0" : "")}>
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
            return <div className="loader mb-4 mx-auto" />;
        }
    };

    summaryReport = () => {
        const { when, players, select_template, school_fees, templates, start } = this.state;
        if (templates) {
            let template = templates.find(x => x.template_id === select_template);
            let cost = this.checkMessageCost(templates.find(x => x.template_id === select_template).content);
            return (
                <div className="form-group">
                    <label className="form-label">Özet Rapor</label>
                    <div className="alert alert-info alert-icon">
                        <i className="fe fe-align-left mr-2"></i>
                        <p>
                            <strong> {formatDate(when, "DD MMMM YYYY, HH:mm")} </strong>tarihinde
                            <strong> {template.template_name} </strong> adlı şablon ile
                            <strong> {players.length} </strong>kişiye mesaj (SMS) gönderimi yapılacaktır.
                            <br />
                            Mesajın birim maliyeti
                            <strong> {cost} </strong>
                            olup, bakiyenizden
                            <strong> {cost * players.length} </strong>
                            hak düşürülecektir.
                        </p>
                        {/* [Bakiyeniz eksiye (-24) düşecektir, bir sonraki gönderimi yapabilmeniz için bakiyenizi
                        sıfırlamanız gerekir!] */}
                    </div>
                    <div className="alert alert-warning alert-icon">
                        <i className="fe fe-pie-chart mr-2"></i>
                        <p>
                            Şu anki Ücretsiz SMS Bakiyesi: <strong>{start.settings.sms_free_balance}</strong>
                            <br />
                            Şu anki SMS Paketi Bakiyesi: <strong>{this.getExtraSMS(school_fees)}</strong>
                            <br />
                            &mdash;
                            <br />
                            Gönderim Sonrası Ücretsiz SMS Bakiyesi:{" "}
                            <strong>{start.settings.sms_free_balance - cost * players.length}</strong>
                            <br />
                            Gönderim Sonrası SMS Paketi Bakiyesi: <strong>{this.getExtraSMS(school_fees)}</strong>
                        </p>
                    </div>
                </div>
            );
        } else {
            return <div className="loader m-auto" />;
        }
    };

    getExtraSMS = fees => {
        return _.sumBy(
            _(fees)
                .flatMap("package")
                .groupBy("type")
                .value().SMS,
            "count"
        );
    };

    sendTestMessageModal = () => {
        const { select, selectSender, start, employee, formErrors, loadingTestButton } = this.state;
        return (
            <div
                className="modal fade"
                id="sendTestMessageModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="sendTestMessageModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="sendTestMessageModalLabel">
                                <i className="fa fa-flask mr-1 text-info"></i> Test Mesajı Gönderimi
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Kime Gönderilecek?</label>
                                <div className="selectgroup w-100">
                                    <label className="selectgroup-item">
                                        <input
                                            type="radio"
                                            name="selectSender"
                                            value="0"
                                            className="selectgroup-input"
                                            checked={selectSender === 0}
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button">Hesap Sahibine</span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input
                                            type="radio"
                                            name="selectSender"
                                            value="1"
                                            className="selectgroup-input"
                                            checked={selectSender === 1}
                                            onChange={this.handleRadio}
                                        />
                                        <span className="selectgroup-button">Personele</span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Gönderilecek Kişi
                                    {selectSender === 1 ? <span className="form-required">*</span> : null}
                                </label>
                                {selectSender === 0 ? (
                                    <fieldset className="form-fieldset">
                                        <div className="font-weight-600">
                                            {`${start.employee.detail.name} — ${formatPhone(
                                                start.employee.detail.phone,
                                                ""
                                            )}`}
                                        </div>
                                    </fieldset>
                                ) : (
                                    <>
                                        <Select
                                            value={employee}
                                            isSearchable={true}
                                            isDisabled={select.employees ? false : true}
                                            isLoading={select.employees ? false : true}
                                            placeholder="Seç..."
                                            onChange={val => this.handleSelect(val, "employee")}
                                            name="employee"
                                            autosize
                                            styles={
                                                formErrors.employee === true
                                                    ? selectCustomStylesError
                                                    : selectCustomStyles
                                            }
                                            options={select.employees}
                                            noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            //components={{ Option: ImageOptionEmployee }}
                                        />
                                        <fieldset className="form-fieldset mt-2">
                                            <div className="font-weight-600">
                                                {employee
                                                    ? `${employee.label} — ${formatPhone(employee.phone, "")}`
                                                    : ""}
                                            </div>
                                        </fieldset>
                                    </>
                                )}
                            </div>
                            <div className="hr-text hr-text-center">Mesajın İçeriği</div>
                            {this.previewMessage(true)}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={this.handleSendTestMessage}
                                className={`btn btn-info ${loadingTestButton}`}>
                                Test Mesajı Gönder
                            </button>
                        </div>
                    </div>
                </div>
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
        this.setState(prevState => ({
            select: {
                ...prevState.select,
                players: null,
                initialPlayers: null
            },
            players: []
        }));
        ListPlayers().then(response => {
            if (response) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        players: response.data.filter(x => x.status !== 0),
                        initialPlayers: response.data
                            .filter(x => x.status !== 0)
                            .filter(y => y.recipient_parent_id !== -1)
                    }
                }));
            }
        });
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

    developLoad = () => {
        /*  this.listMessageTemplates();
        this.listPlayers(); */
    };

    activateTemplates = () => {
        this.setState({ loadingButton: "btn-loading" });
        ActivateMessageTemplate().then(response => {
            if (response) {
                if (response.status.code === 1020) this.listMessageTemplates();
            }
        });
    };

    render() {
        const { steps } = this.state;
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
                </div>
            </div>
        );
    }
}

export default withRouter(Add);
