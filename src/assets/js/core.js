import _ from "lodash";

/**
 * Number.prototype.format(d, w, s, c)
 *
 * @param integer d: length of decimal
 * @param integer w: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function (d, w, s, c) {
    d = 2;
    w = 3;
    s = ".";
    c = ",";
    var re = "\\d(?=(\\d{" + (w || 3) + "})+" + (d > 0 ? "\\b" : "$") + ")",
        num = this.toFixed(Math.max(0, ~~d));

    return (c ? num.replace(".", c) : num).replace(new RegExp(re, "g"), "$&" + (s || ","));
};

String.prototype.capitalize = function () {
    return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
        return p1 + p2.toLocaleUpperCase("tr-TR");
    });
};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays, interval) {
    if (!exdays) {
        exdays = 0;
    }
    if (!interval) {
        interval = "D";
    }
    if (exdays === 0) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    } else {
        var d = new Date();
        if (interval === "D") {
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        }
        if (interval === "M") {
            d.setTime(d.getTime() + exdays * 60 * 1000);
        }
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

const datatable_turkish = {
    sDecimal: ",",
    sEmptyTable: "Tabloda herhangi bir veri mevcut değil",
    sInfo: "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
    sInfoEmpty: "Kayıt yok",
    sInfoFiltered: "(_MAX_ kayıt içerisinden bulunan)",
    sInfoPostFix: "",
    sInfoThousands: ".",
    sLengthMenu: "_MENU_ göster",
    sLoadingRecords: "Yükleniyor...",
    sProcessing: "İşleniyor...",
    sSearch: "",
    searchPlaceholder: "Ara",
    sZeroRecords: "Eşleşen kayıt bulunamadı",
    oPaginate: {
        sFirst: "İlk",
        sLast: "Son",
        sNext: "Sonraki",
        sPrevious: "Önceki"
    },
    oAria: {
        sSortAscending: ": artan sütun sıralamasını aktifleştir",
        sSortDescending: ": azalan sütun sıralamasını aktifleştir"
    },
    select: {
        rows: {
            _: "%d kayıt seçildi",
            "0": "",
            "1": "1 kayıt seçildi"
        }
    }
};

const selectCustomStyles = {
    control: styles => ({
        ...styles,
        borderColor: "rgba(0, 40, 100, 0.12)",
        borderRadius: 3
    })
};

const selectCustomStylesError = {
    control: styles => ({
        ...styles,
        borderColor: "#cd201f",
        borderRadius: 3,
        ":hover": {
            ...styles[":hover"],
            borderColor: "#cd201f"
        }
    })
};

// eslint-disable-next-line
const emailRegEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const securityNoRegEx = /^\d+$/;

const formValid = ({
    formErrors,
    ...rest
}) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

const difference = (object, base) => {
    function changes(object, base) {
        return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
};


export {
    getCookie,
    setCookie,
    datatable_turkish,
    selectCustomStyles,
    selectCustomStylesError,
    formValid,
    emailRegEx,
    securityNoRegEx,
    difference
};