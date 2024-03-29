import { DeleteEmployee } from "../../services/Employee";
import { fatalSwal, Toast } from "../../components/Alert";
import Swal from "sweetalert2";
import moment from "moment";

const reload = history => {
    const current = "/app/persons/employees";
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
                    html: `<b>${name}</b> adlı personeli işten çıkarmak istediğinize emin misiniz?`
                },
                {
                    type: "info",
                    title: "Not",
                    text: "İşten ayrılma nedenini belirtiniz lütfen:",
                    input: "text",
                    inputPlaceholder: "...",
                    inputAttributes: {
                        max: 100
                    }
                },
                {
                    type: "info",
                    title: "İşten Ayrılma Tarihi",
                    text: "İşten Ayrılma Tarihini giriniz lütfen:",
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
                    DeleteEmployee({
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

export default activatePlayer;
