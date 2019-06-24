import ep from "../assets/js/urls";
import { showSwal, errorSwal, fatalSwal } from "../components/Alert.jsx";
import { RequestLogin } from "./Login";
import Swal from "sweetalert2";

const RequestRegister = data => {
	try {
		return fetch(ep.ACCOUNT_CREATE, {
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
				const status = response.status;
				if (status.code !== 1020) {
					errorSwal(status);
				} else if (status.code === 1020) {
					console.log("ok");
					//localStorage.setItem("sRemember", data.tax_no);
					//old system
					Swal.fire({
						heightAuto: false,
						type: "success",
						title: "Hesabınız oluşturuldu",
						text: "Aktifleştirmek için lütfen email hesabınıza gelen kodu giriniz: ",
						confirmButtonText: "Devam et",
						input: "text",
						inputValue: response.data.code,
						inputAttributes: {
							minlength: 6,
							maxlength: 6,
							autocapitalize: "off",
							autocorrect: "off"
						},
						customClass: {
							input: "activation-input",
							actions: "activation-actions"
						},
						showCloseButton: false,
						allowEscapeKey: false,
						allowOutsideClick: false,
						allowEnterKey: false,
						showLoaderOnConfirm: true,
						inputValidator: function(value) {
							return new Promise(function(resolve) {
								if ((value !== "") & (value.length === 6) & /^\d{6,6}/g.test(value)) {
									resolve();
								} else {
									resolve("Lütfen boş bırakmayınız ve 6 haneli kod giriniz");
								}
							});
						},
						preConfirm: function(code) {
							console.log("Kod: ", code);
							return fetch(ep.ACCOUNT_ACTIVATION, {
								method: "POST",
								body: JSON.stringify({
									uid: response.data.uid,
									code: code
								}),
								headers: new Headers({
									"Content-Type": "application/json"
								})
							})
								.then(function(res) {
									if (!res.ok) {
										throw new Error(res.statusText);
									}
									return res.json();
								})
								.catch(function(error) {
									Swal.showValidationMessage(`Request failed: ${error}`);
								});
						}
					}).then(function(response) {
						console.log("ajax then: ", response);
						const value = response.value.status;
						if (value.code !== 1020) {
							showSwal({
								type: "error",
								title: "Hata Kodu: " + value.code,
								text: value.description
							});
						} else {
							console.log(data);
							Swal.fire({
								heightAuto: false,
								type: "success",
								title: "Onaylandı",
								confirmButtonText: "Giriş yap",
								showLoaderOnConfirm: true
							}).then(function() {
								console.log("hadi giriş yap");
								var loginData = {
									username: data.tax_no,
									password: data.password
								};
								RequestLogin(loginData, true).then(code => {
									if (code === 1020)
										setTimeout(() => {
											window.location.pathname = "/app/dashboard";
										}, 100);
								});
							});
						}
					});
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

export { RequestRegister };
