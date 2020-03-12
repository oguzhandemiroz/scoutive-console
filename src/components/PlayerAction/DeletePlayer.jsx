import { DeletePlayer } from "../../services/Player";
import { fatalSwal, Toast } from "../../components/Alert";
import Swal from "sweetalert2";
import moment from "moment";

const reload = history => {
    const current = "/app/players";
    history.replace(`/`);
    setTimeout(() => {
        history.replace(current);
    });
};

const deletePlayer = (uid, to, name, history) => {
    try {
        Swal.mixin({
            allowOutsideClick: false,
            heightAuto: false,
            allowEnterKey: false,
            confirmButtonText: "Evet &rarr;",
            showCloseButton: true,
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
                    html: `<b>${name}</b> adlı öğrencinin kaydını pasifleştirmek istediğinize emin misiniz?`
                },
                {
                    type: "info",
                    title: "Not",
                    text: "Kaydı pasifleştirme nedenini belirtiniz lütfen:",
                    input: "text",
                    inputPlaceholder: "...",
                    inputAttributes: {
                        max: 100
                    }
                },
                {
                    type: "info",
                    title: "Okuldan Ayrılma Tarihi",
                    text: "Okuldan Ayrılma Tarihini giriniz lütfen:",
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
                    DeletePlayer({
                        uid: uid,
                        to: to,
                        note: results[1],
                        end_date: moment(results[2], "DD-MM-YYYY").format("YYYY-MM-DD")
                    }).then(response => {
                        if (response) {
                            const status = response.status;
                            if (status.code === 1022) {
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

export default deletePlayer;
