import React, { Component } from "react";

export class Sessions extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="hr-text mt-0">Aktif Oturumlar</div>
                    <div class="table-responsive">
                        <table className="table card-table border text-nowrap table-center table-striped w-100 table-vcenter">
                            <thead>
                                <tr>
                                    <th>Aygıt</th>
                                    <th>Cihaz</th>
                                    <th>Bölge</th>
                                    <th>Erişim Tarihi</th>
                                    <th>IP Adresi</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <i className="fa fa-laptop" />
                                    </td>
                                    <td>Windows, Chrome</td>
                                    <td>
                                        <i className="flag flag-tr"></i>
                                    </td>
                                    <td>15 Kasım 2020, 15:00</td>
                                    <td>
                                        <span className="badge badge-warning mr-1">127.0.0.1</span>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-sm btn-secondary">
                                            Oturumu Sonlandır
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <i className="fa fa-laptop" />
                                    </td>
                                    <td>Windows, Chrome</td>
                                    <td>
                                        <i className="flag flag-tr"></i>
                                    </td>
                                    <td>15 Kasım 2020, 15:00</td>
                                    <td>
                                        <span className="badge badge-warning mr-1">127.0.0.1</span>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-sm btn-secondary">
                                            Oturumu Sonlandır
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <i className="fa fa-laptop" />
                                    </td>
                                    <td>Windows, Chrome</td>
                                    <td>
                                        <i className="flag flag-tr"></i>
                                    </td>
                                    <td>15 Kasım 2020, 15:00</td>
                                    <td>
                                        <span className="badge badge-warning mr-1">127.0.0.1</span>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-sm btn-secondary">
                                            Oturumu Sonlandır
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sessions;
