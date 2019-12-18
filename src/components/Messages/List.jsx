import React, { Component } from "react";
import ReactDOM from "react-dom";
import { fatalSwal, errorSwal, showSwal } from "../Alert.jsx";
import { BrowserRouter, Link } from "react-router-dom";
import { datatable_turkish, getCookie } from "../../assets/js/core";
import ep from "../../assets/js/urls";
import _ from "lodash";
import "../../assets/css/datatables.responsive.css";
import { formatDate } from "../../services/Others.jsx";
import { CancelCampaign } from "../../services/Messages.jsx";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

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

const statusType = {
    0: { bg: "badge-secondary", title: "İptal" },
    1: { bg: "badge-warning", title: "Kuyrukta" },
    2: { bg: "badge-success", title: "Tamamlandı" },
    3: { bg: "badge-danger", title: "Tamamlanamadı" }
};

export class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID")
        };
    }

    componentDidMount() {
        try {
            const { uid } = this.state;
            const table = $("#messages-list").DataTable({
                dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
                responsive: {
                    details: {
                        type: "column",
                        target: 1,
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
                fixedHeader: true,
                order: [0, "desc"],
                aLengthMenu: [
                    [20, 50, 100, -1],
                    [20, 50, 100, "Tümü"]
                ],
                stateSave: false, // change true
                language: {
                    ...datatable_turkish,
                    decimal: ",",
                    thousands: "."
                },
                ajax: {
                    url: ep.CAMPAIGN_LIST,
                    type: "POST",
                    datatype: "json",
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/json");
                        request.setRequestHeader("XIP", getCookie("IPADDR"));
                        request.setRequestHeader("Authorization", localStorage.getItem("UID"));
                    },
                    data: function(d) {
                        return JSON.stringify({
                            uid: uid
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
                    dataSrc: function(d) {
                        console.log(d);
                        $.fn.dataTable.ext.search = [];
                        if (d.status.code !== 1020) {
                            errorSwal(d.status);
                            return [];
                        } else return d.data;
                    }
                },
                columnDefs: [
                    {
                        targets: [0],
                        visible: false
                    },
                    {
                        className: "control",
                        orderable: false,
                        targets: [1]
                    },
                    {
                        targets: "no-sort",
                        orderable: false
                    },
                    {
                        targets: "title",
                        className: "pl-5",
                        responsivePriority: 1,
                        render: function(data, type, row) {
                            return data + " " + row.template.template_name;
                        },
                        createdCell: (td, cellData, rowData) => {
                            const { campaign_id, title, template } = rowData;
                            ReactDOM.render(
                                <BrowserRouter>
                                    <div
                                        data-toggle="tooltip"
                                        title={template.template_name}
                                        className={`icon-placeholder icon-placeholder-xxs bg-${template.color}-lightest mr-3`}>
                                        <i className={`${template.icon} text-${template.color}`} />
                                    </div>
                                    <Link
                                        className="text-inherit font-weight-600"
                                        to={"/app/messages/detail/" + campaign_id}
                                        onClick={() => this.props.history.push(`/app/messages/detail/${campaign_id}`)}>
                                        {title}
                                    </Link>
                                </BrowserRouter>,
                                td
                            );
                        }
                    },
                    {
                        targets: "status",
                        responsivePriority: 2,
                        render: function(data, type, row) {
                            return data + " " + row.template.template_name;
                        },
                        createdCell: (td, cellData, rowData) => {
                            const { status } = rowData;
                            ReactDOM.render(
                                <span className={`badge ${statusType[status].bg}`}>{statusType[status].title}</span>,
                                td
                            );
                        }
                    },
                    {
                        targets: "action",
                        responsivePriority: 5,
                        createdCell: (td, cellData, rowData) => {
                            const { campaign_id, status, title } = rowData;
                            ReactDOM.render(
                                <BrowserRouter>
                                    <Link
                                        to={"/app/messages/detail/" + campaign_id}
                                        className="btn btn-icon btn-sm btn-secondary mx-1"
                                        onClick={() => this.props.history.push(`/app/messages/detail/${campaign_id}`)}>
                                        Görüntüle
                                    </Link>
                                    {status === 1 ? (
                                        <button
                                            className="btn btn-icon btn-sm btn-secondary mx-1"
                                            data-toggle="tooltip"
                                            onClick={() => this.cancelCampaign(campaign_id, title)}
                                            title="Mesajı İptal Et">
                                            <i className="fe fe-x" />
                                        </button>
                                    ) : null}
                                </BrowserRouter>,
                                td
                            );
                        }
                    }
                ],
                columns: [
                    {
                        data: "campaign_id"
                    },
                    {
                        data: null,
                        defaultContent: ""
                    },
                    {
                        data: "title",
                        render: function(data, type, row) {
                            return data + " " + row.template.template_name;
                        }
                    },
                    {
                        data: "person_count"
                    },
                    {
                        data: "when",
                        render: function(data, type, row) {
                            return formatDate(data, "DD MMMM YYYY, HH:mm");
                        }
                    },
                    {
                        data: "status"
                    },
                    {
                        data: null
                    }
                ]
            });

            $.fn.DataTable.ext.errMode = "none";
            table.on("error.dt", function(e, settings, techNote, message) {
                console.log("An error has been reported by DataTables: ", message, techNote);
            });

            table.on("draw.dt", function() {
                $('[data-toggle="tooltip"]').tooltip();
            });
        } catch (e) {
            console.log("e", e);
        }
    }

    componentWillUnmount() {
        $(".data-table-wrapper")
            .find("table")
            .DataTable()
            .destroy(true);
    }

    cancelCampaign = (campaign_id, name) => {
        const { uid } = this.state;
        showSwal({
            type: "warning",
            title: "Mesaj İptali",
            html: `${name} adlı mesaj iptal edilecektir.<br>Mesaj gönderimi olmayacaktır.<br>Onaylıyor musunuz?`,
            confirmButtonText: "Onaylıyorum",
            cancelButtonText: "İptal",
            confirmButtonColor: "#cd201f",
            cancelButtonColor: "#868e96",
            showCancelButton: true,
            reverseButtons: true
        }).then(re => {
            if (re.value) {
                CancelCampaign({
                    uid: uid,
                    campaign_id: campaign_id
                }).then(response => {
                    if (response) {
                        this.reload();
                    }
                });
            }
        });
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    render() {
        return (
            <div>
                <table
                    id="messages-list"
                    className="table card-table w-100 table-vcenter table-striped text-nowrap datatable dataTable">
                    <thead>
                        <tr>
                            <th className="campaign_id">ID</th>
                            <th className="w-1 no-sort control" />
                            <th className="title pl-5">MESAJ ADI</th>
                            <th className="person_count">KİŞİ SAYISI</th>
                            <th className="when">GÖNDERİM TARİHİ</th>
                            <th className="status">DURUM</th>
                            <th className="no-sort action w-1">İşlem</th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
