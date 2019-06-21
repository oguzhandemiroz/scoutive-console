import { Toast, fatalSwal } from "../components/Alert.jsx";
import ep from "../assets/js/urls";

const Bloods = () => {
	try {
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
	} catch (e) {}
};

const Branchs = () => {
	try {
		return fetch(ep.BRANCH)
			.then(res => res.json())
			.then(response => {
				const data = response.data;
				const status = response.status;
				const selectData = [];
				console.log("Branchs: ", response);

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
	} catch (e) {}
};

const EmployeePositions = () => {
	try {
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
	} catch (e) {}
};

const PlayerPositions = () => {
	try {
		return fetch(ep.PLAYER_POSITION_TYPE)
			.then(res => res.json())
			.then(response => {
				const data = response.data;
				const status = response.status;
				const selectData = [];
				console.log("Mevkii: ", response);

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
			.catch(e => fatalSwal());
	} catch (e) {}
};

const Groups = () => {
	try {
		return fetch(ep.GROUP, {
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
			.catch(e => fatalSwal());
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

const Years = reverse => {
	try {
		const years = [];
		var year = 1950;
		const endYear = 2005;

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

const GetEmployees = () => {
	try {
		return fetch(ep.GET_EMPLOYEE_NAME, {
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
				if (response) {
					const selectData = [];
					const status = response.status;

					if (status.code !== 1020) {
						Toast.fire({
							type: "error",
							title: '"Antrenörler" yüklenemedi'
						});
					} else {
						const data = response.data;
						data.map(el => {
							const value = el.employee_id;
							const label = el.name;
							const image = el.image;
							selectData.push({
								value: value,
								label: label,
								image: image
							});
						});
						return selectData;
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
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
			.then(res => res.json())
			.then(response => {
				if (response) {
					const selectData = [];
					const status = response.status;

					if (status.code !== 1020) {
						Toast.fire({
							type: "error",
							title: '"Öğrenciler" yüklenemedi'
						});
					} else {
						const data = response.data;
						data.map(el => {
							const value = el.player_id;
							const label = el.name;
							const image = el.image;
							selectData.push({
								value: value,
								label: label,
								image: image
							});
						});
						return selectData;
					}
				}
			});
	} catch (e) {}
};

export {
	Bloods,
	Branchs,
	EmployeePositions,
	PlayerPositions,
	Groups,
	Days,
	Months,
	Years,
	DateRange,
	Kinship,
	Hours,
	Minutes,
	GetEmployees,
	GetPlayers
};
