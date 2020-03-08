import React, { Component } from "react";
import List from "../../components/Groups/List";
import All from "../../components/Groups/All";
import { Link, withRouter } from "react-router-dom";
import { CheckPermissions } from "../../services/Others";
import NotPermissions from "../../components/NotActivate/NotPermissions";

export class Groups extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar</h1>
                    {CheckPermissions(["g_write"]) && (
                        <Link to="/app/groups/add" className="btn btn-sm btn-success ml-auto">
                            Grup Oluştur
                        </Link>
                    )}
                </div>
                <div className="row">
                    <div className="col-12">
                        {CheckPermissions(["g_read"]) ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Tüm Veliler</h3>
                                </div>
                                <List />
                            </div>
                        ) : (
                            <NotPermissions
                                title="Üzgünüz 😣"
                                imageAlt="Yetersiz Yetki"
                                content={() => (
                                    <p className="text-muted text-center">
                                        Grupları görüntülemek için yetkiniz bulunmamaktadır.
                                        <br />
                                        Eğer farklı bir sorun olduğunu düşünüyorsanız lütfen yöneticiniz ile iletişime
                                        geçiniz...
                                    </p>
                                )}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Groups);
