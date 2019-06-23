import ep from "../assets/js/urls";
import {fatalSwal, errorSwal} from "../components/Alert.jsx";
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

const getSelectValue = (select, to, type) => {
    try {
        if (select && to) {
            const data = select.find(x => x[type] === to);
            return data || null;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
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
                .catch(e => fatalSwal());
        }
    } catch (e) {
        fatalSwal();
    }
};

const AttributeDataChecker = (data, attr) => {
    try {
        return data.toString() !== attr.toString();
    } catch (e) {}
};

const systemClock = () => {
    try {
        var clock = moment().format("LTS");
        return clock;
    } catch (e) {}
};

function ObjectIsEqual(objA, objB) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(objA);
    var bProps = Object.getOwnPropertyNames(objB);
    // If count of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
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

export {SplitBirthday, UploadFile, getSelectValue, AttributeDataChecker, ObjectIsEqual, systemClock};
