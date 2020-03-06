import { fatalSwal, errorSwal } from "../components/Alert";
import { CheckPermissions } from "./Others";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreatedPlayers = data => {
    try {
        if (!CheckPermissions(["p_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.REPORT_CREATED_PLAYERS, {
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

const ListBirthdays = () => {
    try {
        if (!CheckPermissions(["e_read", "p_read"], "||")) {
            return Promise.resolve(null);
        }

        return fetch(ep.REPORT_BIRTHDAYS, {
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

const UnpaidPlayers = () => {
    try {
        if (!CheckPermissions(["a_read", "p_read"], "||")) {
            return Promise.resolve(null);
        }

        return fetch(ep.REPORT_UNPAID_PLAYERS, {
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

const TrainingGroups = () => {
    try {
        if (!CheckPermissions(["g_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.REPORT_TRAINING_GROUPS, {
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

const MessagesAllTime = () => {
    try {
        return fetch(ep.REPORT_MESSAGES_ALLTIME, {
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

export { CreatedPlayers, ListBirthdays, UnpaidPlayers, TrainingGroups, MessagesAllTime };
