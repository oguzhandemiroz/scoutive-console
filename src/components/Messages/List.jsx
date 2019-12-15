import React, { Component } from "react";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import { datatable_turkish, getCookie } from "../../assets/js/core";
import ep from "../../assets/js/urls";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
import "../../assets/css/datatables.responsive.css";
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
        try {
            const { uid } = this.state;
            const table = $("#messages-list").DataTable({
                dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
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
                        data: "title"
                    },
                    {
                        data: "template",
                        render: function(data, type, row) {
                            return data.template_name;
                        }
                    },
                    {
                        data: "person_count"
                    },
                    {
                        data: "when"
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
                            <th className="title">MESAJ ADI</th>
                            <th className="template">ŞABLON</th>
                            <th className="person_count">GÖNDERİLEN KİŞİ SAYISI</th>
                            <th className="when">GÖNDERİM TARİHİ</th>
                            <th className="status">DURUM</th>
                            <th className="no-sort action" />
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
