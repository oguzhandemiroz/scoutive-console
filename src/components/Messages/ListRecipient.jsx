import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link, withRouter } from "react-router-dom";
import { datatable_turkish } from "../../assets/js/core";
import { formatDate, fullnameGenerator, nullCheck, avatarPlaceholder, formatPhone } from "../../services/Others.jsx";
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

const personTypeToText = {
    1: "players",
    2: "persons/employees",
    3: "persons/parents"
};

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

    componentDidUpdate() {
        $('[data-toggle="popover"]').popover({
            html: true,
            trigger: "hover"
        });
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
                            const { uid, name, surname, person_type } = rowData;
                            const fullname = fullnameGenerator(name, surname);
                            ReactDOM.render(
                                <div
                                    className="text-inherit font-weight-600 btn-link cursor-pointer"
                                    onClick={() =>
                                        this.props.history.push(`/app/${personTypeToText[person_type]}/detail/${uid}`)
                                    }>
                                    {fullname}
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
                        data: null,
                        defaultContent: ""
                    },
                    {
                        data: "image",
                        responsivePriority: 6,
                        class: "text-center",
                        render: function(data, type, row) {
                            const { name, surname } = row;
                            return `<div class="avatar text-uppercase" style="background-image: url(${data || ""})">
                                    ${avatarPlaceholder(name, surname)}
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
                        data: "message.to",
                        responsivePriority: 2,
                        render: function(data, type, row) {
                            return formatPhone(data);
                        }
                    },
                    {
                        data: "message.operator",
                        responsivePriority: 10011,
                        render: function(data, type, row) {
                            return nullCheck(data);
                        }
                    },
                    {
                        data: "message.sent_date",
                        responsivePriority: 4,
                        render: function(data, type, row) {
                            return formatDate(data, "DD MMMM YYYY, HH:mm");
                        }
                    },
                    {
                        data: "message.content",
                        responsivePriority: 10012,
                        className: "none",
                        render: function(data, type, row) {
                            return nullCheck(data);
                        }
                    },
                    {
                        data: "message.status",
                        render: function(data, type, row) {
                            if (Object.keys(row.message).length > 0) {
                                const badgeColor =
                                    data.code === "0" ? "warning" : data.code === "1" ? "success" : "danger";
                                const messageText =
                                    data.code === "0" ? "kuyrukta" : data.code === "1" ? "iletildi" : "iletilemedi";
                                return `<span class="badge badge-${badgeColor}" data-toggle="popover" data-content="
                                    <p><strong>Durum Açıklaması:</strong></p><span class='text-${badgeColor}'>${data.description}</span>
                                ">${messageText}</span>`;
                            } else {
                                return `<span class="badge badge-info" data-toggle="popover" data-content="<span class='text-info'>İşleniyor</span>">işleniyor...</span>`;
                            }
                        }
                    }
                ]
            });

            $.fn.DataTable.ext.errMode = "none";
            table.on("error.dt", function(e, settings, techNote, message) {
                console.log("An error has been reported by DataTables: ", message, techNote);
            });
        } catch (e) {
            console.log("Table [ERROR] ", e);
        }
    };

    render() {
        return (
            <div className="table-responsive">
                <table
                    id="message-recipient-list"
                    className="table card-table w-100 table-vcenter table-striped text-nowrap datatable dataTable">
                    <thead>
                        <tr>
                            <th className="uid">UID</th>
                            <th className="w-1 no-sort control" />
                            <th className="w-1 text-center no-sort">#</th>
                            <th className="name">AD SOYAD</th>
                            <th className="to">TELEFON</th>
                            <th className="operator">OPERATOR</th>
                            <th className="sent_date">GÖNDERİM TARİHİ</th>
                            <th className="content">İÇERİK</th>
                            <th className="code_message">DURUM</th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default withRouter(ListRecipient);
