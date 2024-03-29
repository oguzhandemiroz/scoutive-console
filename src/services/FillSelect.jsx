import { Toast, fatalSwal } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { getCookie } from "../assets/js/core.js";
import { fullnameGenerator } from "./Others.jsx";
import { CheckPermissions } from "../services/Others";

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const Bloods = () => {
    try {
        return fetch(ep.BLOOD_TYPE, { headers: h })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Kan Grubu" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Clubs = () => {
    try {
        return fetch(ep.CLUB, { headers: h })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Kulüpler" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Branchs = () => {
    try {
        return fetch(ep.BRANCH, { headers: h })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Branş" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Areas = () => {
    try {
        return fetch(ep.AREA, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Sahalar" yüklenemedi'
                    });
                } else {
                    return data.map(el => {
                        const value = el.area_id;
                        const label = el.name;
                        return {
                            value: value,
                            label: label
                        };
                    });
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Bodies = () => {
    try {
        return [
            {
                value: "1",
                label: "XXS (5-6 Yaş)"
            },
            {
                value: "2",
                label: "XS (7-8 Yaş)"
            },
            {
                value: "3",
                label: "S (9-10 Yaş)"
            },
            {
                value: "4",
                label: "M (11-12 Yaş)"
            },
            {
                value: "5",
                label: "L (13-14 Yaş)"
            },
            {
                value: "6",
                label: "XL (15-16 Yaş)"
            }
        ];
    } catch (e) {}
};

const EmployeePositions = () => {
    try {
        return fetch(ep.EMPLOYEE_POSITION_TYPE, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Pozisyon" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const PlayerPositions = type => {
    try {
        return fetch(ep.PLAYER_POSITION_TYPE + type, { headers: h })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Mevkii" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Groups = () => {
    try {
        if (!CheckPermissions(["g_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.GROUP, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Grup" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData;
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Banks = () => {
    try {
        return fetch(ep.BANK, { headers: h })
            .then(res => res.json())
            .then(response => {
                const data = response.data;
                const status = response.status;
                const selectData = [];

                if (status.code !== 1020) {
                    Toast.fire({
                        type: "error",
                        title: '"Bankalar" yüklenemedi'
                    });
                } else {
                    for (const item in data) {
                        const value = item;
                        const label = data[item];
                        selectData.push({
                            value: value,
                            label: label
                        });
                    }
                    return selectData.sort((a, b) => {
                        return a.label.localeCompare(b.label);
                    });
                }
            })
            .catch(e => fatalSwal(true));
    } catch (e) {}
};

const Days = () => {
    try {
        const days = [];
        var day = 1;
        const endDay = 31;

        for (day; day <= endDay; day++) {
            days.push({
                value: day < 10 ? "0" + day.toString() : day.toString(),
                label: day < 10 ? "0" + day.toString() : day.toString()
            });
        }

        return days;
    } catch (e) {}
};

const Months = () => {
    try {
        const months = [
            {
                value: "01",
                label: "Ocak"
            },
            {
                value: "02",
                label: "Şubat"
            },
            {
                value: "03",
                label: "Mart"
            },
            {
                value: "04",
                label: "Nisan"
            },
            {
                value: "05",
                label: "Mayıs"
            },
            {
                value: "06",
                label: "Haziran"
            },
            {
                value: "07",
                label: "Temmuz"
            },
            {
                value: "08",
                label: "Ağustos"
            },
            {
                value: "09",
                label: "Eylül"
            },
            {
                value: "10",
                label: "Ekim"
            },
            {
                value: "11",
                label: "Kasım"
            },
            {
                value: "12",
                label: "Aralık"
            }
        ];

        return months;
    } catch (e) {}
};

const Years = (reverse, start_year, end_year) => {
    try {
        const years = [];
        var year = start_year || 1950;
        const endYear = end_year || 2016;

        for (year; year <= endYear; year++) {
            years.push({
                value: year.toString(),
                label: year.toString()
            });
        }

        return reverse ? years.reverse() : years;
    } catch (e) {}
};

const Hours = () => {
    try {
        const hours = [];
        var hour = 0;
        const endHour = 24;
        for (hour; hour <= endHour; hour++) {
            hours.push({
                value: hour < 10 ? "0" + hour.toString() : hour.toString(),
                label: hour < 10 ? "0" + hour.toString() : hour.toString()
            });
        }
        return hours;
    } catch (e) {}
};

const Minutes = () => {
    try {
        const minutes = [];
        var minute = 0;
        const endminute = 59;
        for (minute; minute <= endminute; minute++) {
            minutes.push({
                value: minute < 10 ? "0" + minute.toString() : minute.toString(),
                label: minute < 10 ? "0" + minute.toString() : minute.toString()
            });
        }
        return minutes;
    } catch (e) {}
};

const DateRange = (start, end, reverse) => {
    try {
        const years = [];
        if (start === null) start = 1970;
        if (end === null) end = 2019;

        for (start; start <= end; start++) {
            years.push({
                value: start.toString(),
                label: start.toString()
            });
        }

        return reverse ? years.reverse() : years;
    } catch (e) {}
};

const Kinship = () => {
    try {
        const list = [
            {
                value: "0",
                label: "Anne"
            },
            {
                value: "1",
                label: "Baba"
            },
            {
                value: "2",
                label: "Eş"
            },
            {
                value: "3",
                label: "Diğer"
            }
        ];
        return list;
    } catch (e) {}
};

const GetEmployees = errorMsg => {
    try {
        if (!errorMsg) errorMsg = "Antrenörler";
        return fetch(ep.GET_EMPLOYEE_NAME, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const selectData = [];
                    const status = response.status;

                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: `"${errorMsg}" yüklenemedi`
                        });
                    } else {
                        const data = response.data;
                        data.map(el => {
                            const name = el.name || "";
                            const surname = el.surname || "";
                            const value = el.employee_id;
                            const label = name + " " + surname;
                            const image = el.image;
                            const position = el.position;
                            selectData.push({
                                value: value,
                                label: label,
                                image: image,
                                position: position
                            });
                        });
                        return selectData.sort((a, b) => {
                            return a.label.localeCompare(b.label);
                        });
                    }
                }
            });
    } catch (e) {}
};

const GetPlayers = () => {
    try {
        return fetch(ep.GET_PLAYER_NAME, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    let selectData = [];
                    const status = response.status;

                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Öğrenciler" yüklenemedi'
                        });
                    } else {
                        const data = response.data;
                        data.map(el => {
                            const name = el.name || "";
                            const surname = el.surname || "";
                            const value = el.security_id;
                            const label = name + " " + surname;
                            const image = el.image;
                            const group = el.group ? el.group.name : null;
                            const birthday = el.birthday;
                            const id = el.player_id;
                            selectData.push({
                                value: value,
                                label: label,
                                image: image,
                                group: group,
                                birthday: birthday,
                                id: id
                            });
                        });

                        return selectData.sort((a, b) => {
                            return a.group ? 1 : -1;
                            // return a.label.localeCompare(b.label); isimleri A'dan Z'ye sıralamak için.
                        });
                    }
                }
            });
    } catch (e) {}
};

const GetBudgets = extra => {
    try {
        if (!CheckPermissions(["a_read"])) {
            return Promise.resolve(null);
        }

        return fetch(ep.BUDGET_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const selectData = [];
                    const status = response.status;

                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Kasalar" yüklenemedi'
                        });
                    } else {
                        const data = response.data;
                        if (extra) {
                            data.map(el => {
                                const value = el.budget_id;
                                const label = el.budget_name;
                                selectData.push({
                                    value: value,
                                    label: label,
                                    ...el
                                });
                            });
                        } else {
                            data.map(el => {
                                const value = el.budget_id;
                                const label = el.budget_name;
                                const type = el.budget_type;
                                const balance = el.balance;
                                const _default = el.default;
                                selectData.push({
                                    value: value,
                                    label: label,
                                    type: type,
                                    balance: balance,
                                    default: _default
                                });
                            });
                        }
                        return selectData;
                    }
                }
            })
            .catch(e =>
                Toast.fire({
                    type: "error",
                    title: '"Kasalar" yüklenemedi'
                })
            );
    } catch (e) {}
};

