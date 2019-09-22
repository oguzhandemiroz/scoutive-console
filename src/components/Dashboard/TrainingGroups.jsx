import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TrainingGroups } from "../../services/Report";
import { fullnameGenerator } from "../../services/Others";
import moment from "moment";
const $ = require("jquery");

const noRow = loading =>
    loading ? (
        <div className={`dimmer active p-5`}>
            <div className="loader" />
            <div className="dimmer-content" />
        </div>
    ) : (
        <div className="text-center text-muted font-italic p-5">Kayıt bulunamadı...</div>
    );
export class TrainingGroupList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            trainings: null
        };
    }

    componentDidMount() {
        this.listGroups();
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    listGroups = () => {
        TrainingGroups().then(response => this.setState({ trainings: response.data }));
    };

    render() {
        const { trainings } = this.state;
        return (
            <div className="card">
                {trainings ? (
                    trainings.length > 0 ? (
                        trainings.map((el, key) => {
                            return (
                                <div className="card-body" key={key.toString()}>
                                    <div className="card-value float-right text-muted">
                                        <i className="fa fa-running text-green-light" />
                                    </div>
                                    <h4 className="mb-1">{el.name}</h4>
                                    <div className="text-muted">
                                        Grubu şu an&nbsp;
                                        <strong className="text-body">{el.area ? el.area.name + "'de " : ""}</strong>
                                        antrenmanda
                                    </div>
                                    <div className="row clear-both pt-4">
                                        <div className="col-auto d-lg-flex align-items-center">
                                            <div
                                                className="avatar"
                                                style={{ backgroundImage: `url(${el.employee.image})` }}
                                            />
                                        </div>
                                        <div className="col">
                                            <Link
                                                to={"/app/employees/detail/" + el.employee.uid}
                                                className="text-body font-weight-600 d-block">
                                                {fullnameGenerator(el.employee.name, el.employee.surname)}
                                            </Link>
                                            <span
                                                className="small text-muted"
                                                data-toggle="tooltip"
                                                title={el.employee.permission}>
                                                Sorumlu Antrenör
                                            </span>
                                        </div>
                                        <div className="col-auto d-flex align-items-center">
                                            <span
                                                className="tag tag-gray-dark"
                                                data-original-title="Antrenman Saati"
                                                data-offset="-35"
                                                data-toggle="tooltip">
                                                {moment(el.start_time, "HH:mm").format("HH:mm")}&nbsp;&mdash;&nbsp;
                                                {moment(el.end_time, "HH:mm").format("HH:mm")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="card-body">
                            <div className="card-value float-right text-muted">
                                <i className="fa fa-running" />
                            </div>
                            <div className="text-muted d-flex align-items-center" style={{ height: "3.4rem" }}>
                                Şu an antrenmanda olan grup bulunamadı...
                            </div>
                        </div>
                    )
                ) : (
                    noRow(true)
                )}
            </div>
        );
    }
}

export default TrainingGroupList;
