import React, { Component } from "react";
import { selectCustomStyles, datatable_turkish } from "../../assets/js/core";
import Select from "react-select";
import { Groups } from "../../services/FillSelect";
import { ListRollcallType } from "../../services/Rollcalls";
import { fullnameGenerator, avatarPlaceholder, nullCheck } from "../../services/Others";
import _ from "lodash";
const $ = require("jquery");
$.DataTable = require("datatables.net-responsive");

export class RollcallForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            rcid: this.props.match.params.rcid,
            groups: [],
            select: {
                groups: null,
                players: null,
                initialPlayers: null
            }
        };
    }

    componentDidMount() {
        const { uid, rcid } = this.state;
        Groups().then(response => {
            this.setState(prevState => ({
                select: {
                    ...prevState.select,
                    groups: response
                }
            }));
        });

        ListRollcallType(
            {
                uid: uid,
                rollcall_id: rcid
            },
            "players"
        ).then(response => {
            console.log(response.data);
            this.setState(
                prevState => ({
                    select: {
                        ...prevState.select,
                        players: response.data,
                        initialPlayers: response.data
                    }
                }),
                () => this.renderDataTable()
            );
        });
    }

    componentWillUnmount() {
        $(".data-table-wrapper")
            .find("table")
            .DataTable()
            .destroy(true);
    }

    handleSelect = (value, name) => {
        const { select } = this.state;
        const getValues = value ? value.map(x => parseInt(x.value)) : null;
        this.setState(prevState => ({
            formErrors: {
                ...prevState.formErrors,
                [name]: value ? false : true
            },
            [name]: value,
            select: {
                ...prevState.select,
                players: getValues
                    ? select.initialPlayers.filter(x => x.groups.find(y => getValues.indexOf(y.value) > -1))
                    : select.initialPlayers
            }
        }));

        const dt = $("#rollcall-form").DataTable();

        dt.clear();
        dt.rows.add(
            getValues
                ? select.initialPlayers.filter(x => x.groups.find(y => getValues.indexOf(y.value) > -1))
                : select.initialPlayers
        );
        dt.draw();
    };

    renderDataTable = () => {
        const { select } = this.state;
        $("#rollcall-form").DataTable({
            dom: "t",
            data: select.players,
            aLengthMenu: [-1],
            order: [1, "asc"],
            language: {
                ...datatable_turkish,
                decimal: ",",
                thousands: "."
            },
            columnDefs: [
                {
                    targets: "no-sort",
                    orderable: false
                }
            ],
            columns: [
                {
                    data: "image",
                    class: "text-center",
                    render: function(data, type, row) {
                        var name = row.name;
                        var surname = row.surname;
                        return `<div class="avatar text-uppercase" style="background-image: url(${nullCheck(data)})">
									${data ? "" : avatarPlaceholder(name, surname)}
								</div>`;
                    }
                },
                {
                    data: "name",
                    render: function(data, type, row) {
                        const fullname = fullnameGenerator(data, row.surname);
                        if (["sort", "type"].indexOf(type) > -1) {
                            return fullname;
                        }
                        if (data)
                            return `<a class="text-inherit font-weight-600" target="_blank" rel="noreferrer noopener" href="/app/players/detail/${row.uid}">${fullname}</a>`;
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
                    data: null,
                    defaultContent: ""
                },
                {
                    data: null,
                    defaultContent: ""
                }
            ]
        });

        $.fn.DataTable.ext.errMode = "none";
        $("#rollcall-form").on("error.dt", function(e, settings, techNote, message) {
            console.log("An error has been reported by DataTables: ", message, techNote);
        });
    };

    render() {
        const { groups, select } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-block d-print-none">
                                    <div className="hr-text">Grup Seç (Filtrele)</div>
                                    <Select
                                        value={groups}
                                        isMulti
                                        onChange={val => this.handleSelect(val, "groups")}
                                        options={select.groups}
                                        name="groups"
                                        placeholder="Seç..."
                                        styles={selectCustomStyles}
                                        isClearable={true}
                                        isSearchable={true}
                                        isDisabled={select.groups ? false : true}
                                        isLoading={select.groups ? false : true}
                                        noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
                                    />
                                    <div className="hr-text">Öğrenci Listesi</div>
                                </div>
                                <table
                                    id="rollcall-form"
                                    className="table table-vcenter table-bordered table-striped w-100 text-nowrap datatable">
                                    <thead>
                                        <tr>
                                            <th className="w-1 text-center no-sort"></th>
                                            <th className="name">AD SOYAD</th>
                                            <th className="groups">GRUP</th>
                                            <th className="came w-1 text-center no-sort">GELDİ</th>
                                            <th className="notcame w-1 text-center no-sort">GELMEDİ</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RollcallForm;
