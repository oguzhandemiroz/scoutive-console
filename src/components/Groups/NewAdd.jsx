import React, { Component } from "react";

export class Add extends Component {
    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Gruplar &mdash; Grup Oluştur</h1>
                </div>
                <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-4">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Grup Bilgileri</h3>
                            </div>
                            <div className="card-body">
                                <div class="form-group">
                                    <label class="form-label">
                                        Grup Adı<span class="form-required">*</span>
                                    </label>
                                    <input type="text" className="form-control" name="name" />
                                </div>
                                <div className="row gutters-xs">
                                    <div className="col">
                                        <div class="form-group">
                                            <label class="form-label">
                                                Başlangıç Saati<span class="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="start_time" />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div class="form-group">
                                            <label class="form-label">
                                                Bitiş Saati<span class="form-required">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="end_time" />
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">
                                        Grup Yaş Aralığı<span class="form-required">*</span>
                                    </label>
                                    <div className="row gutters-xs">
                                        <div className="col">
                                            <input type="text" className="form-control" name="start_time" />
                                        </div>
                                        <div className="col">
                                            <input type="text" className="form-control" name="end_time" />
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        Sorumlu Antrenör<span class="form-required">*</span>
                                    </label>
                                    <input type="text" className="form-control" name="name" />
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Antrenman Sahası</label>
                                    <input type="text" className="form-control" name="name" />
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Çalışma Günleri</label>
                                    <div class="selectgroup selectgroup-pills">
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="1" class="selectgroup-input" />
                                            <span class="selectgroup-button">Pazartesi</span>
                                        </label>
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="2" class="selectgroup-input" />
                                            <span class="selectgroup-button">Salı</span>
                                        </label>
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="3" class="selectgroup-input" />
                                            <span class="selectgroup-button">Çarşamba</span>
                                        </label>
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="4" class="selectgroup-input" />
                                            <span class="selectgroup-button">Perşembe</span>
                                        </label>
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="5" class="selectgroup-input" />
                                            <span class="selectgroup-button">Cuma</span>
                                        </label>
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="6" class="selectgroup-input" />
                                            <span class="selectgroup-button">Cumartesi</span>
                                        </label>
                                        <label class="selectgroup-item">
                                            <input type="checkbox" name="value" value="0" class="selectgroup-input" />
                                            <span class="selectgroup-button">Pazar</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-8">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Öğrenciler</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="card">
                                            <div class="card-body p-125 text-center">
                                                <span class="avatar avatar-xl mb-4">OD</span>
                                                <h4 class="mb-0">Oğuzhan Demiröz</h4>
                                                <p class="text-muted text-h5">09 Ocak 1995</p>
                                                <span class="badge badge-success">Forvet</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="card card-active">
                                            <div class="card-body p-125 text-center">
                                                <span class="avatar avatar-xl mb-4">AK</span>
                                                <h4 class="mb-0">Abdullah Külcü</h4>
                                                <p class="text-muted text-h5">09 Ocak 1995</p>
                                                <span class="badge badge-success">Defans</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Add;
