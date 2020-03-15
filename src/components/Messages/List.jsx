import React, { Component } from "react";
import ReactDOM from "react-dom";
import { fatalSwal, errorSwal, showSwal } from "../Alert.jsx";
import { getCookie } from "../../assets/js/core";
import "../../assets/js/datatables-custom";
import ep from "../../assets/js/urls";
import _ from "lodash";
import { formatDate, renderForDataTableSearchStructure } from "../../services/Others.jsx";
import { CancelCampaign, ToggleStatusCampaign } from "../../services/Messages.jsx";
import moment from "moment";
const $ = require("jquery");

const statusType = {
    0: { bg: "badge-dark", title: "İptal" },
    1: { bg: "badge-warning", title: "Kuyrukta" },
    2: { bg: "badge-success", title: "Tamamlandı" },
    3: { bg: "badge-secondary", title: "Durduruldu" },
    4: { bg: "badge-danger", title: "Yetersiz Bakiye" },
    5: { bg: "badge-danger", title: "Başarısız" },
    6: { bg: "badge-danger", title: "Başarısız" },
    999: { bg: "badge-orange", title: "Devam Ediyor" }
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
            const table = $("#messages-list").DataTable({
                dom: '<"top"<"filterTools">f>rt<"bottom"ilp><"clear">',
                responsive: {
                    details: {
                        target: 1
                    }
                },
                fixedHeader: true,
                order: [0, "desc"],
                aLengthMenu: [
                    [20, 50, 100, -1],
                    [20, 50, 100, "Tümü"]
                ],
                ajax: {
                    url: ep.CAMPAIGN_LIST,
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
                        $.fn.dataTable.ext.search = [];
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
                        targets: "title",
                        className: "pl-3",
                        createdCell: (td, cellData, rowData) => {
                            const { campaign_id, title, template, segment_id } = rowData;
                            ReactDOM.render(
                                <div className="d-flex align-items-center">
                                    <div
                                        data-toggle="tooltip"
                                        title={template.template_name}
                                        className={`icon-placeholder icon-placeholder-xxs bg-${template.color}-lightest mr-3 d-none d-sm-inline-flex`}>
                                        <i className={`${template.icon} text-${template.color}`} />
                                    </div>
                                    <span
                                        data-toggle="tooltip"
                                        title={title}
                                        className="btn-link cursor-pointer text-inherit font-weight-600 text-wrap text-sm-nowrap"
                                        onClick={() => this.props.history.push(`/app/messages/detail/${campaign_id}`)}>
                                        {segment_id && <span className="badge badge-primary mr-2">OTOMATİK</span>}
                                        {title}
                                    </span>
                                </div>,
                                td
                            );
                        }
                    },
                    {
                        targets: "status",
                        render: function(data, type, row) {
                            return data + " " + row.template.template_name;
                        },
                        createdCell: (td, cellData, rowData) => {
                            const { status, segment_id } = rowData;
                            if (segment_id && status === 1) {
                                ReactDOM.render(
                                    <span className={`badge ${statusType[999].bg}`}>{statusType[999].title}</span>,
                                    td
                                );
                            } else {
                                ReactDOM.render(
                                    <span className={`badge ${statusType[status].bg}`}>
                                        {statusType[status].title}
                                    </span>,
                                    td
                                );
                            }
                        }
                    },
                    {
                        targets: "action",
                        createdCell: (td, cellData, rowData) => {
                            const { campaign_id, status, title, segment_id } = rowData;
                            ReactDOM.render(
                                <>
                                    <button
                                        data-toggle="tooltip"
                                        title="Gönderimi Görüntüle"
                                        className="btn btn-icon btn-sm btn-secondary mx-1"
                                        onClick={() => this.props.history.push(`/app/messages/detail/${campaign_id}`)}>
                                        <i className="fe fe-eye" />
                                    </button>
                                    {segment_id && status === 1 ? (
                                        <button
                                            className="btn btn-icon btn-sm btn-gray mx-1"
                                            data-toggle="tooltip"
                                            title="Gönderimi Durdur"
                                            onClick={() => this.toggleStatusCampaign(campaign_id, title, 3)}>
                                            <i className="fe fe-pause" />
                                        </button>
                                    ) : null}
                                    {segment_id && status === 3 ? (
                                        <button
                                            className="btn btn-icon btn-sm btn-orange mx-1"
                                            data-toggle="tooltip"
                                            title="Gönderimi Başlat"
                                            onClick={() => this.toggleStatusCampaign(campaign_id, title, 1)}>
                                            <i className="fe fe-play" />
                                        </button>
                                    ) : null}
                                    {status !== 2 && status !== 0 ? (
                                        <button
                                            className="btn btn-icon btn-sm btn-dark mx-1"
                                            data-toggle="tooltip"
                                            title="Gönderimi İptal Et"
                                            onClick={() => this.cancelCampaign(campaign_id, title)}>
                                            <i className="fe fe-x" />
                                        </button>
                                    ) : null}
                                </>,
                                td
                            );
                        }
                    }
                ],
                columns: [
                    {
                        data: "campaign_id"
                    },
                    {
                        data: null,
                        defaultContent: ""
                    },
                    {
                        data: "title",
                        responsivePriority: 1,
                        render: function(data, type, row) {
                            if (type === "filter") {
                                return renderForDataTableSearchStructure(data + row.template.template_name);
                            }
                            return data + " " + row.template.template_name;
                        }
                    },
                    {
                        data: "person_count",
                        responsivePriority: 4,
                        render: function(data, type, row) {
                            return row.segment_id ? "<span style='font-size:20px;'>∞</span>" : data;
                        }
                    },
                    {
                        data: "created_date",
                        className: "none",
                        render: function(data, type, row) {
                            return formatDate(data, "DD MMMM YYYY, HH:mm");
                        }
                    },
                    {
                        data: "when",
                        responsivePriority: 5,
                        render: function(data, type, row) {
                            return formatDate(data, "DD MMMM YYYY, HH:mm");
                        }
                    },
                    {
                        data: "end_date",
                        responsivePriority: 6,
                        render: function(data, type, row) {
                            return formatDate(data, "DD MMMM YYYY, HH:mm");
                        }
                    },
                    {
                        data: "working_days",
                        className: "none",
                        render: function(data, type, row) {
                            const mergedValue = _.sortBy(data)
                                .map(x => moment.weekdays(parseInt(x)))
                                .join(", ");

                            return `<span class="text-wrap">${mergedValue}</span>`;
                        }
                    },
                    {
                        data: "status",
                        responsivePriority: 2
                    },
                    {
                        data: null,
                        responsivePriority: 3
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

    cancelCampaign = (campaign_id, name) => {
        const { uid } = this.state;
        showSwal({
            type: "warning",
            title: "Mesaj İptali",
            html: `<strong>${name}</strong> adlı mesaj iptal edilecektir.<br>Mesaj gönderimi olmayacaktır.<br>Onaylıyor musunuz?`,
            confirmButtonText: "Onaylıyorum",
            cancelButtonText: "İptal",
            confirmButtonColor: "#cd201f",
            cancelButtonColor: "#868e96",
            showCancelButton: true,
            reverseButtons: true
        }).then(re => {
            if (re.value) {
                CancelCampaign({
                    uid: uid,
                    campaign_id: campaign_id
                }).then(response => {
                    if (response) {
                        this.reload();
                    }
                });
            }
        });
    };

    toggleStatusCampaign = (campaign_id, name, status) => {
        const { uid } = this.state;
        showSwal({
            type: "warning",
            title: status === 1 ? "Mesajı Başlat" : "Mesajı Durdur",
            html:
                status === 1
                    ? `<strong>${name}</strong> adlı mesaj başlatılacaktır.<br>Mesaj gönderimi tekrar başlayacaktır.<br>Onaylıyor musunuz?`
                    : `<strong>${name}</strong> adlı mesaj durdurulacaktır.<br>Mesaj gönderimi duracaktır.<br>Onaylıyor musunuz?`,
            confirmButtonText: "Onaylıyorum",
            cancelButtonText: "İptal",
            confirmButtonColor: "#cd201f",
            cancelButtonColor: "#868e96",
            showCancelButton: true,
            reverseButtons: true
        }).then(re => {
            if (re.value) {
                ToggleStatusCampaign({
                    uid: uid,
                    campaign_id: campaign_id,
                    status: status
                }).then(response => {
                    if (response) {
                        this.reload();
                    }
                });
            }
        });
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    render() {
        return (
            <div>
                <table
                    id="messages-list"
                    className="table card-table w-100 table-vcenter table-striped text-nowrap datatable dataTable table-bordered">
                    <thead>
                        <tr>
                            <th className="w-1 campaign_id">ID</th>
                            <th className="w-1 no-sort control" />
                            <th className="title">MESAJ ADI</th>
                            <th className="person_count">KİŞİ SAYISI</th>
                            <th className="created_date">OLUŞTURMA TARİHİ</th>
                            <th className="when">BAŞLAMA TARİHİ</th>
                            <th className="end_date">SONLANMA TARİHİ</th>
                            <th className="working_days">GÖNDERİ ÇALIŞMA GÜNLERİ</th>
                            <th className="status">DURUM</th>
                            <th className="no-sort action w-1">İşlem</th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
}

export default List;
