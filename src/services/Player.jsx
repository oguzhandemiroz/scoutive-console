import {fatalSwal, errorSwal} from "../components/Alert.jsx";
import ep from "../assets/js/urls";

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

export {DetailPlayer};
