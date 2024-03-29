import React, { Component } from "react";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import { CreateVacation, UpdateVacation, ListVacations } from "../../services/EmployeeAction";
import { fullnameGenerator, formatDate, formatMoney } from "../../services/Others";
import { Toast, showSwal } from "../Alert";
import moment from "moment";
import Inputmask from "inputmask";
const $ = require("jquery");

Inputmask.extendDefaults({
    autoUnmask: true
});

Inputmask.extendAliases({
    try: {
        suffix: " ₺",
        radixPoint: ",",
        groupSeparator: ".",
        alias: "numeric",
        autoGroup: true,
        digits: 2,
        digitsOptional: false,
        clearMaskOnLostFocus: false,
        allowMinus: false,
        allowPlus: false,
        rightAlign: false
    }
});

const InputmaskDefaultOptions = {
    showMaskOnHover: false,
    showMaskOnFocus: false,
    placeholder: "0,00",
    autoUnmask: true
};

registerLocale("tr", tr);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

const noRow = loading => (
    <tr style={{ height: 80 }}>
        <td colSpan="5" className="text-center text-muted font-italic">
            {loading ? (
                <div className={`dimmer active`}>
                    <div className="loader" />
                    <div className="dimmer-content" />
                </div>
            ) : (
                "Kayıt bulunamadı..."
            )}
        </td>
    </tr>
);

const initialState = {
    startDate: new Date(),
    endDate: null,
    day: null,
    no_cost: 0,
    daily_amount: null,
    note: null
};

