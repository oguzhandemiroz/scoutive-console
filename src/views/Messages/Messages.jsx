import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { GetSettings } from "../../services/School";
import MessagesNotActivate from "../../components/NotActivate/Messages";
import List from "../../components/Messages/List";

export class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        GetSettings().then(resSettings =>
            this.setState({
                sms_active: parseInt(resSettings.settings.sms_active)
            })
        );
    }

    render() {
        const { sms_active } = this.state;
        if (sms_active) {
            return (
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-title">İletişim Merkezi</h1>
                        <Link
                            to="/app/messages/add"
                            className="btn btn-icon btn-sm btn-success ml-auto dropdown-toggle"
                            data-toggle="dropdown">
                            Yeni Mesaj Oluştur
                        </Link>

                        <div className="dropdown-menu">
                            <Link to="/app/messages/add" className="dropdown-item">
                                Manuel Mesaj Gönderimi
                            </Link>
                            <Link to="/app/messages/add" className="dropdown-item cursor-not-allowed disabled">
                                Otomatik Mesaj Gönderimi
                                <span className="ml-1">
                                    (<i className="fe fe-lock mr-0" />)
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="row row-cards">
                        <div className="col">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Geçmiş Mesajlar</h3>
                                </div>
                                <div className="table-responsive messages-list">
                                    <List history={this.props.history} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="page-header">
                        <h1 className="page-title">İletişim Merkezi</h1>
                    </div>
                    <div className="row row-cards">
                        <div className="col">
                            <MessagesNotActivate
                                content={() => (
                                    <p className="text-muted text-center">
                                        Mesaj servisiniz aktif olmadığı için, iletişim merkezini görüntüleyemiyorsunuz.
                                        <br />
                                        Yetkililer ile iletişime geç hemen aktifleştir!
                                    </p>
                                )}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(Messages);
