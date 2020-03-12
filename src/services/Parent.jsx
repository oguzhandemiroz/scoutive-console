import { fatalSwal, errorSwal, Toast, showToast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "../services/Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateParent = data => {
    try {
        if (!CheckPermissions(["p_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.PARENT_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1021) {
                        errorSwal(status);
                    } else {
                        showToast(status);
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const UpdateParent = data => {
    try {
        if (!CheckPermissions(["p_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.PARENT_UPDATE, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1022) errorSwal(status);
                    else {
                        showToast(status);
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const DetailParent = data => {
    try {
        if (!CheckPermissions(["p_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.PARENT_GET, {
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

const ListParents = () => {
    try {
        if (!CheckPermissions(["p_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.PARENT_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
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

const GetParentPlayers = data => {
    try {
        return fetch(ep.PARENT_PLAYERS, {
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

export { CreateParent, UpdateParent, DetailParent, GetParentPlayers, ListParents };
