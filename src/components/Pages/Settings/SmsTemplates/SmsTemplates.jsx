import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListMessageTemplates } from "../../../../services/Messages";

export class SmsTemplates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            list: []
        };
    }

    componentDidMount() {
        this.listMessageTemplates();
    }

    listMessageTemplates = () => {
        ListMessageTemplates().then(response => {
            if (response) {
                if (response.status.code === 1020) this.setState({ list: response.data });
            }
        });
    };

    render() {
        const { uid, list } = this.state;
        return (
            <div className="row row-deck">
                {list.length > 0 ? (
                    list.map((el, key) => {
                        return (
                            <div className="col-6" key={key.toString()}>
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className={`icon-placeholder bg-${el.color}-lightest`}>
                                            <i className={el.icon + " text-" + el.color}></i>
                                        </div>
                                        <h5 className="mt-3">{el.template_name}</h5>
                                        <p className="text-muted text-truncate">{el.content}</p>
                                        <div>
                                            <button className="btn btn-sm btn-orange">Kullan</button>
                                            <Link
                                                to={`/account/settings/sms-templates-edit/${uid}/${el.template_id}`}
                                                className="btn btn-sm btn-secondary ml-2">
                                                Düzenle
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-12">
                        <div className="loader mx-auto"></div>
                    </div>
                )}
            </div>
        );
    }
}

export default SmsTemplates;
