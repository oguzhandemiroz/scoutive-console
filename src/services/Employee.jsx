import { errorSwal, fatalSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls.js";
import { getCookie } from "../assets/js/core.js";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateEmployee = data => {
    try {
        return fetch(ep.CREATE_EMPLOYEE, {
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
                } else {
                    Toast.fire({
                        type: "success",
                        title: "Başarıyla oluşturuldu..."
                    });
                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const UpdateEmployee = data => {
    try {
        return fetch(ep.UPDATE_EMPLOYEE, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: h
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
                        title: "Başarıyla güncellendi..."
                    });

                    return status.code;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const DetailEmployee = data => {
    try {
        return fetch(ep.GET_EMPLOYEE, {
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
                }
                return response;
            })
            .catch(e => {
                fatalSwal(true);
                return null;
            });
    } catch (e) {
        fatalSwal(true);
    }
};

const ListEmployees = () => {
    try {
        return fetch(ep.LIST_EMPLOYEE, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);

                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const DeleteEmployee = data => {
    try {
        return fetch(ep.EMPLOYEE_DELETE, {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);

                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

const ActivateEmployee = data => {
    try {
        return fetch(ep.EMPLOYEE_ACTIVATE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code !== 1020) errorSwal(status);

                    return response;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {
        fatalSwal(true);
    }
};

export { CreateEmployee, DetailEmployee, UpdateEmployee, ListEmployees, DeleteEmployee, ActivateEmployee };
