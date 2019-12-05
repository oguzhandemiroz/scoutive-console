import { fatalSwal, errorSwal, Toast } from "../components/Alert.jsx";
import ep from "../assets/js/urls";
import { setCookie, getCookie } from "../assets/js/core";
import "clientjs";
const CryptoJS = require("crypto-js");
const client = require("clientjs");

const h = new Headers();
h.append("Content-Type", "application/json");
h.append("XIP", getCookie("IPADDR"));
h.append("Authorization", localStorage.getItem("UID"));

const GeoRequest = () => {
    return new Promise((resolve, reject) => {
        try {
            if (!getCookie("IPADDR") || !localStorage.getItem("S:G")) {
                fetch(ep.GET_GEOLOCATION)
                    .then(res => res.json())
                    .then(response => {
                        setCookie("IPADDR", response.ip, 15, "M");
                        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(response), "sc_geo");
                        localStorage.setItem("S:G", ciphertext);
                        resolve(ciphertext);
                    });
            } else {
                resolve(localStorage.getItem("S:G"));
            }
        } catch (e) {}
    });
};

const DecryptGeo = () => {
    try {
        return GeoRequest().then(response => {
            const bytes = CryptoJS.AES.decrypt(response.toString(), "sc_geo");
            const plain_geo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return plain_geo;
        });
    } catch (e) {}
};

const GetIP = () => DecryptGeo().then(response => response.ip);
const GetCountry = () => DecryptGeo().then(response => response.country_name);
const GetCity = () => DecryptGeo().then(response => response.region);
const GetCookie = () => document.cookie;
const GetUserAgent = () => client().ua;
const GetReferer = () => document.referrer;
const GetLanguage = () => navigator.language;
const GetCookieEnabled = () => navigator.cookieEnabled;
const GetOsName = () => client().os.name;
const GetOsVersion = () => client().os.version;
const GetBrowserName = () => client().browser.name;
const GetBrowserVersion = () => client().browser.version;
const GetDevice = () => (client().device.type ? client().device.type : "desktop");
const GenerateSessionData = () => {
    return DecryptGeo().then(response => {
        return {
            ip: response.ip,
            cookie: GetCookie(),
            language: GetLanguage(),
            cookie_enabled: GetCookieEnabled(),
            city: response.city,
            country: response.country_name,
            device: GetDevice(),
            os_name: GetOsName(),
            os_version: GetOsVersion(),
            browser_name: GetBrowserName(),
            browser_version: GetBrowserVersion()
        };
    });
};

const SetSession = data => {
    try {
        return fetch(ep.SESSION, {
            method: "POST",
            body: JSON.stringify(data),
            headers: h
        })
            .then(res => res.json())
            .then(response => {
                const status = response.status;
                if (status.code !== 1020) errorSwal(status);
                else localStorage.setItem("t", response.t);
                return response;
            })
            .catch(err => fatalSwal(true));
    } catch (e) {}
};

export {
    GeoRequest,
    GetIP,
    GetCountry,
    GetCity,
    GetCookie,
    GetUserAgent,
    GetReferer,
    GetLanguage,
    GetCookieEnabled,
    GetOsName,
    GetOsVersion,
    GetBrowserName,
    GetBrowserVersion,
    GetDevice,
    SetSession,
    GenerateSessionData
};
