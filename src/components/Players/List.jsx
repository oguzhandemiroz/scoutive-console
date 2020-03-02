import React, { Component } from "react";
import { datatable_turkish, getCookie } from "../../assets/js/core";
import ep from "../../assets/js/urls";
import { fatalSwal, errorSwal } from "../Alert.jsx";
import ReactDOM from "react-dom";
import { fullnameGenerator, nullCheck, formatPhone, formatDate } from "../../services/Others";
import { GetPlayerParents } from "../../services/Player";
import Vacation from "../PlayerAction/Vacation";
import ActionButton from "../Players/ActionButton";
import { CheckPermissions } from "../../services/Others";
import _ from "lodash";
import "../../assets/css/datatables.responsive.css";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

const dailyType = {
    "-1": ["Tanımsız", "secondary"],
    "0": ["Gelmedi", "danger"],
    "1": ["Geldi", "success"],
    "2": ["T. Gün İzinli", "warning"],
    "3": ["Y. Gün İzinli", "warning"]
};

const statusType = {
    0: { bg: "bg-danger", title: "Pasif" },
    1: { bg: "bg-success", title: "Aktif" },
    2: { bg: "bg-azure", title: "Donuk" },
    3: { bg: "bg-indigo", title: "Ön Kayıt" }
};

const footType = {
    0: "Sağ & Sol",
    1: "Sağ",
    2: "Sol"
};

