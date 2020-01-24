import { fatalSwal, errorSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateParent = data => {
    try {
        return fetch(ep.PARENT_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        Toast.fire({
                            type: "success",
                            title: "Başarıyla oluşturuldu..."
                        });
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

export { CreateParent, DetailParent, GetParentPlayers, ListParents };
