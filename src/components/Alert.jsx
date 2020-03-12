import Swal from "sweetalert2";
import "../assets/css/custom-theme-swal.css";
import { Logout } from "../services/Login.jsx";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000
});

const showSwal = options => {
    try {
        return Swal.fire({
            allowOutsideClick: false,
            heightAuto: false,
            allowEnterKey: false,
            confirmButtonText: "Tamam",
            ...options
        });
    } catch (e) {}
};

const showToast = (data, options) => {
    try {
        Toast.fire({
            type: data.icon,
            title: data.description,
            ...options
        });
    } catch (e) {}
};

const errorSwal = (data, options) => {
    try {
        showSwal({
            type: data.icon || "error",
            title: "Hata Kodu: " + data.code,
            text: data.description,
            ...options
        });
    } catch (e) {
        showSwal({
            type: "error",
            title: "Hata",
            text: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin..."
        });
    }
};

const fatalSwal = logout => {
    try {
        showSwal({
            type: "error",
            title: "Hata Kodu: 1050",
            text: "Bir hata oluştu. Üzerinde çalışıyoruz. Lütfen daha sonra tekrar deneyin...",
            preConfirm: function(val) {
                if (val) {
                    if (!logout) Logout();
                }
            }
        });
    } catch (e) {}
};

export { Toast, showSwal, errorSwal, fatalSwal, showToast };
