import {fatalSwal, errorSwal} from "../components/Alert";
import ep from "../assets/js/urls";

const GetSchool = uid => {
    try {
        return fetch(ep.GET_SCHOOL, {
            method: "POST",
            body: JSON.stringify({
                uid: uid
            }),
            headers: new Headers({
                "Content-Type": "application/json"
            })
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

export {GetSchool};
