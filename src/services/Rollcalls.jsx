import { fatalSwal, errorSwal, Toast } from "../components/Alert";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "./Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const ListRollcall = data => {
    try {
        if (!CheckPermissions(["r_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.LIST_ROLLCALL, {
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

const ListRollcallType = (data, type) => {
    try {
        return fetch(ep.ROLLCALL_LIST_TYPE + type, {
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

const CreateRollcall = data => {
    try {
        /*
			- type 0 -> player
			- type 1 -> employee
		*/
        return fetch(ep.CREATE_ROLLCALL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020 && status.code !== 2010) errorSwal(status);
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const MakeRollcall = (data, type) => {
    try {
        /*
			- type 0 -> player
			- type 1 -> employee
		*/
        return fetch(ep.ROLLCALL_MAKE + type, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else if (status.code === 1020)
                        Toast.fire({
                            type: "success",
                            title: "İşlem başarılı..."
                        });
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const SetNoteRollcall = (data, type) => {
    try {
        /*
			- type 0 -> player
			- type 1 -> employee
		*/
        return fetch(ep.ROLLCALL_NOTE + type + "/note", {
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
    } catch (e) {}
};

const DeleteRollcall = (data, type) => {
    try {
        /*
			- type 0 -> player
			- type 1 -> employee
		*/
        return fetch(ep.ROLLCALL_DELETE + type, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else if (status.code === 1020)
                        Toast.fire({
                            type: "success",
                            title: "İşlem başarılı..."
                        });
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

/**
 * @param {Object} data - Request Body Data
 * @param {number} type 0 -> player, 1 -> employee
 */

const ActiveRollcall = (data, type) => {
    try {
        /*
			- type 0 -> player
			- type 1 -> employee
        */

        if (!CheckPermissions(["r_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ROLLCALL_ACTIVE + type, {
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

const CloseRollcall = data => {
    try {
        return fetch(ep.CLOSE_ROLLCALL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else
                        Toast.fire({
                            type: "success",
                            title: "İşlem başarılı..."
                        });
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

export {
    CreateRollcall,
    ListRollcall,
    DeleteRollcall,
    SetNoteRollcall,
    ListRollcallType,
    MakeRollcall,
    ActiveRollcall,
    CloseRollcall
};
