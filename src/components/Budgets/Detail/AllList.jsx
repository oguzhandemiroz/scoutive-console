import React, { Component } from "react";
import ReactDOM from "react-dom";
import { datatable_turkish, getCookie } from "../../../assets/js/core";
import ep from "../../../assets/js/urls";
import { nullCheck, formatMoney, formatDate } from "../../../services/Others";
import "../../../assets/css/datatables.responsive.css";
import { fatalSwal, errorSwal } from "../../Alert.jsx";
import { withRouter, Link, BrowserRouter } from "react-router-dom";
import moment from "moment";
import "moment/locale/tr";
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

export class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID")
        };
    }

    componentDidMount() {
        const { uid } = this.state;
        const { bid } = this.props.match.params;

        $(this.refs.incometable).DataTable({
            dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
            responsive: {
                details: {
                    type: "column",
                    target: 0,
                    renderer: function(api, rowIdx, columns) {
                        var tbl = $('<table class="w-100"/>');
                        var found = false;
                        var data = $.map(columns, function(col, i) {
                            if (col.hidden) {
                                $(`<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                                <th class="w-1 text-wrap">${col.title}</th> 
                                </tr>`)
                                    .append(
                                        $("<td class='text-wrap'/>").append(
                                            _childNodes(api, col.rowIndex, col.columnIndex)
                                        )
                                    )
                                    .appendTo(tbl);
                                found = true;
                            }
                        });

                        return found ? tbl : false;
                    }
                }
            },
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
            order: [1, "asc"],
            ajax: {
                url: ep.ACCOUNTING_LIST,
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
                        filter: { budget_id: bid }
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
                    $.fn.dataTable.ext.search = [];
                    if (d.status.code !== 1020) {
                        errorSwal(d.status);
                        return [];
                    } else return d.data;
                }
            },
            columns: [
                {
                    data: null,
                    defaultContent: ""
                },
                {
                    data: "accounting_id",
                    class: "w-1",
                    responsivePriority: 10001,
                    render: function(data, type, row, meta) {
                        if (["sort", "type"].indexOf(type) > -1) {
                            return meta.row;
                        }
                        return `<div class="text-muted">#${data}</div>`;
                    }
                },
                {
                    data: "accounting_type",
                    responsivePriority: 1,
                    render: function(data, type, row) {
                        return `<div class="font-weight-600">${data}</div>
                        <div class="small text-muted text-break">${nullCheck(row.note, "")}</div>`;
                    }
                },
                {
                    data: "amount",
                    responsivePriority: 2,
                    render: function(data, type) {
                        if (["sort", "type"].indexOf(type) > -1) {
                            return data;
                        }
                        if (data !== null && data !== "") return formatMoney(data);
                    }
                },
                {
                    data: "payment_date",
                    responsivePriority: 3,
                    render: function(data, type) {
                        if (["sort", "type"].indexOf(type) > -1) {
                            return moment(data, "YYYY-MM-DD").unix();
                        }
                        return `<td class="text-nowrap">${formatDate(data, "LL")}</td>`;
                    }
                },
                {
                    data: "created_date",
                    responsivePriority: 4,
                    render: function(data, type) {
                        if (["sort", "type"].indexOf(type) > -1) {
                            return moment(data, "YYYY-MM-DD").unix();
                        }
                        return `<td class="text-nowrap">${formatDate(data, "LL")}</td>`;
                    }
                },
                {
                    data: null
                },
                {
                    data: null
                }
            ],
            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: [0]
                },
                {
                    targets: "no-sort",
                    orderable: false
                },
                {
                    targets: "budget",
                    createdCell: (td, cellData, rowData) => {
                        ReactDOM.render(
                            <div
                                onClick={() =>
                                    this.props.history.push("/app/budgets/detail/" + cellData.budget.budget_id)
                                }
                                className="btn-link cursor-pointer text-inherit">
                                {cellData.budget.budget_name}
                            </div>,
                            td
                        );
                    }
                },
                {
                    targets: "detail",
                    class: "w-1",
                    createdCell: (td, cellData, rowData) => {
                        ReactDOM.render(
                            <button
                                onClick={() =>
                                    this.props.history.push("/app/accountings/detail/" + rowData.accounting_id)
                                }
                                data-toggle="tooltip"
                                title="İşlemi Görüntüle"
                                className="btn btn-icon btn-sm btn-secondary mx-1">
                                <i className="fe fe-eye" />
                            </button>,
                            td
                        );
                    }
                }
            ]
        });

        $.fn.DataTable.ext.errMode = "none";
        $(this.refs.incometable).on("error.dt", function(e, settings, techNote, message) {
            console.log("An error has been reported by DataTables: ", message, techNote);
        });
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Tüm İşlemler</h3>
                </div>
                <div className="table-responsive">
                    <table
                        ref="incometable"
                        className="table card-table w-100 table-vcenter table-striped text-nowrap datatable">
                        <thead>
                            <tr>
                                <th className="w-1 no-sort control" />
                                <th className="accounting_id">#</th>
                                <th className="accounting_type">İşlem</th>
                                <th className="amount">Tutar</th>
                                <th className="payment_date">Ödeme Tarihi</th>
                                <th className="created_date">İşlem Tarihi</th>
                                <th className="budget no-sort">Kasa/Banka</th>
                                <th className="detail no-sort w-1"></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        );
    }
}

export default withRouter(List);
