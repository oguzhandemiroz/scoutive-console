import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";
import { DetailGroup, DeleteGroup } from "../../services/Group";
import { nullCheck, groupAgeSplit, fullnameGenerator, formatDate, avatarPlaceholder } from "../../services/Others";
import { ListPlayers } from "../../services/Player";
import { Toast, showSwal } from "../Alert";

const $ = require("jquery");

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Öğrenci" },
    1: { bg: "bg-success", title: "Aktif Öğrenci" },
    2: { bg: "bg-azure", title: "Donuk Öğrenci" }
};

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            gid: parseInt(this.props.match.params.gid),
            loading: "active",
            weekdays: moment.weekdaysShort(),
            players: []
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
        this.groupDetail();
        this.listPlayers();
    }

    groupDetail = () => {
        try {
            const { uid, gid } = this.state;
            DetailGroup({
                uid: uid,
                group_id: gid
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        this.setState({
                            ...response.data,
                            loading: ""
                        });
                    }
                }
            });
        } catch (e) {}
    };

    listPlayers = () => {
        const { gid } = this.state;
        ListPlayers().then(response => {
            if (response) {
                this.setState({
                    players: response.data.filter(x => x.groups.filter(y => y.value === gid).length > 0)
                });
            }
        });
    };

    renderWorkDays = days => {
        const { weekdays } = this.state;
        return (
            <div className="form-control-plaintext work-days d-flex flex-row">
                {weekdays.map((el, key) => (
                    <span
                        style={{ height: 30 }}
                        key={key.toString()}
                        className={`tag ${days ? (days.indexOf(key) > -1 ? "tag-green" : "") : ""}`}>
                        {el}
                    </span>
                ))}
            </div>
        );
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

    deleteGroup = e => {
        try {
            e.preventDefault();
            const { uid, name, gid } = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<strong>${name || ""}</strong> adlı grubu silmek istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    DeleteGroup({
                        uid: uid,
                        group_id: gid
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.props.history.push("/app/groups"), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    render() {
        const { gid, name, start_time, end_time, age, area, work_days, employee, players, loading } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar &mdash; Grup Detay</h1>
                </div>
                <div className="row">
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
                                            <label className="form-label">Grup Adı</label>
                                            <div className="form-control-plaintext">{nullCheck(name)}</div>
                                        </div>
                                        <div className="row gutters-xs">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="form-label">Ant. Başlangıç Saati</label>
                                                    <div className="form-control-plaintext">
                                                        {moment(start_time, "HH:mm").format("HH:mm")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="form-label">Ant. Bitiş Saati</label>
                                                    <div className="form-control-plaintext">
                                                        {moment(end_time, "HH:mm").format("HH:mm")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Grup Yaş Aralığı</label>
                                            <div className="row gutters-xs">
                                                <div className="col">
                                                    <div className="form-control-plaintext">
                                                        {groupAgeSplit(age).start}
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-control-plaintext">
                                                        {groupAgeSplit(age).end}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Sorumlu Antrenör</label>
                                            {employee ? (
                                                <Link
                                                    to={"/app/persons/employees/detail/" + employee.uid}
                                                    className="form-control-plaintext text-blue">
                                                    {fullnameGenerator(employee.name, employee.surname)}
                                                </Link>
                                            ) : (
                                                <div className="form-control-plaintext">&mdash;</div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Antrenman Sahası</label>
                                            <div className="form-control-plaintext">{area ? area.name : "—"}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Çalışma Günleri</label>
                                            {this.renderWorkDays(work_days)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer">
                                <Link to={"/app/groups/edit/" + gid} className="btn btn-dark btn-block">
                                    <i className="fe fe-edit mr-2"></i> Düzenle
                                </Link>
                                <button
                                    data-toggle="dropdown"
                                    className="btn btn-dark dropdown-toggle dropup btn-block">
                                    İşlem Menüsü
                                </button>
                                <div className="dropdown-menu">
                                    <button onClick={this.deleteGroup} className="dropdown-item">
                                        <i className="fe fe-trash mr-2"></i> Grubu Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Öğrenciler</h3>
                            </div>
                            <div className="card-body pb-0">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row row-cards row-deck">
                                            {players.length > 0 ? (
                                                players.map(el => (
                                                    <div className="col-lg-3 col-sm-4" key={el.player_id.toString()}>
                                                        <div className="card shadow-sm">
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
                                                                    {el.image
                                                                        ? ""
                                                                        : avatarPlaceholder(el.name, el.surname)}
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
                                                                <Link
                                                                    className="mb-0 h5 d-block"
                                                                    to={"/app/players/detail/" + el.uid}>
                                                                    {fullnameGenerator(el.name, el.surname)}
                                                                </Link>
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
                                                <div className="text-center w-100 text-muted font-italic pb-5">
                                                    Gruba kayıtlı öğrenci bulunamadı...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detail;
