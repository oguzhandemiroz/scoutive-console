import { fatalSwal, errorSwal } from "../components/Alert";
import ep from "../assets/js/urls";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const ListRollcall = data => {
	try {
		return fetch(ep.LIST_ROLLCALL, {
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

const CompleteRollcall = uid => {
	try {
		/*return fetch(ep.COMPLETE_ROLLCALL, {
			method: "POST",
			body: JSON.stringify({
				uid: uid
			}),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const status = response.status;
					if (status.code !== 1020) errorSwal();
					return response;
				}
			})
            .catch(e => fatalSwal(true));*/
		return fetch("https://scoutive.online").then(res => {
			return {
				status: {
					code: 1020,
					description: "İşlem başarılı"
				}
			};
		});
	} catch (e) {
		fatalSwal(true);
	}
};

const CreateRollcall = data => {
	try {
		/*
			- type 0 -> player
			- type 1 -> employee
		*/
		return fetch(ep.CREATE_ROLLCALL, {
			method: "POST",
			body: JSON.stringify(data),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const status = response.status;
					if (status.code !== 1020 && status.code !== 2010) errorSwal(status);
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

export { CompleteRollcall, CreateRollcall, ListRollcall};
