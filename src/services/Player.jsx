import { fatalSwal, errorSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";

const CreatePlayer = data => {
	try {
		return fetch(ep.CREATE_PLAYER, {
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
				} else {
					Toast.fire({
						type: "success",
						title: "Başarıyla oluşturuldu...",
						timer: 3500
					});

					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

const DetailPlayer = data => {
	try {
		return fetch(ep.GET_PLAYER, {
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
				} else {
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

export { CreatePlayer, DetailPlayer };