const filteredList = () => {
    if (!document.getElementById("clearFilter")) {
        //$("div.filterTools").append(`<a  id="clearFilter" class="btn btn-link text-truncate">Filtreyi temizle</a>`); //filtre

        $(".filterTools #clearFilter").on("click", function() {
            $.fn.dataTable.ext.search = [];
            $("#player-list")
                .DataTable()
                .draw();
            $(this).remove();
        });
    }

    $("#player-list")
        .DataTable()
        .draw();

    $("#playerListFilterMenu").modal("hide");
};

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

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: {},
            filter: {}
        };
    }

    generateFilter = filterFromModal => {
        console.log("filterFromModal", filterFromModal);
        $.fn.dataTable.ext.search = [];

        Object.keys(filterFromModal).map(el => {
            $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
                if (settings.nTable.id !== "player-list") return true;
                if (["status", "group", "is_trial"].indexOf(el) > -1) {
                    return filterFromModal[el] ? (filterFromModal[el].indexOf(rowData[el]) > -1 ? true : false) : true;
                } else if (el === "birthday") {
                    if (filterFromModal[el]) {
                        var first = parseInt(filterFromModal[el].first);
                        var second = parseInt(filterFromModal[el].second);
                        var age = parseInt(rowData[el]) || 0; // use data for the age column

                        if (
                            (isNaN(first) && isNaN(second)) ||
                            (isNaN(first) && age <= second) ||
                            (first <= age && isNaN(second)) ||
                            (first <= age && age <= second)
                        ) {
                            return true;
                        }
                        return false;
                    }
                    return true;
                } else {
                    if (filterFromModal[el]) {
                        switch (filterFromModal[el].condition) {
                            case ">":
                                return parseInt(rowData[el]) > parseInt(filterFromModal[el].value);
                            case ">=":
                                return parseInt(rowData[el]) >= parseInt(filterFromModal[el].value);
                            case "<":
                                return parseInt(rowData[el]) < parseInt(filterFromModal[el].value);
                            case "<=":
                                return parseInt(rowData[el]) <= parseInt(filterFromModal[el].value);
                            case "===":
                                return parseInt(rowData[el]) === parseInt(filterFromModal[el].value);
                            case "!==":
                                return parseInt(rowData[el]) !== parseInt(filterFromModal[el].value);
                            default:
                                return true;
                        }
                    } else return true;
                }
            });
        });

        filteredList();
        $("#playerListFilterMenu").modal("hide");
    };

    componentDidMount() {
        try {
            const { uid } = this.state;
            const table = $("#player-list").DataTable({
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
                order: [4, "asc"],
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
                    url: ep.PLAYER_LIST,
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
                        targets: [0, 1],
                        visible: false
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
                                    onClick={() => this.props.history.push(`/app/players/detail/${uid}`)}>
                                    {fullname}
                                </div>,
                                td
                            );
                        }
                    },
                    {
                        targets: "parents",
                        responsivePriority: 3,
                        createdCell: (td, cellData, rowData) => {
                            const { player_id } = rowData;
                            ReactDOM.render(
                                <button
                                    onClick={el => this.getPlayerParents(el, player_id)}
                                    className="btn btn-secondary btn-sm btn-icon">
                                    <i className="fa fa-user mr-1" /> Velisi
                                </button>,
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
                                                  to={`/app/groups/detail/${el.value}`}
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
                        class: "text-right",
                        responsivePriority: 2,
                        createdCell: (td, cellData, rowData) => {
                            const fullname = fullnameGenerator(rowData.name, rowData.surname);
                            const { uid, group, status, is_trial } = rowData;
                            ReactDOM.render(
                                <ActionButton
                                    hide={["edit"]}
                                    vacationButton={data =>
                                        this.setState({
                                            data: data
                                        })
                                    }
                                    groupChangeButton={data =>
                                        this.setState({
                                            data: data
                                        })
                                    }
                                    history={this.props.history}
                                    dropdown={true}
                                    data={{
                                        to: uid,
                                        name: fullname,
                                        is_trial: is_trial,
                                        status: status,
                                        group: group
                                    }}
                                    renderButton={() => (
                                        <>
                                            <button
                                                className="btn btn-icon btn-sm btn-secondary mr-1"
                                                data-toggle="tooltip"
                                                onClick={() => this.props.history.push(`/app/players/detail/${uid}`)}
                                                title="Görüntüle">
                                                <i className="fe fe-eye" />
                                            </button>
                                            {CheckPermissions(["p_write"]) ? (
                                                <button
                                                    className="btn btn-icon btn-sm btn-secondary mr-1"
                                                    data-toggle="tooltip"
                                                    onClick={() => this.props.history.push(`/app/players/edit/${uid}`)}
                                                    title="Düzenle">
                                                    <i className="fe fe-edit" />
                                                </button>
                                            ) : null}
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
                        class: "text-center",
                        render: function(data, type, row) {
                            var name = row.name;
                            var surname = row.surname;
                            var status = row.status;
                            var renderBg = row.is_trial ? statusType[3].bg : statusType[status].bg;
                            var renderTitle = row.is_trial
                                ? statusType[status].title + " & Ön Kayıt Öğrenci"
                                : statusType[status].title + " Öğrenci";
                            return `<div class="avatar text-uppercase" style="background-image: url(${data || ""})">
										${data ? "" : name.slice(0, 1) + surname.slice(0, 1)}
										<span class="avatar-status ${renderBg}" data-toggle="tooltip" title="${renderTitle}"></span>
									</div>`;
                        }
                    },
                    {
                        data: "name",
                        responsivePriority: 1,
                        render: function(data, type, row) {
                            const fullname = fullnameGenerator(data, row.surname);
                            if (["sort", "type"].indexOf(type) > -1) {
                                return fullname;
                            }
                            if (data)
                                return `<a class="text-inherit font-weight-600" href="/app/players/detail/${row.uid}">${fullname}</a>`;
                        }
                    },
                    {
                        data: null
                    },
                    {
                        data: "fee",
                        responsivePriority: 10010,
                        render: function(data, type, row) {
                            const { is_trial, payment_type } = row;
                            if (["sort", "type"].indexOf(type) > -1) {
                                return data;
                            }

                            if (type === "display") {
                                if (!is_trial && (payment_type !== 1) & (data !== null)) {
                                    return data.format() + " ₺";
                                } else if (is_trial) {
                                    return "<b>ÖN KAYIT</b>";
                                } else if (payment_type === 1) {
                                    return "<b>BURSLU</b>";
                                } else if (data === null) {
                                    return "&mdash;";
                                } else {
                                    return "&mdash;";
                                }
                            }

                            return data;
                        }
                    },
                    {
                        data: "point",
                        responsivePriority: 10011,
                        className: "none",
                        render: function(data) {
                            if (data && data !== "") return data;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "foot",
                        responsivePriority: 10012,
                        className: "none",
                        render: function(data) {
                            if (data && data !== "") return footType[data];
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "position",
                        responsivePriority: 10013,
                        className: "none",
                        render: function(data) {
                            if (data && data !== "") return data.name;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "birthday",
                        responsivePriority: 10009,
                        render: function(data, type) {
                            if (["sort", "type"].indexOf(type) > -1) {
                                return data;
                            }

                            return formatDate(data, "LL");
                        }
                    },
                    {
                        data: "groups",
                        responsivePriority: 10008,
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
                        responsivePriority: 10001,
                        render: function(data, type, row) {
                            return `<span class="status-icon bg-${dailyType[data][1]}"></span> ${dailyType[data][0]}`;
                        }
                    },
                    {
                        data: "created_date",
                        responsivePriority: 10010,
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
                ],

                initComplete: function() {
                    $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
                        /* if (settings.nTable.id !== "player-list") return true;
                        return rowData["status"] === 1 ? true : false; */ //filtre
                        return true;
                    });
                    filteredList();
                }
            });

            /*  $("div.filterTools").html(`
                <button type="button" class="btn btn-yellow" data-toggle="modal" data-target="#playerListFilterMenu"><i class="fe fe-filter mr-2"></i>Filtre</button> //filtre
			`); */

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

    getPlayerParents = (el, player_id) => {
        const { uid } = this.state;
        const element = el.currentTarget;
        const that = this;
        this.addButtonLoading(element);
        GetPlayerParents({ uid: uid, player_id: player_id }).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    const data = response.data;
                    that.showParents(element, data);
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

    showParents = (element, data) => {
        const $parent = $(element).parent();
        if (data.length === 0) {
            $parent.html(`<div class="text-muted font-italic">Veli bulunamadı...</div>`);
        } else {
            $parent.empty();
            data.map(el => {
                const fullname = fullnameGenerator(el.name, el.surname);
                $parent.append(`
                    <a href="/app/persons/parents/detail/${el.uid}"
                    class="text-inherit" 
                    data-toggle="popover" 
                    data-placement="top" 
                    data-content='
                        <p class="text-azure font-weight-600 h6">${fullname}
                            <span class="text-muted ml-1">
                                (${el.kinship})
                            </span>
                        </p>
                        <p>
                            <strong class="d-block">Telefon</strong>
                            <span class="text-muted">
                                ${formatPhone(el.phone)}
                            </span>
                        </p>
						<strong class="d-block">Email</strong>
						<span class="text-muted">
							${nullCheck(el.email)}
						</span>
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

    render() {
        const { data } = this.state;
        return (
            <div>
                <table
                    id="player-list"
                    className="table card-table w-100 table-vcenter table-striped text-nowrap table-bordered datatable dataTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="no-sort">T.C.</th>
                            <th className="w-1 no-sort text-center control" />
                            <th className="w-1 text-center no-sort">#</th>
                            <th className="name">AD SOYAD</th>
                            <th className="parents no-sort">VELİSİ</th>
                            <th className="fee">AİDAT</th>
                            <th className="point">GENEL PUAN</th>
                            <th className="foot">KULLANDIĞI AYAK</th>
                            <th className="position">MEVKİİ</th>
                            <th className="birthday">DOĞUM GÜNÜ</th>
                            <th className="groups">GRUP</th>
                            <th className="daily" title="Yoklama Durumu">
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
                {/* <GroupChange data={data} history={this.props.history} /> */}
                {/* <ListFilter filterState={this.generateFilter} /> */}
            </div>
        );
    }
}

export default Table;
