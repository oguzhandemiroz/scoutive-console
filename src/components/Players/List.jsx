import React, {Component} from "react";
import {datatable_turkish} from "../../assets/js/core";
import ep from "../../assets/js/urls";
import {fatalSwal, errorSwal, showSwal, Toast} from "../Alert.jsx";
import ReactDOM from "react-dom";
import {BrowserRouter, Link} from "react-router-dom";
import {DeletePlayer, FreezePlayer, RefreshPlayer} from "../../services/Player";
import {fullnameGenerator} from "../../services/Others";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons/js/buttons.colVis";
const $ = require("jquery");
$.DataTable = require("datatables.net-buttons");

var dailyType = {
    "-1": ["Tanımsız", "secondary"],
    "0": ["Gelmedi", "danger"],
    "1": ["Geldi", "success"],
    "2": ["T. Gün İzinli", "warning"],
    "3": ["Y. Gün İzinli", "warning"]
};

var statusType = {
    0: "bg-gray",
    1: "bg-success",
    2: "bg-azure",
    3: "bg-indigo"
};

const initialState = {
    vacation: false,
    group_change: false
};

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: {},
            ...initialState
        };
    }

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace(`/`);
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    deletePlayer = (to, name) => {
        try {
            const {uid} = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı öğrencinin <b>kaydını silmek</b> istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    DeletePlayer({
                        uid: uid,
                        to: to
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.reload(), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    freezePlayer = (to, name) => {
        try {
            const {uid} = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı öğrencinin <b>kaydını dondurmak</b> istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    FreezePlayer({
                        uid: uid,
                        to: to
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.reload(), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    refreshPlayer = (to, name) => {
        try {
            const {uid} = this.state;
            showSwal({
                type: "warning",
                title: "Emin misiniz?",
                html: `<b>${name}</b> adlı öğrencinin <b>kaydını yenilemek</b> istediğinize emin misiniz?`,
                confirmButtonText: "Evet",
                cancelButtonText: "Hayır",
                cancelButtonColor: "#868e96",
                confirmButtonColor: "#cd201f",
                showCancelButton: true,
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    RefreshPlayer({
                        uid: uid,
                        to: to
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1020) {
                                Toast.fire({
                                    type: "success",
                                    title: "İşlem başarılı..."
                                });
                                setTimeout(() => this.reload(), 1000);
                            }
                        }
                    });
                }
            });
        } catch (e) {}
    };

    componentDidMount() {
        try {
            const {uid} = this.state;
            const table = $("#player-list").DataTable({
                dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
                /*buttons: [
					{
						text: "My button",
						className: "btn btn-secondary",
						action: function(e, dt, node, config) {
							$.fn.dataTable.ext.search = [];
							$.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
								if (dt.ajax.json().data[dataIndex].status === 1) return true;
								else return false;
							});
							dt.draw();
						}
					}
				],*/
                responsive: true,
                fixedHeader: true,
                order: [3, "asc"],
                aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
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
                        request.setRequestHeader("XIP", sessionStorage.getItem("IPADDR"));
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
                            console.log(res);
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
                        targets: "no-sort",
                        orderable: false
                    },
                    {
                        targets: "action",
                        createdCell: (td, cellData, rowData) => {
                            const fullname = fullnameGenerator(rowData.name, rowData.surname);
                            const {uid, group, status, is_trial} = rowData;

                            const dropdownDivider = key => (
                                <div role="separator" className="dropdown-divider" key={key.toString()} />
                            );
                            const lock = (
                                <span className="ml-1">
                                    (<i className="fe fe-lock mr-0" />)
                                </span>
                            );
                            const actionMenu = [
                                {
                                    tag: "Link",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        to: `/app/players/payment/${uid}`,
                                        onClick: () => this.props.history.push(`/app/players/payment/${uid}`)
                                    },
                                    childText: "Ödeme Al",
                                    child: {
                                        className: "dropdown-icon fa fa-hand-holding-usd"
                                    },
                                    lock: false,
                                    condition: !is_trial
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: !is_trial && status === 0
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item cursor-not-allowed disabled",
                                        onClick: () => console.log("Ödeme İkazı")
                                    },
                                    childText: "Ödeme İkazı",
                                    child: {
                                        className: "dropdown-icon fa fa-exclamation-triangle"
                                    },
                                    lock: lock,
                                    condition: !is_trial && status !== 0
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: !is_trial && status !== 0
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        onClick: () => this.freezePlayer(uid, fullname)
                                    },
                                    childText: "Kaydı Dondur",
                                    child: {
                                        className: "dropdown-icon fa fa-snowflake"
                                    },
                                    lock: false,
                                    condition: !is_trial && status === 1
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        onClick: () => this.refreshPlayer(uid, fullname)
                                    },
                                    childText: "Kaydı Yenile",
                                    child: {
                                        className: "dropdown-icon fa fa-sync-alt"
                                    },
                                    lock: false,
                                    condition: !is_trial && status === 2
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        onClick: () => this.deletePlayer(uid, fullname)
                                    },
                                    childText: "Kaydı Sil",
                                    child: {
                                        className: "dropdown-icon fa fa-user-times"
                                    },
                                    lock: false,
                                    condition: status !== 0
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: status !== 0
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        onClick: () =>
                                            this.setState({
                                                ...initialState,
                                                vacation: true,
                                                data: {name: fullname, uid: uid}
                                            })
                                    },
                                    childText: "İzin Yaz",
                                    child: {
                                        className: "dropdown-icon fa fa-coffee"
                                    },
                                    lock: false,
                                    condition: !is_trial && status === 1
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: !is_trial && status === 1
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item cursor-not-allowed disabled",
                                        onClick: () => console.log("Not (Puan) Ver")
                                    },
                                    childText: "Not (Puan) Ver",
                                    child: {
                                        className: "dropdown-icon fa fa-notes-medical"
                                    },
                                    lock: lock,
                                    condition: !is_trial && status === 1
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: !is_trial && status === 1
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item cursor-not-allowed disabled",
                                        onClick: () => console.log("Veliye Mesaj Gönder")
                                    },
                                    childText: "Veliye Mesaj Gönder",
                                    child: {
                                        className: "dropdown-icon fa fa-paper-plane"
                                    },
                                    lock: lock,
                                    condition: true
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: true
                                },
                                {
                                    tag: "Link",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        to: `/app/players/edit/${uid}`,
                                        onClick: () => this.props.history.push(`/app/players/edit/${uid}`)
                                    },
                                    childText: "Düzenle",
                                    child: {
                                        className: "dropdown-icon fa fa-pen"
                                    },
                                    lock: false,
                                    condition: true
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        onClick: () =>
                                            this.setState({
                                                ...initialState,
                                                group_change: true,
                                                data: {name: fullname, uid: uid, group: group}
                                            })
                                    },
                                    childText: "Grup Değişikliği",
                                    child: {
                                        className: "dropdown-icon fa fa-user-cog"
                                    },
                                    lock: false,
                                    condition: !is_trial && status !== 0
                                },
                                {
                                    divider: key => dropdownDivider(key),
                                    condition: !is_trial && status !== 0
                                },
                                {
                                    tag: "button",
                                    elementAttr: {
                                        className: "dropdown-item cursor-not-allowed disabled",
                                        onClick: () => console.log("Öğrenci Belgesi")
                                    },
                                    childText: "Öğrenci Belgesi",
                                    child: {
                                        className: "dropdown-icon fa fa-id-card-alt"
                                    },
                                    lock: lock,
                                    condition: true
                                },
                                {
                                    tag: "Link",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        to: `/app/players/fee-detail/${uid}`,
                                        onClick: () =>
                                            this.props.history.push(`/app/players/fee-detail/${uid}`)
                                    },
                                    childText: "Tüm Aidat Bilgisi",
                                    child: {
                                        className: "dropdown-icon fa fa-receipt"
                                    },
                                    lock: false,
                                    condition: true
                                },
                                {
                                    tag: "Link",
                                    elementAttr: {
                                        className: "dropdown-item",
                                        to: `/app/players/detail/${uid}`,
                                        onClick: () => this.props.history.push(`/app/players/detail/${uid}`)
                                    },
                                    childText: "Tüm Bilgileri",
                                    child: {
                                        className: "dropdown-icon fa fa-info-circle"
                                    },
                                    lock: false,
                                    condition: true
                                }
                            ];

                            ReactDOM.render(
                                <BrowserRouter>
                                    <div className="dropdown btn-block" id="action-dropdown">
                                        <button
                                            type="button"
                                            id="player-action"
                                            className="btn btn-sm btn-secondary btn-block dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            İşlem
                                        </button>
                                        <div
                                            className="dropdown-menu dropdown-menu-right"
                                            aria-labelledby="player-action"
                                            x-placement="top-end">
                                            <a
                                                className="dropdown-item disabled text-azure"
                                                href="javascript:void(0)">
                                                <i className="dropdown-icon fa fa-user text-azure" />
                                                {fullname}
                                            </a>
                                            <div role="separator" className="dropdown-divider" />
                                            {actionMenu.map((el, key) => {
                                                if (el.condition) {
                                                    if (el.tag === "Link") {
                                                        return (
                                                            <Link {...el.elementAttr} key={key.toString()}>
                                                                <i {...el.child} /> {el.childText}
                                                                {el.lock}
                                                            </Link>
                                                        );
                                                    } else if (el.tag === "button") {
                                                        return (
                                                            <button {...el.elementAttr} key={key.toString()}>
                                                                <i {...el.child} /> {el.childText}
                                                                {el.lock}
                                                            </button>
                                                        );
                                                    } else {
                                                        return el.divider(key);
                                                    }
                                                }
                                            })}
                                        </div>
                                    </div>
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
                        data: "security_id"
                    },
                    {
                        data: "image",
                        class: "text-center",
                        render: function(data, type, row) {
                            var status = row.status;
                            var bg_class_type = {
                                "0": "secondary",
                                "1": "success",
                                "2": "warning",
                                "3": "danger",
                                "4": "info"
                            };
                            if (data === null) {
                                return `<span class="avatar avatar-placeholder">
										<span class="avatar-status ${row.is_trial ? statusType[3] : statusType[status]}"></span>
									</span>`;
                            } else {
                                return `<div class="avatar" style="background-image: url(${data})">
										<span class="avatar-status ${row.is_trial ? statusType[3] : statusType[status]}"></span>
									</div>`;
                            }
                        }
                    },
                    {
                        data: "name",
                        class: "w-1",
                        render: function(data, type, row) {
                            const fullname = fullnameGenerator(data, row.surname);
                            if (type === "sort" || type === "type") {
                                return fullname;
                            }
                            if (data)
                                return `<a class="text-inherit" href="/app/players/detail/${row.uid}">${fullname}</a>`;
                        }
                    },
                    {
                        data: "emergency",
                        render: function(data, type, row) {
                            var elem = "";
                            var j = 0;
                            if (data) {
                                data.map(el => {
                                    if (el.phone !== "" && el.name !== "" && el.kinship !== "") {
                                        const formatPhone = el.phone
                                            ? Inputmask.format(el.phone, {mask: "(999) 999 9999"})
                                            : null;
                                        j++;
                                        elem += `<a href="tel:${el.phone}" data-toggle="tooltip" data-placement="left" data-original-title="${el.kinship}: ${el.name}" class="text-inherit d-block">${formatPhone}</a> `;
                                    }
                                });
                            } else {
                                elem = "&mdash;";
                            }
                            if (j === 0) elem = "&mdash;";
                            return elem;
                        }
                    },
                    {
                        data: "fee",
                        render: function(data, type, row) {
                            if (type === "sort" || type === "type") {
                                return data;
                            }
                            if (data && data !== "") return data.format() + " ₺";
                            else return row.is_trial ? "<i><b>DENEME</b></i>" : "<i><b>BURSLU</b></i>";
                        }
                    },
                    {
                        data: "point",
                        render: function(data) {
                            if (data && data !== "") return data;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "birthday",
                        render: function(data, type, row) {
                            if (type === "sort" || type === "type") {
                                return data ? data.split(".")[0] : data;
                            }

                            if (data && data !== "") return moment(data).format("DD-MM-YYYY");
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "group",
                        render: function(data) {
                            if (data && data !== "") return data;
                            else return "&mdash;";
                        }
                    },
                    {
                        data: "daily",
                        render: function(data, type, row) {
                            return (
                                '<span class="status-icon bg-' +
                                dailyType[data][1] +
                                '"></span>' +
                                dailyType[data][0]
                            );
                        }
                    },
                    {
                        data: null
                    }
                ],
                drawCallback: function(settings) {
                    var api = this.api();

                    // Output the data for the visible rows to the browser's console
                    console.log(api.rows({status: 1}).data());
                }
            });

            $("div.filterTools").html(`
				<label class="custom-control custom-checkbox">
					<input type="checkbox" class="custom-control-input" id="activePlayers" name="example-checkbox1" value="option1">
					<span class="custom-control-label">Aktif Öğrenciler</span>
				</label>
				<label class="custom-control custom-checkbox ml-2">
					<input type="checkbox" class="custom-control-input" id="trialPlayers" name="example-checkbox1" value="option1">
					<span class="custom-control-label">Deneme Öğrenciler</span>
				</label>
			`);

            $("#activePlayers").on("change", function() {
                if ($(this).is(":checked")) {
                    $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
                        return rowData.status === 1;
                    });
                } else {
                    $.fn.dataTable.ext.search.pop();
                }
                table.draw();
            });

            $("#trialPlayers").on("change", function() {
                if ($(this).is(":checked")) {
                    $.fn.dataTable.ext.search.push(function(settings, searchData, index, rowData, counter) {
                        return rowData.is_trial === 1;
                    });
                } else {
                    $.fn.dataTable.ext.search.pop();
                }
                table.draw();
            });

            $.fn.DataTable.ext.errMode = "none";
            $("#player-list").on("error.dt", function(e, settings, techNote, message) {
                console.log("An error has been reported by DataTables: ", message, techNote);
            });

            $("#player-list").on("draw.dt", function() {
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
        const {vacation, group_change, data} = this.state;
        return (
            <div>
                <table
                    id="player-list"
                    className="table card-table w-100 table-vcenter table-striped text-nowrap datatable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="w-1 no-sort">T.C.</th>
                            <th className="w-1 text-center no-sort">#</th>
                            <th className="w-1 name">AD SOYAD</th>
                            <th className="emergency">VELİ TEL.</th>
                            <th className="fee">AİDAT</th>
                            <th className="point">GENEL PUAN</th>
                            <th className="birthday">YAŞ</th>
                            <th className="group">GRUP</th>
                            <th className="status">DURUM</th>
                            <th className="no-sort action" />
                        </tr>
                    </thead>
                </table>
                {<Vacation data={data} visible={vacation} history={this.props.history} />}
                {<GroupChange data={data} visible={group_change} history={this.props.history} />}
            </div>
        );
    }
}

export default Table;
