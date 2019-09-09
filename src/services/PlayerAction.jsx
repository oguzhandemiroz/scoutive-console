import { errorSwal, fatalSwal, Toast } from "../components/Alert";
import ep from "../assets/js/urls";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", sessionStorage.getItem("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const CreateVacation = (data, type) => {
	try {
		console.log(data, type);
		return fetch(ep.VACATION_CREATE + type, {
			method: "POST",
			body: JSON.stringify(data),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const status = response.status;
					if (status.code !== 1020 && status.code !== 1037) errorSwal(status);
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

const UpdateVacation = data => {
	try {
		return fetch(ep.VACATION_UPDATE, {
			method: "PATCH",
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

const ListVacations = (data, type) => {
	try {
		return fetch(ep.VACATION_LIST + type, {
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

const CreatePaymentFee = data => {
	try {
		return fetch(ep.FEE_CREATE, {
			method: "POST",
			body: JSON.stringify(data),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const status = response.status;
					if (status.code !== 1020)
						errorSwal(status, {
							title: "Uyarı",
							text: "Tamamlanmamış ödeme bulunmaktadır. Ödemeleri tamamladıktan sonra tekrar deneyiniz!"
						});
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

const UpdatePaymentFee = data => {
	try {
		return fetch(ep.FEE_UPDATE, {
			method: "POST",
			body: JSON.stringify(data),
			headers: h
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const status = response.status;
					if (status.code !== 1020) errorSwal(status);
					else {
						Toast.fire({
							type: "success",
							title: status.description
						});
					}
					return response;
				}
			})
			.catch(e => fatalSwal(true));
	} catch (e) {
		fatalSwal(true);
	}
};

const ListFees = data => {
	try {
		return fetch(ep.FEE_LIST, {
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

export { CreateVacation, UpdateVacation, ListVacations, CreatePaymentFee, UpdatePaymentFee, ListFees };
