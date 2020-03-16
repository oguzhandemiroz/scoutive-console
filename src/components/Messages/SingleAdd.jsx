import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ListPlayers } from "../../services/Player";
import { ListParents } from "../../services/Parent";
import { ListEmployees } from "../../services/Employee";
import {
    ListMessageTemplates,
    SendTestMessages,
    CreateMessage,
    ActivateMessageTemplate
} from "../../services/Messages";
import NotPermissions from "../../components/NotActivate/NotPermissions";
import { selectCustomStyles, formValid, selectCustomStylesError } from "../../assets/js/core";
import { fullnameGenerator, formatPhone, nullCheck, formatDate, CheckPermissions } from "../../services/Others";
import sms_activate_image from "../../assets/images/illustrations/sms_activate.svg";
import SmsUsage from "../Pages/Settings/UsageDetail/SmsUsage";
import { GetSettings, GetSchoolFees } from "../../services/School";
import { MessagesAllTime } from "../../services/Report";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import _ from "lodash";
import moment from "moment";
const $ = require("jquery");
registerLocale("tr", tr);

const personTypeToText = {
    null: "Kişi",
    player: "Öğrenci",
    parent: "Veli",
    employee: "Personel"
};

const personTypeToType = {
    player: 1,
    employee: 2,
    parent: 3
};

const initialState = {
    content: null,
    contentType: null,
    person: null,
    employee: null,
    recipient: null,
    select_template: null,
    contentLength: "",
    cost: 1,
    when: new Date()
};

