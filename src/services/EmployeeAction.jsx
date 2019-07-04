import { errorSwal, fatalSwal, Toast } from "../components/Alert";
import ep from "../assets/js/urls";

const CreateVacation = (data, type) => {
	try {
		console.log(data, type);
		return fetch(ep.VACATION_CREATE + type, {
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
					else
						Toast.fire({
							type: "success",
							title: "Başarıyla kaydedildi..."
						});
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

export { CreateVacation };
