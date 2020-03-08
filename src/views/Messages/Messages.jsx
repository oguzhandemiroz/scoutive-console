import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { GetSettings } from "../../services/School";
import MessagesNotActivate from "../../components/NotActivate/Messages";
import NotPermissions from "../../components/NotActivate/NotPermissions";
import List from "../../components/Messages/List";
import { CheckPermissions } from "../../services/Others";

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
                        {CheckPermissions(["m_write"]) && (
                            <Link to="/app/messages/select" className="btn btn-icon btn-sm btn-success ml-auto">
                                Yeni Mesaj Oluştur
                            </Link>
                        )}
                    </div>
                    {CheckPermissions(["m_read"]) ? (
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
                    ) : (
                        <NotPermissions
                            title="Üzgünüz 😣"
                            imageAlt="Yetersiz Yetki"
                            content={() => (
                                <p className="text-muted text-center">
                                    İletişim Merkezini görüntülemek için yetkiniz bulunmamaktadır.
                                    <br />
                                    Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime
                                    geçiniz...
                                </p>
                            )}
                        />
                    )}
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
