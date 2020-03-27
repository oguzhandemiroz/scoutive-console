import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ListSessions, DeactiveSession } from "../../../../services/Session";
import { nullCheck, formatDate, fullnameGenerator } from "../../../../services/Others";
import moment from "moment";
const $ = require("jquery");

export class Sessions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            activeSession: localStorage.getItem("t"),
            mainSessions: null,
            employeeSessions: null,
            loadingData: true,
            loadingButton: ""
        };
    }

    componentDidMount() {
        $('[data-toggle="tooltip"]').tooltip("hide");
        this.listSessions();
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    deactiveSession = session_id => {
        const { uid } = this.state;
        this.setState({ loadingButton: "btn-loading" });
        $('[data-toggle="tooltip"]').tooltip("hide");
        DeactiveSession({
            uid: uid,
            sessions: [session_id]
        }).then(response => this.reload());
    };

    listSessions = () => {
        ListSessions().then(response => {
            if (response) {
                const status = response.status;
                const data = response.data;
                if (status.code === 1020) {
                    this.setState({
                        mainSessions: data.filter(s => !s.employee),
                        employeeSessions: data.filter(s => s.employee),
                        loadingData: false
                    });
                }
            }
        });
    };

    renderSessions = sessions_data => {
        const { loadingData, activeSession, loadingButton } = this.state;
        if (loadingData) {
            return <div className="loader mx-auto" />;
        } else {
            sessions_data.sort((a, b) => (a.token === activeSession ? -1 : 1));
            return (
                <div className="table-responsive">
                    <table className="table card-table border text-nowrap table-striped w-100 table-vcenter">
                        <thead>
                            <tr>
                                <th className="text-center">Aygıt</th>
                                <th>Cihaz</th>
                                <th>Bölge</th>
                                <th>Erişim Tarihi</th>
                                <th>IP Adresi</th>
                                <th className="w-1"></th>
                                <th className="w-1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions_data.length > 0 ? (
                                sessions_data.map(session => {
                                    const deviceIcon = {
                                        desktop: <i className="fa fa-laptop fa-lg" />,
                                        mobile: <i className="fa fa-mobile-alt fa-lg" />,
                                        tablet: <i className="fa fa-tablet-alt fa-lg" />
                                    };

                                    return (
                                        <tr
                                            className={session.token === activeSession ? "bg-dark text-white" : ""}
                                            key={session.session_id.toString()}>
                                            <td className="text-center">{deviceIcon[session.device]}</td>
                                            <td>
                                                <div>{`${session.os_name} ${session.os_version}`}</div>
                                                <div className="small text-muted">{session.browser_name}</div>
                                            </td>
                                            <td>
                                                <i
                                                    data-toggle="tooltip"
                                                    title={`${nullCheck(session.city, "[Tanımsız Şehir]")}, ${
                                                        session.country
                                                    }`}
                                                    className={`flag flag-${nullCheck(
                                                        session.country_code,
                                                        ""
                                                    ).toLowerCase()}`}></i>
                                            </td>
                                            <td>
                                                <span
                                                    data-toggle="tooltip"
                                                    title={formatDate(
                                                        session.created_date,
                                                        "ddd, DD MMM YYYY HH:mm:ss"
                                                    )}>
                                                    {moment(session.created_date, "YYYY-MM-DD HH:mm:ss").fromNow()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-purple mr-1">{session.ip}</span>
                                            </td>
                                            <td>
                                                {session.employee && (
                                                    <i
                                                        className="fa fa-user-tie"
                                                        data-toggle="tooltip"
                                                        title={fullnameGenerator(
                                                            session.employee.name,
                                                            session.employee.surname
                                                        )}
                                                    />
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {session.token !== activeSession ? (
                                                    <button
                                                        onClick={() => this.deactiveSession(session.session_id)}
                                                        type="button"
                                                        className={`btn btn-sm btn-secondary btn-icon ${loadingButton}`}
                                                        title="Oturumu Sonlandır"
                                                        data-toggle="tooltip">
                                                        <i className="fe fe-x" />
                                                    </button>
                                                ) : (
                                                    <i
                                                        className="fa fa-info-circle fa-lg"
                                                        title="Şu an ki Aktif Oturum"
                                                        data-toggle="tooltip"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        <div className="font-italic text-muted small text-center">
                                            Aktif oturum bulunamadı...
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    render() {
        const { mainSessions, employeeSessions } = this.state;
        return (
            <div className="row">
                <div className="col-12">
                    <div className="hr-text mt-0">
                        <i className="fa fa-clock" />
                        Aktif Oturumlar (Ana Hesap)
                    </div>
                    {this.renderSessions(mainSessions)}
                </div>
                <div className="col-12 mt-3">
                    <div className="hr-text">
                        <i className="fa fa-user-clock" />
                        Aktif Oturumlar (Personeller)
                    </div>
                    {this.renderSessions(employeeSessions)}
                </div>
            </div>
        );
    }
}

export default withRouter(Sessions);
