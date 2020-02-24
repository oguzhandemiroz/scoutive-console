import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { datatable_turkish, getCookie } from "../../../assets/js/core";
import { fullnameGenerator, formatPhone, nullCheck } from "../../../services/Others";
import { GetPlayerParents } from "../../../services/Player";
import { fatalSwal, errorSwal } from "../../Alert.jsx";
import ep from "../../../assets/js/urls";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import "../../../assets/css/datatables.responsive.css";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

const dailyType = {
    "-1": { icon: "help-circle", color: "gray", text: "Tanımsız" },
    "0": { icon: "x", color: "danger", text: "Gelmedi" },
    "1": { icon: "check", color: "success", text: "Geldi" },
    "2": { icon: "alert-circle", color: "warning", text: "T. Gün İzinli" },
    "3": { icon: "alert-circle", color: "warning", text: "Y. Gün İzinli" }
};

const rollcallType = {
    0: { icon: "fe-x", badge: "bg-red-light", text: "Gelmedi", color: "text-red" },
    1: { icon: "fe-check", badge: "bg-green-light", text: "Geldi", color: "text-green" },
    2: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Tam Gün", color: "text-yellow" },
    3: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Yarın Gün", color: "text-yellow" }
};

var statusType = {
    0: { bg: "bg-danger", title: "Pasif" },
    1: { bg: "bg-success", title: "Aktif" },
    2: { bg: "bg-azure", title: "Donuk" },
    3: { bg: "bg-indigo", title: "Ön Kayıt" }
};

var _childNodeStore = {};
function _childNodes(dt, row, col) {
    var name = row + "-" + col;

    if (_childNodeStore[name]) {
        return _childNodeStore[name];
    }

    // https://jsperf.com/childnodes-array-slice-vs-loop
    var nodes = [];
    var children = dt.cell(row, col).node().childNodes;
    for (var i = 0, ien = children.length; i < ien; i++) {
        nodes.push(children[i]);
    }

    _childNodeStore[name] = nodes;

    return nodes;
}

