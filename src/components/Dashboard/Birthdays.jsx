import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { ListBirthdays } from "../../services/Report";
import "../../assets/css/c3.min.css";
import moment from "moment";
import "moment/locale/tr";
import { fullnameGenerator, avatarPlaceholder, CheckPermissions } from "../../services/Others";
import ActionButton from "../../components/Players/ActionButton";

const $ = require("jquery");

const statusType = {
    0: { bg: "bg-danger", title: "Pasif Öğrenci" },
    1: { bg: "bg-success", title: "Aktif Öğrenci" },
    2: { bg: "bg-azure", title: "Donuk Öğrenci" }
};

const noRow = loading =>
    loading ? (
        <div className={`dimmer active p-3`}>
            <div className="loader" />
            <div className="dimmer-content" />
        </div>
    ) : (
        <div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
    );

export class Birthdays extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: localStorage.getItem("UID"),
            list: null,
            count: 0
        };
    }

    componentDidMount() {
        this.listBirthdays();
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    listBirthdays = () => {
        ListBirthdays().then(response => {
            if (response) {
                const data = response.data;
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({
                        list: data
                    });
                }
            }
        });
    };

    render() {
        const { list } = this.state;

        if (!CheckPermissions(["e_read", "p_read"], "||")) {
            return null;
        }

        return (
            <div className="col-sm-12 col-lg">
                <div className="card">
                    <div className="card-body py-4">
                        <div className="card-value float-right text-muted">
                            <i
                                className={`fa fa-birthday-cake ${
                                    list
                                        ? list.players.length > 0 || list.employees.length > 0
                                            ? "text-orange"
                                            : ""
                                        : ""
                                }`}
                            />
                        </div>

                        <h4 className="mb-1">Doğum Günü</h4>
                        <div className="text-muted">Mutlu Yıllar</div>
                    </div>
                    <div className="card-body">
                        {list ? (
                            (list.players.length === 0) & (list.employees.length === 0) ? (
                                noRow()
                            ) : (
                                <div>
                                    {list.players.length > 0 ? (
                                        <div>
                                            <h5 className="text-muted font-weight-normal">Öğrenciler</h5>
                                            <div className={`pt-1 ${list.employees.length > 0 ? "pb-5" : ""}`}>
                                                {list.players
                                                    .sort((a, b) => b.birthday.localeCompare(a.birthday))
                                                    .map((el, key) => {
                                                        const age = Math.round(
                                                            moment().diff(
                                                                moment(el.birthday, "YYYY-MM-DD"),
                                                                "year",
                                                                true
                                                            )
                                                        );
                                                        return (
                                                            <div className="row mb-3" key={key.toString()}>
                                                                <div className="col-auto d-flex align-items-center">
                                                                    <span
                                                                        className="avatar avatar-xs"
                                                                        style={{ backgroundImage: `url(${el.image})` }}>
                                                                        {el.image
                                                                            ? ""
                                                                            : avatarPlaceholder(el.name, el.surname)}
                                                                        <span
                                                                            data-toggle="tooltip"
                                                                            title={
                                                                                statusType[
                                                                                    el.status !== undefined
                                                                                        ? el.status
                                                                                        : 1
                                                                                ].title
                                                                            }
                                                                            className={`avatar-xs avatar-status ${
                                                                                statusType[
                                                                                    el.status !== undefined
                                                                                        ? el.status
                                                                                        : 1
                                                                                ].bg
                                                                            }`}
                                                                        />
                                                                    </span>
                                                                </div>
                                                                <div className="col pl-1">
                                                                    <Link
                                                                        to={"/app/players/detail/" + el.uid}
                                                                        className="text-body font-weight-600 d-block">
                                                                        {fullnameGenerator(el.name, el.surname)}
                                                                    </Link>
                                                                    <span className="small text-muted d-block">
                                                                        {moment(el.birthday)
                                                                            .year(moment().year())
                                                                            .format("DD MMMM, dddd")}
                                                                    </span>
                                                                    <span className="small text-muted">
                                                                        <i className="fa fa-gift text-instagram mr-2" />
                                                                        {age}. Yaşını Kutlarız!
                                                                    </span>
                                                                </div>
                                                                <div className="col-auto">
                                                                    <ActionButton
                                                                        hide={[
                                                                            "fee",
                                                                            "passive",
                                                                            "payment",
                                                                            "edit",
                                                                            "start",
                                                                            "refresh",
                                                                            "active",
                                                                            "vacation",
                                                                            "point",
                                                                            "group",
                                                                            "rollcall",
                                                                            "certificate"
                                                                        ]}
                                                                        data={{
                                                                            to: el.uid,
                                                                            name: fullnameGenerator(
                                                                                el.name,
                                                                                el.surname
                                                                            ),
                                                                            is_trial: 0
                                                                        }}
                                                                        history={this.props.history}
                                                                        dropdown={true}
                                                                        renderButton={() => (
                                                                            <span
                                                                                className="icon cursor-pointer"
                                                                                data-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                                aria-expanded="false">
                                                                                <i className="fe fe-more-vertical"></i>
                                                                            </span>
                                                                        )}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    ) : null}
                                    {list.employees.length > 0 ? (
                                        <div>
                                            <h5 className="text-muted font-weight-normal">Personeller</h5>
                                            <div className="pt-1">
                                                {list.employees
                                                    .sort((a, b) => b.birthday.localeCompare(a.birthday))
                                                    .map((el, key) => {
                                                        const age = parseInt(
                                                            moment().diff(
                                                                moment(el.birthday, "YYYY-MM-DD"),
                                                                "year",
                                                                true
                                                            )
                                                        );
                                                        return (
                                                            <div className="row mb-3" key={key.toString()}>
                                                                <div className="col-auto d-flex align-items-center">
                                                                    <span
                                                                        className="avatar"
                                                                        style={{ backgroundImage: `url(${el.image})` }}>
                                                                        {el.image
                                                                            ? ""
                                                                            : avatarPlaceholder(el.name, el.surname)}
                                                                    </span>
                                                                </div>
                                                                <div className="col pl-1">
                                                                    <Link
                                                                        to={"/app/persons/employees/detail/" + el.uid}
                                                                        className="text-body font-weight-600 d-block">
                                                                        {fullnameGenerator(el.name, el.surname)}
                                                                    </Link>
                                                                    <span className="small text-muted d-block">
                                                                        {moment(el.birthday).format("DD MMMM, dddd")}
                                                                    </span>
                                                                    <span className="small text-muted">
                                                                        <i className="fa fa-gift text-instagram mr-2" />
                                                                        {age}. Yaşını Kutlarız!
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            )
                        ) : (
                            noRow(true)
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Birthdays);
