import React, { Component } from "react";
import Select, { components } from "react-select";
import { withRouter, Link } from "react-router-dom";
import { Areas, GetEmployees } from "../../services/FillSelect";
import { selectCustomStyles, selectCustomStylesError, formValid } from "../../assets/js/core";
import { avatarPlaceholder, formatDate, fullnameGenerator } from "../../services/Others";
import { ListPlayers } from "../../services/Player";
import _ from "lodash";
const $ = require("jquery");

const { Option } = components;
const ImageOptionEmployee = props => (
    <Option {...props}>
        <span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
        {props.data.label}
        <div className="small text-muted mt-1">
            Pozisyon: <b className="text-blue">{props.data.position}</b>
        </div>
    </Option>
);

export class Add extends Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            formErrors: {
                employee: ""
            },
            select: {
                employees: null,
                areas: null,
                players: null,
                initialPlayers: null
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
        this.getFillSelect();
    }

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
        const { players } = this.state;
        if (players.indexOf(player_id) > -1) {
            this.setState({ players: players.filter(x => x !== player_id) });
        } else {
            this.setState(prevState => ({ players: [...prevState.players, player_id] }));
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

    renderGroups = groups => {
        if (groups.length === 0) return null;

        let list_group = "";
        groups.map(i => (list_group += `<div>${i.label}</div>`));
        return (
            <span
                style={{ width: 12, height: 12 }}
                className="badge badge-primary"
                data-toggle="popover"
                data-content={`
                    <p class="font-weight-600">
                        <span class="badge badge-primary mr-1"></span>Dahil Olduğu Grup(lar)
                    </p>
                    ${list_group}
                `}
            />
        );
    };

    render() {
        const { select, players, loadingImage, imagePreview, playerList, loadingButton, formErrors } = this.state;
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
                                <div className="form-group">
                                    <label className="form-label">
                                        Grup Adı<span className="form-required">*</span>
                                    </label>
                                    <input type="text" className="form-control" name="name" />
                                </div>
                                <div className="row gutters-xs">
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Başlangıç Saati<span className="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="start_time" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label className="form-label">
                                                Bitiş Saati<span className="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="end_time" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Grup Yaş Aralığı<span className="form-required">*</span>
                                    </label>
                                    <div className="row gutters-xs">
                                        <div className="col">
                                            <input type="text" className="form-control" name="start_time" />
                                        </div>
                                        <div className="col">
                                            <input type="text" className="form-control" name="end_time" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Sorumlu Antrenör<span className="form-required">*</span>
                                    </label>
                                    <Select
                                        isSearchable={true}
                                        isDisabled={select.employees ? false : true}
                                        isLoading={select.employees ? false : true}
                                        placeholder="Seç..."
                                        onChange={val => this.handleSelect(val, "employee")}
                                        name="employee"
                                        autosize
                                        styles={
                                            formErrors.employee === true ? selectCustomStylesError : selectCustomStyles
                                        }
                                        options={select.employees}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                        components={{ Option: ImageOptionEmployee }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Antrenman Sahası</label>
                                    <Select
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

                                <div className="form-group">
                                    <label className="form-label">Çalışma Günleri</label>
                                    <div className="selectgroup selectgroup-pills">
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="1"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Pazartesi</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="2"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Salı</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="3"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Çarşamba</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="4"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Perşembe</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="5"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Cuma</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="6"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Cumartesi</span>
                                        </label>
                                        <label className="selectgroup-item">
                                            <input
                                                type="checkbox"
                                                name="value"
                                                value="0"
                                                className="selectgroup-input"
                                            />
                                            <span className="selectgroup-button">Pazar</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="alert alert-info card-alert">
                                <p>
                                    <strong>Öğrenci Seçmeyi Unutma!</strong>
                                </p>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-success btn-block">Oluştur</button>
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
                            <div className="card-body pb-0">
                                <div className="row row-cards row-deck">
                                    {select.initialPlayers ? (
                                        select.initialPlayers.length > 0 ? (
                                            select.initialPlayers.map(el => (
                                                <div className="col-lg-3 col-sm-4" key={el.player_id.toString()}>
                                                    <div
                                                        onClick={() => this.handleCard(el.player_id)}
                                                        className={`card user-select-none shadow-sm ${
                                                            players.indexOf(el.player_id) > -1 ? "card-active" : ""
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
                                                                    className="text-muted text-h6"
                                                                    data-toggle="tooltip"
                                                                    title="Okula Başlama Tarihi">
                                                                    {formatDate(el.start_date, "DD/MM/YYYY")}
                                                                </div>
                                                            </div>
                                                            <span
                                                                className="avatar avatar-lg my-4"
                                                                style={{ backgroundImage: `url(${el.image})` }}>
                                                                {el.image
                                                                    ? null
                                                                    : avatarPlaceholder(el.name, el.surname)}
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
                </form>
            </div>
        );
    }
}

export default Add;
