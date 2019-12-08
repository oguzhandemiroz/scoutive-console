import { fatalSwal, errorSwal, Toast, showSwal } from "../components/Alert";
import ep from "../assets/js/urls";
import { Start } from "./Starts";
import { getCookie } from "../assets/js/core.js";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const GetSchool = data => {
    try {
        return fetch(ep.SCHOOL_GET, {
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

const UpdateSchool = data => {
    try {
        return fetch(ep.SCHOOL_UPDATE, {
            method: "PATCH",
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
                        Toast.fire({
                            type: "success",
                            title: "Başarıyla güncellendi..."
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

const ActivationSchool = data => {
    try {
        return fetch(ep.ACCOUNT_ACTIVATION, {
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

const ListPermissions = uid => {
    try {
        return fetch(ep.SCHOOL_LIST_PERMISSION, {
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
                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Pozisyonlar" yüklenemedi...'
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

const UpdatePermissions = data => {
    try {
        return fetch(ep.SCHOOL_UPDATE_PERMISSION, {
            method: "PATCH",
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

const ListAreas = () => {
    try {
        return fetch(ep.AREA, {
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
                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Sahalar" yüklenemedi...'
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

const UpdateAreas = data => {
    try {
        return fetch(ep.AREAS_UPDATE, {
            method: "PATCH",
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
                            title: "Başarıyla güncellendi..."
                        });
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const GetSettings = () => {
    try {
        const settings = JSON.parse(localStorage.getItem("sSettings"));
        if (!settings) {
            return Start().then(response => {
                if (response) {
                    return response.data;
                }
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(settings);
            });
        }
    } catch (e) {}
};

const SetSettings = data => {
    return fetch(ep.SCHOOL_SET_SETTINGS, {
        method: "PATCH",
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
                        title: "Başarıyla güncellendi..."
                    });
                    Start();
                }
                return response;
            }
        })
        .catch(e => fatalSwal(true));
};

const GetSchoolFees = () => {
    try {
        return fetch(ep.SCHOOL_GET_FEES, {
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

export {
    GetSchool,
    UpdateSchool,
    ListPermissions,
    UpdatePermissions,
    ListAreas,
    UpdateAreas,
    ActivationSchool,
    GetSettings,
    SetSettings,
    GetSchoolFees
};
