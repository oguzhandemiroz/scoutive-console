import ep from "../assets/js/urls";
import { fatalSwal, errorSwal } from "../components/Alert.jsx";

const SplitBirthday = date => {
	if (date) {
		const _split = date.split("-");
		const splitedBirthday = {
			day: _split[2],
			month: _split[1],
			year: _split[0]
		};

		return splitedBirthday;
	}
	return null;
};

const UploadFile = formData => {
	try {
		if (formData) {
			return fetch(ep.UPLOAD_FILE, {
				method: "POST",
				body: formData
			})
				.then(res => res.json())
				.then(response => {
					if (response) {
						const status = response.status;
						if (status.code !== 1020) errorSwal(status);

						return response;
					}
				})
				.catch(e => fatalSwal());
		}
	} catch (e) {
		fatalSwal();
	}
};

export { SplitBirthday,UploadFile};
