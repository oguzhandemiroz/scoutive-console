import { fatalSwal, errorSwal, Toast } from "../components/Alert";
import ep from "../assets/js/urls";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const GetSchool = data => {
	try {
		return fetch(ep.SCHOOL_GET, {
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

const UpdateSchool = data => {
	try {
		return fetch(ep.SCHOOL_UPDATE, {
			method: "PATCH",
			body: JSON.stringify(data),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const status = response.status;

					if (status.code !== 1020) {
						errorSwal(status);
					} else {
						Toast.fire({
							type: "success",
							title: "Başarıyla güncellendi..."
						});
					}
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

const ListPermissions = uid => {
	try {
		return fetch(ep.SCHOOL_LIST_PERMISSION, {
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
					if (status.code !== 1020) {
						Toast.fire({
							type: "error",
							title: '"Pozisyonlar" yüklenemedi...'
						});
					}
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

export { GetSchool, UpdateSchool, ListPermissions };
