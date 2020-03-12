import React, { Component } from "react";
import ep from "../../assets/js/urls";
import "../../assets/js/datatables-custom";
import { getCookie } from "../../assets/js/core";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import ReactDOM from "react-dom";
import { renderForDataTableSearchStructure } from "../../services/Others";
const $ = require("jquery");

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
            const table = $("#budget-list").DataTable({
                dom: '<"top"f>rt<"bottom"ilp><"clear">',
                responsive: {
                    details: {
                        target: 0
                    }
                },
                order: [2, "asc"],
                aLengthMenu: [
                    [20, 50, 100, -1],
                    [20, 50, 100, "Tümü"]
                ],
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
                            if (res.responseJSON.status.code !== 1020) {
                                if (res.status !== 200) fatalSwal();
                                else errorSwal(res.responseJSON.status);
                            }
                        } catch (e) {
                            fatalSwal();
                        }
                    },
                    dataSrc: function(d) {
                        if (d.status.code !== 1020) {
                            errorSwal(d.status);
                            return [];
                        } else return d.data;
                    }
                },
                columnDefs: [
                    {
                        type: "turkish",
                        targets: "_all"
                    },
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
                        targets: [1],
                        createdCell: (td, cellData) => {
                            ReactDOM.render(<i className={`fa fa-${budgetType[cellData].icon}`} />, td);
                        }
                    },
                    {
                        targets: "budget_name",
                        render: function(data, type, row) {
                            if (type === "filter") {
                                return renderForDataTableSearchStructure(data);
                            }

                            return data;
                        },
                        createdCell: (td, cellData, rowData) => {
                            ReactDOM.render(
                                <span
                                    onClick={() => this.props.history.push("/app/budgets/detail/" + rowData.budget_id)}
                                    className="btn-link cursor-pointer text-inherit"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    data-original-title={cellData}>
                                    {cellData}
                                </span>,
                                td
                            );
                        }
                    }
                ],
                columns: [
                    {
                        data: null,
                        defaultContent: ""
                    },
                    {
                        data: "budget_type",
                        responsivePriority: 0
                    },
                    {
                        data: "budget_name",
                        responsivePriority: 1
                    },
                    {
                        data: "budget_type",
                        responsivePriority: 5,
                        render: function(data, type, row) {
                            return budgetType[data].text;
                        }
                    },
                    {
                        data: "balance",
                        responsivePriority: 2,
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
                        responsivePriority: 4,
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
                        responsivePriority: 3,
                        class: "text-center w-1",
                        render: function(data, type, row) {
                            return data ? '<span class="badge badge-primary">Varsayılan</span>' : null;
                        }
                    }
                ]
            });

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
                    id="budget-list"
                    className="table table-hover w-100 card-table table-vcenter text-nowrap datatable table-bordered">
                    <thead>
                        <tr>
                            <th className="w-1 no-sort control" />
                            <th className="w-1 text-center budget_type no-sort"></th>
                            <th className="budget_name">HESAP ADI</th>
                            <th className="budget_type">HESAP TÜRÜ</th>
                            <th className="balance">BAKİYE</th>
                            <th className="currency">PARA BİRİMİ</th>
                            <th className="status">DURUM</th>
                            <th className="w-1 default no-sort">VARSAYILAN</th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
