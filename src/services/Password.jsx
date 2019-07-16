import ep from "../assets/js/urls";
import {errorSwal, fatalSwal, showSwal} from "../components/Alert.jsx";
import Swal from "sweetalert2";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const Forgot = data => {
    try {
        return fetch(ep.FORGOT_PASSWORD, {
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
                } else if (status.code === 1020) {
                    showSwal({
                        type: "success",
                        title: "Başarılı",
                        text: "Email adresinize bağlantı gönderilmiştir. Lütfen kontrol ediniz."
                    });
                }
            })
            .catch(e => fatalSwal());
    } catch (e) {
        fatalSwal();
    }
};

const Reset = (data, history) => {
    try {
        return fetch(ep.RESET_PASSWORD, {
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
                } else if (status.code === 1020) {
                    Swal.fire({
                        type: "success",
                        title: "Başarılı",
                        text: "Şifreniz başarıyla güncellenmiştir",
                        confirmButtonText: "Giriş yap",
                        heightAuto: false
                    }).then(() => history.push("/auth"));
                }
            })
            .catch(e => fatalSwal());
    } catch (e) {
        fatalSwal();
    }
};

export {Forgot, Reset};
