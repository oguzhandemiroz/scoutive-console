import React, {Component} from "react";
import {Link} from "react-router-dom";
import {ActiveRollcall} from "../../services/Rollcalls";
import moment from "moment";
import "moment/locale/tr";

export class PlayerRollcall extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            loadingData: "active",
            data: null
        };
    }

    componentDidMount() {
        this.listActiveRollcall();
    }

    listActiveRollcall = () => {
        const {uid} = this.state;
        this.setState({loadingData: "active"});
        ActiveRollcall(
            {
                uid: uid
            },
            "players"
        ).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({loadingData: "", data: response.data});
                    console.log(response.data);
                }
            }
        });
    };

    render() {
        const {data, loadingData} = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Öğrenci Yoklaması</div>
                </div>
                {data ? (
                    data.length > 0 ? (
                        <table className="table card-table">
                            <tbody>
                                {data.map((el, key) => (
                                    <tr key={key.toString()}>
                                        <td>{moment(data.created_date).format("LL")}</td>
                                        <td className="text-right">
                                            <Link
                                                to={{
                                                    pathname: `/app/rollcalls/player/add`,
                                                    state: {rcid: el.rollcall_id}
                                                }}
                                                className="btn btn-sm btn-info">
                                                Yoklamaya Devam Et
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="card-body text-center">
                            <Link to="/app/rollcalls/player" className="btn btn-success">
                                Yeni Yoklama Oluştur
                            </Link>
                        </div>
                    )
                ) : (
                    <div className="card-body">
                        <div className={`dimmer ${loadingData}  p-3`}>
                            <div className="loader" />
                            <div className="dimmer-content"></div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default PlayerRollcall;
