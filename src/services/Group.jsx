import { errorSwal, fatalSwal } from "../components/Alert";
import ep from "../assets/js/urls";

const ListGroups = uid => {
	try {
		return fetch(ep.LIST_GROUP, {
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
				console.log(response);
				if (response) {
					const status = response.status;
					const data = response.data;
					if (status.code != 1020) {
						errorSwal(status);
					} else {
						return response;
					}
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {}
};

export { ListGroups };
