import React, { Component } from "react";
import PersonCard from "./PersonCard";
import { DetailParent, GetParentPlayers } from "../../services/Parent";
import { fullnameGenerator, nullCheck, formatMoney, formatDate, CheckPermissions } from "../../services/Others";
import Tabs from "./Tabs";
import { Link } from "react-router-dom";

const dailyType = {
    "-1": { icon: "help-circle", color: "gray", text: "Tanımsız" },
    "0": { icon: "x", color: "danger", text: "Gelmedi" },
    "1": { icon: "check", color: "success", text: "Geldi" },
    "2": { icon: "alert-circle", color: "warning", text: "İzinli" }
};
var statusType = {
    0: { bg: "bg-danger", title: "Pasif" },
    1: { bg: "bg-success", title: "Aktif" },
    2: { bg: "bg-azure", title: "Donuk" },
    3: { bg: "bg-indigo", title: "Ön Kayıt" }
};

export class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            loading: "active",
            players: []
        };
    }

    componentDidMount() {
        this.detailParent();
    }

    detailParent = () => {
        const { uid, to } = this.state;
        DetailParent({ uid: uid, to: to }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    delete data.uid;
                    this.setState({ ...data });
                    GetParentPlayers({
                        uid: uid,
                        parent_id: data.parent_id
                    }).then(responsePlayers => {
                        if (responsePlayers) {
                            const status = responsePlayers.status;
                            if (status.code === 1020) {
                                const playerData = responsePlayers.data;
                                this.setState({ players: playerData, loading: "" });
                            }
                        }
                    });
                }
            }
        });
    };

    renderFeeType = data => {
        if (!data.is_trial && !data.is_scholarship & (data.fee !== null)) {
            return formatMoney(data.fee);
        } else if (data.is_trial) {
            return "ÖN KAYIT";
        } else if (data.is_scholarship) {
            return "BURSLU";
        } else if (data.fee === null) {
            return "—";
        } else {
            return "—";
        }
    };

    render() {
        const { to, loading, players } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Veli Detay</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
                </div>
                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />
                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Öğrenci Bilgileri</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-12">
                                                {players.length > 0 ? (
                                                    players.map((el, key) => (
                                                        <div
                                                            className={`example ${
                                                                players.length - 1 === key ? "" : "mb-4"
                                                            }`}
                                                            key={key.toString()}>
                                                            <div className="row">
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">Ad Soyad</label>
                                                                        <Link
                                                                            className="text-blue"
                                                                            to={`/app/players/detail/${el.uid}`}>
                                                                            {fullnameGenerator(el.name, el.surname)}
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">
                                                                            T.C. Kimlik Numarası
                                                                        </label>
                                                                        {el.security_id}
                                                                    </div>
                                                                </div>
                                                                {CheckPermissions(["a_read"]) && (
                                                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                                                        <div className="form-group mb-5">
                                                                            <label className="form-label">Aidat</label>
                                                                            {this.renderFeeType(el)}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">Doğum Günü</label>
                                                                        {formatDate(el.birthday, "LL")}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">Grup</label>
                                                                        {el.group
                                                                            ? el.group.map((el, key) => (
                                                                                  <div key={key.toString()}>{el}</div>
                                                                              ))
                                                                            : nullCheck(el.group)}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">
                                                                            Okula Başlama Tarihi
                                                                        </label>

                                                                        {formatDate(el.start_date)}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">
                                                                            Kayıt Durumu
                                                                        </label>
                                                                        <span
                                                                            className={`status-icon ${
                                                                                el.is_trial
                                                                                    ? statusType[3].bg
                                                                                    : statusType[el.status].bg
                                                                            } mr-2`}></span>
                                                                        {el.is_trial
                                                                            ? statusType[3].title
                                                                            : statusType[el.status].title}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4 col-md-6 col-sm-6">
                                                                    <div className="form-group mb-5">
                                                                        <label className="form-label">
                                                                            Yoklama Durumu (Bugün)
                                                                        </label>
                                                                        <div
                                                                            className={`text-${
                                                                                dailyType[el.daily].color
                                                                            }`}>
                                                                            <i
                                                                                className={`fe fe-${
                                                                                    dailyType[el.daily].icon
                                                                                } mr-2`}
                                                                            />
                                                                            {dailyType[el.daily].text}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-100 text-center font-italic text-muted">
                                                        Tanımlı öğrenci bilgisi bulunamadı...
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
            </div>
        );
    }
}

export default Detail;
