import React, { Component } from "react";

export class SmsTemplates extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-6">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="icon-placeholder">
                                <i className="fa fa-birthday-cake"></i>
                            </div>
                            <h5 className="mt-3">Doğum Günü Şablonu</h5>
                            <p className="text-muted">
                                Sayın Veli, öğrenicimizin doğum gününü kutlar yeni yaşında başarılar dileriz...
                            </p>
                            <div>
                                <button className="btn btn-sm btn-orange">Kullan</button>
                                <button className="btn btn-sm btn-secondary ml-2">Düzenle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SmsTemplates;
