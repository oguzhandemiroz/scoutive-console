import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
    ListMessageTemplates,
    ActivateMessageTemplate,
    ListStaticSegments,
    CreateSegment,
    SendTestMessages,
    CreateCampaign
} from "../../services/Messages";
import sms_activate_image from "../../assets/images/illustrations/sms_activate.svg";
import SmsUsage from "../Pages/Settings/UsageDetail/SmsUsage";
import moment from "moment";
import _ from "lodash";
import Select, { components } from "react-select";
import { formValid, selectCustomStyles, selectCustomStylesError } from "../../assets/js/core";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import { formatDate, formatPhone, fullnameGenerator, CheckPermissions } from "../../services/Others";
import { GetSettings, GetSchoolFees } from "../../services/School";
import NotPermissions from "../../components/NotActivate/NotPermissions";
import { MessagesAllTime } from "../../services/Report";
import { ListEmployees } from "../../services/Employee";
import { Groups } from "../../services/FillSelect";
const $ = require("jquery");
registerLocale("tr", tr);

const initialState = {
    title: null,
    end_date: moment()
        .add("years", 1)
        .toDate(),
    repeat: false,
    status: "(0)",
    is_trial: false,
    is_active: {
        value: 1,
        label: "Kaydı Aktif"
    },
    passed_day: 3,
    working_days: [0, 1, 2, 3, 4, 5, 6],
    groups: [],
    segment_id: null
};

