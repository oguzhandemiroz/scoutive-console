import React, { Component } from "react";
import { ListGroups } from "../../services/Group";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import { fullnameGenerator, avatarPlaceholder } from "../../services/Others";
const $ = require("jquery");

export class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: [],
            weekdays: moment.weekdaysShort()
        };
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    componentDidMount() {
        this.listGroups();
    }

    listGroups = () => {
        ListGroups().then(response => {
            if (response) {
                let sortData = response.data;
                sortData = sortData.sort((a, b) => {
                    return parseInt(a.start_time) > parseInt(b.start_time) ? 1 : -1;
                });
                this.setState({ list: sortData ? sortData : [] });
            }
        });
    };

    getWorkDays = days => {
        const { weekdays } = this.state;
        return (
            <div className="work-days d-flex flex-row">
                {weekdays.map((el, key) => (
                    <span key={key.toString()} className={`tag ${days.indexOf(key) > -1 ? "tag-green" : ""}`}>
                        {el}
                    </span>
                ))}
            </div>
        );
    };

    render() {
        const { list } = this.state;
        return (
            <div className="row">
                {list.length > 0 ? (
                    list.map((el, key) => {
                        return (
                            <div className="col-md-6 col-lg-4" key={key.toString()}>
                                <div className="card card-hover hover-primary text-decoration-none">
                                    <div className="card-body p-125">
                                        <div className="row gutters-xs align-items-center">
                                            <div className="col">
                                                <h4 className="mb-0">
                                                    <Link
                                                        className="text-body"
                                                        to={"/app/groups/detail/" + el.group_id}>
                                                        {el.name}
                                                    </Link>
                                                </h4>
                                                <span
                                                    className="text-muted text-h5"
                                                    data-original-title="Grup Yaş Aralığı"
                                                    data-toggle="tooltip">
                                                    {el.age}
                                                </span>
                                            </div>
                                            <div className="col-auto leading-none align-self-start">
                                                <span
                                                    className="badge badge-primary"
                                                    data-original-title="Antrenman Saati"
                                                    data-toggle="tooltip">
                                                    {moment(el.start_time, "HH:mm").format("HH:mm")}&nbsp;&mdash;&nbsp;
                                                    {moment(el.end_time, "HH:mm").format("HH:mm")}
                                                </span>
                                                <div className="text-right mt-1">
                                                    <span
                                                        className="text-muted text-h5"
                                                        data-original-title="Antrenman Sahası"
                                                        data-toggle="tooltip">
                                                        {el.area ? el.area.name : "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mt-5">
                                            <div
                                                className="col"
                                                data-original-title="Çalışma Günleri"
                                                data-toggle="tooltip">
                                                {this.getWorkDays(el.work_days)}
                                            </div>
                                            <div className="col-auto">
                                                <Link
                                                    to={"/app/groups/edit/" + el.group_id}
                                                    className="btn btn-secondary btn-sm">
                                                    Düzenle
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12 text-center font-italic text-h3 text-muted p-5">
                        Listelenecek gruplar bulunamadı, hemen sağ yukarıdaki yeşil butondan oluştur!
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(List);
