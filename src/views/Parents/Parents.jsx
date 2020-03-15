import React, { Component } from "react";
import List from "../../components/Parents/List";
import { Link } from "react-router-dom";
import NotPermissions from "../../components/NotActivate/NotPermissions";
import { CheckPermissions } from "../../services/Others";

export class Parents extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Veliler</h1>
                    {CheckPermissions(["p_write"]) && (
                        <Link to="/app/persons/parents/add" className="btn btn-success ml-auto">
                            Veli Ekle
                        </Link>
                    )}
                </div>
                <div className="row row-cards">
                    <div className="col">
                        {CheckPermissions(["p_read"]) ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Tüm Veliler</h3>
                                </div>
                                <List history={this.props.history} />
                            </div>
                        ) : (
                            <NotPermissions
                                title="Üzgünüz 😣"
                                imageAlt="Yetersiz Yetki"
                                content={() => (
                                    <p className="text-muted text-center">
                                        Velileri görüntülemek için yetkiniz bulunmamaktadır.
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

export default Parents;