export class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            players: null,
            loadingData: true
        };
    }

    componentDidMount() {
        this.renderDataTable();
    }

    renderDataTable = () => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        const table = $("#rollcall-list").DataTable({
            dom: '<"top"f>rt<"bottom"ilp><"clear">',
            responsive: {
                details: {
                    type: "column",
                    target: 2,
                    renderer: function(api, rowIdx, columns) {
                        var tbl = $('<table class="w-100"/>');
                        var found = false;
                        var data = $.map(columns, function(col, i) {
                            if (col.hidden) {
                                $(`<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                                <th class="w-1">${col.title}</th> 
								</tr>`)
                                    .append($("<td/>").append(_childNodes(api, col.rowIndex, col.columnIndex)))
                                    .appendTo(tbl);
                                found = true;
                            }
                        });

                        return found ? tbl : false;
                    }
                }
            },
            order: [4, "asc"],
            aLengthMenu: [
                [30, 50, 100, -1],
                [30, 50, 100, "Tümü"]
            ],
            stateSave: false,
            language: {
                ...datatable_turkish,
                decimal: ",",
                thousands: "."
            },
            ajax: {
                url: ep.ROLLCALL_LIST_TYPE + "players",
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
                        return d.extra_data === 2
                            ? []
                            : d.data.filter(x => x.status === 1).filter(x => x.is_trial === 0);
                    }
                }
            },
            columnDefs: [
                {
                    targets: [0, 1],
                    visible: false
                },
                {
                    className: "control",
                    orderable: false,
                    targets: [2]
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
                        if (["sort", "type"].indexOf(type) > -1) {
                            return fullname;
                        }
                    },
                    createdCell: (td, cellData, rowData) => {
                        const { uid, name, surname } = rowData;
                        const fullname = fullnameGenerator(name, surname);
                        ReactDOM.render(
                            <div
                                className="text-inherit font-weight-600 btn-link cursor-pointer"
                                onClick={() => this.props.history.push(`/app/players/detail/${uid}`)}>
                                {fullname}
                            </div>,
                            td
                        );
                    }
                },
                {
                    targets: "parents",
                    responsivePriority: 3,
                    createdCell: (td, cellData, rowData) => {
                        const { player_id } = rowData;
                        ReactDOM.render(
                            <button
                                onClick={el => this.getPlayerParents(el, player_id)}
                                className="btn btn-secondary btn-sm btn-icon">
                                <i className="fa fa-user mr-1" /> Velisi
                            </button>,
                            td
                        );
                    }
                },
                {
                    targets: "groups",
                    responsivePriority: 10007,
                    createdCell: (td, cellData, rowData) => {
                        const { groups } = rowData;
                        ReactDOM.render(
                            <>
                                {groups.length > 0
                                    ? groups.map(el => (
                                          <div
                                              key={el.value.toString()}
                                              className="d-block text-inherit btn-link cursor-pointer"
                                              to={`/app/groups/detail/${el.value}`}
                                              onClick={() => this.props.history.push(`/app/groups/detail/${el.value}`)}>
                                              {el.label}
                                          </div>
                                      ))
                                    : "—"}
                            </>,
                            td
                        );
                    }
                },
                {
                    targets: "rollcalls",
                    responsivePriority: 10002,
                    createdCell: (td, cellData, rowData) => {
                        ReactDOM.render(
                            <div>
                                {cellData.rollcalls.map((el, key) => {
                                    return (
                                        <span
                                            key={key.toString()}
                                            data-placement="top"
                                            data-content={`
                                            <p><b>${moment(el.rollcall_date).format("LL, dddd")}</b></p>
                                            Durum: <b class="${rollcallType[el.status].color}">${
                                                rollcallType[el.status].text
                                            }</b>
                                            ${
                                                el.note ? `<hr class="my-2"/><b>Not:</b> ${el.note}<br>` : ""
                                            }                                            
                                        `}
                                            data-toggle="popover"
                                            className={`d-inline-flex justify-content-center align-items-center mr-1 badge ${
                                                rollcallType[el.status].badge
                                            }`}>
                                            <i className={`fe ${rollcallType[el.status].icon}`} />
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
                    data: null,
                    defaultContent: ""
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
                            ? statusType[status].title + " & Ön Kayıt Öğrenci"
                            : statusType[status].title + " Öğrenci";
                        return `<div class="avatar text-uppercase" style="background-image: url(${data || ""})">
									${data ? "" : name.slice(0, 1) + surname.slice(0, 1)}
									<span class="avatar-status ${renderBg}" data-toggle="tooltip" title="${renderTitle}"></span>
								</div>`;
                    }
                },
                {
                    data: "name",
                    responsivePriority: 1,
                    render: function(data, type, row) {
                        const fullname = fullnameGenerator(data, row.surname);
                        if (["sort", "type"].indexOf(type) > -1) {
                            return fullname;
                        }
                        if (data)
                            return `<a class="text-inherit font-weight-600" href="/app/players/detail/${row.uid}">${fullname}</a>`;
                    }
                },
                { data: null },
                {
                    data: "birthday",
                    responsivePriority: 10005,
                    render: function(data, type, row) {
                        if (["sort", "type"].indexOf(type) > -1) {
                            return data ? data.split(".")[0] : data;
                        }

                        if (data && data !== "") return moment(data).format("YYYY");
                        else return "&mdash;";
                    }
                },
                {
                    data: "groups",
                    responsivePriority: 10008,
                    render: function(data, type) {
                        if (["sort", "type", "display"].indexOf(type) > -1) {
                            return _(data)
                                .groupBy("label")
                                .keys("label")
                                .join(", ");
                        }

                        return JSON.stringify(data);
                    }
                },
                { data: null },
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
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover({
                html: true,
                trigger: "hover"
            });
        });

        table.on("responsive-display", function(e, datatable, row, showHide, update) {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover({
                html: true,
                trigger: "hover"
            });
        });
    };

    getPaidStatus = (fee, amount) => {
        try {
            if (amount === 0) {
                return 0;
            } else {
                return amount >= fee ? 1 : 2;
            }
        } catch (e) {}
    };

    formatPaidDate = date => {
        try {
            const splitDate = date.split(",");
            const firstDate = moment(splitDate[0]);
            const secondDate = moment(splitDate[1]);
            const diff = Math.ceil(moment(secondDate).diff(moment(firstDate), "months", true));

            return `${firstDate.format("MMMM")} ${firstDate.format("YYYY")} - ${secondDate.format(
                "MMMM"
            )} ${secondDate.format("YYYY")} (${diff} aylık)`;
        } catch (e) {}
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

    getPlayerParents = (el, player_id) => {
        const { uid } = this.state;
        const element = el.currentTarget;
        const that = this;
        this.addButtonLoading(element);
        GetPlayerParents({ uid: uid, player_id: player_id }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    that.showParents(element, data);
                }
            }
        });
    };

    addButtonLoading = element => {
        $(element).addClass("btn-loading");
    };

    removeButtonLoading = element => {
        $(element).removeClass("btn-loading");
    };

    showParents = (element, data) => {
        const $parent = $(element).parent();
        if (data.length === 0) {
            $parent.html(`<div class="text-muted font-italic">Veli bulunamadı...</div>`);
        } else {
            $parent.empty();
            data.map(el => {
                const fullname = fullnameGenerator(el.name, el.surname);
                $parent.append(`
                    <a href="/app/persons/parents/detail/${el.uid}"
                    class="text-inherit" 
                    data-toggle="popover" 
                    data-placement="top" 
                    data-content='
                        <p class="text-azure font-weight-600 h6">${fullname}
                            <span class="text-muted ml-1">
                                (${el.kinship})
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Telefon</strong>
                            <span class="text-muted">
                                ${formatPhone(el.phone)}
                            </span>
                        </p>
						<strong class="d-block">Email</strong>
						<span class="text-muted">
							${nullCheck(el.email)}
						</span>
                    '>
						${fullname}
                    </a>
                    <br/>
                `);
            });

            $('[data-toggle="popover"]').popover({
                html: true,
                trigger: "hover"
            });
        }
    };

    render() {
        const { rollcall } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        Yoklamalar &mdash; Öğrenci &mdash; Yoklama Geçmişi (#{this.props.match.params.rcid || 0})
                    </h1>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-status bg-azure" />
                                <h3 className="card-title">Öğrenci Listesi</h3>
                                <div className="card-options">
                                    <span
                                        className="form-help bg-gray-dark text-white"
                                        data-toggle="popover"
                                        data-placement="bottom"
                                        data-content='<p>Yoklama yapılırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar gün sonunda otomatik olarak tamamlanır. İşaretlenmemiş olanlar, sisteme <b>"gelmedi"</b> şeklinde tanımlanır.</p><p><b class="text-red">Not:</b> Yoklama tamamlana kadar değişiklik yapabilirsiniz. Tamamlanan yoklamalarda değişiklik <b><u><i>yapılamaz.</i></u></b></p>'>
                                        !
                                    </span>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6 col-lg-3">
                                        <div className="card p-3 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="stamp stamp-md bg-green-light d-flex justify-content-center align-items-center mr-3">
                                                    <i className="fe fe-check"></i>
                                                </span>
                                                <div className="d-flex flex-column">
                                                    <div className="small text-muted">Toplam</div>
                                                    <div>{this.generateRollcallTotalCount(rollcall, 1, "Geldi")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-3">
                                        <div className="card p-3 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="stamp stamp-md bg-red-light d-flex justify-content-center align-items-center mr-3">
                                                    <i className="fe fe-x"></i>
                                                </span>
                                                <div className="d-flex flex-column">
                                                    <div className="small text-muted">Toplam</div>
                                                    <div>{this.generateRollcallTotalCount(rollcall, 0, "Gelmedi")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6 col-lg-3">
                                        <div className="card p-3 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="stamp stamp-md bg-yellow-light d-flex justify-content-center align-items-center mr-3">
                                                    <i className="fe fe-alert-circle"></i>
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
                                    <div className="col-sm-12 col-md-6 col-lg-3">
                                        <div className="card p-3 mb-2">
                                            <div className="d-flex align-items-center">
                                                <span className="stamp stamp-md bg-gray d-flex justify-content-center align-items-center mr-3">
                                                    <i className="fe fe-help-circle"></i>
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
                                                <th className="w-1 no-sort control" />
                                                <th className="w-1 text-center no-sort"></th>
                                                <th className="name">AD SOYAD</th>
                                                <th className="parents">VELİSİ</th>
                                                <th className="birthday">DOĞUM YILI</th>
                                                <th className="groups">GRUP</th>
                                                <th className="w-1 text-nowrap no-sort rollcalls">SON 3 YOKLAMA</th>
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

export default Detail;
