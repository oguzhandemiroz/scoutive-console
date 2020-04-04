import React, { Component } from "react";
import { getCookie } from "../../assets/js/core";
import "../../assets/js/datatables-custom";
import ep from "../../assets/js/urls";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import Vacation from "../EmployeeAction/Vacation";
import Password from "../EmployeeAction/Password";
import AdvancePayment from "../EmployeeAction/AdvancePayment";
import {
    fullnameGenerator,
    formatDate,
    renderForDataTableSearchStructure,
    formatPhone,
    nullCheck,
    avatarPlaceholder,
    formatMoney,
    CheckPermissions
} from "../../services/Others";
import ActionButton from "./ActionButton";
import ReactDOM from "react-dom";
import _ from "lodash";
const $ = require("jquery");

const dailyType = {
    "-1": ["Tanımsız", "secondary"],
    "0": ["Gelmedi", "danger"],
    "1": ["Geldi", "success"],
    "2": ["İzinli", "warning"]
};

const statusType = {
    0: { bg: "bg-danger", title: "Pasif" },
    1: { bg: "bg-success", title: "Aktif" },
    2: { bg: "bg-azure", title: "Donuk" },
    3: { bg: "bg-indigo", title: "Ön Kayıt" }
};

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: {}
        };
    }

    componentDidMount() {
        try {
            const { uid } = this.state;
            const table = $("#employee-list").DataTable({
                dom: '<"top"f>rt<"bottom"ilp><"clear">',
                order: [4, "asc"],
                aLengthMenu: [
                    [20, 50, 100, -1],
                    [20, 50, 100, "Tümü"]
                ],
                ajax: {
                    url: ep.LIST_EMPLOYEE,
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
                        targets: [0, 1],
                        visible: false
                    },
                    {
                        targets: "salary",
                        visible: CheckPermissions(["a_read"]) ? true : false
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
                                    className="btn-link cursor-pointer text-inherit font-weight-600"
                                    onClick={() => this.props.history.push(`/app/persons/employees/detail/${uid}`)}>
                                    {fullname}
                                </div>,
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
                                                  onClick={() =>
                                                      this.props.history.push(`/app/groups/detail/${el.value}`)
                                                  }>
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
                        targets: "action",
                        createdCell: (td, cellData, rowData) => {
                            const fullname = fullnameGenerator(rowData.name, rowData.surname);
                            const { uid, status } = rowData;
                            ReactDOM.render(
                                <ActionButton
                                    advancePaymentButton={data =>
                                        this.setState({
                                            data: data
                                        })
                                    }
                                    vacationButton={data =>
                                        this.setState({
                                            data: data
                                        })
                                    }
                                    passwordButton={data =>
                                        this.setState({
                                            data: data
                                        })
                                    }
                                    history={this.props.history}
                                    dropdown={true}
                                    data={{
                                        to: uid,
                                        name: fullname,
                                        status: status
                                    }}
                                    renderButton={() => (
                                        <button
                                            type="button"
                                            id="employee-action"
                                            className="btn btn-sm btn-secondary btn-block dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            İşlem
                                        </button>
                                    )}
                                />,
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
                        class: "text-center px-3",
                        render: function(data, type, row) {
                            var status = row.status;
                            var renderBg = statusType[status].bg;
                            var renderTitle = statusType[status].title + " Personel";
                            return `<div class="avatar text-uppercase" style="background-image: url(${nullCheck(
                                data
                            )})">
                                    ${avatarPlaceholder(row.name, row.surname)}
										<span class="avatar-status ${renderBg}" data-toggle="tooltip" title="${renderTitle}"></span>
									</div>`;
                        }
                    },
                    {
                        data: "name",
                        class: "w-1",
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
                                return `<a class="text-inherit font-weight-600" href="/app/persons/employees/detail/${row.uid}">${fullname}</a>`;
                        }
                    },
                    {
                        data: "phone",
                        responsivePriority: 10000,
                        render: function(data, type, row) {
                            const phone = data ? formatPhone(data) : null;
                            if (formatPhone) return `<a href="tel:+90${data}" class="text-inherit">${phone}</a>`;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "position",
                        responsivePriority: 10008
                    },
                    {
                        data: "salary",
                        responsivePriority: 10009,
                        render: function(data, type, row) {
                            if (type === "filter") {
                                return renderForDataTableSearchStructure(data + " " + formatMoney(data));
                            }

                            if (["sort", "type"].indexOf(type) > -1) {
                                return data;
                            }

                            return formatMoney(data);
                        }
                    },
                    {
                        data: "groups",
                        responsivePriority: 10007,
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
                    {
                        data: "daily",
                        responsivePriority: 10006,
                        render: function(data, type) {
                            if (type === "filter") {
                                return renderForDataTableSearchStructure(dailyType[data][0]);
                            }
                            return `<span class="status-icon bg-${dailyType[data][1]}"></span> ${dailyType[data][0]}`;
                        }
                    },
                    {
                        data: "created_date",
                        responsivePriority: 10001,
                        render: function(data, type) {
                            if (["sort", "type"].indexOf(type) > -1) {
                                return data;
                            }

                            return formatDate(data, "LL");
                        }
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
        const { data } = this.state;
        return (
            <div>
                <table
                    id="employee-list"
                    className="table card-table table-vcenter w-100 table-striped text-nowrap table-bordered datatable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="w-1 no-sort">T.C.</th>
                            <th className="w-1 no-sort control" />
                            <th className="w-1 text-center px-3 no-sort">#</th>
                            <th className="w-1 name">AD SOYAD</th>
                            <th className="phone">TELEFON</th>
                            <th className="position">POZİSYON</th>
                            <th className="salary">MAAŞ</th>
                            <th className="groups">GRUP</th>
                            <th className="status" title="Yoklama Durumu">
                                YOKL. DURUMU
                            </th>
                            <th className="created_date" title="Oluşturma Tarihi">
                                OLUŞT. TARİHİ
                            </th>
                            <th className="no-sort action" />
                        </tr>
                    </thead>
                </table>
                <Vacation data={data} history={this.props.history} />
                <Password data={data} history={this.props.history} />
                <AdvancePayment data={data} history={this.props.history} />
            </div>
        );
    }
}

export default Table;