export class SingleAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: this.props.match.params.uid,
            steps: [
                {
                    key: "0",
                    name: "Mesaj İçeriği",
                    title: "Mesaj İçeriği",
                    active: true,
                    components: () => this.messagesStep()
                },
                {
                    key: "1",
                    name: "Onayla ve Gönder",
                    title: "Onayla ve Gönder",
                    active: false,
                    components: () => this.sendPreviewStep()
                }
            ],
            select: {
                players: null,
                parents: null,
                employees: null,
                persons: null,
                templates: null
            },
            formErrors: {
                when: "",
                content: "",
                employee: false
            },
            sender: "8503055215",
            personType: this.props.match.params.ptype || null,
            ...initialState,
            loadingButton: "",
            loadingTemplates: null,
            loadingTestButton: "",
            messagesStepError: false,
            dateError: false,
            selectSender: 0,
            //settings
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
            }
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
        if (CheckPermissions(["m_write"])) {
            const { personType } = this.state;
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
            switch (personType) {
                case "player":
                    this.listPlayers();
                    break;
                case "parent":
                    this.listParents();
                case "employee":
                    this.listEmployees();
                default:
                    break;
            }
        }
    }

    handleSubmit = () => {
        const { uid, person, sender, personType, select_template, content, when } = this.state;
        CreateMessage({
            uid: uid,
            campaign_name: person.label + " - " + moment(when).format("DDMMYY"),
            to: person.value,
            person_type: personTypeToType[personType],
            content: content,
            sender: sender,
            template_id: select_template ? select_template : 0,
            when: formatDate(when, "YYYY-MM-DD HH:mm:00")
        }).then(response => {
            if (response) {
                if (response.status.code === 1023) {
                    this.props.history.push("/app/messages/detail/" + response.campaign_id);
                }
            }
        });
    };

    handleDate = (date, name) => {
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: date ? "" : "is-invalid"
            },
            dateError: date < new Date() ? true : false,
            [name]: date
        }));
    };

    handleChange = e => {
        try {
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
        } catch (e) {}
    };

    handleSelect = (value, name) => {
        const recipient_data =
            value.recipient_parent_id > 0 ? value.parents.find(x => x.parent_id === value.recipient_parent_id) : null;
        this.setState({
            [name]: value,
            to: value.value,
            recipient: {
                ...value,
                fullname: recipient_data ? fullnameGenerator(recipient_data.name, recipient_data.surname) : value.label,
                kinship: recipient_data ? recipient_data.kinship : "Kendisi",
                phone: recipient_data ? recipient_data.phone : value.phone,
                email: recipient_data ? recipient_data.email : value.email
            }
        });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        const { select } = this.state;
        if (name === "selectSender" && parseInt(value) === 1) {
            if (!select.employees) {
                ListEmployees().then(response => {
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

    handlePersonType = e => {
        const { name, value } = e.target;
        const { to } = this.state;
        this.setState(prevState => ({
            select: {
                ...prevState.select,
                persons: null
            },
            ...initialState,
            [name]: value
        }));
        switch (value) {
            case "player":
                this.listPlayers();
                break;
            case "parent":
                this.listParents();
                break;
            case "employee":
                this.listEmployees();
                break;
            default:
                break;
        }
        if (to) this.props.history.push(`/app/messages/single/add`);
    };

    handleContentType = e => {
        const { name, value } = e.target;
        switch (value) {
            case "0":
                this.listMessageTemplates();
                break;

            default:
                break;
        }
        this.setState({ [name]: value, select_template: null, content: null });
    };

    handleTemplateCard = template_id => {
        const { select_template, select } = this.state;
        if (select_template === template_id)
            this.setState({
                select_template: null,
                content: null
            });
        else
            this.setState(prevState => ({
                select_template: template_id,
                content: select.templates.find(x => x.template_id === template_id).content,
                formErrors: {
                    ...prevState.formErrors,
                    content: ""
                }
            }));
    };

    handleMessagesStep = () => {
        const { when, content, contentType, person, formErrors } = this.state;
        let required = {
            when: when,
            content: content,
            person: person,
            formErrors: formErrors
        };

        if (formValid(required)) {
            this.setState({ messagesStepError: false });
            this.handleNextStep(0);
        } else {
            this.setState(prevState => ({
                messagesStepError: true,
                formErrors: {
                    ...prevState.formErrors,
                    content: contentType === "-1" ? (content ? "" : "is-invalid") : ""
                }
            }));
        }
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

    handleSendTestMessage = () => {
        const { uid, employee, selectSender, content, sender } = this.state;
        if (selectSender === 0) {
            this.setState({ loadingTestButton: "btn-loading" });
            SendTestMessages({
                uid: uid,
                to: uid,
                sender: sender,
                content: content
            }).then(response => {
                this.setState({ loadingTestButton: "" });
                $("#sendTestMessageModal").modal("hide");
            });
        } else if (selectSender === 1 && employee) {
            this.setState({ loadingTestButton: "btn-loading" });
            SendTestMessages({
                uid: uid,
                to: employee.value,
                sender: sender,
                content: content
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

    useAndEditTemplate = content => {
        this.setState({ contentType: "-1", content: content, select_template: null });
        $('[data-toggle="popover"]').popover("hide");
    };

    listPlayers = () => {
        try {
            const { select } = this.state;
            if (select.players) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        persons: select.players
                    }
                }));
            } else {
                ListPlayers().then(response => this.dataCollection(response, "players"));
            }
        } catch (e) {}
    };

    listParents = () => {
        try {
            const { select } = this.state;
            if (select.parents) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        persons: select.parents
                    }
                }));
            } else {
                ListParents().then(response => this.dataCollection(response, "parents"));
            }
        } catch (e) {}
    };

    listEmployees = () => {
        try {
            const { select } = this.state;
            if (select.employees) {
                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        persons: select.employees
                    }
                }));
            } else {
                ListEmployees().then(response => this.dataCollection(response, "employees"));
            }
        } catch (e) {}
    };

    listMessageTemplates = () => {
        const { select } = this.state;
        if (!select.templates || (select.templates && select.templates.length === 0)) {
            this.setState({ loadingTemplates: true });
            ListMessageTemplates().then(response => {
                if (response) {
                    if (response.status.code === 1020)
                        this.setState(prevState => ({
                            select: {
                                ...prevState.select,
                                templates: response.data
                            },
                            loadingTemplates: null
                        }));
                }
            });
        }
    };

    dataCollection = (response, type) => {
        const { to } = this.state;
        if (response) {
            const status = response.status;
            if (status.code === 1020) {
                const data = response.data;
                const persons = [];

                data.map(el => {
                    let persondata = { ...el };
                    delete persondata.uid;

                    persons.push({
                        value: el.uid,
                        label: fullnameGenerator(el.name, el.surname),
                        ...persondata,
                        isDisabled: el.recipient_parent_id === -1 ? true : false
                    });
                });

                const thisperson = persons.find(x => x.value === to) || null;
                const recipient_data = thisperson
                    ? thisperson.recipient_parent_id > 0
                        ? thisperson.parents.find(x => x.parent_id === thisperson.recipient_parent_id)
                        : null
                    : null;

                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        [type]: persons,
                        persons: persons
                    },
                    person: thisperson,
                    recipient: thisperson
                        ? {
                              ...thisperson,
                              fullname: recipient_data
                                  ? fullnameGenerator(recipient_data.name, recipient_data.surname)
                                  : thisperson.label,
                              kinship: recipient_data ? recipient_data.kinship : "Kendisi",
                              phone: recipient_data ? recipient_data.phone : thisperson.phone,
                              email: recipient_data ? recipient_data.email : thisperson.email
                          }
                        : null
                }));
            }
        }
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

    activateTemplates = () => {
        this.setState({ loadingButton: "btn-loading" });
        ActivateMessageTemplate().then(response => {
            if (response) {
                if (response.status.code === 1020) this.listMessageTemplates();
            }
        });
    };

    selectedTemplate = () => {
        const { select_template, select, content } = this.state;
        let template = select_template
            ? select.templates.find(x => x.template_id === select_template)
            : {
                  color: "orange",
                  icon: "fa fa-star",
                  template_name: "Özel Mesaj",
                  content: content
              };
        return (
            <div className="form-group">
                <label className="form-label">Seçili Şablon/Özel Mesaj</label>
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
    };

    deliveryCost = () => {
        const { content } = this.state;
        const template_cost = this.checkMessageCost(content) * 1;
        return (
            <div className="form-group">
                <label className="form-label">Gönderim Maliyeti</label>
                {template_cost}
            </div>
        );
    };

    deliveryRecipient = () => {
        const { person, personType, to } = this.state;
        return (
            <div className="form-group">
                <label className="form-label">Gönderim Yapılacak Kişi</label>
                <div className="tags">
                    <Link to={`/app/${personType}s/detail/${to}`} target="_blank" className="tag">
                        {person.label}
                    </Link>
                </div>
            </div>
        );
    };

    summaryReport = () => {
        const { when, person, content, school_fees, start } = this.state;
        let cost = this.checkMessageCost(content) * 1;
        return (
            <div className="form-group">
                <label className="form-label">Özet Rapor</label>
                <div className="alert alert-info alert-icon">
                    <i className="fe fe-align-left mr-2"></i>
                    <p>
                        <strong>{person.label}</strong> adlı kişiye
                        <strong> {formatDate(when, "DD MMMM YYYY, HH:mm")} </strong>tarihinde mesaj (SMS) gönderimi
                        yapılacaktır.
                        <br />
                        Mesajın birim maliyeti
                        <strong> {cost} </strong>
                        olup, bakiyenizden
                        <strong> {cost} </strong>
                        hak düşürülecektir.
                    </p>
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
                        <strong>{start.settings.sms_free_balance - cost}</strong>
                        <br />
                        Gönderim Sonrası SMS Paketi Bakiyesi: <strong>{this.getExtraSMS(school_fees)}</strong>
                    </p>
                </div>
            </div>
        );
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

    previewMessage = margin => {
        const { content, start, when } = this.state;
        return (
            <div className={"card bg-indigo-lighter " + (margin ? "mb-0" : "")}>
                <div className="card-body text-indigo p-125">
                    <div className="row gutters-sm">
                        <div className="col">
                            <span className="float-right">{formatDate(when, "HH:mm")}</span>
                            <div className="text-h3 font-weight-600">+90 (850) 305 52 15</div>
                            <div>{start.settings.sender_name},</div>
                            <div className="mt-3">{content}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    renderToContentType = () => {
        const {
            contentType,
            contentLength,
            content,
            cost,
            select,
            select_template,
            loadingTemplates,
            loadingButton,
            formErrors
        } = this.state;
        switch (contentType) {
            case "0":
                return (
                    <>
                        <div className="hr-text">Şablon Seç</div>
                        <div className="row row-deck gutters-sm">
                            {select.templates ? (
                                select.templates.length > 0 ? (
                                    select.templates.map((el, key) => {
                                        return (
                                            <div className="col-lg-2 col-md-3 col-sm-6" key={key.toString()}>
                                                <div
                                                    data-placement="top"
                                                    data-toggle="popover"
                                                    data-content={`<p><strong>Şablon İçeriği</strong></p>${el.content}`}
                                                    className={`card cursor-pointer ${
                                                        select_template === el.template_id ? "card-active" : ""
                                                    }`}>
                                                    <div
                                                        className="card-body text-center p-4"
                                                        onClick={() => this.handleTemplateCard(el.template_id)}>
                                                        {el.default ? (
                                                            <div
                                                                data-toggle="tooltip"
                                                                title="Varsayılan Şablon"
                                                                className="d-flex justify-content-start align-items-center p-2"
                                                                style={{
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    left: 0
                                                                }}>
                                                                <i className="fa fa-star text-info small font-weight-600" />
                                                            </div>
                                                        ) : null}
                                                        <div
                                                            className={`icon-placeholder icon-placeholder-sm bg-${el.color}-lightest`}>
                                                            <i className={el.icon + " text-" + el.color} />
                                                        </div>

                                                        <div className="small font-weight-600 mt-3">
                                                            {el.template_name}
                                                        </div>
                                                        <div className="small text-muted">
                                                            Karakter Sayısı: {this.getMessageLength(el.content)}
                                                        </div>
                                                        <div className="small text-muted">
                                                            Maliyet: {this.checkMessageCost(el.content)}
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={{
                                                            borderTopRightRadius: 0,
                                                            borderTopLeftRadius: 0,
                                                            position: "relative",
                                                            zIndex: 2
                                                        }}
                                                        type="button"
                                                        onClick={() => this.useAndEditTemplate(el.content)}
                                                        className="btn btn-sm btn-primary">
                                                        Özelleştir
                                                    </button>
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
                            ) : null}
                            {loadingTemplates ? <div className="loader m-auto" /> : null}
                        </div>
                    </>
                );
            case "-1":
                return (
                    <>
                        <div className="hr-text">Özel Mesaj Oluştur</div>
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
                        <div className="row row-deck gutters-sm">
                            <div className="col-lg-6 col-md-6 mb-lg-0 mb-md-0 mb-3">
                                <textarea
                                    className={`form-control resize-none ${formErrors.content}`}
                                    name="content"
                                    placeholder="Mesaj İçeriği..."
                                    onChange={this.handleChange}
                                    value={content || ""}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="alert mb-0 alert-info">
                                    <p>
                                        Mesaj içeriğinde Türkçe karakter içeren harf bulunuyorsa karakter hesaplamada
                                        <strong> 2 karakter</strong> harcar.
                                        <br /> Sistemdeki Türkçe karakterler:<strong> ç, ğ, ı, ş, Ğ, İ, Ş</strong>
                                    </p>
                                    Mesaj karakterlerini ve Maliyeti, <span className="form-help mx-1 bg-dark">?</span>{" "}
                                    kısmından görüntüleyebilirsiniz.
                                </div>
                            </div>
                        </div>
                    </>
                );

            default:
                break;
        }
    };

    messagesStep = () => {
        const {
            personType,
            dateError,
            when,
            messagesStepError,
            contentType,
            select,
            person,
            recipient,
            formErrors
        } = this.state;
        return (
            <>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="hr-text mt-0">Kişi Türü Seç</div>
                            <div className="selectgroup w-100">
                                {CheckPermissions(["p_read"]) && (
                                    <label className="selectgroup-item">
                                        <input
                                            className="selectgroup-input"
                                            type="radio"
                                            name="personType"
                                            value="player"
                                            checked={personType === "player"}
                                            onChange={this.handlePersonType}
                                        />
                                        <span className="selectgroup-button">Öğrenci</span>
                                    </label>
                                )}
                                {CheckPermissions(["p_read"]) && (
                                    <label className="selectgroup-item">
                                        <input
                                            className="selectgroup-input"
                                            type="radio"
                                            name="personType"
                                            value="parent"
                                            checked={personType === "parent"}
                                            onChange={this.handlePersonType}
                                        />
                                        <span className="selectgroup-button">Veli</span>
                                    </label>
                                )}
                                {CheckPermissions(["e_read"]) && (
                                    <label className="selectgroup-item">
                                        <input
                                            className="selectgroup-input"
                                            type="radio"
                                            name="personType"
                                            value="employee"
                                            checked={personType === "employee"}
                                            onChange={this.handlePersonType}
                                        />
                                        <span className="selectgroup-button">Personel</span>
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="hr-text">{personTypeToText[personType]} Seç</div>
                            <Select
                                value={person}
                                onChange={val => this.handleSelect(val, "person")}
                                options={select.persons}
                                name="person"
                                placeholder={personTypeToText[personType] + " Seç..."}
                                styles={selectCustomStyles}
                                autoSize
                                isSearchable={true}
                                isDisabled={select.persons ? false : true}
                                isLoading={select.persons ? false : true}
                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                            />
                        </div>
                        {recipient ? (
                            <div className="col-lg-12">
                                <div className="hr-text">Alıcı Bilgisi</div>
                                <div className="card mb-0">
                                    <div className="card-body">
                                        <div className="row row-sm align-items-center">
                                            <div className="col">
                                                <h4 className="mb-0">{recipient.fullname}</h4>
                                                <div className="text-muted text-h5">{recipient.kinship}</div>
                                            </div>
                                            <div className="col-auto leading-none align-self-start">
                                                <span className="badge badge-info">ONAYLI</span>
                                            </div>
                                        </div>
                                        <div className="row row-sm align-items-center mt-3">
                                            <div className="col-sm-6 col-lg-3 mb-4 mb-lg-0 mb-md-0 mb-sm-0">
                                                <label className="form-label">Telefon</label>
                                                {formatPhone(recipient.phone)}
                                            </div>
                                            <div className="col-auto">
                                                <label className="form-label">Email</label>
                                                {nullCheck(recipient.email)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {recipient ? (
                            <div className="col-lg-12">
                                <div className="hr-text">Şablon Seç / Özel Mesaj Oluştur</div>
                                <div className="selectgroup w-100">
                                    <label className="selectgroup-item">
                                        <input
                                            className="selectgroup-input"
                                            type="radio"
                                            name="contentType"
                                            value="-1"
                                            checked={contentType === "-1"}
                                            onChange={this.handleContentType}
                                        />
                                        <span className="selectgroup-button">Özel Mesaj Oluştur</span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input
                                            className="selectgroup-input"
                                            type="radio"
                                            name="contentType"
                                            value="0"
                                            checked={contentType === "0"}
                                            onChange={this.handleContentType}
                                        />
                                        <span className="selectgroup-button">Şablon Seç</span>
                                    </label>
                                </div>
                                {this.renderToContentType()}
                            </div>
                        ) : null}

                        <div className="col-lg-12">
                            <div className="hr-text">Tarih Seç</div>
                            <div className="form-group">
                                <label className="form-label">
                                    Gönderim Tarihi <span className="form-required">*</span>
                                </label>
                                <DatePicker
                                    autoComplete="off"
                                    selected={when}
                                    selectsEnd
                                    name="when"
                                    locale="tr"
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                    showTimeInput
                                    timeInputLabel="Saat: "
                                    onChange={date => this.handleDate(date, "when")}
                                    className={`form-control ${formErrors.when}`}
                                />
                            </div>
                            {dateError ? (
                                <div className="alert alert-warning alert-icon">
                                    <i className="fe fe-alert-circle mr-2"></i>
                                    <p>
                                        <strong>Geçmiş Tarih Uyarısı</strong>
                                    </p>
                                    Geçmiş zamanlı bir tarih seçtiniz, mesaj anında gönderilecektir!
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                    {messagesStepError ? (
                        <div className="text-danger d-flex align-items-center">
                            <i className="fe fe-alert-circle mr-1"></i>Ayarlarınızı tamamlamalısınız!
                        </div>
                    ) : null}
                    <button
                        type="button"
                        onClick={this.handleMessagesStep}
                        className="btn btn-success btn-icon ml-auto">
                        Devam Et<i className="fa fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </>
        );
    };

    sendPreviewStep = () => {
        const { start, school_fees, all_time_messages, loadingButton } = this.state;
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
                        onClick={() => this.handlePrevStep(1)}
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
                        <button
                            type="button"
                            onClick={this.handleSubmit}
                            className={`btn btn-success btn-icon ${loadingButton}`}>
                            Onayla ve Gönder<i className="fa fa-check ml-2"></i>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    //Send Test Message
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

    render() {
        const { steps } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Tekli Mesaj Oluştur</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages/select"}>
                        Mesaj Tipi Seçme Ekranına Geri Dön
                    </Link>
                </div>
                {CheckPermissions(["p_read", "e_read"], "||") ? (
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
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <NotPermissions
                                title="Üzgünüz 😣"
                                imageAlt="Yetersiz Yetki"
                                content={() => (
                                    <p className="text-muted text-center">
                                        Tekil Mesaj oluşturabilmek için öğrencileri, velileri veya personelleri
                                        görüntüleme yetkinizin olması gerekiyor.
                                        <br />
                                        Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime
                                        geçiniz...
                                    </p>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default SingleAdd;