export class RecurringAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            sid: localStorage.getItem("sID"),
            ...initialState,
            when: new Date(),
            steps: [
                {
                    key: "0",
                    name: "Segment",
                    title: "Segment Belirle",
                    active: true,
                    components: () => this.segmentStep()
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
                    name: "Onayla ve Gönder",
                    title: "Onayla ve Gönder",
                    active: false,
                    components: () => this.sendPreviewStep()
                }
            ],
            sender: "8503055215",
            segments: null,
            templates: null,
            selected_segment: null,
            select_template: null,
            loadingButton: "",
            loadingTestButton: "",
            formErrors: {
                when: "",
                title: "",
                employee: "",
                passed_day: ""
            },
            select: {
                is_active: [
                    {
                        value: -1,
                        label: "Tüm Kayıtlar"
                    },
                    {
                        value: 0,
                        label: "Pasif Kayıtlar"
                    },
                    {
                        value: 1,
                        label: "Aktif Kayıtlar"
                    },
                    {
                        value: 2,
                        label: "Dondurulmuş Kayıtlar"
                    }
                ],
                employees: null,
                groups: null
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
        if (CheckPermissions(["m_write"])) {
            this.listStaticSegments();
        }
    }

    handleSendTestMessage = () => {
        const { uid, employee, selectSender, select_template, templates, sender } = this.state;
        let template = templates.find(x => x.template_id === select_template);
        if (selectSender === 0) {
            this.setState({ loadingTestButton: "btn-loading" });
            SendTestMessages({
                uid: uid,
                to: uid,
                sender: sender,
                content: template.content
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
                content: template.content
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

    handleSubmit = () => {
        const { uid, title, select_template, when, end_date, segment_id, working_days } = this.state;
        this.setState({ loadingButton: "btn-loading" });
        CreateCampaign({
            uid: uid,
            title: title,
            person_type: 1,
            segment_id: segment_id,
            persons: null,
            template_id: select_template,
            working_days: working_days,
            when: formatDate(when, "YYYY-MM-DD HH:mm:00"),
            end_date: formatDate(end_date, "YYYY-MM-DD ") + formatDate(when, "HH:mm:00")
        }).then(response => {
            if (response) {
                if (response.status.code === 1021) {
                    this.props.history.push("/app/messages/detail/" + response.campaign_id);
                }
            }
            this.setState({ loadingButton: "" });
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

    handleCheck = e => {
        const { name, checked } = e.target;
        this.setState({ [name]: checked });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        const { select, uid } = this.state;
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

    handleSegmentStep = () => {
        const {
            uid,
            sid,
            selected_segment,
            segments,
            title,
            when,
            is_trial,
            is_active,
            status,
            passed_day,
            groups
        } = this.state;
        const required = {
            title: title,
            when: when
        };

        const values = {
            school_id: parseInt(sid),
            is_trial: is_trial ? 1 : 0,
            is_active: is_trial ? 1 : is_active.value === -1 ? "(0,1,2)" : `(${is_active.value})`
        };

        if (selected_segment === 1) {
            values.passed_day = 0;
        }
        if (selected_segment === 3) {
            values.status = status;
        }

        if (selected_segment === 4) {
            required.passed_day = passed_day;
            values.passed_day = passed_day;
        }
        if (selected_segment === 5) {
            required.groups = groups;
            values.group_id = `(${groups.map(x => x.value).join(",")})`;
        }

        if (selected_segment && formValid(required)) {
            this.setState({ loadingButton: "btn-loading" });
            CreateSegment({
                uid: uid,
                segment_name:
                    segments.find(x => x.static_segment_id === selected_segment).segment_name +
                    " - " +
                    moment(when).format("DDMMYY"),
                static_segment_id: selected_segment,
                values: values
            }).then(response => {
                if (response) {
                    if (response.status.code === 1021) {
                        this.handleNextStep(0);
                        this.listMessageTemplates();
                        this.setState({ segment_id: response.segment_id });
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            console.error("HATA");
        }
    };

    handleTemplatesStep = () => {
        const { select_template } = this.state;
        if (select_template) {
            this.handleNextStep(1);
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
    };

    handleTemplateCard = template_id => {
        const { select_template } = this.state;
        if (select_template === template_id) this.setState({ select_template: null });
        else this.setState({ select_template: template_id });
    };

    handleWorkDays = e => {
        const { name, value, checked } = e.target;
        const { working_days } = this.state;
        if (working_days.indexOf(parseInt(value)) > -1) {
            this.setState({ working_days: working_days.filter(x => x !== parseInt(value)) });
        } else {
            this.setState(prevState => ({ working_days: [...prevState.working_days, parseInt(value)] }));
        }
    };

    segmentStep = () => {
        const { segments, selected_segment, loadingButton, title, when, formErrors, end_date } = this.state;
        return (
            <>
                <div className="card-body pb-2">
                    <div className="hr-text mt-0">Hazır Segmentler</div>
                    <div className="row row-deck">
                        {segments ? (
                            segments.map(el => {
                                return (
                                    <div className="col-lg-3 col-md-6" key={el.static_segment_id.toString()}>
                                        <div
                                            onClick={() => this.selectSegment(el.static_segment_id)}
                                            className={`card cursor-pointer ${
                                                el.static_segment_id === selected_segment ? "card-active" : ""
                                            }`}>
                                            <div className="card-body text-center p-125">
                                                <div className="icon-placeholder bg-gray-lightest">
                                                    <i className={el.icon + " text-gray"}></i>
                                                </div>
                                                <h5 className="mt-3">{el.segment_name}</h5>
                                                <p className="text-muted">{el.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="loader mx-auto mb-5" />
                        )}
                    </div>
                    {selected_segment ? (
                        <>
                            <div className="hr-text mt-0">Segment ve Mesaj Ayarları</div>
                            <div className="row gutters-xs">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Mesaj Adı<span className="form-required">*</span>
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
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Gönderi Başlama Tarihi <span className="form-required">*</span>
                                        </label>
                                        <DatePicker
                                            autoComplete="off"
                                            selected={when}
                                            dateFormat="dd MMMM yyyy"
                                            name="when"
                                            locale="tr"
                                            onChange={date => this.handleDate(date, "when")}
                                            className={`form-control ${formErrors.when}`}
                                        />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Gönderim Saati <span className="form-required">*</span>
                                        </label>
                                        <DatePicker
                                            autoComplete="off"
                                            selected={when}
                                            name="when"
                                            locale="tr"
                                            dateFormat="HH:mm"
                                            onChange={date => this.handleDate(date, "when")}
                                            className={`form-control ${formErrors.when}`}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={5}
                                            timeCaption="Saat"
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Gönderi Sonlanma Tarihi <span className="form-required">*</span>
                                        </label>
                                        <DatePicker
                                            autoComplete="off"
                                            selected={end_date}
                                            dateFormat="dd MMMM yyyy"
                                            name="end_date"
                                            locale="tr"
                                            onChange={date => this.handleDate(date, "end_date")}
                                            className={`form-control ${formErrors.end_date}`}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">{this.renderWorkingDays()}</div>
                            </div>
                            <div className="row gutters-xs">
                                {this.renderSegmentSettings()}
                                <div className="col-lg -12">
                                    <div className="alert alert-warning alert-icon">
                                        <i className="fe fe-alert-triangle mr-2" aria-hidden="true"></i>
                                        Gönderim yapılan kişilere <u>tekrardan gönderim yapmaz.</u>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
                <div className="card-footer d-flex justify-content-between">
                    {selected_segment ? null : (
                        <div className="text-danger d-flex align-items-center">
                            <i className="fe fe-alert-circle mr-1"></i>Segment Belirlemelisiniz
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={this.handleSegmentStep}
                        className={`btn btn-success btn-icon ml-auto ${loadingButton}`}>
                        Devam Et<i className="fa fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </>
        );
    };

    renderSegmentSettings = () => {
        const {
            segments,
            selected_segment,
            when,
            end_date,
            is_active,
            select,
            is_trial,
            passed_day,
            formErrors,
            working_days,
            groups
        } = this.state;
        const segmentName = segments.find(x => x.static_segment_id === selected_segment).segment_name;
        switch (selected_segment) {
            case 1:
                return (
                    <>
                        <div className="col-lg-12">
                            <div className="hr-text">{segmentName} Segmenti Ayarları</div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Kayıt Tipi</label>
                                <div className="selectgroup selectgroup-vertical w-100">
                                    <label className="selectgroup-item">
                                        <input
                                            className="selectgroup-input"
                                            type="checkbox"
                                            name="is_trial"
                                            value="1"
                                            checked={is_trial}
                                            onChange={this.handleCheck}
                                        />
                                        <span className="selectgroup-button">Ön Kayıt Öğrencisi</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {is_trial ? null : (
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <label className="form-label">Kayıt Durumu</label>
                                    <Select
                                        value={is_active}
                                        onChange={val => this.handleSelect(val, "is_active")}
                                        name="is_active"
                                        styles={selectCustomStyles}
                                        options={select.is_active}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="col-lg-12">
                            <div className="hr-text">Uyarılar</div>
                            <div className="alert alert-info alert-icon">
                                <i className="fe fe-check mr-2" aria-hidden="true"></i>
                                <strong>{segmentName}</strong> segmenti seçilmiş olup bu mesaj
                                <strong>
                                    {is_trial ? " Ön Kayıt Öğrencilerine" : " " + is_active.label + " Öğrencilere"}
                                </strong>
                                , haftada {working_days.length} gün çalışacak şekilde yeni kayıtlara{" "}
                                <strong> {formatDate(when, "DD MMMM YYYY")}</strong> tarihinden{" "}
                                <strong> {formatDate(end_date, "DD MMMM YYYY")}</strong> tarihine kadar saat
                                <strong> {formatDate(when, "HH:mm")}</strong>'de/da gönderim yapacaktır.
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="col-lg-12">
                            <div className="hr-text">{segmentName} Segmenti Ayarları</div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Kayıt Durumu</label>
                                <Select
                                    value={is_active}
                                    onChange={val => this.handleSelect(val, "is_active")}
                                    name="is_active"
                                    styles={selectCustomStyles}
                                    options={select.is_active}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="hr-text">Uyarılar</div>
                            <div className="alert alert-info alert-icon">
                                <i className="fe fe-check mr-2" aria-hidden="true"></i>
                                <strong>{segmentName}</strong> segmenti seçilmiş olup bu mesaj
                                <strong>
                                    {is_trial ? " Ön Kayıt Öğrencilerine" : " " + is_active.label + " Öğrencilere"}
                                </strong>
                                , haftada {working_days.length} gün çalışacak şekilde doğum günü olanlara{" "}
                                <strong> {formatDate(when, "DD MMMM YYYY")}</strong> tarihinden{" "}
                                <strong> {formatDate(end_date, "DD MMMM YYYY")}</strong> tarihine kadar saat
                                <strong> {formatDate(when, "HH:mm")}</strong>'de/da gönderim yapacaktır.
                            </div>
                        </div>
                    </>
                );
            case 3:
                return (
                    <div className="col-lg-12">
                        <div className="hr-text">Uyarılar</div>
                        <div className="alert alert-info alert-icon">
                            <i className="fe fe-check mr-2" aria-hidden="true"></i>
                            <strong>{segmentName}</strong> segmenti seçilmiş olup bu mesaj
                            <strong> devamsızlık yapan (okula/kursa gelmeyen)</strong> öğrencilere, haftada{" "}
                            {working_days.length} gün çalışacak şekilde{" "}
                            <strong> {formatDate(when, "DD MMMM YYYY")}</strong> tarihinden{" "}
                            <strong> {formatDate(end_date, "DD MMMM YYYY")}</strong> tarihine kadar saat
                            <strong> {formatDate(when, "HH:mm")}</strong>'de/da gönderim yapacaktır.
                        </div>
                    </div>
                );
            case 4:
                return (
                    <>
                        <div className="col-lg-12">
                            <div className="hr-text">{segmentName} Segmenti Ayarları</div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Kaç Gün Gecikmiş?
                                    <span className="form-required">*</span>
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
                                <input
                                    className={`form-control ${formErrors.passed_day}`}
                                    type="number"
                                    min="1"
                                    name="passed_day"
                                    value={passed_day}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Kayıt Durumu</label>
                                <Select
                                    value={is_active}
                                    onChange={val => this.handleSelect(val, "is_active")}
                                    name="is_active"
                                    styles={selectCustomStyles}
                                    options={select.is_active}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="hr-text">Uyarılar</div>
                            <div className="alert alert-info alert-icon">
                                <i className="fe fe-check mr-2" aria-hidden="true"></i>
                                <strong>{segmentName}</strong> segmenti seçilmiş olup bu mesaj, ödemesini{" "}
                                <strong>{passed_day}</strong> gün geciktirmiş öğrencilere, haftada {working_days.length}{" "}
                                gün çalışacak şekilde <strong> {formatDate(when, "DD MMMM YYYY")}</strong> tarihinden{" "}
                                <strong> {formatDate(end_date, "DD MMMM YYYY")}</strong> tarihine kadar saat
                                <strong> {formatDate(when, "HH:mm")}</strong>'de/da gönderim yapacaktır.
                            </div>
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <div className="col-lg-12">
                            <div className="hr-text">{segmentName} Segmenti Ayarları</div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">Kayıt Durumu</label>
                                <Select
                                    value={is_active}
                                    onChange={val => this.handleSelect(val, "is_active")}
                                    name="is_active"
                                    styles={selectCustomStyles}
                                    options={select.is_active}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label className="form-label">
                                    Grup(lar)
                                    <span className="form-required">*</span>
                                </label>
                                <Select
                                    value={groups}
                                    isMulti
                                    onChange={val => this.handleSelect(val, "groups")}
                                    options={select.groups}
                                    name="groups"
                                    placeholder="Seç..."
                                    styles={formErrors.groups ? selectCustomStylesError : selectCustomStyles}
                                    isClearable={true}
                                    isSearchable={true}
                                    isDisabled={select.groups ? false : true}
                                    isLoading={select.groups ? false : true}
                                    noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="hr-text">Uyarılar</div>
                            <div className="alert alert-info alert-icon">
                                <i className="fe fe-check mr-2" aria-hidden="true"></i>
                                <strong>{segmentName}</strong> segmenti seçilmiş olup bu mesaj
                                <strong> seçili olan gruplara</strong>, haftada {working_days.length} gün çalışacak
                                şekilde
                                <strong> {formatDate(when, "DD MMMM YYYY")}</strong> tarihinden{" "}
                                <strong> {formatDate(end_date, "DD MMMM YYYY")}</strong> tarihine kadar saat
                                <strong> {formatDate(when, "HH:mm")}</strong>'de/da gönderim yapacaktır.
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    renderWorkingDays = () => {
        const { working_days } = this.state;
        const weekdays = moment.weekdays();
        return (
            <div className="form-group">
                <label className="form-label">Mesaj Çalışma Günleri</label>
                <div className="selectgroup selectgroup-pills">
                    {weekdays.map((el, key) => (
                        <label className="selectgroup-item" key={key.toString()}>
                            <input
                                type="checkbox"
                                name="working_days"
                                value={key}
                                className="selectgroup-input"
                                onChange={this.handleWorkDays}
                                checked={working_days.indexOf(key) > -1 ? true : false}
                            />
                            <span className="selectgroup-button">{el}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    templatesStep = () => {
        const { templates, select_template, loadingButton } = this.state;
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
                                                                left: 0
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
                                <div className="col-lg-6">{this.deliveryCost()}</div>
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
                        onClick={() => this.handlePrevStep(2)}
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
        const { select_template, templates } = this.state;
        return (
            <div className="form-group">
                <label className="form-label">Gönderim Maliyeti (Birim)</label>~
                {templates
                    ? this.checkMessageCost(templates.find(x => x.template_id === select_template).content)
                    : "1"}
            </div>
        );
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
        const { when, select_template, working_days, templates } = this.state;
        if (templates) {
            let template = templates.find(x => x.template_id === select_template);
            let cost = this.checkMessageCost(templates.find(x => x.template_id === select_template).content);
            return (
                <div className="form-group">
                    <label className="form-label">Özet Rapor</label>
                    <div className="alert alert-info alert-icon">
                        <i className="fe fe-align-left mr-2"></i>
                        <p>
                            Haftada {working_days.length} gün çalışacak şekilde saat
                            <strong> {formatDate(when, "HH:mm")} </strong>'de/da
                            <strong> {template.template_name} </strong> adlı şablon ile mesaj (SMS) gönderimi
                            yapılacaktır.
                            <br />
                            Her gönderim için mesajın birim maliyeti yaklaşık
                            <strong> {cost} </strong>
                            olup, bakiyenizden otomatik olarak düşülecektir.
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

    selectSegment = k => {
        const { segments, when } = this.state;
        if (k === 5) this.listGroups();
        this.setState({
            ...initialState,
            selected_segment: k,
            title: segments.find(x => x.static_segment_id === k).segment_name + " - " + moment(when).format("DDMMYY")
        });
    };

    listGroups = () => {
        const { select } = this.state;
        if (!select.groups) {
            Groups().then(response => {
                if (response) {
                    this.setState(prevState => ({
                        select: {
                            ...prevState.select,
                            groups: response
                        }
                    }));
                }
            });
        }
    };

    listMessageTemplates = () => {
        ListMessageTemplates().then(response => {
            if (response) {
                if (response.status.code === 1020) this.setState({ templates: response.data });
            }
        });
    };

    listStaticSegments = () => {
        ListStaticSegments().then(response => {
            if (response) {
                if (response.status.code === 1020) this.setState({ segments: response.data });
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

    activateTemplates = () => {
        this.setState({ loadingButton: "btn-loading" });
        ActivateMessageTemplate().then(response => {
            if (response) {
                if (response.status.code === 1020) this.listMessageTemplates();
            }
        });
    };

    render() {
        const { steps, segments, selected_segment } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Otomatik (Tekrarlayan) Mesaj Oluştur</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/messages/select"}>
                        Mesaj Tipi Seçme Ekranına Geri Dön
                    </Link>
                </div>
                {CheckPermissions(["m_read", "m_write"]) ? (
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
                                    <h3 className="card-title">
                                        {steps.find(x => x.active).title}
                                        {segments && selected_segment
                                            ? " — #" +
                                              segments.find(x => x.static_segment_id === selected_segment).segment_name
                                            : ""}
                                    </h3>
                                </div>
                                {steps.find(x => x.active).components()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <NotPermissions
                        title="Üzgünüz 😣"
                        imageAlt="Yetersiz Yetki"
                        content={() => (
                            <p className="text-muted text-center">
                                Otomatik (Tekrarlayan) Mesaj oluşturabilmek için yetkiniz bulunmamaktadır.
                                <br />
                                Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime
                                geçiniz...
                            </p>
                        )}
                    />
                )}
            </div>
        );
    }
}

export default withRouter(RecurringAdd);
