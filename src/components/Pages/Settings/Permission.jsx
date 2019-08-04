import React, {Component} from "react";
import {GetEmployeePositions} from "../../../services/School";

export class Permission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            positionList: null,
            loadingData: "active p-3"
        };
    }

    componentDidMount() {
        this.getEmployeePosition();
    }

    getEmployeePosition = () => {
        const {uid} = this.state;
        GetEmployeePositions(uid).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({positionList: response.data});
                }
            }
            this.setState({loadingData: ""});
        });
    };

    convertWriteMode = name => {};
    render() {
        const {positionList, loadingData} = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Yetkilendirme</h3>
                </div>
                <div className="card-body">
                    <div className={`dimmer ${loadingData}`}>
                        <div className="loader" />
                        <div className="dimmer-content">
                            {positionList
                                ? Object.keys(positionList).map(el => (
                                      <div className="example p-4 mb-5">
                                          <div className="table-responsive">
                                              <table
                                                  className="table card-table table-vcenter"
                                                  key={el.toString()}>
                                                  <thead>
                                                      <tr>
                                                          <th className="pl-0">
                                                              <input
                                                                  type="text"
                                                                  class="form-control text-uppercase font-weight-600 text-dark"
                                                                  name={`position.name.${el}`}
                                                                  placeholder={positionList[el]}
                                                                  value={positionList[el]}
                                                              />
                                                          </th>
                                                          <th className="w-2 text-center">
                                                              <span
                                                                  className="font-weight-600"
                                                                  data-toggle="tooltip"
                                                                  title="Oluşturma">
                                                                  O
                                                              </span>
                                                          </th>
                                                          <th className="w-2 text-center">
                                                              <span
                                                                  className="font-weight-600"
                                                                  data-toggle="tooltip"
                                                                  title="Görüntüleme">
                                                                  G
                                                              </span>
                                                          </th>
                                                          <th className="w-2 text-center">
                                                              <span
                                                                  className="font-weight-600"
                                                                  data-toggle="tooltip"
                                                                  title="Düzenleme">
                                                                  D
                                                              </span>
                                                          </th>
                                                          <th className="w-2 pr-2 text-center">
                                                              <span
                                                                  className="font-weight-600"
                                                                  data-toggle="tooltip"
                                                                  title="Silme">
                                                                  S
                                                              </span>
                                                          </th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      <tr>
                                                          <td className="pl-2 text-muted">Personel</td>
                                                          <td>
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                          <td>
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                          <td>
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                          <td className="pr-2">
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <td className="pl-2 text-muted">Öğrenci</td>
                                                          <td>
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                          <td>
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                          <td>
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                          <td className="pr-2">
                                                              <label className="pl-0 custom-switch">
                                                                  <input
                                                                      type="checkbox"
                                                                      name="emp"
                                                                      className="custom-switch-input"
                                                                  />
                                                                  <span className="custom-switch-indicator"></span>
                                                              </label>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </div>
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                </div>
                <div className="card-footer text-right">
                    <button type="submit" className={`btn btn-primary`}>
                        Kaydet
                    </button>
                </div>
            </div>
        );
    }
}

export default Permission;
