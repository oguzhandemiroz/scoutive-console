import { fatalSwal, errorSwal, Toast } from "../components/Alert";
import ep from "../assets/js/urls";

const GetSchool = data => {
	try {
		return fetch(ep.SCHOOL_GET, {
			method: "POST",
			body: JSON.stringify(data),
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

const UpdateSchool = data => {
	try {
		return fetch(ep.SCHOOL_UPDATE, {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				"Content-Type": "application/json"
			})
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

export { GetSchool, UpdateSchool };
