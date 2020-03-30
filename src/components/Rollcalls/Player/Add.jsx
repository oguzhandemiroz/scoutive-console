import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { MakeRollcall, SetNoteRollcall, DeleteRollcall, CloseRollcall } from "../../../services/Rollcalls";
import { CreateVacation, UpdateVacation } from "../../../services/PlayerAction";
import { GetPlayerParents } from "../../../services/Player";
import {
    fullnameGenerator,
    nullCheck,
    formatPhone,
    renderForDataTableSearchStructure,
    avatarPlaceholder,
    CheckPermissions,
    formatDate,
    formatMoney
} from "../../../services/Others";
import { getCookie } from "../../../assets/js/core";
import "../../../assets/js/datatables-custom";
import { fatalSwal, errorSwal, Toast, showSwal } from "../../Alert.jsx";
import Vacation from "../../PlayerAction/Vacation";
import ep from "../../../assets/js/urls";
import ActionButton from "../../Players/ActionButton";
import _ from "lodash";
import moment from "moment";
const $ = require("jquery");

const statusType = {
    0: { bg: "bg-danger", title: "Pasif" },
    1: { bg: "bg-success", title: "Aktif" },
    2: { bg: "bg-azure", title: "Donuk" },
    3: { bg: "bg-indigo", title: "Ön Kayıt" }
};

const dailyType = {
    0: { icon: "fe-x", badge: "bg-red-light", text: "Gelmedi", color: "text-red" },
    1: { icon: "fe-check", badge: "bg-green-light", text: "Geldi", color: "text-green" },
    2: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Tam Gün", color: "text-yellow" },
    3: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "Yarın Gün", color: "text-yellow" }
};

const feeType = {
    0: { icon: "fe-x", badge: "bg-red-light", text: "Ödenmedi", color: "text-danger" },
    1: { icon: "fe-check", badge: "bg-green-light", text: "Ödendi", color: "text-success" },
    2: {
        icon: "fe-alert-circle",
        badge: "bg-yellow-light",
        text: "Eksik Ödendi",
        color: "text-warning"
    },
    3: {
        icon: "fa fa-user-graduate",
        badge: "bg-primary",
        text: "Burslu",
        color: "text-primary"
    }
};