const GetServices = () => {
    try {
        return fetch(ep.SERVICES, { headers: h })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    const status = response.status;

                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Servisler" yüklenemedi'
                        });
                    } else {
                        return response.data;
                    }
                }
            })
            .catch(e =>
                Toast.fire({
                    type: "error",
                    title: '"Servisler" yüklenemedi'
                })
            );
    } catch (e) {}
};

const GetParents = () => {
    try {
        return fetch(ep.PARENT_LIST, {
            method: "POST",
            body: JSON.stringify({
                uid: localStorage.getItem("UID")
            }),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                if (response) {
                    let selectData = [];
                    const status = response.status;
                    if (status.code !== 1020) {
                        Toast.fire({
                            type: "error",
                            title: '"Veliler" yüklenemedi'
                        });
                    } else {
                        const data = response.data;
                        data.map(el => {
                            const value = el.parent_id;
                            const label = fullnameGenerator(el.name, el.surname);
                            const uid = el.uid;
                            const phone = el.phone;
                            const email = el.email;
                            const name = el.name;
                            const surname = el.surname;
                            selectData.push({
                                value: value,
                                label: label,
                                uid: uid,
                                phone: phone,
                                email: email,
                                name: name,
                                surname: surname
                            });
                        });
                        return selectData.sort((a, b) => {
                            return a.label.localeCompare(b.label);
                        });
                    }
                }
            })
            .catch(e =>
                Toast.fire({
                    type: "error",
                    title: '"Veliler" yüklenemedi'
                })
            );
    } catch (e) {}
};

export {
    Clubs,
    Bloods,
    Branchs,
    EmployeePositions,
    PlayerPositions,
    Groups,
    Banks,
    Days,
    Months,
    Years,
    DateRange,
    Kinship,
    Hours,
    Minutes,
    GetEmployees,
    GetPlayers,
    GetBudgets,
    Areas,
    GetServices,
    GetParents,
    Bodies
};
