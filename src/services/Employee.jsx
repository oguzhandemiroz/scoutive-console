import { errorSwal, fatalSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls.js";

const CreateEmployee = data => {
	try {
		return fetch(ep.CREATE_EMPLOYEE, {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				"Content-Type": "application/json"
			})
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
						title: "Başarıyla oluşturuldu..."
					});

					return status.code;
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
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				"Content-Type": "application/json"
			})
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
			headers: new Headers({
				"Content-Type": "application/json"
			})
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

export { CreateEmployee, DetailEmployee, UpdateEmployee };
