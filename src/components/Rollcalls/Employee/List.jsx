import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { CreateRollcall, ListRollcall } from "../../../services/Rollcalls";
import { Toast, showSwal } from "../../Alert";
import moment from "moment";
import "moment/locale/tr";
import Swal from "sweetalert2";
import { formatDate } from "../../../services/Others";

const noRow = loading => (
    <tr style={{ height: 80 }}>
        <td colSpan="3" className="text-center text-muted font-italic">
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

export class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            rollcallList: null,
            onLoadedData: true
        };
    }

    componentDidMount() {
        this.renderRollcallList();
    }

    renderRollcallList = () => {
        try {
            const { uid } = this.state;
            ListRollcall({
                uid: uid,
                type: 1
            }).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) {
                        this.setState({ rollcallList: response.data.reverse() });
                    }
                }
                this.setState({
                    loadingButton: false
                });
            });
        } catch (e) {}
    };

    createRollcall = () => {
        try {
            const { uid } = this.state;
            showSwal({
                type: "info",
                title: "Yoklama İsmi",
                html: `
                Yoklama ismi giriniz lütfen. (Opsiyonel)<br>
                Yoklama ismine tarih girmenize gerek yoktur. Otomatik olarak ismin sonunda tarih eklenecektir.
                <br><br>Aşağıdaki gibi gözükecektir<br>
                <strong class="text-orange">"Yoklama Adı - ${formatDate(Date(), "DD/MM/YYYY HH:mm")}"</strong>
            `,
                confirmButtonText: "Devam Et &rarr;",
                cancelButtonText: "İptal",
                cancelButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true,
                input: "text",
                inputAttributes: {
                    max: 50,
                    autocapitalize: "off"
                },
                inputValidator: value => {
                    return new Promise(resolve => {
                        const generatedValue = value
                            ? value + " - " + formatDate(Date(), "DD/MM/YYYY HH:mm")
                            : formatDate(Date(), "DD/MM/YYYY HH:mm");
                        showSwal({
                            type: "info",
                            title: "Bilgi",
                            html: `<strong>${formatDate(Date(), "LLL")} </strong> tarihinde 
                            <strong class="text-orange">${generatedValue}</strong> 
                            adında yoklama açılacaktır.<br>Onaylıyor musunuz?`,
                            confirmButtonText: "Onaylıyorum",
                            cancelButtonText: "İptal",
                            cancelButtonColor: "#868e96",
                            showCancelButton: true,
                            reverseButtons: true,
                            showLoaderOnConfirm: true,
                            preConfirm: res => {
                                return CreateRollcall({
                                    uid: uid,
                                    type: 1,
                                    title: generatedValue
                                })
                                    .then(response => {
                                        return response;
                                    })
                                    .catch(error => {
                                        Swal.showValidationMessage(`Hata oluştu: ${error}`);
                                    });
                            }
                        }).then(re => {
                            if (re.value) {
                                if (re.value) {
                                    const status = re.value.status;
                                    if (status.code === 1020) {
                                        Toast.fire({
                                            type: "success",
                                            title: "İşlem başarılı..."
                                        });
                                        this.props.history.push(`/app/rollcalls/employee/add/${re.value.rollcall_id}`);
                                    } else if (status.code === 2010) {
                                        showSwal({
                                            type: "warning",
                                            title: "Uyarı",
                                            text: status.description,
                                            reverseButtons: true,
                                            showCancelButton: true,
                                            confirmButtonText: "Yoklamaya devam et",
                                            cancelButtonText: "Kapat"
                                        }).then(result => {
                                            if (result.value) {
                                                this.props.history.push(
                                                    `/app/rollcalls/employee/add/${re.value.rollcall_id}`
                                                );
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            });
        } catch (e) {}
    };

    render() {
        const { rollcallList, onLoadedData } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <div className="card-status bg-azure" />
                    <h3 className="card-title">Geçmiş Yoklama Listesi</h3>
                    <div className="card-options">
                        <button onClick={this.createRollcall} className="btn btn-sm btn-success">
                            Yoklama Oluştur
                        </button>
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-outline table-vcenter text-nowrap card-table mb-0">
                            <thead>
                                <tr>
                                    <th className="pl-0 w-1" />
                                    <th>Yoklama Tarihi</th>
                                    <th className="text-center">
                                        Personel Katılımı
                                        <span
                                            className="form-help ml-2"
                                            data-original-title="Gelen/Toplam"
                                            data-toggle="tooltip"
                                            data-placement="top">
                                            ?
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rollcallList
                                    ? rollcallList.length > 0
                                        ? rollcallList.map((el, key) => {
                                              const redirect =
                                                  "/app/rollcalls/employee/" +
                                                  (el.status === 2 ? "add/" : "detail/") +
                                                  el.rollcall_id;
                                              return (
                                                  <tr key={key.toString()}>
                                                      <td className="text-center text-muted">
                                                          #{rollcallList.length - key}
                                                      </td>
                                                      <td>
                                                          {el.status === 2 ? (
                                                              <span className="badge badge-danger mr-2">
                                                                  Devam ediyor
                                                              </span>
                                                          ) : null}
                                                          <Link className="text-inherit font-weight-600" to={redirect}>
                                                              {el.title}
                                                          </Link>
                                                      </td>
                                                      <td className="text-center">{el.came + "/" + el.total}</td>
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
        );
    }
}

export default withRouter(List);
