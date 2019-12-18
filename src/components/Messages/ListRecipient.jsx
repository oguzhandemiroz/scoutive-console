import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, withRouter } from "react-router-dom";
import { datatable_turkish } from "../../assets/js/core";
import { formatDate, fullnameGenerator, nullCheck } from "../../services/Others.jsx";
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

export class ListRecipient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID")
        };
    }

    componentDidMount() {
        const { recipients } = this.props;
        if (recipients) this.renderList(recipients);
    }

    componentWillReceiveProps(nextProps) {
        const { recipients } = this.props;
        if (recipients !== nextProps.recipients) {
            this.renderList(nextProps.recipients);
        }
    }

    componentWillUnmount() {
        $(".data-table-wrapper")
            .find("table")
            .DataTable()
            .destroy(true);
    }

    renderList = data => {
        try {
            const table = $("#message-recipient-list").DataTable({
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
                data: data,
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
                                        to={"/app/players/detail/" + uid}
                                        onClick={() => this.props.history.push(`/app/players/detail/${uid}`)}>
                                        {fullname}
                                    </Link>
                                </BrowserRouter>,
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
                        data: null,
                        defaultContent: ""
                    },
                    {
                        data: "image",
                        class: "text-center",
                        render: function(data, type, row) {
                            console.log(data);
                            const { name, surname } = row;
                            return `<div class="avatar text-uppercase" style="background-image: url(${data || ""})">
                                    ${data ? "" : name.slice(0, 1) + surname.slice(0, 1)}
                                </div>`;
                        }
                    },
                    {
                        data: "name",
                        responsivePriority: 1,
                        render: function(data, type, row) {
                            const fullname = fullnameGenerator(data, row.surname);
                            return fullname;
                        }
                    },
                    {
                        data: "message.operator",
                        render: function(data, type, row) {
                            return nullCheck(data);
                        }
                    },
                    {
                        data: "message.sent_date",
                        render: function(data, type, row) {
                            return formatDate(data, "DD MMMM YYYY, HH:mm");
                        }
                    },
                    {
                        data: "message.status",
                        render: function(data, type, row) {
                            return nullCheck(data);
                        }
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
    };

    render() {
        return (
            <table
                id="message-recipient-list"
                className="table card-table w-100 table-vcenter table-striped text-nowrap datatable dataTable">
                <thead>
                    <tr>
                        <th className="uid">UID</th>
                        <th className="w-1 no-sort control" />
                        <th className="w-1 text-center no-sort">#</th>
                        <th className="name">AD SOYAD</th>
                        {/* <th className="phone">TELEFON</th> */}
                        <th className="operator">OPERATOR</th>
                        <th className="sent_date">GÖNDERİM TARİHİ</th>
                        <th className="code_message">DURUM</th>
                    </tr>
                </thead>
            </table>
        );
    }
}

export default withRouter(ListRecipient);