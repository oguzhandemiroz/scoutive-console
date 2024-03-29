import { errorSwal, fatalSwal, Toast, showToast } from "../components/Alert";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "../services/Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const GetBudget = data => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_GET, {
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

const CreateBudget = data => {
    try {
        if (!CheckPermissions(["a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_CREATE, {
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

const ListBudgets = uid => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: uid
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

const MakeDefaultBudget = data => {
    try {
        if (!CheckPermissions(["a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_DEFAULT, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1022) {
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

const UpdateBudget = data => {
    try {
        if (!CheckPermissions(["a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_UPDATE, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1022) {
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

const TransferBudget = data => {
    try {
        if (!CheckPermissions(["a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_TRANSFER, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) {
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

const BalanceHistoryBudget = data => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_BALANCE_HISTORY, {
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

export { GetBudget, CreateBudget, ListBudgets, MakeDefaultBudget, UpdateBudget, TransferBudget, BalanceHistoryBudget };
