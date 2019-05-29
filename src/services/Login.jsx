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
			.then(res => {
				return res.json();
			})
			.then(response => {
				console.log(response);
				const data = response.data[0];
				const status = response.status;
				if (status.code !== 1020) {
					errorSwal(status);
				} else if (status.code === 1020) {
					Toast.fire({
						type: "success",
						title: "Giriş yapılıyor..."
                    });
                    
					localStorage.setItem("sName", data.name);
					localStorage.setItem("UID", data.uid);
					localStorage.setItem("sID", data.sid);
					localStorage.setItem("sLogo", data.image);
					localStorage.setItem("sType", data.type);
				}

				return status.code;
			})
			.catch(err => {
				fatalSwal();
			});
	} catch (e) {
		fatalSwal();
	}
};

export { RequestLogin };
