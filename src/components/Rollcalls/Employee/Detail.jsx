import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, withRouter } from "react-router-dom";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";
import { WarningModal as Modal } from "../WarningModal";
import { datatable_turkish, getCookie } from "../../../assets/js/core";
import ep from "../../../assets/js/urls";
import { fatalSwal, errorSwal } from "../../Alert.jsx";
import { fullnameGenerator } from "../../../services/Others";
const $ = require("jquery");
$.DataTable = require("datatables.net");

const dailyType = {
    "-1": { icon: "help-circle", color: "gray", text: "Tanımsız" },
    "0": { icon: "x", color: "danger", text: "Gelmedi" },
    "1": { icon: "check", color: "success", text: "Geldi" },
    "2": { icon: "alert-circle", color: "warning", text: "T. Gün İzinli" },
    "3": { icon: "alert-circle", color: "warning", text: "Y. Gün İzinli" }
};
var statusType = {
    0: { bg: "bg-danger", title: "Pasif" },
    1: { bg: "bg-success", title: "Aktif" },
    2: { bg: "bg-azure", title: "Donuk" },
    3: { bg: "bg-indigo", title: "Ön Kayıt" }
};

const initialState = {
    advance: false
};

export class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            ...initialState,
            employees: null,
            statuses: [],
            onLoadedData: false,
            loadingButtons: []
        };
    }

    componentDidMount() {
        this.renderDataTable();
    }

    componentWillUnmount() {
        $(".data-table-wrapper")
            .find("table")
            .DataTable()
            .destroy(true);
    }

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    renderDataTable = () => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        const table = $("#rollcall-list").DataTable({
            dom: '<"top"f>rt<"bottom"ilp><"clear">',
            responsive: false,
            order: [3, "asc"],
            aLengthMenu: [
                [30, 50, 100, -1],
                [30, 50, 100, "Tümü"]
            ],
            stateSave: false, // change true
            language: {
                ...datatable_turkish,
                decimal: ",",
                thousands: "."
            },
            ajax: {
                url: ep.ROLLCALL_LIST_TYPE + "employees",
                type: "POST",
                datatype: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("Content-Type", "application/json");
                    request.setRequestHeader("XIP", getCookie("IPADDR"));
                    request.setRequestHeader("Authorization", localStorage.getItem("UID"));
                },
                data: function(d) {
                    return JSON.stringify({
                        uid: uid,
                        rollcall_id: rcid
                    });
                },
                contentType: "application/json",
                complete: function(res) {
                    try {
                        console.log(res);
                        if (res.responseJSON.status.code !== 1020) {
                            if (res.status !== 200) fatalSwal();
                            else errorSwal(res.responseJSON.status);
                        }
                    } catch (e) {
                        fatalSwal(true);
                    }
                },
                dataSrc: d => {
                    console.log(d);
                    if (d.status.code !== 1020) {
                        errorSwal(d.status);
                        return [];
                    } else {
                        if (d.extra_data === 2) this.props.history.goBack();
                        const statusList = [];
                        d.data.map(el => {
                            statusList.push({
                                uid: el.uid,
                                status: el.daily
                            });
                        });
                        this.setState({ statuses: statusList, rollcall: d.data });
                        return d.extra_data === 2 ? [] : d.data.filter(x => x.status === 1);
                    }
                }
            },
            columnDefs: [
                {
                    targets: [0, 1],
                    visible: false
                },
                {
                    targets: "no-sort",
                    orderable: false
                },
                {
                    targets: "name",
                    responsivePriority: 1,
                    render: function(data, type, row) {
                        const fullname = fullnameGenerator(data, row.surname);
                        if (type === "sort" || type === "type") {
                            return fullname;
                        }
                    },
                    createdCell: (td, cellData, rowData) => {
                        const { uid, name, surname } = rowData;
                        const fullname = fullnameGenerator(name, surname);
                        ReactDOM.render(
                            <BrowserRouter>
                                <Link
                                    className="text-inherit font-weight-600"
                                    to={"/app/employees/detail/" + uid}
                                    onClick={() => this.props.history.push(`/app/employees/detail/${uid}`)}>
                                    {fullname}
                                </Link>
                            </BrowserRouter>,
                            td
                        );
                    }
                },
                {
                    targets: "rollcalls",
                    responsivePriority: 10002,
                    createdCell: (td, cellData, rowData) => {
                        const status_type = {
                            0: { icon: "fe-x", badge: "bg-red-light", text: "Gelmedi" },
                            1: { icon: "fe-check", badge: "bg-green-light", text: "Geldi" },
                            2: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Tam Gün" },
                            3: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Yarın Gün" }
                        };
                        ReactDOM.render(
                            <div>
                                {cellData.rollcalls.map((el, key) => {
                                    return (
                                        <span
                                            key={key.toString()}
                                            title={
                                                status_type[el.status].text +
                                                ": " +
                                                moment(el.rollcall_date).format("LL")
                                            }
                                            data-toggle="tooltip"
                                            className={`d-inline-flex justify-content-center align-items-center mr-1 badge ${
                                                status_type[el.status].badge
                                            }`}>
                                            <i className={`fe ${status_type[el.status].icon}`} />
                                        </span>
                                    );
                                })}
                            </div>,
                            td
                        );
                    }
                }
            ],
            columns: [
                {
                    data: "uid"
                },
                {
                    data: "security_id"
                },
                {
                    data: "image",
                    class: "text-center",
                    render: function(data, type, row) {
                        var name = row.name;
                        var surname = row.surname;
                        var status = row.status;
                        var renderBg = row.is_trial ? statusType[3].bg : statusType[status].bg;
                        var renderTitle = row.is_trial
                            ? statusType[status].title + " & Ön Kayıt Personel"
                            : statusType[status].title + " Personel";
                        return `<div class="avatar text-uppercase" style="background-image: url(${data || ""})">
									${data ? "" : name.slice(0, 1) + surname.slice(0, 1)}
									<span class="avatar-status ${renderBg}" data-toggle="tooltip" title="${renderTitle}"></span>
								</div>`;
                    }
                },
                {
                    data: "name",
                    render: function(data, type, row) {
                        const fullname = fullnameGenerator(data, row.surname);
                        if (type === "sort" || type === "type") {
                            return fullname;
                        }
                        if (data)
                            return `<a class="text-inherit font-weight-600" href="/app/employees/detail/${row.uid}">${fullname}</a>`;
                    }
                },
                {
                    data: "phone",
                    render: function(data, type, row) {
                        const formatPhone = data ? Inputmask.format(data, { mask: "(999) 999 9999" }) : null;
                        if (formatPhone) return `<a href="tel:+90${data}" class="text-inherit">${formatPhone}</a>`;
                        else return "&mdash;";
                    }
                },
                {
                    data: "position"
                },
                {
                    data: null
                },
                {
                    data: "note",
                    render: function(data, type, row) {
                        return `<div class="text-break">${data || "—"}</div>`;
                    }
                },
                {
                    data: "daily",
                    class: "text-center",
                    render: function(data, type, row) {
                        return `<div
									data-toggle="tooltip"
									title="${dailyType[data].text}"
									class="text-${dailyType[data].color}"
									style="font-size: 20px">
									<i class="fe fe-${dailyType[data].icon}"/>
								</div>`;
                    }
                }
            ]
        });

        $.fn.DataTable.ext.errMode = "none";
        $("#rollcall-list").on("error.dt", function(e, settings, techNote, message) {
            console.log("An error has been reported by DataTables: ", message, techNote);
        });

        $("#rollcall-list").on("draw.dt", function() {
            console.log("draw.dt");
            $('[data-toggle="tooltip"]').tooltip();
        });
    };

    generateRollcallTotalCount = (rollcall, status, text) => {
        let total = 0;
        if (rollcall) {
            rollcall.map(el => {
                if (Array.isArray(status)) {
                    if (status.indexOf(el.daily) > -1) total++;
                } else {
                    if (el.daily === status) total++;
                }
            });
        }

        return (
            <h4 className="m-0">
                {total} <small>{text}</small>
            </h4>
        );
    };

    render() {
        const { rollcall } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        Yoklamalar &mdash; Personel &mdash; Yoklama Al (#{this.props.match.params.rcid})
                    </h1>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-status bg-azure" />
                                <h3 className="card-title">Personel Listesi</h3>
                                <div className="card-options">
                                    <span
                                        className="form-help bg-gray-dark text-white"
                                        data-toggle="popover"
                                        data-placement="bottom"
                                        data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"gelmedi"</b> şeklinde tanımlanır.</p><p><b className="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
                                        !
                                    </span>
                                    <Modal />
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div class="col-sm-12 col-md-6 col-lg-3">
                                        <div class="card p-3 mb-2">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-green-light d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-check"></i>
                                                </span>
                                                <div className="d-flex flex-column">
                                                    <div className="small text-muted">Toplam</div>
                                                    <div>{this.generateRollcallTotalCount(rollcall, 1, "Geldi")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-6 col-lg-3">
                                        <div class="card p-3 mb-2">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-red-light d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-x"></i>
                                                </span>
                                                <div className="d-flex flex-column">
                                                    <div className="small text-muted">Toplam</div>
                                                    <div>{this.generateRollcallTotalCount(rollcall, 0, "Gelmedi")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-6 col-lg-3">
                                        <div class="card p-3 mb-2">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-yellow-light d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-alert-circle"></i>
                                                </span>
                                                <div className="d-flex flex-column">
                                                    <div className="small text-muted">Toplam</div>
                                                    <div>
                                                        {this.generateRollcallTotalCount(rollcall, [2, 3], "İzinli")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-6 col-lg-3">
                                        <div class="card p-3 mb-2">
                                            <div class="d-flex align-items-center">
                                                <span class="stamp stamp-md bg-gray d-flex justify-content-center align-items-center mr-3">
                                                    <i class="fe fe-help-circle"></i>
                                                </span>
                                                <div className="d-flex flex-column">
                                                    <div className="small text-muted">Toplam</div>
                                                    <div>
                                                        {this.generateRollcallTotalCount(rollcall, -1, "Tanımsız")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table
                                        id="rollcall-list"
                                        className="table card-table w-100 table-vcenter table-hover datatable">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th className="w-1 no-sort">T.C.</th>
                                                <th className="w-1 text-center no-sort"></th>
                                                <th className="name">AD SOYAD</th>
                                                <th className="phone">TELEFON</th>
                                                <th className="position">POZİSYON</th>
                                                <th className="no-sort rollcalls">SON 3 YOKLAMA</th>
                                                <th className="w-10 no-sort note">NOT</th>
                                                <th className="w-2 no-sort daily">DURUM</th>
                                            </tr>
                                        </thead>
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

export default withRouter(Detail);
