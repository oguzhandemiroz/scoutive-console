import { fatalSwal, errorSwal, Toast, showToast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { CheckPermissions } from "../services/Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreatePlayer = data => {
    try {
        if (!CheckPermissions(["p_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.PLAYER_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                const status = response.status;

                if (status.code !== 1021) {
                    errorSwal(status);
                } else {
                    showToast(status);
                }

                return response;
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const DetailPlayer = data => {
    try {
        if (!CheckPermissions(["p_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.GET_PLAYER, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                const status = response.status;
                if (status.code !== 1020) {
                    errorSwal(status);
                } else {
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const UpdatePlayer = data => {
    try {
        if (!CheckPermissions(["p_write"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.UPDATE_PLAYER, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                const status = response.status;

                if (status.code !== 1022) {
                    errorSwal(status);
                } else {
                    showToast(status);
                }
                return response;
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const UpdatePlayers = data => {
    try {
        return fetch(ep.UPDATE_PLAYERS, {
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
                        return response;
                    }
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const DeletePlayer = data => {
    try {
        return fetch(ep.PLAYER_DELETE, {
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
    } catch (e) {
        fatalSwal(true);
    }
};

const FreezePlayer = data => {
    try {
        return fetch(ep.PLAYER_FREEZE, {
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

const RefreshPlayer = data => {
    try {
        return fetch(ep.PLAYER_REFRESH, {
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

const ActivatePlayer = data => {
    try {
        return fetch(ep.PLAYER_ACTIVATE, {
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

const ListPlayers = () => {
    try {
        if (!CheckPermissions(["p_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.PLAYER_LIST, {
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
    } catch (e) {}
};

const ListPlayerFees = data => {
    try {
        return fetch(ep.FEE_LIST, {
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

const ListPlayerFeesNew = data => {
    try {
        return fetch(ep.FEE_LIST_NEW, {
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

const GetPlayerParents = data => {
    try {
        return fetch(ep.PLAYER_PARENTS, {
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

export {
    CreatePlayer,
    DetailPlayer,
    UpdatePlayer,
    UpdatePlayers,
    DeletePlayer,
    FreezePlayer,
    RefreshPlayer,
    ActivatePlayer,
    ListPlayers,
    ListPlayerFees,
    ListPlayerFeesNew,
    GetPlayerParents
};
