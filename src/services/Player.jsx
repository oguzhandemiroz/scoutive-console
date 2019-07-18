import { fatalSwal, errorSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreatePlayer = data => {
	try {
		return fetch(ep.CREATE_PLAYER, {
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
			headers: h
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

const UpdatePlayer = data => {
	try {
		return fetch(ep.UPDATE_PLAYER, {
			method: "POST",
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

const UpdatePlayers = data => {
	try {
		return fetch(ep.UPDATE_PLAYERS, {
			method: "POST",
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
						return response;
					}
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

const DeletePlayer = data => {
	try {
		return fetch(ep.PLAYER_DELETE, {
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

export { CreatePlayer, DetailPlayer, UpdatePlayer, UpdatePlayers, DeletePlayer };