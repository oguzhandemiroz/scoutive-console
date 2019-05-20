Number.prototype.format = function() {
    var re = "\\d(?=(\\d{" + (3 || 3) + "})+" + (2 > 0 ? "\\D" : "₺") + ")",
        num = this.toFixed(Math.max(0, ~~2));

    return ("," ? num.replace(".", ",") : num).replace(new RegExp(re, "g"), "$&" + ("." || ","));
};
