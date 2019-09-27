import ep from "../assets/js/urls";
import { fatalSwal, errorSwal, showSwal, Toast } from "../components/Alert";
import { ActivationSchool } from "./School";
import { RequestLogin, SetSchoolInfoToLocalStorage } from "./Login";
import Inputmask from "inputmask";
import moment from "moment";
import "moment/locale/tr";

const SplitBirthday = date => {
	try {
		const splitedBirthday = {
			day: null,
			month: null,
			year: null
		};
		if (date) {
			const _split = date.split("-");

			splitedBirthday.day = _split[2];
			splitedBirthday.month = _split[1];
			splitedBirthday.year = _split[0];
		}
		return splitedBirthday;
	} catch (e) {}
};

const getSelectValue = (select, to, type, get) => {
	try {
		if (select && to) {
			const data = get ? select.find(x => x[type] === to)[get] : select.find(x => x[type] === to);
			return data || null;
		} else {
			return null;
		}
	} catch (e) {
		return null;
	}
};

const generateSelectValue = (value, label, custom) => {
	return { value: value, label: label, ...custom };
};

const UploadFile = formData => {
	try {
		if (formData) {
			return fetch(ep.UPLOAD_FILE, {
				method: "POST",
				body: formData
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
		}
	} catch (e) {
		fatalSwal(true);
	}
};

const AttributeDataChecker = (data, attr) => {
	try {
		if (data && attr) {
			return data.toString() !== attr.toString();
		} else if (attr === null) return false;
		else return data !== attr;
	} catch (e) {}
};

const systemClock = () => {
	try {
		var clock = moment().format("LTS");
		return clock;
	} catch (e) {}
};

const nullCheck = (data, instead) => {
	try {
		if (instead === undefined) instead = "—";
		return data ? data : instead;
	} catch (e) {
		return data;
	}
};

const formatDate = (date, format) => {
	try {
		if (!format) format = "DD/MM/YYYY";
		return date ? moment(date).format(format) : "—";
	} catch (e) {}
};

const formatMoney = (money, currency) => {
	try {
		if (!currency) currency = "₺";
		return money ? (!isNaN(money) ? money.format() + " " + currency : money) : "—";
	} catch (e) {}
};

const formatPhone = (phone, instead, mask) => {
	try {
		if (!mask) mask = "(999) 999 9999";
		if (instead === null) instead = "—";
		return phone
			? Inputmask.format(phone, {
					mask: mask
			  })
			: instead;
	} catch (e) {}
};

const clearMoney = money => {
	try {
		return money ? parseFloat(money.toString().replace(",", ".")) : null;
	} catch (e) {}
};

const fullnameGenerator = (name, surname) => {
	try {
		const fullname = nullCheck(name, "") + " " + nullCheck(surname, "");
		return fullname;
	} catch (e) {
		return nullCheck(name, "") + " " + nullCheck(surname, "");
	}
};

const avatarPlaceholder = (name, surname) => {
	try {
		const placeholder = nullCheck(name, "").slice(0, 1) + nullCheck(surname, "").slice(0, 1);
		return placeholder;
	} catch (e) {
		return nullCheck(name, "").slice(0, 1) + nullCheck(surname, "").slice(0, 1);
	}
};

const groupAgeSplit = age => {
	try {
		var result = {};
		const __split = age.indexOf("-") > -1 ? age.split("-") : null;
		if (__split) {
			const start = parseInt(__split[0]);
			const end = parseInt(__split[1]);
			result = {
				start: start,
				end: end,
				diff: end - start
			};
		} else {
			result = { start: age, end: age, diff: age - age };
		}
		return result;
	} catch (e) {}
};

function ObjectIsEqual(objA, objB) {
	// Create arrays of property names
	var aProps = Object.getOwnPropertyNames(objA);
	var bProps = Object.getOwnPropertyNames(objB);
	// If count of properties is different,
	// objects are not equivalent
	if (aProps.length !== bProps.length) {
		return false;
	}
	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];
		// If values of same property are not equal,
		// objects are not equivalent
		if (objA[propName] !== objB[propName]) {
			return false;
		}
	}
	// If we made it this far, objects
	// are considered equivalent
	return true;
}

const ActivateSchool = (title, loginInfo, data) => {
	try {
		showSwal({
			type: "success",
			title: title,
			text: "Aktifleştirmek için lütfen email hesabınıza gelen kodu giriniz: ",
			confirmButtonText: "Devam et",
			input: "text",
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
			showLoaderOnConfirm: true,
			inputValidator: value => {
				return new Promise(resolve => {
					if ((value !== "") & (value.length === 6) & /^\d{6,6}/g.test(value)) {
						ActivationSchool({
							uid: data.uid,
							code: value
						}).then(response => {
							if (response) {
								const status = response.status;
								if (status.code === 1020) {
									showSwal({
										type: "success",
										title: "Onaylandı",
										confirmButtonText: "Giriş yap",
										showLoaderOnConfirm: true
									}).then(re => {
										if (re.value) {
											RequestLogin(loginInfo, true).then(response => {
												if (response) {
													const data = response.data;
													const status = response.status;
													if (status.code === 1020) {
														Toast.fire({
															type: "success",
															title: "Giriş yapılıyor..."
														});
														SetSchoolInfoToLocalStorage(data);
													} else if (status.code === 1082) {
														errorSwal(status);
													}
												}
											});
										}
									});
								}
							}
						});
					} else {
						resolve("Lütfen boş bırakmayınız ve 6 haneli kod giriniz");
					}
				});
			}
		});
	} catch (e) {}
};

export {
	SplitBirthday,
	UploadFile,
	getSelectValue,
	generateSelectValue,
	AttributeDataChecker,
	ObjectIsEqual,
	systemClock,
	nullCheck,
	formatDate,
	formatMoney,
	formatPhone,
	fullnameGenerator,
	clearMoney,
	groupAgeSplit,
	ActivateSchool,
	avatarPlaceholder
};
