import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { DetailPlayer } from "../../services/Player.jsx";
import Tabs from "../../components/Players/Tabs";
import PersonCard from "./PersonCard";
import Swal from "sweetalert2";
import { formatPhone, nullCheck, formatDate, fullnameGenerator } from "../../services/Others.jsx";
import { showSwal } from "../Alert.jsx";

const genderToText = {
    0: "Erkek",
    1: "Kız"
};

const footToText = {
    0: "Sağ & Sol",
    1: "Sağ",
    2: "Sol"
};

export class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            loading: "active",
            attributes: { body_height: null, body_weight: null },
            groups: [],
            show: {
                parents: false
            }
        };
    }

    componentDidMount() {
        this.detailPlayer();
    }

    componentWillUnmount() {
        Swal.close();
    }

    detailPlayer = () => {
        const { uid, to } = this.state;
        DetailPlayer({ uid: uid, to: to, attribute_values: [] }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    delete data.uid;
                    this.setState({ ...data, loading: "" });
                    if (data.recipient_parent_id === -1) {
                        showSwal({
                            type: "warning",
                            title: "İletişim Servisi Uyarısı!",
                            html: `İletişim Bilgisi tanımlanmamış.<br/>Tanımlamak için <a href="/app/players/messages/${to}">tıklayın...</a>`,
                            backdrop: false,
                            toast: true,
                            showConfirmButton: false,
                            position: "top-end",
                            timer: 10000,
                            customClass: {
                                popup: "flex-column",
                                content: "mt-3"
                            }
                        });
                    }
                }
            }
        });
    };

    render() {
        const {
            to,
            email,
            phone,
            birthday,
            address,
            gender,
            blood,
            foot,
            note,
            attributes,
            loading,
            parents,
            show
        } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Detay</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
                </div>

                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />
                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Detay Bilgiler</h3>
                            </div>
                            <div className="card-body">
                                <div className={`dimmer ${loading}`}>
                                    <div className="loader" />
                                    <div className="dimmer-content">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">Email</label>
                                                    <div className="form-control-plaintext">
                                                        <a href={email ? `mailto:${nullCheck(email)}` : ""}>
                                                            {nullCheck(email)}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Telefonu</label>
                                                    <div className="form-control-plaintext">
                                                        <a href={phone ? `tel:+90${nullCheck(phone)}` : ""}>
                                                            {formatPhone(phone)}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Doğum Tarihi</label>
                                                    <div className="form-control-plaintext">
                                                        {formatDate(birthday, "LL")}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Adresi</label>
                                                    <div className="form-control-plaintext">{nullCheck(address)}</div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-12">
                                                <div className="form-group">
                                                    <label className="form-label">Boy ve Kilo</label>
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <div className="form-control-plaintext" id="body_height">
                                                                <b>Boy: </b>
                                                                <span>{nullCheck(attributes.body_height)}cm</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="form-control-plaintext" id="body_weight">
                                                                <b>Kilo: </b>
                                                                <span>{nullCheck(attributes.body_weight)}kg</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Cinsiyeti</label>
                                                    <div className="form-control-plaintext">
                                                        {nullCheck(genderToText[gender])}
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <label className="form-label">Kan Grubu</label>
                                                            <div className="form-control-plaintext">
                                                                {blood ? blood.label : "—"}
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label">Beden</label>
                                                            <div className="form-control-plaintext">
                                                                {nullCheck(attributes.body)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <label className="form-label">Kullandığı Ayak</label>
                                                            <div className="form-control-plaintext">
                                                                {nullCheck(footToText[foot])}
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label">Ayak Numarası</label>
                                                            <div className="form-control-plaintext">
                                                                {nullCheck(attributes.foot_no)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 mt-3">
                                                <label className="form-label">Veli Bilgileri</label>
                                                {show.parents ? (
                                                    <div className="row gutters-xs">
                                                        {parents ? (
                                                            parents.length > 0 ? (
                                                                parents.map(el => (
                                                                    <div
                                                                        className="col-6"
                                                                        key={el.parent_id.toString()}>
                                                                        <div className="card">
                                                                            <div className="card-body">
                                                                                <div className="text-dark font-weight-600">
                                                                                    {el.kinship}
                                                                                </div>
                                                                                <Link
                                                                                    to={`/app/parents/detail/${el.uid}`}>
                                                                                    {fullnameGenerator(
                                                                                        el.name,
                                                                                        el.surname
                                                                                    )}
                                                                                </Link>
                                                                                <Link
                                                                                    to={"tel:" + el.phone}
                                                                                    className="d-block text-muted">
                                                                                    Telefon: {formatPhone(el.phone)}
                                                                                </Link>
                                                                                <div className="text-muted">
                                                                                    Email: {el.email}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="font-italic text-center w-100 p-4">
                                                                    Kayıtlı veli bilgisi bulunamadı...
                                                                </div>
                                                            )
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="btn btn-cyan btn-icon"
                                                        onClick={() =>
                                                            this.setState(prevState => ({
                                                                show: {
                                                                    ...prevState.show,
                                                                    parents: true
                                                                }
                                                            }))
                                                        }>
                                                        <i className="fa fa-user mr-2" />
                                                        Veli Bilgilerini Görüntüle
                                                    </button>
                                                )}
                                            </div>

                                            <div className="col-12 mt-5">
                                                <div className="form-group">
                                                    <label className="form-label">Not</label>
                                                    <div className="form-control-plaintext">{nullCheck(note)}</div>
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
