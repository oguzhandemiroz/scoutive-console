import React, { Component } from "react";
import List from "./List";
import { DetailGroup, ListPlayers, DeleteGroup } from "../../services/Group";
import { nullCheck, formatDate, fullnameGenerator } from "../../services/Others";
import { Toast, showSwal } from "../Alert";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";

const noRow = () => (
    <tr>
        <td colSpan="4" className="text-center text-muted font-italic">
            Kayıt bulunamadı...
        </td>
    </tr>
);

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            players: [],
            loading: "active",
            onLoadedData: true,
            loadingButton: false
        };
    }

    componentDidMount() {
        const { gid } = this.props.match.params;
        this.renderGroupDetail(gid);
        this.renderPlayerList(gid);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.gid !== this.props.match.params.gid) {
            this.setState({
                loading: "active"
            });
            this.renderGroupDetail(nextProps.match.params.gid);
            this.renderPlayerList(nextProps.match.params.gid);
        }
    }

    renderGroupDetail = gid => {
        try {
            const { uid } = this.state;
            DetailGroup({
                uid: uid,
                group_id: parseInt(gid)
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

    renderPlayerList = gid => {
        try {
            const { uid } = this.state;
            ListPlayers({
                uid: uid,
                filter: { groups: { $elemMatch: { group_id: parseInt(gid) } } }
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        const data = response.data;
                        this.setState({ players: data, loading: "" });
                    }
                }
            });
        } catch (e) {}
    };

    deleteGroup = e => {
        try {
            e.preventDefault();
            const { uid, name } = this.state;
            const { gid } = this.props.match.params;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name || ""}</b> adlı grubu silmek istediğinize emin misiniz?`,
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
        const { gid } = this.props.match.params;
        const { name, area, start_time, end_time, age, employee, loading, created_date, image, players } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar</h1>
                </div>
                <div className="row">
                    <div className="col-lg-3 mb-4">
                        <Link to="/app/groups/add" className="btn btn-block btn-success btn-icon mb-6">
                            <i className="fe fe-plus-square mr-2" />
                            Grup Ekle
                        </Link>
                        <List match={this.props.match} />
                    </div>

                    <div className="col-lg-9">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-status bg-teal" />
                                <h3 className="card-title">{nullCheck(name)}</h3>
                                <div className="card-options">
                                    <span
                                        className="tag tag-gray-dark"
                                        data-original-title="Antrenman Saati"
                                        data-offset="-35"
                                        data-toggle="tooltip">
                                        {start_time ? moment(start_time, "HH:mm").format("HH:mm") : ""} &mdash;{" "}
                                        {end_time ? moment(end_time, "HH:mm").format("HH:mm") : ""}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-auto">
                                                <span
                                                    className="avatar avatar-xxxl"
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: ".875rem",
                                                        backgroundImage: `url(${image})`
                                                    }}>
                                                    {image ? "" : "Logo"}
                                                </span>
                                            </div>
                                            <div className="col d-flex flex-column">
                                                <div className="form-inline mb-1">
                                                    <label className="form-label">Grup Yaş Aralığı: </label>
                                                    <div className="ml-2">{age}</div>
                                                </div>
                                                <div className="form-inline mb-1">
                                                    <label className="form-label">Antrenman Sahası:</label>
                                                    <div className="ml-2">{area ? area.name : "—"}</div>
                                                </div>
                                            </div>
                                            <div className="col d-flex flex-column">
                                                <div className="form-inline mb-1">
                                                    <label className="form-label">Sorumlu Antrenör: </label>
                                                    {employee ? (
                                                        <Link
                                                            to={"/app/persons/employees/detail/" + employee.uid}
                                                            className="ml-2">
                                                            {fullnameGenerator(employee.name, employee.surname)}
                                                        </Link>
                                                    ) : (
                                                        <span className="ml-2">&mdash;</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-12">
                                                <label
                                                    className="form-label text-center"
                                                    style={{ fontSize: "1.15rem" }}>
                                                    Öğrenciler
                                                </label>
                                                <div className="table-responsive">
                                                    <table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="pl-0 w-1" />
                                                                <th>Ad Soyad</th>
                                                                <th>Mevkii</th>
                                                                <th className="w-1 text-center">Genel Puan</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {players
                                                                ? players.length > 0
                                                                    ? players.map((el, key) => (
                                                                          <tr key={key.toString()}>
                                                                              <td className="text-center">
                                                                                  <div
                                                                                      className="avatar d-block"
                                                                                      style={{
                                                                                          backgroundImage: `url(${el.image})`
                                                                                      }}
                                                                                  />
                                                                              </td>
                                                                              <td>
                                                                                  <div>
                                                                                      <Link
                                                                                          className="text-inherit"
                                                                                          to={
                                                                                              "/app/players/detail/" +
                                                                                              el.uid
                                                                                          }>
                                                                                          {el.name + " " + el.surname}
                                                                                      </Link>
                                                                                  </div>
                                                                                  <div className="small text-muted">
                                                                                      Doğum Yılı:{" "}
                                                                                      {el.birthday
                                                                                          ? moment(
                                                                                                new Date(el.birthday)
                                                                                            ).format("YYYY")
                                                                                          : "—"}
                                                                                  </div>
                                                                              </td>
                                                                              <td>
                                                                                  {el.position ? el.position.name : "—"}
                                                                              </td>
                                                                              <td className="text-center">
                                                                                  {el.point ? el.point : "—"}
                                                                              </td>
                                                                          </tr>
                                                                      ))
                                                                    : noRow()
                                                                : noRow()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex">
                                    <Link
                                        to={{
                                            pathname: "/app/groups/detail/" + gid
                                        }}
                                        data-toggle="dropdown"
                                        className="btn btn-secondary dropdown-toggle">
                                        İşlem
                                    </Link>
                                    <div className="dropdown-menu">
                                        <Link
                                            to={{
                                                pathname: "/app/groups/edit/" + gid
                                                //state: { type: "edit", detailGroup: detail }
                                            }}
                                            className="dropdown-item">
                                            <i className="fe fe-edit mr-2"></i> Grubu Düzenle
                                        </Link>
                                        <Link to="" onClick={this.deleteGroup} className="dropdown-item">
                                            <i className="fe fe-trash mr-2"></i> Grubu Sil
                                        </Link>
                                    </div>
                                    <div className="ml-auto d-flex align-items-center">
                                        Oluşturma tarihi:
                                        <strong className="m-2 font-italic">
                                            {created_date ? moment(created_date).format("LLL") : "—"}
                                        </strong>
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
