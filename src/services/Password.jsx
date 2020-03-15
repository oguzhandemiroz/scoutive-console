import ep from "../assets/js/urls";
import { errorSwal, fatalSwal, showSwal, Toast, showToast } from "../components/Alert.jsx";
import { getCookie } from "../assets/js/core.js";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const Forgot = data => {
    try {
        return fetch(ep.PASSWORD_FORGOT, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
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
                }
            })
            .catch(e => fatalSwal());
    } catch (e) {
        fatalSwal();
    }
};

const Reset = (data, history) => {
    try {
        return fetch(ep.PASSWORD_RESET, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    console.log(response);
                    const status = response.status;
                    if (status.code !== 1020) {
                        errorSwal(status);
                    } else if (status.code === 1020) {
                        showSwal({
                            type: "success",
                            title: "Başarılı",
                            text: "Şifreniz başarıyla güncellenmiştir",
                            confirmButtonText: "Giriş yap"
                        }).then(() => history.push("/auth"));
                    }
                }
            })
            .catch(e => fatalSwal());
    } catch (e) {
        fatalSwal();
    }
};

const Change = data => {
    try {
        return fetch(ep.PASSWORD_CHANGE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    console.log(response);
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

const ChangeEmployee = data => {
    try {
        return fetch(ep.PASSWORD_CHANGE_EMPLOYEE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    console.log(response);
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);
                    else if (status.code === 1020)
                        Toast.fire({
                            type: "success",
                            title: "Şifre başarıyla güncellenmiştir..."
                        });

                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

export { Forgot, Reset, Change, ChangeEmployee };
