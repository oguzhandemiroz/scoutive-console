import React, { Component } from "react";
import { ListPermissions, UpdatePermissions } from "../../../services/School";
import _ from "lodash";
const $ = require("jquery");

const permissionKeyToText = {
    player: "Öğrenci",
    employee: "Personel",
    rollcall: "Yoklama",
    accounting: "Gelir/Gider",
    group: "Grup",
    message: "İletişim Merkezi"
};

export class PermissionNew extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            permissionList: [],
            loadingData: "active p-5 mb-5",
            loadingButton: ""
        };
    }

    componentDidMount() {
        this.getEmployeePosition();
    }

    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    handleSubmit = e => {
        e.preventDefault();
        const { uid, permissionList } = this.state;
        this.setState({ loadingButton: "btn-loading" });
        UpdatePermissions({
            uid: uid,
            permissions: permissionList
        }).then(response => this.setState({ loadingButton: "" }));
    };

    handleCheck = (pid, type, key, value) => {
        const { permissionList } = this.state;
        const checkedValue = value === 0 ? 1 : 0;
        permissionList.find(x => x.permission_id === pid).permissions[type][key] = checkedValue;
        this.setState({ permissionList: permissionList });
    };

    getEmployeePosition = () => {
        const { uid } = this.state;
        ListPermissions(uid).then(response => {
            if (response) {
                const status = response.status;
                if (status.code === 1020) {
                    this.setState({ permissionList: response.data });
                }
            }
            this.setState({ loadingData: "" });
        });
    };

    render() {
        const { loadingData, loadingButton, permissionList } = this.state;
        return (
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Yetkilendirme</h3>
                    <div className="card-options mr-0">
                        <span className="form-required font-weight-600 mr-1">*</span>
                        <span
                            className="form-help bg-gray-dark text-white"
                            data-toggle="popover"
                            data-placement="bottom"
                            data-content='<p>Harf Açıklamaları:</p><p> <div><span class="font-weight-600 text-red"> L/G</span>: Listeleme ve Görüntüleme</div><div><span class="font-weight-600 text-red"> O/D</span>: Oluşturma ve Düzenleme</<div><div><span class="font-weight-600 text-red"> S</span>: Silme</div></p><p><b>Ek:</b> Tablo üzerinde harflerin üzerine geldiğinizde de harfin açıklaması gözükür.</p>'>
                            !
                        </span>
                        <button
                            type="button"
                            className={`btn btn-sm btn-primary ml-3 ${loadingButton}`}
                            onClick={this.handleSubmit}>
                            Kaydet
                        </button>
                    </div>
                </div>
                <div className="card-body pb-0">
                    <div className={`dimmer ${loadingData}`}>
                        <div className="loader" />
                        <div className="dimmer-content">
                            {permissionList.map(permission => (
                                <div className="example p-0 mb-5" key={permission.permission_id.toString()}>
                                    <div className="table-responsive">
                                        <table className="table card-table table-striped table-vcenter text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th className="text-primary py-3" style={{ fontSize: "1rem" }}>
                                                        {permission.title}
                                                    </th>
                                                    <th className="w-2 text-center py-3">
                                                        <span
                                                            className="font-weight-600"
                                                            data-toggle="tooltip"
                                                            title="Listeleme ve Görüntüleme">
                                                            L/G
                                                            <span className="form-required">*</span>
                                                        </span>
                                                    </th>
                                                    <th className="w-2 text-center py-3">
                                                        <span
                                                            className="font-weight-600"
                                                            data-toggle="tooltip"
                                                            title="Oluşturma ve Düzenleme">
                                                            O/D
                                                            <span className="form-required">*</span>
                                                        </span>
                                                    </th>
                                                    <th className="w-2 pr-3 text-center py-3">
                                                        <span
                                                            className="font-weight-600"
                                                            data-toggle="tooltip"
                                                            title="Silme">
                                                            S<span className="form-required">*</span>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(permissionKeyToText).map((key, idx) => {
                                                    return (
                                                        <tr key={idx.toString()}>
                                                            <td>{permissionKeyToText[key]}</td>
                                                            {Object.keys(permission.permissions[key]).map(el => (
                                                                <td key={el}>
                                                                    <label className="pl-0 custom-switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            name={el}
                                                                            className="custom-switch-input custom-switch-green-input"
                                                                            onChange={() =>
                                                                                this.handleCheck(
                                                                                    permission.permission_id,
                                                                                    key,
                                                                                    el,
                                                                                    permission.permissions[key][el]
                                                                                )
                                                                            }
                                                                            checked={permission.permissions[key][el]}
                                                                        />
                                                                        <span className="custom-switch-indicator custom-switch-green-indicator"></span>
                                                                    </label>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PermissionNew;
