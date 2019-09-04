Number.prototype.format = function () {
	var re = "\\d(?=(\\d{" + (3 || 3) + "})+" + (2 > 0 ? "\\D" : "₺") + ")",
		num = this.toFixed(Math.max(0, ~~2));

	return ("," ? num.replace(".", ",") : num).replace(new RegExp(re, "g"), "$&" + ("." || ","));
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

export {
	getCookie,
	setCookie,
	datatable_turkish,
	selectCustomStyles,
	selectCustomStylesError,
	formValid
};