export class Vacation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: localStorage.getItem("UID"),
            data: {},
            ...initialState,
            loadingButton: false,
            loadingData: false,
            list: [],
            formErrors: {
                startDate: "",
                endDate: "",
                day: "",
                daily_amount: ""
            }
        };
    }

    fieldMasked = () => {
        try {
            console.log("e");
            const elemArray = {
                daily_amount: $("[name=daily_amount]")
            };
            Inputmask({
                alias: "try",
                ...InputmaskDefaultOptions
            }).mask(elemArray.daily_amount);
        } catch (e) {}
    };

    componentDidMount() {
        if (document.querySelectorAll("#vacation-past-tab.active").length > 0)
            this.renderVacationList(this.props.data.uid);
        this.setState({ ...this.props });
    }

    componentWillReceiveProps(nextProps) {
        if (document.querySelectorAll("#vacation-past-tab.active").length > 0)
            this.renderVacationList(nextProps.data.uid);
        this.setState({ ...nextProps, ...initialState });
    }

    reload = () => {
        const current = this.props.history.location.pathname;
        this.props.history.replace("/app/reload");
        setTimeout(() => {
            this.props.history.replace(current);
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { uid, day, startDate, note, daily_amount, endDate, formErrors, no_cost } = this.state;
        const { data } = this.props;
        const requiredData = {};

        console.log(startDate, endDate, day);
        requiredData.startDate = startDate;
        requiredData.endDate = endDate;
        requiredData.day = day;
        if (no_cost === 1) requiredData.daily_amount = daily_amount;
        requiredData.formErrors = formErrors;

        if (formValid(requiredData)) {
            this.setState({ loadingButton: true });
            CreateVacation(
                {
                    uid: uid,
                    to: data.uid,
                    start: moment(startDate).format("YYYY-MM-DD"),
                    end: endDate ? moment(endDate).format("YYYY-MM-DD") : moment(startDate).format("YYYY-MM-DD"),
                    day: day ? parseFloat(day) : 1,
                    no_cost: no_cost,
                    note: note,
                    daily_amount: daily_amount ? daily_amount.replace(",", ".") : null
                },
                "employee"
            ).then(response => {
                if (response) {
                    const status = response.status;
                    if (status.code === 1021) {
                        setTimeout(() => this.reload(), 1000);
                    } else if (status.code === 1030) {
                        showSwal({
                            type: "warning",
                            title: "Uyarı!",
                            html: `${status.description}.<br>
								Yeni bilgiler ile güncellemek ister misiniz? <hr class="my-3"/>
								<div class="card text-left">
								<div class="card-header">
									<h2 class="card-title text-dark font-weight-600">Önceki Bilgiler</h2>
								</div>
								<table class="table card-table">
									<tbody>
										<tr>
											<td>Başlangıç Tarihi</td>
											<td class="text-right">
												<span class="text-muted">${response.data.start}</span>
											</td>
										</tr>
										<tr>
											<td>Bitiş Tarihi</td>
											<td class="text-right">
												<span class="text-muted">${response.data.end}</span>
											</td>
										</tr>
										<tr>
											<td>Gün sayısı</td>
											<td class="text-right">
												<span class="text-muted">${response.data.day}</span>
											</td>
										</tr>
										<tr>
											<td>Ücretli/Ücretsiz</td>
											<td class="text-right">
												<span class="badge badge-${response.data.no_cost === 0 ? "success" : "danger"}">${
                                response.data.no_cost === 0 ? "Ücretli" : "Ücretsiz"
                            }</span>
											</td>
										</tr>
										<tr>
											<td>İşlemi yapan</td>
											<td class="text-right">
												<span class="text-muted">${fullnameGenerator(response.data.creator.name, response.data.creator.surname)}</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>`,
                            confirmButtonText: "Evet, güncelle",
                            cancelButtonText: "Hayır",
                            showCancelButton: true,
                            reverseButtons: true,
                            preConfirm: function(res) {
                                console.log("vacation_id: ", response.data.vacation_id);
                                UpdateVacation({
                                    uid: uid,
                                    vacation_id: response.data.vacation_id,
                                    update: {
                                        start: moment(startDate).format("YYYY-MM-DD"),
                                        end: endDate
                                            ? moment(endDate).format("YYYY-MM-DD")
                                            : moment(startDate).format("YYYY-MM-DD"),
                                        day: day ? parseFloat(day) : 1,
                                        no_cost: no_cost,
                                        note: note,
                                        daily_amount: daily_amount ? daily_amount.replace(",", ".") : null
                                    }
                                }).then(response => {
                                    if (response) {
                                        const status = response.status;
                                        setTimeout(() => this.reload(), 1000);
                                    }
                                });
                            }.bind(this)
                        });
                    }
                }
                this.setState({ loadingButton: false });
            });
        } else {
            let formErrors = { ...this.state.formErrors };

            formErrors.startDate = startDate ? "" : "is-invalid";
            formErrors.endDate = endDate ? "" : "is-invalid";
            formErrors.day = day ? "" : "is-invalid";
            formErrors.daily_amount = no_cost === 1 ? (daily_amount ? "" : "is-invalid") : "";

            this.setState({ formErrors });
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        console.log(value);
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "day":
                formErrors.day = value ? "" : "is-invalid";
                break;
            case "daily_amount":
                formErrors.daily_amount = value ? "" : "is-invalid";
                break;
            default:
                break;
        }
        if (name === "daily_amount") {
            this.setState({ [name]: value === "0,00" ? null : value });
        } else {
            this.setState({ [name]: value });
        }

        this.setState({ formErrors });
    };

    handleDate = (date, name) => {
        let formErrors = { ...this.state.formErrors };
        if (name === "startDate") {
            this.setState({
                endDate: null,
                day: null
            });
        } else if (name === "endDate") {
            const start = moment(this.state.startDate, "YYYY-MM-DD");
            const end = moment(date, "YYYY-MM-DD");
            const duration = moment.duration(end.diff(start));
            this.setState({
                day: duration.days() + 1
            });
        }

        switch (name) {
            case "startDate":
                formErrors.startDate = date ? "" : "is-invalid";
                break;
            case "endDate":
                formErrors.endDate = date ? "" : "is-invalid";
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: date });
    };

    handleRadio = e => {
        const { name, value } = e.target;
        this.setState({ [name]: parseInt(value) });

        if (value === "0") this.setState({ daily_amount: null });

        this.fieldMasked();
    };

    renderVacationList = to => {
        try {
            const { uid } = this.state;
            this.setState({ loadingData: true });
            ListVacations(
                {
                    uid: uid,
                    to: to
                },
                "employee"
            ).then(response => {
                console.log(response);
                if (response) {
                    const status = response.status;
                    if (status.code === 1020) this.setState({ list: response.data });
                }

                this.setState({ loadingData: false });
            });
        } catch (e) {}
    };

    render() {
        const {
            startDate,
            endDate,
            day,
            no_cost,
            note,
            daily_amount,
            data,
            loadingButton,
            list,
            loadingData,
            formErrors
        } = this.state;
        return (
            <div
                className="modal fade employeeActionModal"
                id="vacationModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <nav className="employeeActionNav">
                                <div className="nav nav-tabs" id="vacation-tab" role="tablist">
                                    <a
                                        className="nav-item nav-link active"
                                        id="vacation-create-tab"
                                        data-toggle="tab"
                                        href="#vacation-create"
                                        role="tab"
                                        aria-controls="nav-home"
                                        aria-selected="true">
                                        <i className="fa fa-coffee mr-2" />
                                        İzin Yaz
                                    </a>
                                    <a
                                        onClick={() => this.renderVacationList(this.props.data.uid)}
                                        className="nav-item nav-link"
                                        id="vacation-past-tab"
                                        data-toggle="tab"
                                        href="#vacation-past"
                                        role="tab"
                                        aria-controls="nav-profile"
                                        aria-selected="false">
                                        <i className="fa fa-list-ul mr-2" />
                                        İzinleri
                                    </a>
                                </div>
                            </nav>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="tab-content" id="nav-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="vacation-create"
                                role="tabpanel"
                                aria-labelledby="vacation-create-tab">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="modal-body">
                                        <div className={`dimmer ${loadingButton ? "active" : ""}`}>
                                            <div className="loader" />
                                            <div className="dimmer-content">
                                                <div className="form-group">
                                                    <label className="form-label">Personel Bilgisi:</label>
                                                    <div className="form-control-plaintext">
                                                        <Link to={`/app/persons/employees/detail/${data.uid}`}>
                                                            {data.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row gutters-xs">
                                                        <div className="col-6">
                                                            <label className="form-label">
                                                                Başlangıç Tarihi
                                                                <span className="form-required">*</span>
                                                            </label>
                                                            <DatePicker
                                                                autoComplete="off"
                                                                selected={startDate}
                                                                selectsStart
                                                                startDate={startDate}
                                                                endDate={endDate}
                                                                name="startDate"
                                                                locale="tr"
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={date => this.handleDate(date, "startDate")}
                                                                className={`form-control ${formErrors.startDate}`}
                                                            />
                                                        </div>

                                                        <div className="col-6">
                                                            <label className="form-label">
                                                                Bitiş Tarihi
                                                                <span className="form-required">*</span>
                                                            </label>
                                                            <DatePicker
                                                                autoComplete="off"
                                                                selected={endDate}
                                                                selectsEnd
                                                                startDate={startDate}
                                                                minDate={startDate}
                                                                endDate={endDate}
                                                                name="endDate"
                                                                locale="tr"
                                                                dateFormat="dd/MM/yyyy"
                                                                onChange={date => this.handleDate(date, "endDate")}
                                                                className={`form-control ${formErrors.endDate}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="day" className="form-label">
                                                        Gün Sayısı
                                                        <span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        id="day"
                                                        name="day"
                                                        className={`form-control ${formErrors.day}`}
                                                        type="number"
                                                        min="0.5"
                                                        step="0.5"
                                                        value={day || ""}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Ücretli/Ücretsiz
                                                        <span className="form-required">*</span>
                                                        <span
                                                            className="form-help ml-1"
                                                            data-toggle="popover"
                                                            data-placement="top"
                                                            data-content="<p><b>Ücretli İzin: </b>Personel çalışmadığı halde kendisine normal ücreti ödenir.</p>
														<p><b>Ücretsiz İzin: </b>Personel izinli olduğu süre için kendisine herhangi bir ücret ödemesi yapılmaz.</p>"
                                                            data-original-title=""
                                                            title="">
                                                            ?
                                                        </span>
                                                    </label>
                                                    <div className="selectgroup w-100">
                                                        <label className="selectgroup-item">
                                                            <input
                                                                type="radio"
                                                                name="no_cost"
                                                                value="0"
                                                                className="selectgroup-input"
                                                                checked={no_cost === 0 ? true : false}
                                                                onChange={this.handleRadio}
                                                            />
                                                            <span className="selectgroup-button">Ücretli</span>
                                                        </label>
                                                        <label className="selectgroup-item">
                                                            <input
                                                                type="radio"
                                                                name="no_cost"
                                                                value="1"
                                                                className="selectgroup-input"
                                                                checked={no_cost === 1 ? true : false}
                                                                onChange={this.handleRadio}
                                                            />
                                                            <span className="selectgroup-button">Ücretsiz</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div
                                                    className="form-group"
                                                    style={{ display: no_cost === 1 ? "block" : "none" }}>
                                                    <label htmlFor="daily_amount" className="form-label">
                                                        Günlük Kesinti Tutarı
                                                        <span className="form-required">*</span>
                                                    </label>
                                                    <input
                                                        id="daily_amount"
                                                        name="daily_amount"
                                                        className={`form-control ${formErrors.daily_amount}`}
                                                        type="text"
                                                        value={daily_amount || ""}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Not
                                                        <span className="form-label-small">
                                                            {note ? note.length : 0}/255
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        name="note"
                                                        onChange={this.handleChange}
                                                        rows="1"
                                                        maxLength="255"
                                                        placeholder="Not.."></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="submit"
                                            className={`btn btn-primary ${
                                                loadingButton ? "btn-loading disabled" : ""
                                            }`}>
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="vacation-past"
                                role="tabpanel"
                                aria-labelledby="vacation-past-tab">
                                <div className="modal-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-outline table-vcenter text-nowrap text-center">
                                            <thead>
                                                <tr>
                                                    <th className="w-1">Başlangıç Tarihi</th>
                                                    <th className="w-1">Bitiş Tarihi</th>
                                                    <th className="w-1">Gün Sayısı</th>
                                                    <th className="w-1">Günlük Kesinti Ücreti</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.length > 0
                                                    ? list.map((el, key) => {
                                                          return (
                                                              <tr key={key.toString()}>
                                                                  <td>{formatDate(el.start, "LL")}</td>
                                                                  <td>{formatDate(el.end, "LL")}</td>
                                                                  <td>{el.day}</td>
                                                                  <td>{formatMoney(el.daily_amount)}</td>
                                                              </tr>
                                                          );
                                                      })
                                                    : noRow()}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Vacation;
