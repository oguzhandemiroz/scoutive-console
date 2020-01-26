import { fatalSwal, errorSwal, showSwal } from "../components/Alert.jsx";
import { Logout, SetSchoolInfoToLocalStorage } from "./Login";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const Start = () => {
    try {
        return fetch(ep.START, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID"),
                token: localStorage.getItem("t")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    console.log("Settings Request");
                    const status = response.status;
                    if (status.code === 1090) {
                        showSwal({
                            allowOutsideClick: false,
                            type: "error",
                            title: "Hata Kodu: " + status.code,
                            text: status.description
                        }).then(re => {
                            if (re.value) Logout();
                        });
                    } else if (status.code !== 1020) errorSwal(status);
                    else {
                        localStorage.setItem("sSettings", JSON.stringify(response.data));
                        SetSchoolInfoToLocalStorage(response.data.employee.detail, true);
                    }
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

export { Start };
