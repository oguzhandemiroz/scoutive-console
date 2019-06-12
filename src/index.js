import "./assets/css/dashboard.css";
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";
import Core from "./layouts/Core.jsx";
const $ = require("jquery");

/** Initialize popovers */
$(function () {
    $('[data-toggle="popover"]').popover({
        html: true,
        trigger: "hover",
    });
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

const rootElement = document.getElementById("root");

ReactDOM.render( < Core / > , rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();