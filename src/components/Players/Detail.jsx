import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { DetailPlayer, DeletePlayer, FreezePlayer, RefreshPlayer } from "../../services/Player.jsx";
import Tabs from "../../components/Players/Tabs";
import { showSwal, Toast } from "../../components/Alert";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import moment from "moment";

const genderToText = {
    0: "Erkek",
    1: "Kız"
};

const footToText = {
    0: "Sağ & Sol",
    1: "Sağ",
    2: "Sol"
};

const initialState = {
    vacation: false,
    group_change: false
};

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            ...initialState,
            image: "",
            name: "—",
            email: "—",
            phone: "—",
            birthday: "—",
            securityNo: "—",
            position: "—",
            point: "—",
            group: "—",
            fee: "—",
            branch: "—",
            gender: "—",
            foot: "—",
            foot_no: "—",
            branch: "—",
            body_measure: null,
            emergency: null,
            is_trial: 1,
            body: { height: "—", weight: "—" },
            onLoadedData: false,
            data: {}
        };
    }

    componentDidMount() {
        const { uid, to } = this.state;
        DetailPlayer({ uid: uid, to: to }).then(response => {
            const stateData = {};
            if (response) {
                const status = response.status;
                stateData.body = {};
                if (status.code === 1020) {
                    const data = response.data;
                    stateData.body = {};
                    stateData.name = `${data.name || ""} ${data.surname || ""}`;
                    stateData.securityNo = data.security_id || "—";
                    stateData.image = data.image || "—";
                    stateData.email = data.email || "—";
                    stateData.phone = data.phone || "—";
                    stateData.birthday = data.birthday || "—";
                    stateData.group = data.group || "—";
                    stateData.fee = data.fee ? data.fee.format() + " ₺" : "—";
                    stateData.position = data.position || "—";
                    stateData.branch = data.branch || "—";
                    stateData.point = data.point || "—";
                    stateData.gender = data.gender !== null ? genderToText[data.gender] : "—";
                    stateData.body.height = data.attributes.body_height || "—";
                    stateData.body.weight = data.attributes.body_weight || "—";
                    stateData.address = data.address || "—";
                    stateData.start_date = data.start_date ? moment(data.start_date).format("DD/MM/YYYY") : "—";
                    stateData.end_date = data.end_date ? moment(data.end_date).format("DD/MM/YYYY") : null;
                    stateData.blood = data.blood || "—";
                    stateData.foot = data.foot !== null ? footToText[data.foot] : "—";
                    stateData.foot_no = data.attributes.foot_no || "—";
                    stateData.emergency = data.emergency;
                    stateData.is_trial = data.is_trial;
                    stateData.status = data.status;
                    stateData.body_measure = data.attributes.body_measure;
                    stateData.onLoadedData = true;
                }
            }

            this.setState({ ...stateData });
        });
    }

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace(`/`);
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    deletePlayer = () => {
        try {
            const { uid, to, name } = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı öğrencinin kaydını silmek istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                confirmButtonColor: "#cd201f",
                cancelButtonColor: "#868e96",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    DeletePlayer({
                        uid: uid,
                        to: to
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.props.history.push("/app/players"), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    freezePlayer = (to, name) => {
        try {
            const { uid } = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı öğrencinin <b>kaydını dondurmak</b> istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    FreezePlayer({
                        uid: uid,
                        to: to
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.reload(), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    refreshPlayer = (to, name) => {
        try {
            const { uid } = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı öğrencinin <b>kaydını yenilemek</b> istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    RefreshPlayer({
                        uid: uid,
                        to: to
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.reload(), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    renderActionButton = () => {
        const { to, name, is_trial, status, group } = this.state;
        const fullname = name;

        const dropdownDivider = key => <div role="separator" className="dropdown-divider" key={key.toString()} />;
        const lock = (
            <span className="ml-1">
                (<i className="fe fe-lock mr-0" />)
            </span>
        );

        const actionMenu = [
            {
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/payment/${to}`,
                    onClick: () => this.props.history.push(`/app/players/payment/${to}`)
                },
                childText: "Ödeme Al",
                child: {
                    className: "dropdown-icon fa fa-hand-holding-usd"
                },
                lock: false,
                condition: !is_trial
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status === 0
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Ödeme İkazı")
                },
                childText: "Ödeme İkazı",
                child: {
                    className: "dropdown-icon fa fa-exclamation-triangle"
                },
                lock: lock,
                condition: !is_trial && status !== 0
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status !== 0
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => this.freezePlayer(to, fullname)
                },
                childText: "Kaydı Dondur",
                child: {
                    className: "dropdown-icon fa fa-snowflake"
                },
                lock: false,
                condition: !is_trial && status === 1
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => this.refreshPlayer(to, fullname)
                },
                childText: "Kaydı Yenile",
                child: {
                    className: "dropdown-icon fa fa-sync-alt"
                },
                lock: false,
                condition: !is_trial && status === 2
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () => this.deletePlayer(to, fullname)
                },
                childText: "Kaydı Sil",
                child: {
                    className: "dropdown-icon fa fa-user-times"
                },
                lock: false,
                condition: status !== 0
            },
            {
                divider: key => dropdownDivider(key),
                condition: status !== 0
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () =>
                        this.setState({
                            ...initialState,
                            vacation: true,
                            data: { name: fullname, uid: to }
                        })
                },
                childText: "İzin Yaz",
                child: {
                    className: "dropdown-icon fa fa-coffee"
                },
                lock: false,
                condition: !is_trial && status === 1
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status === 1
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Not (Puan) Ver")
                },
                childText: "Not (Puan) Ver",
                child: {
                    className: "dropdown-icon fa fa-notes-medical"
                },
                lock: lock,
                condition: !is_trial && status === 1
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status === 1
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Veliye Mesaj Gönder")
                },
                childText: "Veliye Mesaj Gönder",
                child: {
                    className: "dropdown-icon fa fa-paper-plane"
                },
                lock: lock,
                condition: true
            },
            {
                divider: key => dropdownDivider(key),
                condition: true
            },
            {
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/edit/${to}`,
                    onClick: () => this.props.history.push(`/app/players/edit/${to}`)
                },
                childText: "Düzenle",
                child: {
                    className: "dropdown-icon fa fa-pen"
                },
                lock: false,
                condition: true
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item",
                    onClick: () =>
                        this.setState({
                            ...initialState,
                            group_change: true,
                            data: {
                                name: fullname,
                                uid: to,
                                group: group ? group.name : null,
                                group_id: group ? group.group_id : null
                            }
                        })
                },
                childText: "Grup Değişikliği",
                child: {
                    className: "dropdown-icon fa fa-user-cog"
                },
                lock: false,
                condition: !is_trial && status !== 0
            },
            {
                divider: key => dropdownDivider(key),
                condition: !is_trial && status !== 0
            },
            {
                tag: "button",
                elementAttr: {
                    className: "dropdown-item cursor-not-allowed disabled",
                    onClick: () => console.log("Öğrenci Belgesi")
                },
                childText: "Öğrenci Belgesi",
                child: {
                    className: "dropdown-icon fa fa-id-card-alt"
                },
                lock: lock,
                condition: true
            },
            {
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/fee-detail/${to}`,
                    onClick: () => this.props.history.push(`/app/players/fee-detail/${to}`)
                },
                childText: "Tüm Aidat Bilgisi",
                child: {
                    className: "dropdown-icon fa fa-receipt"
                },
                lock: false,
                condition: true
            },
            {
                tag: "Link",
                elementAttr: {
                    className: "dropdown-item",
                    to: `/app/players/detail/${to}`,
                    onClick: () => this.props.history.push(`/app/players/detail/${to}`)
                },
                childText: "Tüm Bilgileri",
                child: {
                    className: "dropdown-icon fa fa-info-circle"
                },
                lock: false,
                condition: true
            }
        ];

        return (
            <div className="dropdown dropup btn-block" id="action-dropdown">
                <button
                    type="button"
                    id="player-action"
                    className="btn btn-gray-dark btn-block dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    İşlem
                </button>
                <div
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="player-action"
                    x-placement="top-end">
                    <a className="dropdown-item disabled text-azure" href="javascript:void(0)">
                        <i className="dropdown-icon fa fa-user text-azure" />
                        {fullname}
                    </a>
                    <div role="separator" className="dropdown-divider" />
                    {actionMenu.map((el, key) => {
                        if (el.condition) {
                            if (el.tag === "Link") {
                                return (
                                    <Link {...el.elementAttr} key={key.toString()}>
                                        <i {...el.child} /> {el.childText}
                                        {el.lock}
                                    </Link>
                                );
                            } else if (el.tag === "button") {
                                return (
                                    <button {...el.elementAttr} key={key.toString()}>
                                        <i {...el.child} /> {el.childText}
                                        {el.lock}
                                    </button>
                                );
                            } else {
                                return el.divider(key);
                            }
                        }
                    })}
                </div>
            </div>
        );
    };

    render() {
        const {
            to,
            image,
            name,
            email,
            phone,
            securityNo,
            point,
            position,
            group,
            fee,
            branch,
            birthday,
            vacation,
            group_change,
            address,
            body,
            gender,
            data,
            blood,
            emergency,
            body_measure,
            foot,
            foot_no,
            start_date,
            is_trial,
            end_date,
            onLoadedData
        } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Detay</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{is_trial === 0 ? <Tabs match={match} to={to} /> : null}</div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Genel Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="media mb-5">
                                            <span
                                                className="avatar avatar-xxl mr-4"
                                                style={{ backgroundImage: `url(${image})` }}
                                            />
                                            <div className="media-body">
                                                <h4 className="m-0">{name}</h4>
                                                <p className="text-muted mb-0">{position}</p>
                                                <ul className="social-links list-inline mb-0 mt-2">
                                                    <li className="list-inline-item">
                                                        <a
                                                            className="employee_email"
                                                            href={`mailto:${email}`}
                                                            data-original-title={email}
                                                            data-toggle="tooltip">
                                                            <i className="fa fa-envelope" />
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            className="employee_phone"
                                                            href={`tel:${phone}`}
                                                            data-original-title={phone}
                                                            data-toggle="tooltip">
                                                            <i className="fa fa-phone" />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">T.C. Kimlik Numarası</label>
                                            <div className="form-control-plaintext">{securityNo}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Genel Puan</label>
                                            <div className="form-control-plaintext">{point}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Grup</label>
                                            <div className="form-control-plaintext">
                                                {typeof group === "object" ? (
                                                    <Link to={`/app/groups/detail/${group.group_id}`}>
                                                        {group.name}
                                                    </Link>
                                                ) : (
                                                    <div className="form-control-plaintext">{group}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Aidat</label>
                                            <div className="form-control-plaintext">{fee}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Branş</label>
                                            <div className="form-control-plaintext">{branch}</div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Okula Başlama Tarihi</label>
                                            <div className="form-control-plaintext">{start_date}</div>
                                        </div>

                                        {end_date ? (
                                            <div className="form-group">
                                                <label className="form-label">Okuldan Ayrılma Tarihi</label>
                                                <div className="form-control-plaintext">{end_date}</div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                {this.renderActionButton()}
                                {<Vacation data={data} visible={vacation} history={this.props.history} />}
                                {<GroupChange data={data} visible={group_change} history={this.props.history} />}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">Email</label>
                                                    <div className="form-control-plaintext">{email}</div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Telefonu</label>
                                                    <div className="form-control-plaintext">{phone}</div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Doğum Tarihi</label>
                                                    <div className="form-control-plaintext">{birthday}</div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Adresi</label>
                                                    <div className="form-control-plaintext">{address}</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">Vücut Metrikleri (Boy & Kilo)</label>
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <div className="form-control-plaintext" id="body_height">
                                                                <b>Boy: </b>
                                                                <span>{body.height}cm</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-control-plaintext" id="body_weight">
                                                                <b>Kilo: </b> <span>{body.weight}kg</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Cinsiyeti</label>
                                                    <div className="form-control-plaintext">{gender}</div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Kan Grubu</label>
                                                    <div className="form-control-plaintext">{blood}</div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <label className="form-label">Kullandığı Ayak</label>
                                                            <div className="form-control-plaintext">{foot}</div>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label">Ayak Numarası</label>
                                                            <div className="form-control-plaintext">{foot_no}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <label className="form-label">Acil Durumda İletişim</label>
                                                <div className="table-responsive">
                                                    <table className="table mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="pl-0">Yakınlık</th>
                                                                <th>Adı ve Soyadı</th>
                                                                <th className="pl-0">Telefon</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.isArray(emergency)
                                                                ? emergency.map((el, key) => {
                                                                      return (
                                                                          <tr key={key.toString()}>
                                                                              <td className="pl-0 pr-0">
                                                                                  <div className="form-control-plaintext">
                                                                                      {el.kinship}
                                                                                  </div>
                                                                              </td>
                                                                              <td>
                                                                                  <div className="form-control-plaintext">
                                                                                      {el.name}
                                                                                  </div>
                                                                              </td>
                                                                              <td className="pl-0">
                                                                                  <div className="form-control-plaintext">
                                                                                      <a href={"tel:" + el.phone}>
                                                                                          {el.phone}
                                                                                      </a>
                                                                                  </div>
                                                                              </td>
                                                                          </tr>
                                                                      );
                                                                  })
                                                                : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <label className="form-label">Vücut Ölçüleri</label>
                                                <div className="table-responsive">
                                                    <table className="table mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th className="pl-0">Tür</th>
                                                                <th>Değer</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.isArray(body_measure)
                                                                ? body_measure.map((el, key) => {
                                                                      console.log(el);
                                                                      if (el.type !== "" && el.value !== "")
                                                                          return (
                                                                              <tr key={key.toString()}>
                                                                                  <td className="pl-0 pr-0">
                                                                                      <div className="form-control-plaintext">
                                                                                          {el.type}
                                                                                      </div>
                                                                                  </td>
                                                                                  <td>
                                                                                      <div className="form-control-plaintext">
                                                                                          {el.value}cm
                                                                                      </div>
                                                                                  </td>
                                                                              </tr>
                                                                          );
                                                                  })
                                                                : null}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
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

export default withRouter(Detail);
