import "./assets/css/dashboard.css";
import "./assets/css/custom.css";
import { registerLocale } from "react-datepicker";
import tr from "date-fns/locale/tr";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import Core from "./layouts/Core.jsx";
import Maintenance from "./components/Maintenance";
import ep from "./assets/js/urls";
const $ = require("jquery");

registerLocale("tr", tr);

/** Initialize popovers */
$(function() {
    $('[data-toggle="popover"]').popover({
        html: true,
        trigger: "hover"
    });
});

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

Array.prototype.diff = function(a) {
    return this.filter(function(i) {
        return a.indexOf(i) < 0;
    });
};

if (sessionStorage.getItem("IPADDR") === null) {
    fetch(ep.GET_IP)
        .then(res => res.json())
        .then(response => {
            sessionStorage.setItem("IPADDR", response.ip);
        });
}

if (process.env.NODE_ENV !== "development") {
    Sentry.init({
        dsn: "https://c90b37e039fe47be999b38143129dd3d@sentry.io/1505918"
    });

    Sentry.configureScope(function(scope) {
        scope.setUser({
            id: localStorage.getItem("sID"),
            uid: localStorage.getItem("UID"),
            name: localStorage.getItem("sName"),
            username: localStorage.getItem("sRemember"),
            permission: localStorage.getItem("sType")
        });
    });
}

const rootElement = document.getElementById("root");

ReactDOM.render(<Core />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
