import React, { Component } from "react";
import moment from "moment";
import "moment/locale/tr";

export class listPlayers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            totalCount: null
        };
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps;
        this.listPlayers(data);
    }

    listPlayers = data => {
        var total = 0;
        data.map(el => {
            if (
                moment(el.created_date, "YYYY-MM-DD HH:mm:ss").isAfter(
                    moment()
                        .subtract(1, "days")
                        .endOf("day")
                        .format("YYYY-MM-DD HH:mm:ss")
                ) &&
                el.status === 1
            ) {
                total++;
            }
        });
        this.setState({ totalCount: total });
    };

    render() {
        const { totalCount } = this.state;
        return (
            <div
                className="card-body p-3 text-center d-flex flex-column justify-content-center"
                style={{ height: 140 }}>
                <div className="h5">Bugün Kayıt Olan Öğrenci</div>
                <div style={{ fontSize: "2.35rem" }} className="display-4 font-weight-bold mb-3">
                    {totalCount !== null ? (
                        totalCount
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="loader"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default listPlayers;
