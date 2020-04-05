import React, { Component } from "react";
import { DetailEmployee } from "../../services/Employee.jsx";
import { ListVacations, DeleteVacation } from "../../services/EmployeeAction";
import { Vacation as ModalVacation } from "../EmployeeAction/Vacation";
import { showSwal, Toast } from "../Alert.jsx";
import Tabs from "../../components/Employees/Tabs";
import PersonCard from "./PersonCard.jsx";
import { formatDate, formatMoney, CheckPermissions } from "../../services/Others.jsx";

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

export class Vacation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            to: props.match.params.uid,
            loading: "active",
            list: []
        };
    }

    componentDidMount() {
        this.detailEmployee();
        this.renderVacationList();
    }

    detailEmployee = () => {
        const { uid, to } = this.state;
        DetailEmployee({
            uid: uid,
            to: to
        }).then(response => {
            if (response !== null) {
                const status = response.status;
                const stateData = {};
                stateData.body = {};
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
                "employee"
            ).then(response => {
                console.log(response);
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) this.setState({ list: response.data });
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
            const { uid, name } = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı personelin <b>#${key}</b> nolu iznini iptal etmek istediğinize emin misiniz?`,
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
                    }).then(response => this.reload());
                }
            });
        } catch (e) {}
    };

    render() {
        const { to, list } = this.state;
        const { match } = this.props;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Personel Detay &mdash; İzin Geçmişi</h1>
                    <div className="col" />
                    <div className="col-auto px-0">
                        <Tabs match={match} to={to} />
                    </div>
                </div>
                <div className="row">
                    <PersonCard data={this.state} history={this.props.history} />

                    <div className="col-lg-8 col-sm-12 col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">İzin Geçmişi</h3>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover table-outline table-vcenter text-nowrap card-table text-center">
                                    <thead>
                                        <tr>
                                            <th className="w-1">Başlangıç Tarihi</th>
                                            <th className="w-1">Bitiş Tarihi</th>
                                            <th className="w-1">Gün Sayısı</th>
                                            <th className="w-1">Günlük Kesinti Ücreti</th>
                                            <th className="w-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.length > 0
                                            ? list.map((el, key) => {
                                                  return (
                                                      <tr key={key.toString()}>
                                                          <td>{formatDate(el.start, "LL")}</td>
                                                          <td>{formatDate(el.end, "LL")}</td>
                                                          <td>{el.day}</td>
                                                          <td>{formatMoney(el.daily_amount)}</td>
                                                          <td className="text-right">
                                                              {CheckPermissions(["e_write"]) && (
                                                                  <button
                                                                      className="btn btn-sm btn-icon btn-secondary"
                                                                      onClick={() =>
                                                                          this.deleteVacation(el.vacation_id, key + 1)
                                                                      }
                                                                      data-toggle="tooltip"
                                                                      title="İptal et">
                                                                      <i className="fe fe-x"></i>
                                                                  </button>
                                                              )}
                                                          </td>
                                                      </tr>
                                                  );
                                              })
                                            : noRow()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Vacation;
