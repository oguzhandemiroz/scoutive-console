import React, { Component } from "react";
import Select, { components } from "react-select";
import { Areas, GetEmployees } from "../../services/FillSelect";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../assets/js/core";
import { avatarPlaceholder, formatDate, fullnameGenerator, nullCheck } from "../../services/Others";
import { ListPlayers } from "../../services/Player";
import { CreateGroup, DetailGroup, ChangeGroup, UpdateGroup } from "../../services/Group";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import Inputmask from "inputmask";
const $ = require("jquery");

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Öğrenci" },
    1: { bg: "bg-success", title: "Aktif Öğrenci" },
    2: { bg: "bg-azure", title: "Donuk Öğrenci" }
};

Inputmask.extendDefaults({
    autoUnmask: true
});

const InputmaskDefaultOptions = {
    showMaskOnHover: false,
    showMaskOnFocus: false,
    placeholder: ""
};

const { Option } = components;
const ImageOptionEmployee = props => (
    <Option {...props}>
        {props.data.label}
        <div className="small text-muted mt-1">
            Pozisyon: <b className="text-blue">{props.data.position}</b>
        </div>
    </Option>
);

export class Edit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            gid: parseInt(this.props.match.params.gid),
            add: [],
            remove: [],
            work_days: [],
            select: {
                employees: null,
                areas: null,
                players: null,
                initialPlayers: null
            },
            formErrors: {
                name: "",
                start_time: "",
                end_time: "",
                start_age: "",
                end_age: "",
                employee: ""
            },
            loading: "active",
            loadingButton: ""
        };
    }

    fieldMasked = () => {
        try {
            const elemArray = {
                start_time: $("[name=start_time]"),
                end_time: $("[name=end_time]")
            };
            Inputmask({ alias: "datetime", inputFormat: "HH:MM", ...InputmaskDefaultOptions }).mask(
                elemArray.start_time
            );
            Inputmask({ alias: "datetime", inputFormat: "HH:MM", ...InputmaskDefaultOptions }).mask(elemArray.end_time);
        } catch (e) {}
    };

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: "hover"
        });
    }

    componentDidMount() {
        this.groupDetail();
        this.getFillSelect();
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            uid,
            gid,
            name,
            work_days,
            start_time,
            end_time,
            employee,
            start_age,
            end_age,
            area,
            add,
            remove
        } = this.state;

        let require = { ...this.state };
        delete require.area;

        if (formValid(require)) {
            this.setState({ loadingButton: "btn-loading" });

            UpdateGroup({
                uid: uid,
                group_id: gid,
                name: name.capitalize(),
                start_time: start_time,
                end_time: end_time,
                employee_id: employee.value,
                age: `${start_age}-${end_age}`,
                area_id: area ? area.value : 1,
                work_days: _.join(work_days, ",")
            }).then(response => {
                if (response) {
                    if (response.status.code === 1022) {
                        const group_id = response.group_id;
                        ChangeGroup({
                            uid: uid,
                            group_id: group_id,
                            add: add,
                            remove: remove
                        }).then(response => {
                            if (response) {
                                const status = response.status;
                                if (status.code === 1022) {
                                    this.props.history.push("/app/groups/detail/" + group_id);
                                }
                            }
                        });
                    }
                }
                this.setState({ loadingButton: "" });
            });
        } else {
            this.setState(prevState => ({
                formErrors: {
                    ...prevState.formErrors,
                    employee: employee ? false : true,
                    name: name ? "" : "is-invalid",
                    start_time: moment(start_time, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless",
                    end_time: moment(end_time, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless",
                    start_age: start_age ? "" : "is-invalid",
                    end_age: end_age ? "" : "is-invalid"
                }
            }));
        }
    };

    handleChange = e => {
        try {
            e.preventDefault();
            const { value, name } = e.target;
            let formErrors = { ...this.state.formErrors };
            switch (name) {
                case "start_time":
                    formErrors[name] = moment(value, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless";
                    break;
                case "end_time":
                    formErrors[name] = moment(value, "HH:mm", true).isValid("HH:mm") ? "" : "is-invalid-iconless";
                    break;
                default:
                    formErrors[name] = value ? "" : "is-invalid";
                    break;
            }
            this.setState({ formErrors, [name]: value });
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

    handleWorkDays = e => {
        const { name, value, checked } = e.target;
        const { work_days } = this.state;
        if (work_days.indexOf(parseInt(value)) > -1) {
            this.setState({ work_days: work_days.filter(x => x !== parseInt(value)) });
        } else {
            this.setState(prevState => ({ work_days: [...prevState.work_days, parseInt(value)] }));
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

    handleCard = player_id => {
        console.log(player_id);
        const { add, remove } = this.state;
        if (add.indexOf(player_id) > -1) {
            this.setState(prevState => ({
                add: add.filter(x => x !== player_id),
                remove: [...prevState.remove, player_id]
            }));
        } else {
            this.setState(prevState => ({
                remove: remove.filter(x => x !== player_id),
                add: [...prevState.add, player_id]
            }));
        }
    };

    getFillSelect = () => {
        Areas().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    areas: response
                }
            }));
        });

        GetEmployees().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    employees: response
                }
            }));
        });

        ListPlayers().then(response => {
            const { gid } = this.state;
            if (response) {
                const filtered = response.data
                    .filter(x => x.status !== 0)
                    .filter(x => x.groups.filter(y => y.value === gid).length > 0);

                const players = _(filtered)
                    .map("player_id")
                    .value();

                this.setState(prevState => ({
                    select: {
                        ...prevState.select,
                        initialPlayers: response.data.filter(x => x.status !== 0),
                        players: response.data.filter(x => x.status !== 0)
                    },
                    add: players
                }));
            }
        });
    };

    renderGroups = groups => {
        if (groups.length === 0) return null;

        let list_group = "";
        groups.map(i => (list_group += `<div>${i.label}</div>`));
        return (
            <span
                style={{ width: 12, height: 12 }}
                className="icon"
                data-toggle="popover"
                data-content={`
                    <p class="font-weight-600">
                        <span class="badge badge-primary mr-1"></span>Dahil Olduğu Grup(lar)
                    </p>
                    ${list_group}
                `}>
                <i className="fa fa-th" />
            </span>
        );
    };

    renderWorkDays = () => {
        const { work_days } = this.state;
        const weekdays = moment.weekdays();
        return (
            <div className="form-group">
                <label className="form-label">Çalışma Günleri</label>
                <div className="selectgroup selectgroup-pills">
                    {weekdays.map((el, key) => (
                        <label className="selectgroup-item" key={key.toString()}>
                            <input
                                type="checkbox"
                                name="work_days"
                                value={key}
                                className="selectgroup-input"
                                onChange={this.handleWorkDays}
                                checked={work_days.indexOf(key) > -1 ? true : false}
                            />
                            <span className="selectgroup-button">{el}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    groupDetail = () => {
        try {
            const { uid, gid } = this.state;
            DetailGroup({
                uid: uid,
                group_id: gid
            }).then(response => {
                if (response) {
                    const status = response.status;
                    const data = response.data;
                    if (status.code === 1020) {
                        this.setState({
                            ...data,
                            start_time: moment(data.start_time, "HH:mm").format("HH:mm"),
                            end_time: moment(data.end_time, "HH:mm").format("HH:mm"),
                            start_age: data.age.split("-")[0],
                            end_age: data.age.split("-")[1],
                            area: data.area ? { label: data.area.name, value: data.area.area_id } : null,
                            employee: {
                                label: fullnameGenerator(data.employee.name, data.employee.surname),
                                value: data.employee.security_id
                            },
                            loading: ""
                        });
                    }
                    this.fieldMasked();
                }
            });
        } catch (e) {}
    };

    render() {
        const {
            name,
            start_time,
            end_time,
            start_age,
            end_age,
            loading,
            employee,
            area,
            select,
            players,
            loadingButton,
            add,
            formErrors
        } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar &mdash; Grup Oluştur</h1>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Grup Bilgileri</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Grup Adı<span className="form-required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                onChange={this.handleChange}
                                                className={`form-control ${formErrors.name}`}
                                                value={nullCheck(name, "")}
                                            />
                                        </div>
                                        <div className="row gutters-xs">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Başlangıç Saati<span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="start_time"
                                                        className={`form-control ${formErrors.start_time}`}
                                                        placeholder="08:00"
                                                        data-toggle="tooltip"
                                                        title="Antrenman Başlangıç Saati"
                                                        onChange={this.handleChange}
                                                        value={nullCheck(start_time, "")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Bitiş Saati<span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="end_time"
                                                        className={`form-control ${formErrors.end_time}`}
                                                        placeholder="08:30"
                                                        data-toggle="tooltip"
                                                        title="Antrenman Bitiş Saati"
                                                        onChange={this.handleChange}
                                                        value={nullCheck(end_time, "")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                Grup Yaş Aralığı<span className="form-required">*</span>
                                            </label>
                                            <div className="row gutters-xs">
                                                <div className="col">
                                                    <input
                                                        placeholder="Başlangıç"
                                                        type="number"
                                                        min="1980"
                                                        max="2019"
                                                        className={`form-control ${formErrors.start_age}`}
                                                        name="start_age"
                                                        onChange={this.handleChange}
                                                        value={nullCheck(start_age, "")}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input
                                                        placeholder="Bitiş"
                                                        type="number"
                                                        min={start_age || "1981"}
                                                        max="2019"
                                                        className={`form-control ${formErrors.end_age}`}
                                                        name="end_age"
                                                        onChange={this.handleChange}
                                                        value={nullCheck(end_age, "")}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                Sorumlu Antrenör<span className="form-required">*</span>
                                            </label>
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
                                                components={{ Option: ImageOptionEmployee }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Antrenman Sahası</label>
                                            <Select
                                                value={area}
                                                options={select.areas}
                                                isSearchable={true}
                                                isDisabled={select.areas ? false : true}
                                                isLoading={select.areas ? false : true}
                                                placeholder="Seç..."
                                                onChange={val => this.handleSelect(val, "area")}
                                                name="area"
                                                autosize
                                                styles={selectCustomStyles}
                                                noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                            />
                                        </div>

                                        {this.renderWorkDays()}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className={`btn btn-block btn-primary ${loadingButton}`}>
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Öğrenciler</h3>
                                <div className="card-options">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Öğrenci Ara..."
                                        name="search"
                                        onChange={this.handleSearch}
                                    />
                                </div>
                            </div>
                            <div className="alert alert-info card-alert pl-5">
                                <p>
                                    <strong>Öğrenci Seçmeyi Unutma!</strong>
                                </p>
                                Grubun bilgilerini girdikten sonra aşağıdan gruba eklenecek öğrencileri seçebilirsiniz.
                            </div>
                            <div className="card-body pb-0">
                                <div className="row row-cards row-deck">
                                    {select.initialPlayers ? (
                                        select.initialPlayers.length > 0 ? (
                                            select.initialPlayers.map(el => (
                                                <div className="col-lg-3 col-sm-4" key={el.player_id.toString()}>
                                                    <div
                                                        onClick={() => this.handleCard(el.player_id)}
                                                        className={`card user-select-none cursor-pointer shadow-sm ${
                                                            add.indexOf(el.player_id) > -1 ? "card-active" : ""
                                                        }`}>
                                                        <div className="card-body p-4 text-center card-checkbox">
                                                            <div
                                                                className="d-flex justify-content-between align-items-center py-1 px-2"
                                                                style={{
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    left: 0,
                                                                    right: 0
                                                                }}>
                                                                {this.renderGroups(el.groups)}
                                                                <div
                                                                    className="text-muted text-h6 ml-auto"
                                                                    data-toggle="tooltip"
                                                                    title="Okula Başlama Tarihi">
                                                                    {formatDate(el.start_date, "DD/MM/YYYY")}
                                                                </div>
                                                            </div>
                                                            <span
                                                                className="avatar avatar-lg my-4"
                                                                style={{ backgroundImage: `url(${el.image})` }}>
                                                                {el.image ? "" : avatarPlaceholder(el.name, el.surname)}
                                                                <span
                                                                    data-toggle="tooltip"
                                                                    title={
                                                                        statusType[
                                                                            el.status !== undefined ? el.status : 1
                                                                        ].title
                                                                    }
                                                                    style={{ width: "1rem", height: "1rem" }}
                                                                    className={`avatar-status ${
                                                                        statusType[
                                                                            el.status !== undefined ? el.status : 1
                                                                        ].bg
                                                                    }`}
                                                                />
                                                            </span>
                                                            <h5 className="mb-0">
                                                                {fullnameGenerator(el.name, el.surname)}
                                                            </h5>
                                                            <div
                                                                className="text-muted text-h6"
                                                                data-toggle="tooltip"
                                                                title="Doğum Yılı">
                                                                {formatDate(el.birthday, "YYYY")}
                                                            </div>

                                                            {el.position ? (
                                                                <span
                                                                    className="badge badge-success mt-3"
                                                                    data-toggle="tooltip"
                                                                    title="Mevkii">
                                                                    {el.position.name}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center w-100 text-muted font-italic mb-5">
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
                </form>
            </div>
        );
    }
}

export default Edit;
