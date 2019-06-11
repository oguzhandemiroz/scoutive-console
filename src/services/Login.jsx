import ep from "../assets/js/urls";
import { errorSwal, fatalSwal, Toast } from "../components/Alert.jsx";

const RequestLogin = (data, remember) => {
	try {
		if (remember) {
			localStorage.setItem("sRemember", data.username);
		}

		return fetch(ep.ACCOUNT_LOGIN, {
			method: "POST",
			body: JSON.stringify(data),
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
			.then(res => res.json())
			.then(response => {
				console.log(response);
				// new system
				//const data = response.data;
				// old system
				const data = response.data;
				const status = response.status;
				if (status.code !== 1020) {
					errorSwal(status);
				} else if (status.code === 1020) {
					Toast.fire({
						type: "success",
						title: "Giriş yapılıyor..."
					});
					localStorage.setItem("sName", data.name + (data.surname ? " " + data.surname : ""));
					localStorage.setItem("UID", data.uid);
					localStorage.setItem("sID", data.sid);
					localStorage.setItem("sImage", data.image);
					localStorage.setItem("sType", data.type);
					localStorage.setItem("sPosition", data.type_name);
				}

				return status.code;
			})
			.catch(err => fatalSwal(true));
	} catch (e) {
		fatalSwal();
	}
};

const Logout = () => {
	try {
		const localeStorageList = ["sImage", "sName", "UID", "sID", "sType", "sPosition"];
		localeStorageList.map(el => localStorage.removeItem(el));
		setTimeout(() => {
			window.location.reload();
		}, 100);
	} catch (e) {
		fatalSwal();
	}
};

export { RequestLogin, Logout};