export class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            players: null,
            counter: 0,
            statuses: [],
            loadingButtons: [],
            data: {}
        };
    }

    componentDidMount() {
        this.renderDataTable();
    }

    componentWillUnmount() {
        $(".data-table-wrapper")
            .find("table")
            .DataTable()
            .destroy(true);
    }

    getPaidStatus = (fee, amount) => {
        try {
            if (amount === 0) {
                return 0;
            } else {
                return amount >= fee ? 1 : 2;
            }
        } catch (e) {}
    };

    formatPaidDate = date => {
        try {
            const splitDate = date.split(",");
            const firstDate = moment(splitDate[0]);
            const secondDate = moment(splitDate[1]);
            const diff = Math.ceil(moment(secondDate).diff(moment(firstDate), "months", true));

            return `${firstDate.format("MMMM")} ${firstDate.format("YYYY")} - ${secondDate.format(
                "MMMM"
            )} ${secondDate.format("YYYY")} (${diff} aylık)`;
        } catch (e) {}
    };

    renderDataTable = () => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        const table = $("#rollcall-list").DataTable({
            dom: '<"top"f>rt<"bottom"ilp><"clear">',
            responsive: {
                details: {
                    target: 2
                }
            },
            order: [4, "asc"],
            aLengthMenu: [
                [30, 50, 100, -1],
                [30, 50, 100, "Tümü"]
            ],
            stateSave: true,
            ajax: {
                url: ep.ROLLCALL_LIST_TYPE + "players",
                type: "POST",
                datatype: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("Content-Type", "application/json");
                    request.setRequestHeader("XIP", getCookie("IPADDR"));
                    request.setRequestHeader("Authorization", localStorage.getItem("UID"));
                },
                data: function(d) {
                    return JSON.stringify({
                        uid: uid,
                        rollcall_id: rcid
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
                dataSrc: d => {
                    if (d.status.code !== 1020) {
                        errorSwal(d.status);
                        return [];
                    } else {
                        if (d.extra_data === 1) this.props.history.goBack();
                        const statusList = [];
                        d.data.map(el => {
                            statusList.push({
                                uid: el.uid,
                                status: el.daily
                            });
                        });
                        this.setState({ statuses: statusList });
                        return d.extra_data === 1
                            ? []
                            : d.data.filter(x => x.status === 1).filter(x => x.is_trial === 0);
                    }
                }
            },
            columnDefs: [
                {
                    type: "turkish",
                    targets: "_all"
                },
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
                                              onClick={() => this.props.history.push(`/app/groups/detail/${el.value}`)}>
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
                    targets: "rollcalls",
                    responsivePriority: 3,
                    createdCell: (td, cellData, rowData) => {
                        ReactDOM.render(
                            <div>
                                {cellData.rollcalls.map((el, key) => {
                                    return (
                                        <span
                                            key={key.toString()}
                                            data-placement="top"
                                            data-content={`
                                            <p><b>${moment(el.rollcall_date).format("LL, dddd")}</b></p>
                                            Durum: <b class="${dailyType[el.status].color}">${
                                                dailyType[el.status].text
                                            }</b>
                                            ${
                                                el.note ? `<hr class="my-2"/><b>Not:</b> ${el.note}<br>` : ""
                                            }                                            
                                        `}
                                            data-toggle="popover"
                                            className={`d-inline-flex justify-content-center align-items-center mr-1 badge ${
                                                dailyType[el.status].badge
                                            }`}>
                                            <i className={`fe ${dailyType[el.status].icon}`} />
                                        </span>
                                    );
                                })}
                            </div>,
                            td
                        );
                    }
                },
                {
                    targets: "delayed_payment",
                    responsivePriority: 3,
                    className: "text-center",
                    createdCell: (td, cellData, rowData) => {
                        const { name, surname, delayed_payment } = rowData;
                        const fullname = fullnameGenerator(name, surname);

                        if (delayed_payment) {
                            const delay = moment(new Date(), "YYYY-MM-DD").diff(
                                moment(delayed_payment.required_payment_date, "YYYY-MM-DD"),
                                "days"
                            );

                            ReactDOM.render(
                                <span
                                    data-toggle="popover"
                                    data-placement="top"
                                    data-content={`
                                        <p class="font-weight-600 text-info">
                                            <i class="fa fa-user mr-2"></i>${fullname}
                                        </p>
                                        <p class="font-weight-600">
                                            Ödemesi <span class="text-red h5">${delay}</span> gün gecikmiş.
                                        </p>
                                        <div>
                                            <b>${formatDate(delayed_payment.required_payment_date, "LL, dddd")}</b> 
                                            tarihine kadar ödenmesi gereken <b>${formatMoney(delayed_payment.fee)}</b>'lik 
                                            ödeme gecikmiş veya eksik ödenmiştir.
                                        </div>
                                        <hr class="my-3"/>
                                        <div class="mb-2">
                                            Son Ödeme Tarihi<br/>
                                            <b>→ ${formatDate(delayed_payment.required_payment_date, "LL, dddd")}</b>
                                        </div>
                                        <div class="mb-2">
                                            Toplam Ödeme Tutarı<br/>
                                            <b>→ ${formatMoney(delayed_payment.fee)}</b>
                                        </div>
                                        <div class="mb-2">
                                            Toplam Ödenen Tutar<br/>
                                            <b class="${delayed_payment.amount ? "text-green-dark" : ""}">
                                                → ${formatMoney(delayed_payment.amount)}
                                            </b>
                                        </div>
                                
                                    `}>
                                    <i className="fa fa-exclamation-triangle text-red fa-lg"></i>
                                </span>,
                                td
                            );
                        }
                    }
                },
                {
                    targets: "status",
                    class: "w-1 px-3",
                    responsivePriority: 2,
                    createdCell: (td, cellData, rowData) => {
                        const { uid } = rowData;
                        const { statuses, loadingButtons } = this.state;
                        ReactDOM.render(
                            <div>
                                <button
                                    onClick={el => this.takeRollcall(uid, 1, el)}
                                    title="Geldi"
                                    data-toggle="tooltip"
                                    className={`btn btn-icon btn-sm ${
                                        statuses.find(x => x.uid === uid).status === 1
                                            ? "disable-overlay btn-success"
                                            : "btn-secondary"
                                    } ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
                                    <i className="fe fe-check" />
                                </button>

                                <span data-toggle="tooltip" title="İzinli">
                                    <button
                                        data-toggle="dropdown"
                                        className={`btn btn-icon btn-sm ${
                                            statuses.find(x => x.uid === uid).status === 2 ||
                                            statuses.find(x => x.uid === uid).status === 3
                                                ? "btn-warning"
                                                : "btn-secondary"
                                        } mx-1 ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
                                        <i className="fe fe-alert-circle" />
                                    </button>
                                    <div className="dropdown-menu">
                                        <button onClick={el => this.takeRollcall(uid, 2, el)} className="dropdown-item">
                                            Tam Gün
                                        </button>
                                        <button onClick={el => this.takeRollcall(uid, 3, el)} className="dropdown-item">
                                            Yarım Gün
                                        </button>
                                    </div>
                                </span>

                                <button
                                    onClick={el => this.takeRollcall(uid, 0, el)}
                                    title="Gelmedi"
                                    data-toggle="tooltip"
                                    className={`btn btn-icon btn-sm ${
                                        statuses.find(x => x.uid === uid).status === 0
                                            ? "disable-overlay btn-danger"
                                            : "btn-secondary"
                                    } ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
                                    <i className="fe fe-x" />
                                </button>
                            </div>,
                            td
                        );
                    }
                },
                {
                    targets: "action",
                    class: "w-1 px-3",
                    responsivePriority: 3,
                    createdCell: (td, cellData, rowData) => {
                        const fullname = fullnameGenerator(rowData.name, rowData.surname);
                        const { uid, name, surname, group, status, note, daily } = rowData;
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
                                    status: status,
                                    group: group
                                }}
                                renderButton={() => (
                                    <>
                                        {CheckPermissions(["r_write"]) && daily !== -1 && (
                                            <button
                                                className="btn btn-icon btn-sm btn-secondary mr-1"
                                                data-toggle="tooltip"
                                                onClick={() => this.removeRollcallStatus(uid)}
                                                title="Yoklamayı Kaldır">
                                                <i className="fe fe-x text-danger" />
                                            </button>
                                        )}
                                        {CheckPermissions(["r_write"]) && (
                                            <button
                                                className="btn btn-icon btn-sm btn-secondary mr-1"
                                                data-toggle="tooltip"
                                                onClick={() =>
                                                    this.setRollcallNote(fullnameGenerator(name, surname), uid)
                                                }
                                                title={note ? "Not: " + note : "Not Gir"}>
                                                <i className={`fe fe-edit ${note ? "text-orange" : ""}`} />
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
                    responsivePriority: 5,
                    render: function(data, type, row) {
                        var status = row.status;
                        var renderBg = row.is_trial ? statusType[3].bg : statusType[status].bg;
                        var renderTitle = row.is_trial
                            ? statusType[status].title + " & Ön Kayıt Öğrenci"
                            : statusType[status].title + " Öğrenci";
                        return `<div class="avatar text-uppercase" style="background-image: url(${nullCheck(data)})">
									${avatarPlaceholder(row.name, row.surname)}
									<span class="avatar-status ${renderBg}" data-toggle="tooltip" title="${renderTitle}"></span>
								</div>`;
                    }
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
                            return `<a class="text-inherit font-weight-600" href="/app/players/detail/${row.uid}">${fullname}</a>`;
                    }
                },
                {
                    data: null
                },
                {
                    data: "birthday",
                    responsivePriority: 6,
                    render: function(data, type, row) {
                        if (["sort", "type"].indexOf(type) > -1) {
                            return data ? data.split(".")[0] : data;
                        }

                        if (data && data !== "") return moment(data).format("YYYY");
                        else return "&mdash;";
                    }
                },
                {
                    data: "groups",
                    responsivePriority: 2,
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
                { data: null },
                {
                    data: "delayed_payment",
                    render: function(data, type, row) {
                        return data && 1;
                    }
                },
                { data: null },
                { data: null }
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
    };

    takeRollcall = (to, type, that) => {
        try {
            /*
				- type 0 -> gelmedi
				- type 1 -> geldi
				- type 2 -> izinli
			*/

            const element = that.currentTarget;

            const { uid, loadingButtons } = this.state;
            const { rcid } = this.props.match.params;

            this.setState({ loadingButtons: [...loadingButtons, to] });
            this.addButtonLoading(element, type);

            if (type === 2 || type === 3) {
                Promise.all([
                    CreateVacation(
                        {
                            uid: uid,
                            to: to,
                            start: moment(new Date()).format("YYYY-MM-DD"),
                            end: moment(new Date()).format("YYYY-MM-DD"),
                            day: type === 2 ? 1 : 0.5,
                            no_cost: 0
                        },
                        "player"
                    ),
                    MakeRollcall(
                        {
                            uid: uid,
                            to: to,
                            status: parseInt(type),
                            rollcall_id: parseInt(rcid)
                        },
                        "player"
                    )
                ]).then(([responseVacation, responseRollcall]) => {
                    if (responseVacation && responseRollcall) {
                        const vacationStatus = responseVacation.status;
                        const rollcallStatus = responseRollcall.status;
                        if (rollcallStatus.code === 1020) {
                            if (vacationStatus.code === 1037) {
                                UpdateVacation({
                                    uid: uid,
                                    vacation_id: responseVacation.data.vacation_id,
                                    update: {
                                        start: moment(new Date()).format("YYYY-MM-DD"),
                                        end: moment(new Date()).format("YYYY-MM-DD"),
                                        day: type === 2 ? 1 : 0.5,
                                        no_cost: 0
                                    }
                                });
                            }
                            this.changeStatus(element, type);
                        }
                        this.removeButtonLoading(element, type);
                    }
                });
            } else {
                MakeRollcall(
                    {
                        uid: uid,
                        to: to,
                        status: parseInt(type),
                        rollcall_id: parseInt(rcid)
                    },
                    "player"
                ).then(response => {
                    if (response) {
                        this.removeButtonLoading(element, type);
                        this.changeStatus(element, type);
                    }
                });
            }
        } catch (e) {}
    };

    addButtonLoading = (element, type) => {
        if (type === 2 || type === 3) {
            $(element)
                .parent()
                .siblings("button")
                .addClass("btn-loading");
            $(element)
                .parent()
                .siblings("button")
                .parent()
                .siblings()
                .map(function() {
                    if (this.tagName === "SPAN") {
                        $("button", this).addClass("btn-loading");
                    } else {
                        $(this).addClass("btn-loading");
                    }
                });
        } else {
            $(element).addClass("btn-loading");
            $(element)
                .siblings()
                .map(function() {
                    if (this.tagName === "SPAN") {
                        $("button", this).addClass("btn-loading");
                    } else {
                        $(this).addClass("btn-loading");
                    }
                });
        }
    };

    removeButtonLoading = (element, type) => {
        if (type === 2 || type === 3) {
            $(element)
                .parent()
                .siblings("button")
                .removeClass("btn-loading");
            $(element)
                .parent()
                .siblings("button")
                .parent()
                .siblings()
                .map(function() {
                    if (this.tagName === "SPAN") {
                        $("button", this)
                            .removeClass("btn-loading")
                            .removeClass("disable-overlay");
                    } else {
                        $(this)
                            .removeClass("btn-loading")
                            .removeClass("disable-overlay");
                    }
                });
        } else {
            $(element).removeClass("btn-loading");
            $(element)
                .siblings()
                .map(function() {
                    if (this.tagName === "SPAN") {
                        $("button", this)
                            .removeClass("btn-loading")
                            .removeClass("disable-overlay");
                    } else {
                        $(this)
                            .removeClass("btn-loading")
                            .removeClass("disable-overlay");
                    }
                });
        }
    };

    changeStatus = (element, type) => {
        const status_type = {
            0: "btn-danger",
            1: "btn-success",
            2: "btn-warning",
            3: "btn-warning",
            x: "btn-secondary"
        };
        if (type === 2 || type === 3) {
            $(element)
                .parent()
                .siblings("button")
                .removeClass(status_type.x)
                .addClass(status_type[type]);

            $(element)
                .parent()
                .siblings("button")
                .parent()
                .siblings()
                .map(function() {
                    if (this.tagName === "SPAN") {
                        $("button", this)
                            .removeClass(status_type[2])
                            .addClass(status_type.x);
                    } else {
                        $(this)
                            .removeClass(status_type[0])
                            .addClass(status_type.x);
                    }
                });
        } else {
            $(element)
                .removeClass(status_type.x)
                .addClass(status_type[type])
                .addClass("disable-overlay");

            $(element)
                .siblings()
                .map(function() {
                    if (this.tagName === "SPAN") {
                        $("button", this)
                            .removeClass(status_type[2])
                            .addClass(status_type.x);
                    } else {
                        $(this)
                            .removeClass(status_type[0])
                            .addClass(status_type.x);
                    }
                });
        }
    };

    setRollcallNote = (name, to) => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        showSwal({
            type: "info",
            title: "Yoklama Notu",
            html: `<b>${name}</b> adlı öğrenci için yoklama notu giriniz:`,
            confirmButtonText: "Onayla",
            showCancelButton: true,
            cancelButtonText: "İptal",
            cancelButtonColor: "#868e96",
            reverseButtons: true,
            input: "text",
            inputPlaceholder: "...",
            inputAttributes: {
                max: 100
            },
            inputValidator: value => {
                return new Promise(resolve => {
                    if (value.length > 0 && value.length <= 100) {
                        SetNoteRollcall(
                            {
                                uid: uid,
                                to: to,
                                rollcall_id: rcid,
                                note: value
                            },
                            "player"
                        ).then(response => setTimeout(this.reload, 1000));
                    } else {
                        resolve("Hatalı değer!");
                    }
                });
            }
        });
    };

    removeRollcallStatus = to => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        DeleteRollcall({ uid: uid, to: to, rollcall_id: rcid }, "player").then(response =>
            setTimeout(this.reload, 1000)
        );
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

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

    printableRollcallForm = () => {
        showSwal({
            type: "question",
            title: "Yoklama Formu",
            text: "Yoklama formu hangi şekilde hazırlansın?",
            confirmButtonText: "Günlük",
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonText: "Aylık",
            confirmButtonColor: "#316cbe",
            cancelButtonColor: "#868e96"
        }).then(result => {
            if (result.value) {
                this.props.history.push(`/printable/rollcall-form/${this.props.match.params.rcid}/daily`);
            } else {
                this.props.history.push(`/printable/rollcall-form/${this.props.match.params.rcid}/monthly`);
            }
        });
    };

    closeRollcall = () => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        showSwal({
            type: "warning",
            title: "Uyarı",
            html: `Yoklama sonlandırılacaktır!
            <br>Yoklama sonlandıktan sonra <u>değişiklik yapamazsınız.</u>
            <br><br>
            İşaretlenmemiş öğrenciler sisteme<br>
            <strong class="text-orange">Tanımsız</strong> olarak tanımlanacaktır.
            <br>Yoklamayı sonlandırmak istediğinize emin misiniz?
            <br><br>
            <u class="bg-red p-1">Bu işlem geri alınamaz.</u>
            <br><br>
            <span class="font-italic">Not: Sonlandırılmayan yoklamalar gün sonunda otomatik olarak sonlanır.</span>`,
            confirmButtonText: "Eminim, Sonlandır",
            cancelButtonText: "İptal",
            confirmButtonColor: "#cd201f",
            cancelButtonColor: "#868e96",
            showCancelButton: true,
            reverseButtons: true
        }).then(re => {
            if (re.value) {
                CloseRollcall({
                    uid: uid,
                    rollcall_id: rcid
                }).then(response => {
                    if (response) {
                        const status = response.status;
                        if (status.code === 1020) {
                            this.props.history.push("/app/rollcalls/player");
                        }
                    }
                });
            }
        });
    };

    render() {
        const { data } = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Yoklamalar &mdash; Öğrenciler &mdash; Yoklama Al</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/rollcalls/player"}>
                        Yoklamalara Geri Dön
                    </Link>
                    {/* <button onClick={this.printableRollcallForm} className="btn btn-icon btn-secondary ml-auto mr-2">
                        <i className="fe fe-printer mr-1"></i>
                        Yoklama Formu
                    </button> */}
                </div>
                <div className="row row-cards">
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-status bg-teal" />
                                <h3 className="card-title">Öğrenci Listesi</h3>
                                <div className="card-options">
                                    <button onClick={this.closeRollcall} className="btn btn-sm btn-danger mr-2">
                                        Yoklamayı Sonlandır
                                    </button>
                                    <span
                                        className="form-help bg-gray-dark text-white"
                                        data-toggle="popover"
                                        data-placement="bottom"
                                        data-content='<p>Yoklama alınırken, sisteme <b>"geldi"</b>, <b>"izinli"</b> veya <b>"gelmedi"</b> olarak giriş yapabilirsiniz.</p><p>Yoklamalar sonlandırılmadığı takdirde gün sonunda otomatik olarak sonlanır. İşaretlenmemiş olanlar, sisteme <b>"Tanımsız"</b> şeklinde tanımlanır.</p><p><b className="text-red">Not:</b> Yoklama sonlanana kadar değişiklik yapabilirsiniz. Sonlanılan yoklamalarda değişiklik <b class="text-red"><u><i>yapılamaz.</i></u></b></p>'>
                                        !
                                    </span>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div>
                                    <table
                                        id="rollcall-list"
                                        className="table card-table w-100 table-vcenter table-hover text-nowrap datatable table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th className="w-1 no-sort">T.C.</th>
                                                <th className="w-1 no-sort control" />
                                                <th className="w-1 text-center no-sort"></th>
                                                <th className="name">AD SOYAD</th>
                                                <th className="parents">VELİSİ</th>
                                                <th className="birthday">DOĞUM YILI</th>
                                                <th className="groups">GRUP</th>
                                                <th className="w-1 no-sort rollcalls">SON 4 YOKLAMA</th>
                                                <th className="w-1 delayed_payment">GECİKMİŞ ÖDEME</th>
                                                <th className="w-1 no-sort status">DURUM</th>
                                                <th className="w-1 no-sort action">İŞLEM</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    {/* <GroupChange data={data} history={this.props.history} /> */}
                                    <Vacation data={data} history={this.props.history} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Add;
