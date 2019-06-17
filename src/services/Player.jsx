import {fatalSwal, errorSwal, Toast} from "../components/Alert.jsx";
import ep from "../assets/js/urls";

const CreatePlayer = data => {
    try {
        return fetch(ep.CREATE_PLAYER, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                const data = response.data;
                const status = response.status;

                if (status.code !== 1020) {
                    errorSwal(status);
                } else {
                    Toast.fire({
                        type: "success",
                        title: "Başarıyla oluşturuldu..."
                    });

                    return status.code;
                }
            })
            .catch(e => fatalSwal());
    } catch (e) {
        fatalSwal();
    }
};

const DetailPlayer = data => {
    try {
        return fetch(ep.GET_PLAYER, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
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
            });
    } catch (e) {
        fatalSwal();
    }
};

export {CreatePlayer, DetailPlayer};
