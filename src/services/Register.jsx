import ep from "../assets/js/urls";
import { showSwal, errorSwal, fatalSwal } from "../components/Alert.jsx";
import { ActivationSchool } from "./School";
import { RequestLogin } from "./Login";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
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
                console.log(response);
                const status = response.status;
                if (status.code !== 1020) {
                    errorSwal(status);
                } else if (status.code === 1020) {
                    localStorage.setItem("sRemember", data.tax_no);
                    showSwal({
                        heightAuto: false,
                        type: "success",
                        title: "Hesabınız oluşturuldu",
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
                                        uid: response.data.uid,
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
                                                }).then(function(re) {
                                                    if (re.value) {
                                                        RequestLogin(
                                                            {
                                                                username: data.tax_no,
                                                                password: data.password
                                                            },
                                                            true
                                                        );
                                                    }
                                                });
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

                return status.code;
            })
            .catch(err => {
                fatalSwal();
            });
    } catch (e) {
        fatalSwal();
    }
};

export { RequestRegister };
