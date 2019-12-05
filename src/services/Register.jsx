import ep from "../assets/js/urls";
import { errorSwal, fatalSwal } from "../components/Alert.jsx";
import { getCookie } from "../assets/js/core.js";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const RequestRegister = data => {
    try {
        return fetch(ep.SCHOOL_CREATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => {
                return res.json();
            })
            .then(response => {
                const status = response.status;
                if (status.code !== 1020) errorSwal(status);

                return response;
            })
            .catch(err => {
                fatalSwal(true);
            });
    } catch (e) {
        fatalSwal();
    }
};

export { RequestRegister };
