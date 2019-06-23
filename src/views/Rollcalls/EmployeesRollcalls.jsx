import React, {Component} from "react";
import {systemClock} from "../../services/Others";

export class EmployeesRollcalls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employees: [1, 2]
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({systemClock: systemClock()});
        }, 1000);
    }

    render() {
        const {employees, systemClock} = this.state;
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Yoklamalar &mdash; Personel</h1>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-status bg-azure" />
                                <h3 className="card-title">Personel Listesi</h3>
                                <div className="card-options">
                                    <span
                                        className="tag tag-gray-dark"
                                        data-original-title="Sistem Saati"
                                        data-offset="-35"
                                        data-toggle="tooltip">
                                        {systemClock}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover table-outline table-vcenter text-nowrap card-table mb-0">
                                        <thead>
                                            <tr>
                                                <th className="pl-0 w-1" />
                                                <th>Ad Soyad</th>
                                                <th>Pozisyon</th>
                                                <th className="w-1">İşlem</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees
                                                ? employees.length > 0
                                                    ? employees.map((el, key) => (
                                                          <tr key={key.toString()}>
                                                              <td className="text-center">
                                                                  <div className="avatar d-block" />
                                                              </td>
                                                              <td>&mdash;</td>
                                                              <td>&mdash;</td>
                                                              <td>
                                                                  <button className="btn btn-sm btn-success">
                                                                      <i className="fe fe-check" />
                                                                  </button>
                                                                  <button className="btn btn-sm btn-warning ml-2">
                                                                      <i className="fe fe-alert-circle" />
                                                                  </button>
                                                              </td>
                                                          </tr>
                                                      ))
                                                    : null
                                                : null}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-end align-items-center">
                                    <span className="mx-2">
                                        <span
                                            className="form-help"
                                            data-toggle="popover"
                                            data-placement="top"
                                            data-content='<p><b>"Sürekli Ekle"</b> aktif olduğunda; işlem tamamlandıktan sonra ekleme yapmaya devam edebilirsiniz.</p><p>Pasif olduğunda; işlem tamamlandıktan sonra <b>"Personeller"</b> sayfasına yönlendirilirsiniz.</p>'>
                                            ?
                                        </span>
                                    </span>
                                    <button type="submit" className={`btn btn-primary`}>
                                        Yoklamalayı Tamamla
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmployeesRollcalls;
