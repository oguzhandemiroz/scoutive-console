import {errorSwal, fatalSwal, Toast} from "../components/Alert";
import ep from "../assets/js/urls";

const CreateGroup = data => {
    try {
        return fetch(ep.CREATE_GROUP, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
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

const ListGroups = uid => {
    try {
        return fetch(ep.LIST_GROUP, {
            method: "POST",
            body: JSON.stringify({
                uid: uid
            }),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                if (response) {
                    const status = response.status;
                    const data = response.data;
                    if (status.code != 1020) {
                        errorSwal(status);
                    } else {
                        return response;
                    }
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const ListPlayers = data => {
    try {
        return fetch(ep.LIST_PLAYER, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                if (response) {
                    const status = response.status;
                    const data = response.data;
                    if (status.code != 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Öğrenciler" yüklenemedi'
                        });
                    } else {
                        return response;
                    }
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const UpdateGroup = data => {
    try {
        return fetch(ep.UPDATE_GROUP, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
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

                        return status.code;
                    }
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

export {CreateGroup, ListGroups, ListPlayers, UpdateGroup};
