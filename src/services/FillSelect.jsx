import {Toast, fatalSwal} from "../components/Alert.jsx";
import ep from "../assets/js/urls";

const Bloods = () => {
    return fetch(ep.BLOOD_TYPE)
        .then(res => res.json())
        .then(response => {
            const data = response.data;
            const status = response.status;
            const selectData = [];
            console.log("Bloods: ", response);

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
        .catch(e => fatalSwal());
};

const Branchs = () => {
    return fetch(ep.BRANCH)
        .then(res => res.json())
        .then(response => {
            const data = response.data;
            const status = response.status;
            const selectData = [];
            console.log("Bloods: ", response);

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
        .catch(e => fatalSwal());
};

const EmployeePositions = () => {
    return fetch(ep.EMPLOYEE_POSITION_TYPE, {
        method: "POST",
        body: JSON.stringify({
            uid: localStorage.getItem("UID")
        }),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })
        .then(res => res.json())
        .then(response => {
            const data = response.data;
            const status = response.status;
            const selectData = [];
            console.log("Employee: ", response);

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
        .catch(e => fatalSwal());
};

const Days = () => {
    const days = [];
    var day = 1;
    const endDay = 31;

    for (day; day <= endDay; day++) {
        days.push({
            value: day,
            label: day.toString()
        });
    }

    return days;
};

const Months = () => {
    const months = [
        {
            value: 1,
            label: "Ocak"
        },
        {
            value: 2,
            label: "Şubat"
        },
        {
            value: 3,
            label: "Mart"
        },
        {
            value: 4,
            label: "Nisan"
        },
        {
            value: 5,
            label: "Mayıs"
        },
        {
            value: 6,
            label: "Haziran"
        },
        {
            value: 7,
            label: "Temmuz"
        },
        {
            value: 8,
            label: "Ağustos"
        },
        {
            value: 9,
            label: "Eylül"
        },
        {
            value: 10,
            label: "Ekim"
        },
        {
            value: 11,
            label: "Kasım"
        },
        {
            value: 12,
            label: "Aralık"
        }
    ];

    return months;
};

const Years = () => {
    const years = [];
    var year = 1950;
    const endYear = 2005;

    for (year; year <= endYear; year++) {
        years.push({
            value: year,
            label: year.toString()
        });
    }

    return years;
};

const DateRange = (start, end) => {
    const years = [];
    if (!start) start = 1970;
    if (!end) end = 2019;

    for (start; start <= end; start++) {
        years.push({
            value: start,
            label: start.toString()
        });
    }

    return years;
};

const Kinship = () => {
    const list = [
        {
            value: 0,
            label: "Anne"
        },
        {
            value: 1,
            label: "Baba"
        },
        {
            value: 2,
            label: "Eş"
        },
        {
            value: 3,
            label: "Diğer"
        }
    ];
    return list;
};

export {Bloods, Branchs, EmployeePositions, Days, Months, Years, DateRange, Kinship};
