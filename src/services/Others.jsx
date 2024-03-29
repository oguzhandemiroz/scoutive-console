import ep from "../assets/js/urls";
import { fatalSwal, errorSwal, showSwal, Toast, showToast } from "../components/Alert";
import { ActivationSchool } from "./School";
import { RequestLogin, SetSchoolInfoToLocalStorage, SetPermissionsKeys } from "./Login";
import { SetSession, GenerateSessionData } from "./Session";
import Inputmask from "inputmask";
import _ from "lodash";
import moment from "moment";
import "moment/locale/tr";
const CryptoJS = require("crypto-js");

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

const parseJSON = data => {
    return JSON.parse(data.split("'").join('"'));
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

const spaceTrim = value => {
    try {
        return value ? value.trim() : "";
    } catch (e) {
        return "";
    }
};

const formatDate = (date, format) => {
    try {
        if (!format) format = "DD/MM/YYYY";
        return date ? moment(date).format(format) : "—";
    } catch (e) {}
};

const formatPhone = (phone, instead, mask) => {
    try {
        if (!mask) mask = "(999) 999 9999";
        if (instead === undefined) instead = "—";
        return phone
            ? Inputmask.format(phone, {
                  mask: mask
              })
            : instead;
    } catch (e) {}
};

const formatMaskMoney = money => {
    try {
        return money !== null && money !== undefined ? (!isNaN(money) ? money.format() : money) : "0,00";
    } catch (e) {}
};

const formatMoney = (money, currency) => {
    try {
        if (!currency) currency = "₺";
        return money !== null && money !== undefined ? (!isNaN(money) ? money.format() + " " + currency : money) : "—";
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

const renderForDataTableSearchStructure = value => {
    try {
        const mergedValue =
            value + value.toString().toLocaleLowerCase("tr-TR") + value.toString().toLocaleUpperCase("tr-TR");
        return mergedValue;
    } catch (e) {
        return value;
    }
};

const searchStructureForDate = (value, format) => {
    try {
        if (!format) format = "YYYY-MM-DD";
        if (moment(value).isValid()) {
            const formats = [
                "",
                "LL",
                "DD/MM/YYYY",
                "DD MM YYYY",
                "DD.MM.YYYY",
                "DD-MM-YYYY",
                "MM/DD/YYYY",
                "MM DD YYYY",
                "MM.DD.YYYY",
                "MM-DD-YYYY"
            ];
            return `${value} ${formats
                .reduce((total, item) => total + " " + moment(value, format).format(item))
                .trim()}`;
        }
        return value;
    } catch (e) {
        return value;
    }
};

const groupAgeSplit = age => {
    try {
        var result = {};
        if (age) {
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
        }
        return { start: "—", end: "—", diff: "—" };
    } catch (e) {}
};

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isChrome = () => {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
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
            text: "Kodu almak ve hesabı aktifleştirmek için yetkililer ile iletişime geçiniz: ",
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
                                                    if (status.code === 1012) {
                                                        GenerateSessionData().then(r =>
                                                            SetSession({
                                                                uid: data.uid,
                                                                school_id: data.sid,
                                                                type: 1,
                                                                ...r
                                                            }).then(res => {
                                                                showToast(status);

                                                                SetPermissionsKeys(data.permissions);
                                                                SetSchoolInfoToLocalStorage(data);
                                                            })
                                                        );
                                                    } else {
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

const CheckPermissions = (keys, condition_operator) => {
    try {
        if (!condition_operator) condition_operator = "&&";

        // decrypt (S:C "Scoutive:Permission") storage
        const getPermissions = localStorage.getItem("S:P");
        const decryptPermissions = CryptoJS.AES.decrypt(getPermissions.toString(), "sc_prm");
        const plainPermissons = JSON.parse(decryptPermissions.toString(CryptoJS.enc.Utf8));

        if (keys.length > 0) {
            if (condition_operator === "&&") {
                return _.isEqual(_.sortBy(_.intersection(plainPermissons, keys)), _.sortBy(keys));
            } else if (condition_operator === "||") {
                return _.intersection(plainPermissons, keys).length > 0;
            }
        }
        return false;
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
    formatMaskMoney,
    formatPhone,
    fullnameGenerator,
    clearMoney,
    groupAgeSplit,
    ActivateSchool,
    avatarPlaceholder,
    parseJSON,
    isMobile,
    isChrome,
    CheckPermissions,
    renderForDataTableSearchStructure,
    searchStructureForDate,
    spaceTrim
};
