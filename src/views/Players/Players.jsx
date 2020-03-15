import React, { Component } from "react";
import Table from "../../components/Players/List";
import { ListPlayers } from "../../services/Player";
import { Link } from "react-router-dom";
import DailyPlayer from "../../components/Players/Charts/DailyPlayer";
import TotalFee from "../../components/Players/Charts/TotalFee";
import DailyCreatedPlayer from "../../components/Players/Charts/DailyCreatedPlayer";
import TotalPlayerCount from "../../components/Players/Charts/TotalPlayerCount";
import { CheckPermissions } from "../../services/Others";
import Swal from "sweetalert2";
import NotPermissions from "../../components/NotActivate/NotPermissions";

class Players extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: []
        };
    }

    componentDidMount() {
        this.renderPlayerList();
    }

    renderPlayerList = () => {
        const { uid } = this.state;
        ListPlayers(uid).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) this.setState({ data: response.data });
            }
        });
    };

    printablePlayerForm = () => {
        Swal.mixin({
            allowOutsideClick: false,
            heightAuto: false,
            allowEnterKey: false,
            confirmButtonText: "Devam &rarr;",
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonText: "İptal",
            confirmButtonColor: "#316cbe",
            cancelButtonColor: "#868e96",
            reverseButtons: true
        })
            .queue([
                {
                    type: "question",
                    title: "Form İletişim Bilgisi",
                    text: "Form üzerine yazılacak iletişim bilgisi için yetkili ismini giriniz:",
                    input: "text"
                },
                {
                    type: "question",
                    title: "Form İletişim Bilgisi",
                    text: "Form üzerine yazılacak iletişim bilgisi için yetkili telefon numarası giriniz:",
                    input: "text"
                },
                {
                    type: "question",
                    title: "Form Alanı",
                    html: "Form içerisinde <b>Aidat</b> bilgisi bulunsun mu?",
                    input: "checkbox",
                    inputValue: 0,
                    inputPlaceholder: "Evet, bulunsun"
                },
                {
                    type: "question",
                    title: "Form Alanı",
                    html: "Form içerisinde <b>Bizi Nereden Duydunuz?</b> bilgisi bulunsun mu?",
                    input: "checkbox",
                    inputValue: 0,
                    inputPlaceholder: "Evet, bulunsun"
                }
            ])
            .then(result => {
                if (result.value) {
                    const results = result.value;
                    this.props.history.push(
                        `/printable/player-form/${results[0]}/${results[1]}/${results[2]}/${results[3]}`
                    );
                }
            });
    };

    render() {
        const { data } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenciler</h1>
                    <button onClick={this.printablePlayerForm} className="btn btn-secondary ml-auto mr-2">
                        <i className="fe fe-printer mr-1"></i>
                        Öğrenci Bilgi Formu
                    </button>
                    {CheckPermissions(["p_write"]) && (
                        <Link to="/app/players/add" className="btn btn-success">
                            Öğrenci Ekle
                        </Link>
                    )}
                </div>
                {CheckPermissions(["p_read"]) ? (
                    <>
                        <div className="row row-cards row-deck">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <DailyPlayer data={data.filter(x => x.status === 1)} />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TotalPlayerCount data={data} />
                            </div>
                            {/* <div className="col-sm-6 col-md-4">
                                <div className="card">
                                    <TotalFee data={data} />
                                    <DailyCreatedPlayer />
                                </div>
                            </div> */}
                        </div>
                        <div className="row row-cards">
                            <div className="col">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Tüm Öğrenciler</h3>
                                    </div>
                                    <div className="player-list">
                                        <Table history={this.props.history} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <NotPermissions
                        title="Üzgünüz 😣"
                        imageAlt="Yetersiz Yetki"
                        content={() => (
                            <p className="text-muted text-center">
                                Öğrencileri görüntülemek için yetkiniz bulunmamaktadır.
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

export default Players;
