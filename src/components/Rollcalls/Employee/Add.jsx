import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter, Link } from "react-router-dom";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";
import { MakeRollcall, SetNoteRollcall, DeleteRollcall, CloseRollcall } from "../../../services/Rollcalls";
import { getCookie } from "../../../assets/js/core";
import ep from "../../../assets/js/urls";
import "../../../assets/js/datatables-custom";
import AdvancePayment from "../../EmployeeAction/AdvancePayment";
import { fatalSwal, errorSwal, showSwal } from "../../Alert.jsx";
import Vacation from "../../EmployeeAction/Vacation";
import Password from "../../EmployeeAction/Password";
import ActionButton from "../../Employees/ActionButton";
import {
    fullnameGenerator,
    renderForDataTableSearchStructure,
    nullCheck,
    formatPhone,
    avatarPlaceholder,
    CheckPermissions
} from "../../../services/Others";
const $ = require("jquery");

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Personel" },
    1: { bg: "bg-success", title: "Aktif Personel" }
};

const dailyType = {
    0: { icon: "fe-x", badge: "bg-red-light", text: "Gelmedi", color: "text-red" },
    1: { icon: "fe-check", badge: "bg-green-light", text: "Geldi", color: "text-green" },
    2: { icon: "fe-alert-circle", badge: "bg-yellow-light", text: "İzinli", color: "text-yellow" }
};

export class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            employees: null,
            statuses: [],
            onLoadedData: false,
            data: {},
            loadingButtons: []
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

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
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
                url: ep.ROLLCALL_LIST_TYPE + "employees",
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
                        return d.extra_data === 1 ? [] : d.data.filter(x => x.status === 1);
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
                                onClick={() => this.props.history.push(`/app/persons/employees/detail/${uid}`)}>
                                {fullname}
                            </div>,
                            td
                        );
                    }
                },
                {
                    targets: "rollcalls",
                    responsivePriority: 5,
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
                    targets: "status",
                    class: "w-1 px-3",
                    responsivePriority: 2,
                    createdCell: (td, cellData, rowData) => {
                        const { uid } = rowData;
                        const { statuses, loadingButtons } = this.state;
                        const status = statuses.find(x => x.uid === uid).status;
                        ReactDOM.render(
                            <div>
                                <button
                                    onClick={el => this.takeRollcall(uid, 1, el)}
                                    title="Geldi"
                                    data-toggle="tooltip"
                                    className={`btn btn-icon btn-sm mr-1 ${
                                        status === 1 ? "disable-overlay btn-success" : "btn-secondary"
                                    } ${loadingButtons.find(x => x === uid) ? "btn-loading" : ""}`}>
                                    <i className="fe fe-check" />
                                </button>
                                <button
                                    onClick={el => this.takeRollcall(uid, 0, el)}
                                    title={status === 2 ? "Gelmedi (İzinli)" : "Gelmedi"}
                                    data-toggle="tooltip"
                                    className={`btn btn-icon btn-sm ${
                                        [0, 2].indexOf(status) > -1 ? "disable-overlay btn-danger" : "btn-secondary"
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
                    responsivePriority: 4,
                    createdCell: (td, cellData, rowData) => {
                        const fullname = fullnameGenerator(rowData.name, rowData.surname);
                        const { uid, status, daily, note, name, surname } = rowData;
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
                        var renderBg = statusType[status].bg;
                        var renderTitle = statusType[status].title;
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
                            return `<a class="text-inherit font-weight-600" href="/app/persons/employees/detail/${row.uid}">${fullname}</a>`;
                    }
                },
                {
                    data: "phone",
                    responsivePriority: 3,
                    render: function(data, type, row) {
                        return `<a href="tel:+90${data}" class="text-inherit">${formatPhone(data)}</a>`;
                    }
                },
                {
                    data: "position",
                    responsivePriority: 4
                },
                { data: null },
                { data: null },
                { data: null }
            ]
        });

        $("#rollcall-list").on("error.dt", function(e, settings, techNote, message) {
            console.log("An error has been reported by DataTables: ", message, techNote);
        });

        $("#rollcall-list").on("draw.dt", function() {
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
            this.addButtonLoading(element);

            MakeRollcall(
                {
                    uid: uid,
                    to: to,
                    status: parseInt(type),
                    rollcall_id: parseInt(rcid)
                },
                "employee"
            ).then(response => {
                if (response) {
                    this.removeButtonLoading(element);
                    this.changeStatus(element, type);
                }
            });
        } catch (e) {}
    };

    addButtonLoading = element => {
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
    };

    removeButtonLoading = element => {
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
    };

    changeStatus = (element, type) => {
        const status_type = {
            0: "btn-danger",
            1: "btn-success",
            2: "btn-warning",
            x: "btn-secondary"
        };
        $(element)
            .removeClass(status_type.x)
            .addClass(status_type[type])
            .addClass("disable-overlay");

        $(element)
            .siblings()
            .map(function() {
                $(this)
                    .removeClass(status_type[0])
                    .addClass(status_type.x);
            });
    };

    setRollcallNote = (name, to) => {
        const { uid } = this.state;
        const { rcid } = this.props.match.params;
        showSwal({
            type: "info",
            title: "Yoklama Notu",
            html: `<b>${name}</b> adlı personel için yoklama notu giriniz:`,
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
                            "employee"
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
        DeleteRollcall({ uid: uid, to: to, rollcall_id: rcid }, "employee").then(response =>
            setTimeout(this.reload, 1000)
        );
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
            İşaretlenmemiş personeller sisteme<br>
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
                            this.props.history.push("/app/rollcalls/employee");
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
                    <h1 className="page-title">Yoklamalar &mdash; Personeller &mdash; Yoklama Al</h1>
                    <Link className="btn btn-link ml-auto" to={"/app/rollcalls/employee"}>
                        Yoklamalara Geri Dön
                    </Link>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-status bg-azure" />
                                <h3 className="card-title">Personel Listesi</h3>
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
                                <div className="table-responsive">
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
                                                <th className="phone">TELEFON</th>
                                                <th className="position">POZİSYON</th>
                                                <th className="no-sort rollcalls">SON 4 YOKLAMA</th>
                                                <th className="w-1 no-sort status">DURUM</th>
                                                <th className="w-1 no-sort action">İŞLEM</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <Vacation data={data} history={this.props.history} />
                                    <Password data={data} history={this.props.history} />
                                    <AdvancePayment data={data} history={this.props.history} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Add);
