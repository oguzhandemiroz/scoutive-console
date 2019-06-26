import { fatalSwal, errorSwal } from "../components/Alert";
import ep from "../assets/js/urls";

const CompleteRollcall = uid => {
	try {
		/*return fetch(ep.COMPLETE_ROLLCALL, {
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

const TakeRollcall = data => {
	try {
		/*return fetch(ep.TAKE_ROLLCALL, {
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

export { CompleteRollcall, TakeRollcall };
