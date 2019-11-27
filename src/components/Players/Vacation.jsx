import React, { Component } from "react";
import { DetailPlayer } from "../../services/Player";
import { fullnameGenerator } from "../../services/Others";
import { ListVacations, DeleteVacation } from "../../services/PlayerAction";
import Tabs from "../../components/Players/Tabs";
import PersonCard from "./PersonCard";
import { Toast, showSwal } from "../Alert";

const noRow = loading => (
    <tr style={{ height: 80 }}>
        <td colSpan="6" className="text-center text-muted font-italic">
            {loading ? (
                <div className={`dimmer active`}>
                    <div className="loader" />
                    <div className="dimmer-content" />
                </div>
            ) : (
                "Kayıt bulunamadı..."
            )}
        </td>
    </tr>
);

const vacationStatus = {
    3: { type: "danger", text: "İptal" },
    1: { type: "success", text: "Aktif" },
    2: { type: "warning", text: "Tamamlandı" }
};

export class VacationPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            attributes: {},
            data: {},
            groups: [],
            loading: "active"
        };
    }

    componentDidMount() {
        this.detailPlayer();
        this.renderVacationList();
    }

    detailPlayer = () => {
        const { uid, to } = this.state;
        DetailPlayer({ uid: uid, to: to, attribute_values: [] }).then(response => {
            if (response !== null) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    delete data.uid;
                    this.setState({ ...data, loading: "" });
                }
            }
        });
    };

    renderVacationList = () => {
        try {
            const { uid, to } = this.state;
            this.setState({ loadingData: true });
            ListVacations(
                {
                    uid: uid,
                    to: to
                },
                "player"
            ).then(response => {
                console.log(response);
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) this.setState({ vacations: response.data.reverse() });
                }

                this.setState({ loadingData: false });
            });
        } catch (e) {}
    };

    reload = () => {
        setTimeout(() => {
            const current = this.props.history.location.pathname;
            this.props.history.replace("/app/reload");
            setTimeout(() => {
                this.props.history.replace(current);
            });
        }, 1000);
    };

    deleteVacation = (vid, key) => {
        try {
            const { uid, name, surname } = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${fullnameGenerator(
                    name,
                    surname
                )}</b> adlı öğrencinin <b>#${vid}</b> nolu iznini iptal etmek istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    DeleteVacation({
                        uid: uid,
                        vacation_id: vid
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                this.reload();
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    render() {
        const { to, vacations } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Öğrenci Detay &mdash; İzin Geçmişi</h1>
                    <div className="col" />
                    <div className="col-auto px-0">{<Tabs match={match} to={to} />}</div>
                </div>

                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">İzin Geçmişi</h3>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover table-outline table-vcenter text-nowrap card-table text-center">
                                        <thead>
                                            <tr>
                                                <th className="w-1">Başlangıç Tarihi</th>
                                                <th className="w-1">Bitiş Tarihi</th>
                                                <th className="w-1">Gün Sayısı</th>
                                                <th className="w-1">Durum</th>
                                                <th className="w-1"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vacations
                                                ? vacations.length > 0
                                                    ? vacations.map((el, key) => {
                                                          return (
                                                              <tr key={key.toString()}>
                                                                  <td>{el.start}</td>
                                                                  <td>{el.end}</td>
                                                                  <td>{el.day}</td>
                                                                  <td>
                                                                      <span
                                                                          className={`badge badge-${
                                                                              vacationStatus[el.status].type
                                                                          }`}>
                                                                          {vacationStatus[el.status].text}
                                                                      </span>
                                                                  </td>
                                                                  <td className="text-right">
                                                                      <button
                                                                          className="btn btn-sm btn-icon btn-secondary"
                                                                          onClick={() =>
                                                                              this.deleteVacation(
                                                                                  el.vacation_id,
                                                                                  key + 1
                                                                              )
                                                                          }
                                                                          data-toggle="tooltip"
                                                                          title="İptal et">
                                                                          <i className="fe fe-x"></i>
                                                                      </button>
                                                                  </td>
                                                              </tr>
                                                          );
                                                      })
                                                    : noRow()
                                                : noRow(true)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VacationPlayer;
