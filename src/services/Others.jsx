import ep from "../assets/js/urls";
import { fatalSwal, errorSwal } from "../components/Alert.jsx";

const SplitBirthday = date => {
	try {
		const splitedBirthday = {
			day: null,
			month: null,
			year: null
		};
		if (date) {
			const _split = date.split("-");

			splitedBirthday.day = _split[2];
			splitedBirthday.month = _split[1];
			splitedBirthday.year = _split[0];
		}
		return splitedBirthday;
	} catch (e) {}
};

const getSelectValue = (select, to, type) => {
	try {
		if (select && to) {
			const data = select.find(x => x[type] === to);
			return data || null;
		} else {
			return null;
		}
	} catch (e) {
		return null;
	}
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

export { SplitBirthday, UploadFile, getSelectValue };
