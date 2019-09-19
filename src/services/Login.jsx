import ep from "../assets/js/urls";
import { errorSwal, fatalSwal, Toast, showSwal } from "../components/Alert.jsx";
import { ActivationSchool } from "./School";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const RequestLogin = (data, remember) => {
    try {
        if (remember) {
            localStorage.setItem("sRemember", data.username);
        }
        return fetch(ep.ACCOUNT_LOGIN, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                if (status.code === 1082) {
                    showSwal({
                        type: "warning",
                        title: "Hata Kodu: " + status.code,
                        text: status.description,
                        confirmButtonText: "Aktive Et",
                        cancelButtonText: "İptal",
                        confirmButtonColor: "#467fcf",
                        cancelButtonColor: "#868e96",
                        showCancelButton: true,
                        reverseButtons: true
                    }).then(re => {
                        if (re.value) {
                            showSwal({
                                type: "success",
                                title: "Hesabı Aktive Et",
                                text: "Aktifleştirmek için lütfen email hesabınıza gelen kodu giriniz: ",
                                confirmButtonText: "Devam et",
                                input: "text",
                                inputAttributes: {
                                    minlength: 6,
                                    maxlength: 6,
                                    autocapitalize: "off",
                                    autocorrect: "off"
                                },
                                customClass: {
                                    input: "activation-input",
                                    actions: "activation-actions"
                                },
                                showCloseButton: false,
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                allowEnterKey: false,
                                showLoaderOnConfirm: true,
                                inputValidator: function(value) {
                                    return new Promise(function(resolve) {
                                        if ((value !== "") & (value.length === 6) & /^\d{6,6}/g.test(value)) {
                                            ActivationSchool({
                                                uid: data.uid,
                                                code: value
                                            }).then(response => {
                                                if (response) {
                                                    const status = response.status;
                                                    if (status.code === 1020) {
                                                        showSwal({
                                                            type: "success",
                                                            title: "Onaylandı",
                                                            confirmButtonText: "Giriş yap",
                                                            showLoaderOnConfirm: true
                                                        })
                                                    }
                                                }
                                            });
                                        } else {
                                            resolve("Lütfen boş bırakmayınız ve 6 haneli kod giriniz");
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else if (status.code === 1020) {
                    Toast.fire({
                        type: "success",
                        title: "Giriş yapılıyor..."
                    });
                    localStorage.setItem("sName", data.name + (data.surname ? " " + data.surname : ""));
                    localStorage.setItem("UID", data.uid);
                    localStorage.setItem("sID", data.sid);
                    localStorage.setItem("sImage", data.image);
                    localStorage.setItem("sType", data.type);
                    localStorage.setItem("sPosition", data.type_name);
                    setTimeout(() => {
                        window.location.pathname = "/app/dashboard";
                    }, 1000);
                } else {
                    errorSwal(status);
                }

                return status.code;
            })
            .catch(err => fatalSwal(true));
    } catch (e) {
        fatalSwal();
    }
};

const Logout = () => {
    try {
        const localeStorageList = ["sImage", "sName", "UID", "sID", "sType", "sPosition"];
        localeStorageList.map(el => localStorage.removeItem(el));
        setTimeout(() => {
            window.location.pathname = "/auth/login";
        }, 100);
    } catch (e) {
        fatalSwal();
    }
};

export { RequestLogin, Logout };
