import React, { Component } from "react";
import ep from "../../assets/js/urls";
import "../../assets/js/core";
import { getCookie } from "../../assets/js/core";
import "../../assets/js/datatables-custom";
import { GetParentPlayers } from "../../services/Parent";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import { CheckPermissions } from "../../services/Others";
import ReactDOM from "react-dom";
import {
    fullnameGenerator,
    nullCheck,
    formatDate,
    formatMoney,
    renderForDataTableSearchStructure
} from "../../services/Others";
import ActionButton from "../Parents/ActionButton";
import Inputmask from "inputmask";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

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
            const table = $("#parent-list").DataTable({
                dom: '<"top"f>rt<"bottom"ilp><"clear">',
                responsive: {
                    details: {
                        target: 1
                    }
                },
                order: [2, "asc"],
                aLengthMenu: [
                    [20, 50, 100, -1],
                    [20, 50, 100, "Tümü"]
                ],
                ajax: {
                    url: ep.PARENT_LIST,
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
                        type: "turkish",
                        targets: "_all"
                    },
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
                            if (["sort", "type"].indexOf(type) > -1) {
                                return fullname;
                            }
                        },
                        createdCell: (td, cellData, rowData) => {
                            const { uid, name, surname } = rowData;
                            const fullname = fullnameGenerator(name, surname);
                            ReactDOM.render(
                                <div
                                    className="btn-link cursor-pointer text-inherit font-weight-600"
                                    onClick={() => this.props.history.push(`/app/persons/parents/detail/${uid}`)}>
                                    {fullname}
                                </div>,
                                td
                            );
                        }
                    },
                    {
                        targets: "players",
                        responsivePriority: 3,
                        createdCell: (td, cellData, rowData) => {
                            const { parent_id } = rowData;
                            ReactDOM.render(
                                <button
                                    onClick={el => this.getParentPlayers(el, parent_id)}
                                    className="btn btn-secondary btn-sm btn-icon">
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
                                <ActionButton
                                    history={this.props.history}
                                    dropdown={true}
                                    data={{
                                        to: uid,
                                        name: fullname
                                    }}
                                    renderButton={() => (
                                        <>
                                            <button
                                                className="btn btn-icon btn-sm btn-secondary mr-1"
                                                data-toggle="tooltip"
                                                onClick={() =>
                                                    this.props.history.push(`/app/persons/parents/detail/${uid}`)
                                                }
                                                title="Görüntüle">
                                                <i className="fe fe-eye" />
                                            </button>
                                            {CheckPermissions(["p_write"]) && (
                                                <button
                                                    className="btn btn-icon btn-sm btn-secondary mr-1"
                                                    data-toggle="tooltip"
                                                    onClick={() =>
                                                        this.props.history.push(`/app/persons/parents/edit/${uid}`)
                                                    }
                                                    title="Düzenle">
                                                    <i className="fe fe-edit" />
                                                </button>
                                            )}
                                            <a
                                                title="İşlem Menüsü"
                                                className="btn btn-icon btn-sm btn-secondary"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false">
                                                <i className="fe fe-menu" />
                                            </a>
                                        </>
                                    )}
                                />,
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
                        data: null,
                        defaultContent: ""
                    },
                    {
                        data: "name",
                        responsivePriority: 1,
                        render: function(data, type, row) {
                            const fullname = fullnameGenerator(data, row.surname);
                            if (type === "filter") {
                                return renderForDataTableSearchStructure(fullname);
                            }
                            if (["sort", "type"].indexOf(type) > -1) {
                                return fullname;
                            }
                            if (data)
                                return `<a class="text-inherit font-weight-600" href="/app/persons/parents/detail/${row.uid}">${fullname}</a>`;
                        }
                    },
                    {
                        data: "phone",
                        responsivePriority: 10001,
                        render: function(data, type, row) {
                            const formatPhone = data ? Inputmask.format(data, { mask: "(999) 999 9999" }) : null;
                            if (formatPhone) return `<a href="tel:+90${data}">${formatPhone}</a>`;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "email",
                        responsivePriority: 10007,
                        render: function(data, type, row) {
                        if (data) return `<a href="mailto:+${data}">${data}</a>`;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "job",
                        className: "none",
                        responsivePriority: 10011,
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

            table.on("error.dt", function(e, settings, techNote, message) {
                console.log("An error has been reported by DataTables: ", message, techNote);
            });

            table.on("draw.dt", function() {
                $('[data-toggle="tooltip"]').tooltip();
                $('[data-toggle="popover"]').popover({
                    html: true,
                    trigger: "hover"
                });
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

    getParentPlayers = (el, parent_id) => {
        const { uid } = this.state;
        const element = el.currentTarget;
        const that = this;
        this.addButtonLoading(element);
        GetParentPlayers({ uid: uid, parent_id: parent_id }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    that.showPlayers(element, data);
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

    showPlayers = (element, data) => {
        const $parent = $(element).parent();
        if (data.length === 0) {
            $parent.html(`<div class="text-muted font-italic">Öğrenci bulunamadı...</div>`);
        } else {
            $parent.empty();
            data.map(el => {
                const fullname = fullnameGenerator(el.name, el.surname);
                $parent.append(`
                    <a href="/app/players/detail/${el.uid}"
                    class="text-inherit" 
                    data-toggle="popover" 
                    data-placement="top" 
                    data-content='
                        <p class="text-azure font-weight-600 h6">${fullname}
                            <span class="text-muted ml-1">
                                (${el.security_id})
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Aidat</strong>
                            <span class="text-muted">
                                ${this.renderFeeType(el)}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Grubu</strong>
                            <span class="text-muted">
                                ${nullCheck(el.group)}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Doğum Günü</strong>
                            <span class="text-muted">
                                ${formatDate(el.birthday, "LL")}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Kayıt Durumu</strong> 
                            <span class="text-${dailyType[el.daily].color}">
                                <span class="status-icon ${
                                    el.is_trial ? statusType[3].bg : statusType[el.status].bg
                                } mr-1"/>
                                ${el.is_trial ? statusType[3].title : statusType[el.status].title}
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Yoklama Durumu (Bugün)</strong> 
                            <span class="text-${dailyType[el.daily].color}">
                                ${dailyType[el.daily].text}
                            </span>
                        </p>
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

    renderFeeType = data => {
        if (!data.is_trial && !data.is_scholarship & (data.fee !== null)) {
            return formatMoney(data.fee);
        } else if (data.is_trial) {
            return "ÖN KAYIT";
        } else if (data.is_scholarship) {
            return "BURSLU";
        } else if (data.fee === null) {
            return "&mdash;";
        } else {
            return "&mdash;";
        }
    };

    render() {
        return (
            <div>
                <table
                    id="parent-list"
                    className="table table-hover w-100 card-table table-vcenter text-nowrap table-bordered datatable table-striped">
                    <thead>
                        <tr>
                            <th className="security no-sort">T.C. KİMLİK NO</th>
                            <th className="w-1 no-sort control" />
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
