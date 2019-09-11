import { ActivatePlayer, UpdatePlayer } from "../../services/Player";
import { fatalSwal } from "../../components/Alert";
import Swal from "sweetalert2";
import moment from "moment";

const reload = history => {
	const current = "/app/players";
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
					html: `<b>${name}</b> adlı öğrencinin kaydını aktifleştirmek istediğinize emin misiniz?`
				},
				{
					type: "info",
					title: "Not",
					text: "Tekrar başlama nedenini belirtiniz lütfen:",
					input: "text",
					inputPlaceholder: "...",
					inputAttributes: {
						max: 100
					}
				},
				{
					type: "info",
					title: "Aidat Belirle",
					text: "Yeni aidat tutarını giriniz lütfen:",
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
					title: "Okula Başlama Tarihi",
					text: "Okula Başlama Tarihini giriniz lütfen:",
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
						ActivatePlayer({
							uid: uid,
							to: to,
							note: results[1],
							start_date: moment(results[3], "DD-MM-YYYY").format("YYYY-MM-DD")
						}),
						UpdatePlayer({
							uid: uid,
							to: to,
							fee: parseFloat(results[2].split(",").join(".")),
							attributes: {
								fee: parseFloat(results[2].split(",").join("."))
							}
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
