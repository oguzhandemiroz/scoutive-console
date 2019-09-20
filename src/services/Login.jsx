import ep from "../assets/js/urls";
import { errorSwal, fatalSwal, Toast, showSwal } from "../components/Alert.jsx";
import { ActivationSchool } from "./School";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const RequestLogin = (data, remember) => {
	try {
		if (remember) localStorage.setItem("sRemember", data.username);

		return fetch(ep.ACCOUNT_LOGIN, {
			method: "POST",
			body: JSON.stringify(data),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				const status = response.status;
				if ((status.code !== 1020) & (status.code !== 1082)) errorSwal(status);
				return response;
			})
			.catch(err => fatalSwal(true));
	} catch (e) {
		fatalSwal();
	}
};

const Logout = () => {
	try {
		const localeStorageList = ["sImage", "sName", "UID", "sID", "sType", "sPosition", "sBranch"];
		localeStorageList.map(el => localStorage.removeItem(el));
		setTimeout(() => {
			window.location.pathname = "/auth/login";
		}, 100);
	} catch (e) {
		fatalSwal();
	}
};

const SetSchoolInfoToLocalStorage = data => {
	try {
		localStorage.setItem("sName", data.name + (data.surname ? " " + data.surname : ""));
		localStorage.setItem("UID", data.uid);
		localStorage.setItem("sID", data.sid);
		localStorage.setItem("sImage", data.image);
		localStorage.setItem("sType", data.type);
		localStorage.setItem("sPosition", data.type_name);
		localStorage.setItem("sBranch", data.branch_id);
		setTimeout(() => (window.location.pathname = "/app/dashboard"), 1000);
	} catch (e) {}
};

export { RequestLogin, Logout, SetSchoolInfoToLocalStorage };
