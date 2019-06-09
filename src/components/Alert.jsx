import Swal from "sweetalert2";

const Toast = Swal.mixin({
	toast: true,
	position: "top-end",
	showConfirmButton: false,
	timer: 2000
});

const showSwal = options => {
	try {
		return Swal.fire({
			heightAuto: false,
			confirmButtonText: "Tamam",
			...options
		});
	} catch (e) {}
};

const errorSwal = (data, options) => {
	try {
		showSwal({
			allowOutsideClick: false,
			type: "error",
			title: "Hata Kodu: " + data.code,
			text: data.description,
			...options
		});
	} catch (e) {}
};

const fatalSwal = () => {
	try {
		showSwal({
			allowOutsideClick: false,
			type: "error",
			title: "Hata Kodu: 1050",
			text: "Kritik bir hata ile karşı karşıyayız. Üzerinde çalışıyoruz. Lütfen daha sonra tekrar deneyin...",
			preConfirm: function(val) {
				if (val) {
				}
			}
		});
	} catch (e) {}
};

export { Toast, showSwal, errorSwal, fatalSwal };
