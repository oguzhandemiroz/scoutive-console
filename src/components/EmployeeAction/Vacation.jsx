import React, { Component } from "react";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import { CreateVacation } from "../../services/EmployeeAction";
import moment from "moment";
const $ = require("jquery");

registerLocale("tr", tr);

const initialState = {
	day: null,
	no_cost: 0
};

export class Vacation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			startDate: new Date(),
			data: {},
			...initialState,
			loadingButton: false
		};
	}

	componentDidMount() {
		if (this.props.visible)
			$("#vacationModal").modal({
				keyboard: false,
				backdrop: "static"
			});
		this.setState({ ...this.props });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible)
			$("#vacationModal").modal({
				keyboard: false,
				backdrop: "static"
			});
		this.setState({ ...nextProps });
	}

	handleSubmit = e => {
		e.preventDefault();
		const { uid, day, startDate, endDate, no_cost } = this.state;
		const { data } = this.props;

		this.setState({ loadingButton: true });
		CreateVacation(
			{
				uid: uid,
				to: data.uid,
				start: moment(startDate).format("YYYY-MM-DD"),
				end: moment(endDate).format("YYYY-MM-DD"),
				day: parseFloat(day),
				no_cost: no_cost
			},
			"employee"
		).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					console.log(response);
				}
			}
			this.setState({ loadingButton: false });
		});
	};

	handleChange = e => {
		const { name, value } = e.target;

		this.setState({ [name]: value });
	};

	handleDate = (date, name) => {
		if (name === "startDate") {
			this.setState({
				endDate: null
			});
		}
		this.setState({
			[name]: date
		});
	};

	handleRadio = e => {
		const { name, value } = e.target;
		this.setState({ [name]: parseInt(value) });
	};

	render() {
		const { startDate, endDate, day, no_cost, data, loadingButton } = this.state;
		return (
			<div
				className="modal fade"
				id="vacationModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								<i className="fa fa-coffee mr-2" />
								İzin Yaz
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close" />
						</div>

						<form onSubmit={this.handleSubmit}>
							<div className="modal-body">
								<div className={`dimmer ${loadingButton ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="form-group">
											<label className="form-label">Personel Bilgisi:</label>
											<div className="form-control-plaintext">
												<Link to={`/app/employees/detail/${data.uid}`}>{data.name}</Link>
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
														selected={startDate}
														selectsStart
														startDate={startDate}
														endDate={endDate}
														name="startDate"
														locale="tr"
														dateFormat="dd/MM/yyyy"
														onChange={date => this.handleDate(date, "startDate")}
														className="form-control"
													/>
												</div>

												<div className="col-6">
													<label className="form-label">
														Bitiş Tarihi
														<span className="form-required">*</span>
													</label>
													<DatePicker
														selected={endDate}
														selectsEnd
														startDate={startDate}
														minDate={startDate}
														endDate={endDate}
														name="endDate"
														locale="tr"
														dateFormat="dd/MM/yyyy"
														onChange={date => this.handleDate(date, "endDate")}
														className="form-control"
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
												className="form-control"
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
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="submit"
									className={`btn btn-primary ${loadingButton ? "btn-loading disabled" : ""}`}>
									Kaydet
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Vacation;
