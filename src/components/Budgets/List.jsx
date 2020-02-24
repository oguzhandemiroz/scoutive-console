import React, { Component } from "react";
import ep from "../../assets/js/urls";
import "../../assets/js/core";
import { datatable_turkish, getCookie } from "../../assets/js/core";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import { BrowserRouter, Link } from "react-router-dom";
import ReactDOM from "react-dom";
const $ = require("jquery");
$.DataTable = require("datatables.net");

const budgetType = {
    0: { icon: "briefcase", text: "Kasa" },
    1: { icon: "university", text: "Banka" }
};

const currencyType = {
    TRY: { icon: "lira-sign", text: "TRY", sign: "₺" },
    USD: { icon: "dollar-sign", text: "USD", sign: "$" },
    EUR: { icon: "euro-sign", text: "EUR", sign: "€" },
    GBP: { icon: "pound-sign", text: "GBP", sign: "£" }
};

var statusType = {
    "1": ["Aktif", "success"],
    "2": ["Pasif", "warning"]
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
            $("#budget-list").DataTable({
                dom: '<"top"f>rt<"bottom"ilp><"clear">',
                responsive: false,
                order: [0, "asc"],
                aLengthMenu: [
                    [10, 25, 50, 100, -1],
                    [10, 25, 50, 100, "Tümü"]
                ],
                stateSave: false, // change true
                language: {
                    ...datatable_turkish,
                    decimal: ",",
                    thousands: "."
                },
                ajax: {
                    url: ep.BUDGET_LIST,
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/json");
                        request.setRequestHeader("XIP", getCookie("IPADDR"));
                        request.setRequestHeader("Authorization", uid);
                    },
                    datatype: "json",
                    data: function(d) {
                        return JSON.stringify({
                            uid: uid
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
                            fatalSwal();
                        }
                    },
                    dataSrc: function(d) {
                        console.log("dataSrc", d);
                        if (d.status.code !== 1020) {
                            errorSwal(d.status);
                            return [];
                        } else return d.data;
                    }
                },
                columnDefs: [
                    {
                        targets: "no-sort",
                        orderable: false
                    },
                    {
                        targets: [0],
                        createdCell: (td, cellData) => {
                            ReactDOM.render(<i className={`fa fa-${budgetType[cellData].icon}`} />, td);
                        }
                    },
                    {
                        targets: "budget_name",
                        createdCell: (td, cellData, rowData) => {
                            ReactDOM.render(
                                <div
                                    onClick={() => this.props.history.push("/app/budgets/detail/" + rowData.budget_id)}
                                    className="btn-link cursor-pointer text-inherit"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    data-original-title={cellData}>
                                    {cellData}
                                </div>,
                                td
                            );
                        }
                    }
                ],
                columns: [
                    {
                        data: "budget_type"
                    },
                    {
                        data: "budget_name"
                    },
                    {
                        data: "budget_type",
                        render: function(data, type, row) {
                            return budgetType[data].text;
                        }
                    },
                    {
                        data: "balance",
                        render: function(data, type, row) {
                            if (["sort", "type"].indexOf(type) > -1) {
                                return data;
                            } else {
                                var convert = typeof data === "number" ? data.format(2, 3, ".", ",") : data;
                                convert = convert ? convert + " " + currencyType[row.currency].sign : "&mdash;";
                                return convert;
                            }
                        }
                    },
                    {
                        data: "currency",
                        render: function(data, type, row) {
                            return `${currencyType[data].sign} (${row.currency})`;
                        }
                    },
                    {
                        data: "status",
                        render: function(data, type, row) {
                            return (
                                '<span class="status-icon bg-' + statusType[data][1] + '"></span>' + statusType[data][0]
                            );
                        }
                    },
                    {
                        data: "default",
                        class: "text-center w-1",
                        render: function(data, type, row) {
                            return data ? '<span class="badge badge-primary">Varsayılan</span>' : null;
                        }
                    }
                ]
            });

            $.fn.DataTable.ext.errMode = "none";
            $("#budget-list").on("error.dt", function(e, settings, techNote, message) {
                console.log("An error has been reported by DataTables: ", message, techNote);
            });

            $("#budget-list").on("draw.dt", function() {
                $('[data-toggle="tooltip"]').tooltip();
            });
        } catch (e) {
            //fatalSwal();
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
                    id="budget-list"
                    className="table table-hover w-100 card-table table-vcenter text-nowrap datatable">
                    <thead>
                        <tr>
                            <th className="w-1 text-center budget_type no-sort"></th>
                            <th className="budget_name">HESAP ADI</th>
                            <th className="budget_type">HESAP TÜRÜ</th>
                            <th className="balance">BAKİYE</th>
                            <th className="currency">PARA BİRİMİ</th>
                            <th className="status">DURUM</th>
                            <th className="w-1 default no-sort"></th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
