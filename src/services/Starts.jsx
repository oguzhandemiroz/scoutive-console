import { fatalSwal, errorSwal } from "../components/Alert.jsx";
import ep from "../assets/js/urls";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const Start = () => {
    try {
        return fetch(ep.START, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    console.log("Settings Request");
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else {
                        localStorage.setItem("sSettings", JSON.stringify(response.data));
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

export { Start };
