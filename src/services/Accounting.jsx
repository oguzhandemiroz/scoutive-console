import { Toast, fatalSwal, errorSwal } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "./Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateAccountingRecord = data => {
    try {
        if (!CheckPermissions(["a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ACCOUNTING_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const ListAccountingRecords = data => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ACCOUNTING_LIST, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const DetailAccountingRecord = data => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ACCOUNTING_DETAIL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const ListAccountingTypes = type => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ACCOUNTING_TYPE_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const selectData = [];
                    const status = response.status;

                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Gelir Tipleri" yüklenemedi'
                        });
                    } else {
                        const data = response.data.filter(x => [2, type].indexOf(x.type) > -1);
                        data.map(el => {
                            const value = el.accounting_type_id;
                            const label = el.name;
                            const description = el.description;
                            const _default = el.default;
                            selectData.push({
                                value: value,
                                label: label,
                                description: description,
                                default: _default
                            });
                        });
                        return selectData;
                    }
                }
            })
            .catch(e =>
                Toast.fire({
                    type: "error",
                    title: '"Gelir Tipleri" yüklenemedi'
                })
            );
    } catch (e) {}
};

export { CreateAccountingRecord, ListAccountingRecords, ListAccountingTypes, DetailAccountingRecord };
