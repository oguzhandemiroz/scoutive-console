import React, { Component } from "react";
import ep from "../../assets/js/urls";
import "../../assets/js/core";
import { datatable_turkish } from "../../assets/js/core";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import { BrowserRouter, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { fullnameGenerator } from "../../services/Others";
import ActionButton from "../Parents/ActionButton";
import Inputmask from "inputmask";
const $ = require("jquery");
$.DataTable = require("datatables.net");

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
            $("#parent-list").DataTable({
                dom: '<"top"f>rt<"bottom"ilp><"clear">',
                responsive: false,
                order: [1, "asc"],
                aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
                stateSave: false, // change true
                language: {
                    ...datatable_turkish,
                    decimal: ",",
                    thousands: "."
                },
                ajax: {
                    url: ep.PARENT_LIST,
                    type: "POST",
                    beforeSend: function(request) {
                        request.setRequestHeader("Content-Type", "application/json");
                        request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
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
                        targets: [0],
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
                                        to={"/app/parents/detail/" + uid}
                                        onClick={() => this.props.history.push(`/app/parents/detail/${uid}`)}>
                                        {fullname}
                                    </Link>
                                </BrowserRouter>,
                                td
                            );
                        }
                    },
                    {
                        targets: "players",
                        createdCell: (td, cellData, rowData) => {
                            const { parent_id } = rowData;
                            ReactDOM.render(
                                <button className="btn btn-secondary btn-sm btn-icon">
                                    <i className="fa fa-user-graduate mr-1" /> Öğrencisi
                                </button>,
                                td
                            );
                        }
                    },
                    {
                        targets: "action",
                        class: "text-right",
                        responsivePriority: 2,
                        createdCell: (td, cellData, rowData) => {
                            const fullname = fullnameGenerator(rowData.name, rowData.surname);
                            const { uid } = rowData;
                            ReactDOM.render(
                                <BrowserRouter>
                                    <ActionButton
                                        history={this.props.history}
                                        dropdown={true}
                                        data={{
                                            to: uid,
                                            name: fullname
                                        }}
                                        renderButton={() => (
                                            <>
                                                <Link
                                                    to={"/app/parents/detail/" + uid}
                                                    className="btn btn-icon btn-sm btn-secondary"
                                                    data-toggle="tooltip"
                                                    onClick={() =>
                                                        this.props.history.push(`/app/parents/detail/${uid}`)
                                                    }
                                                    title="Görüntüle">
                                                    <i className="fe fe-eye" />
                                                </Link>
                                                <Link
                                                    to={"/app/parents/edit/" + uid}
                                                    className="btn btn-icon btn-sm btn-secondary mx-1"
                                                    data-toggle="tooltip"
                                                    onClick={() => this.props.history.push(`/app/parents/edit/${uid}`)}
                                                    title="Düzenle">
                                                    <i className="fe fe-edit" />
                                                </Link>
                                                <a
                                                    title="İşlem Menüsü"
                                                    href="javascript:void(0)"
                                                    className="btn btn-icon btn-sm btn-secondary"
                                                    data-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false">
                                                    <i className="fe fe-menu" />
                                                </a>
                                            </>
                                        )}
                                    />
                                </BrowserRouter>,
                                td
                            );
                        }
                    }
                ],
                columns: [
                    {
                        data: "security_id"
                    },
                    {
                        data: "name",
                        responsivePriority: 1,
                        render: function(data, type, row) {
                            const fullname = fullnameGenerator(data, row.surname);
                            if (type === "sort" || type === "type") {
                                return fullname;
                            }
                            if (data)
                                return `<a class="text-inherit font-weight-600" href="/app/parents/detail/${row.uid}">${fullname}</a>`;
                        }
                    },
                    {
                        data: "phone",
                        render: function(data, type, row) {
                            const formatPhone = data ? Inputmask.format(data, { mask: "(999) 999 9999" }) : null;
                            if (formatPhone) return `<a href="tel:+90${data}">${formatPhone}</a>`;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "email",
                        render: function(data, type, row) {
                            if (data) return `<a href="mailto:+${data}">${data}</a>`;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "job",
                        render: function(data, type, row) {
                            return data || "&mdash;";
                        }
                    },
                    {
                        data: null
                    },
                    {
                        data: null
                    }
                ]
            });

            $.fn.DataTable.ext.errMode = "none";
            $("#parent-list").on("error.dt", function(e, settings, techNote, message) {
                console.log("An error has been reported by DataTables: ", message, techNote);
            });

            $("#parent-list").on("draw.dt", function() {
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
                    id="parent-list"
                    className="table table-hover w-100 card-table table-vcenter text-nowrap datatable">
                    <thead>
                        <tr>
                            <th className="security no-sort">T.C. KİMLİK NO</th>
                            <th className="name">ADI SOYADI</th>
                            <th className="phone">TELEFON</th>
                            <th className="email">EMAİL</th>
                            <th className="job">MESLEK</th>
                            <th className="players no-sort w-1">ÖĞRENCİSİ</th>
                            <th className="w-1 action no-sort"></th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
