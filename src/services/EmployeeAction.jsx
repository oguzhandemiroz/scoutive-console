import { errorSwal, fatalSwal, showToast } from "../components/Alert";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "./Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateVacation = (data, type) => {
    try {
        if (!CheckPermissions(["e_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.VACATION_CREATE + type, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1021 && status.code !== 1030) {
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

const UpdateVacation = data => {
    try {
        if (!CheckPermissions(["e_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.VACATION_UPDATE, {
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

const ListVacations = (data, type) => {
    try {
        if (!CheckPermissions(["e_read"])) {
            return Promise.resolve(null);
        }
        return fetch(ep.VACATION_LIST + type, {
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

const DeleteVacation = data => {
    try {
        if (!CheckPermissions(["e_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.VACATION_DELETE, {
            method: "DELETE",
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
    } catch (e) {}
};

const CreateAdvancePayment = data => {
    try {
        if (!CheckPermissions(["a_write", "e_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ADVANCE_PAYMENT_CREATE, {
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
    } catch (e) {}
};
const ListAdvancePayments = data => {
    try {
        if (!CheckPermissions(["a_read", "e_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ADVANCE_PAYMENT_LIST, {
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

const CreateSalary = data => {
    try {
        if (!CheckPermissions(["e_write", "a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.SALARY_CREATE, {
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
    } catch (e) {}
};

const ListSalaries = data => {
    try {
        if (!CheckPermissions(["a_read", "e_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.SALARY_LIST, {
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

const PayVacations = data => {
    try {
        if (!CheckPermissions(["a_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.VACATION_PAY, {
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

const PayAdvancePayments = data => {
    try {
        if (!CheckPermissions(["a_write", "e_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.ADVANCE_PAYMENT_PAY, {
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

export {
    CreateVacation,
    UpdateVacation,
    ListVacations,
    DeleteVacation,
    CreateAdvancePayment,
    ListAdvancePayments,
    CreateSalary,
    ListSalaries,
    PayVacations,
    PayAdvancePayments
};
