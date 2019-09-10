import { ActivateEmployee, UpdateEmployee } from "../../services/Employee";
import { fatalSwal } from "../../components/Alert";
import Swal from "sweetalert2";
import moment from "moment";

const reload = history => {
	const current = "/app/employees";
	history.replace(`/`);
	setTimeout(() => {
		history.replace(current);
	});
};

const activatePlayer = (uid, to, name, history) => {
	try {
		Swal.mixin({
			heightAuto: false,
			allowEnterKey: false,
			confirmButtonText: "Evet &rarr;",
			showCancelButton: true,
			cancelButtonText: "Hayır",
			confirmButtonColor: "#cd201f",
			cancelButtonColor: "#868e96",
			reverseButtons: true
		})
			.queue([
				{
					type: "warning",
					title: "Emin misiniz?",
					html: `<b>${name}</b> adlı çalışanı tekrar işe almak istediğinize emin misiniz?`
				},
				{
					type: "info",
					title: "Not",
					text: "Tekrar işe alma nedenini belirtiniz lütfen:",
					input: "text",
					inputPlaceholder: "...",
					inputAttributes: {
						max: 100
					}
				},
				{
					type: "info",
					title: "Maaş Belirle",
					text: "Yeni maaş tutarını giriniz lütfen:",
					input: "number",
					inputPlaceholder: "0",
					inputAttributes: {
						autocapitalize: "off"
					},
					inputValidator: value => {
						return new Promise(resolve => {
							if (value > 0 && value < 10000) resolve();
							else resolve("Hatalı değer!");
						});
					}
				},
				{
					type: "info",
					title: "İşe Başlama Tarihi",
					text: "İşe Başlama Tarihini giriniz lütfen:",
					input: "text",
					inputValue: moment().format("DD-MM-YYYY"),
					inputPlaceholder: moment().format("DD-MM-YYYY") + " (GG-AA-YYYY)",
					inputAttributes: {
						autocapitalize: "off"
					},
					inputValidator: value => {
						return new Promise(resolve => {
							if (moment(value, "DD-MM-YYYY").isValid()) resolve();
							else resolve("Hatalı değer!");
						});
					}
				}
			])
			.then(result => {
				if (result.value) {
					const results = result.value;
					console.log(results);
					Promise.all([
						ActivateEmployee({
							uid: uid,
							to: to,
							note: results[1],
							start_date: moment(results[3], "DD-MM-YYYY").format("YYYY-MM-DD")
						}),
						UpdateEmployee({
							uid: uid,
							to: to,
							salary: parseFloat(results[2].split(",").join("."))
						})
					]).then(([responseActivated, responseUpdated]) => {
						if (responseActivated && responseUpdated) {
							const statusActivate = responseActivated.status;
							if (statusActivate.code === 1020 && responseUpdated === 1020) {
								setTimeout(() => reload(history), 1000);
							}
						}
					});
				}
			});
	} catch (e) {
		fatalSwal(true);
	}
};

export default activatePlayer;
