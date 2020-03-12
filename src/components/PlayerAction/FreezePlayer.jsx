import { FreezePlayer } from "../../services/Player";
import { fatalSwal, Toast } from "../../components/Alert";
import Swal from "sweetalert2";

const reload = history => {
    const current = history.location.pathname;
    history.replace(`/`);
    setTimeout(() => {
        history.replace(current);
    });
};

const freezePlayer = (uid, to, name, history) => {
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
                    html: `<b>${name}</b> adlı öğrencinin <b>kaydını dondurmak</b> istediğinize emin misiniz?`
                },
                {
                    type: "info",
                    title: "Not",
                    text: "Kaydı dondurma nedenini belirtiniz lütfen:",
                    input: "text",
                    inputPlaceholder: "...",
                    inputAttributes: {
                        max: 100
                    }
                }
            ])
            .then(result => {
                if (result.value) {
                    const results = result.value;
                    FreezePlayer({
                        uid: uid,
                        to: to,
                        note: results[1]
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

export default freezePlayer;
