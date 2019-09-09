import React, { Component } from "react";
import { ListPlayers } from "../../services/Player";
import { CreatePaymentFee, UpdatePaymentFee, ListFees } from "../../services/PlayerAction";
import { GetBudgets } from "../../services/FillSelect";
import { fullnameGenerator, getSelectValue } from "../../services/Others";
import { Toast, showSwal } from "../Alert";
import DatePicker, { registerLocale } from "react-datepicker";
import { withRouter } from "react-router-dom";
import Select, { components } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr";
import moment from "moment";
import Inputmask from "inputmask";
const $ = require("jquery");

registerLocale("tr", tr);

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

const customStyles = {
	control: styles => ({ ...styles, borderColor: "rgba(0, 40, 100, 0.12)", borderRadius: 3 })
};

const customStylesError = {
	control: styles => ({
		...styles,
		borderColor: "#cd201f",
		borderRadius: 3,
		":hover": { ...styles[":hover"], borderColor: "#cd201f" }
	})
};

const { Option } = components;
const ImageOption = props => (
	<Option {...props}>
		<span className="avatar avatar-sm mr-2" style={{ backgroundImage: `url(${props.data.image})` }} />
		{props.data.label}
	</Option>
);
const IconOption = props => (
	<Option {...props}>
		<span>
			<i
				className={`mr-2 fa fa-${props.data.type === 1 ? "university" : "briefcase"}`}
				style={{ backgroundImage: `url(${props.data.image})` }}
			/>
			{props.data.label}
			<div className="small text-muted">
				Bütçe: <b>{props.data.balance.format() + " ₺"}</b>
			</div>
		</span>
	</Option>
);

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
	);

const initialState = {
	fee_date: new Date(),
	paid_date: new Date(),
	fee: null,
	player: null,
	month: { label: moment().format("MMMM"), value: moment().format("M") },
	payment_type: 0,
	period: 1,
	loadingButton: ""
};

export class Payment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: this.props.match.params.uid,
			...initialState,
			formErrors: {
				player: "",
				fee_date: "",
				paid_date: ""
			},
			loadingData: true,
			loadingPast: true,
			pastData: null,
			budget: null,
			select: {
				employees: null,
				budgets: null,
				months: null
			}
		};
	}

	fieldMasked = () => {
		try {
			const elemArray = {
				fee: $("[name=fee]")
			};
			Inputmask({
				alias: "try",
				...InputmaskDefaultOptions
			}).mask(elemArray.fee);
		} catch (e) {}
	};

	componentDidMount() {
		const { to } = this.state;
		this.fieldMasked();
		this.generateMonthList();
		this.listPlayers();
		this.listBudgets();
		if (to) this.listPastPayment(to);
		else this.setState({ pastData: [] });
	}

	handleSubmit = e => {
		try {
			e.preventDefault();
			const { uid, to, player, fee, neccesary_fee, paid_date, period, month, payment_type, budget } = this.state;
			let required = { ...this.state };
			delete required.pastData;
			if (formValid(required)) {
				this.setState({ loadingButton: "btn-loading" });
				CreatePaymentFee({
					uid: uid,
					to: player.value,
					fee: parseFloat(neccesary_fee),
					amount: parseFloat(fee.replace(",", ".")),
					required_payment_date: moment(player.required_payment_date)
						.month(parseInt(month.value) - 1)
						.format("YYYY-MM-DD"),
					payment_end_date: moment(player.required_payment_date)
						.month(parseInt(month.value) - 1)
						.add(period, "month")
						.format("YYYY-MM-DD"),
					paid_date: moment(paid_date).format("YYYY-MM-DD"),
					payment_type: payment_type,
					budget_id: budget.value
				}).then(response => {
					if (response) {
						const status = response.status;
						if (status.code === 1020) {
							Toast.fire({
								type: "success",
								title: "İşlem başarılı..."
							});
						}
					}
					this.setState({ loadingButton: "" });
					this.listPastPayment(to);
				});
			} else {
				console.error("ERROR FORM");
				let formErrors = { ...this.state.formErrors };
				formErrors.fee = fee ? "" : "is-invalid";
				formErrors.player = player ? "" : "is-invalid";
				formErrors.paid_date = paid_date ? "" : "is-invalid";
				formErrors.budget = budget ? false : true;
				this.setState({ formErrors });
			}
		} catch (e) {}
	};

	handleChange = e => {
		try {
			const { name, value } = e.target;
			const { player, fee } = this.state;
			let formErrors = { ...this.state.formErrors };
			switch (name) {
				case "fee":
					formErrors.fee = value ? "" : "is-invalid";
					this.setState({ [name]: value === "0,00" ? null : value });
					break;
				case "period":
					this.setState({
						[name]: value,
						fee: player
							? player.fee
								? (player.fee * parseInt(value)).format().replace(".", "")
								: null
							: null,
						neccesary_fee: player
							? player.fee
								? (player.fee * parseInt(value)).format().replace(".", "")
								: null
							: null
					});
					break;
				default:
					this.setState({ [name]: value });
					break;
			}

			this.setState({ formErrors });
		} catch (e) {}
	};

	handleDate = (date, name) => {
		let formErrors = { ...this.state.formErrors };
		switch (name) {
			case "paid_date":
				formErrors[name] = date ? "" : "is-invalid";
				break;
			default:
				break;
		}

		this.setState({ formErrors, [name]: date });
	};

	handleSelect = (value, name) => {
		try {
			let formErrors = { ...this.state.formErrors };
			formErrors[name] = value ? false : true;
			switch (name) {
				case "player":
					{
						this.setState({
							...initialState,
							pastData: null,
							[name]: value,
							fee: value.fee
								? value.fee
										.format()
										.toString()
										.split(".")
										.join("")
								: null,
							neccesary_fee: value.fee
								? value.fee
										.format()
										.toString()
										.split(".")
										.join("")
								: null,
							to: value.value
						});
						this.listPastPayment(value.value);
					}
					break;
				default:
					this.setState({
						[name]: value
					});
					break;
			}
			this.setState({ formErrors });
		} catch (e) {}
	};

	listPlayers = () => {
		try {
			const { uid } = this.state;
			const to = this.props.match.params.uid;
			this.setState({ loadingData: true });
			ListPlayers(uid).then(response => {
				if (response) {
					const status = response.status;
					if (status.code === 1020) {
						const data = response.data.filter(x => x.is_trial === 0);
						const selectData = [];
						data.map(el => {
							selectData.push({
								value: el.uid,
								label: fullnameGenerator(el.name, el.surname),
								image: el.image,
								fee: el.fee,
								required_payment_date: el.start_date
							});
						});

						const getFee = to ? getSelectValue(selectData, to, "value").fee : null;

						this.setState(prevState => ({
							select: {
								...prevState.select,
								players: selectData
							},
							loadingData: false,
							player: to ? getSelectValue(selectData, to, "value") : initialState.player,
							fee: to
								? getFee
									? getFee
											.format()
											.toString()
											.split(".")
											.join("")
									: null
								: null,
							neccesary_fee: to
								? getFee
									? getFee
											.format()
											.toString()
											.split(".")
											.join("")
									: null
								: null
						}));
					}
				}
			});
		} catch (e) {}
	};

	listBudgets = () => {
		try {
			GetBudgets().then(response => {
				this.setState(prevState => ({
					select: {
						...prevState.select,
						budgets: response
					},
					budget: response.find(x => x.default === 1)
				}));
			});
		} catch (e) {}
	};

	listPastPayment = to => {
		const { uid } = this.state;
		ListFees({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					this.setState({ pastData: response.data.reverse() });
				}
			}
		});
	};

	generateMonthList = () => {
		const months = moment.months();
		const monthsForSelect = [];
		months.map(el => {
			monthsForSelect.push({
				value: moment()
					.month(el)
					.format("M"),
				label: el
			});
		});

		console.log("monthsForSelect", monthsForSelect);

		this.setState(prevState => ({
			month: { label: moment().format("MMMM"), value: moment().format("M") },
			select: {
				...prevState.select,
				months: monthsForSelect
			}
		}));
	};

	formatPaidDate = date => {
		try {
			const splitDate = date.split(",");
			const firstDate = moment(splitDate[0]);
			const secondDate = moment(splitDate[1]);
			const diff = Math.ceil(moment(secondDate).diff(moment(firstDate), "months", true));

			return `${firstDate.format("MMMM")} ${firstDate.format("YYYY")} - ${secondDate.format(
				"MMMM"
			)} ${secondDate.format("YYYY")} (${diff} aylık)`;
		} catch (e) {}
	};

	completeFee = data => {
		const { uid, to, player, fee, paid_date, period, month, payment_type, budget } = this.state;
		if (fee === null) {
			Toast.fire({
				type: "error",
				title: "Tanımsız ödeme bilgisi..."
			});
			return null;
		}
		const totalDept = data.fee - data.amount;
		showSwal({
			type: "question",
			title: "Ödeme Tutarı",
			html: `<b>${
				player.label
			}</b> adlı öğrencinin, <b>${totalDept.format()} ₺</b> tutarında borcu bulunmaktadır.<hr>Ne kadarını ödemek istiyorsunuz?`,
			input: "number",
			inputValue: totalDept,
			inputAttributes: {
				min: 0,
				max: totalDept
			},
			inputValidator: value => {
				return new Promise(resolve => {
					if (value > 0 && value <= totalDept) {
						showSwal({
							type: "info",
							title: "Bilgi",
							html: `<b>${
								player.label
							}</b> adlı öğrencinin, <b>${totalDept.format()} ₺</b> tutarındaki borcu için toplamda <b>${parseFloat(
								value
							).format()} ₺</b> ödeme yapılacaktır.<br>
			Onaylıyor musunuz?`,
							confirmButtonText: "Onaylıyorum",
							cancelButtonText: "İptal",
							confirmButtonColor: "#467fcf",
							cancelButtonColor: "#868e96",
							showCancelButton: true,
							reverseButtons: true
						}).then(re => {
							if (re.value) {
								UpdatePaymentFee({
									uid: uid,
									to: player.value,
									fee_id: data.fee_id,
									amount: parseFloat(value.replace(",", ".")),
									paid_date: moment().format("YYYY-MM-DD"),
									payment_type: payment_type,
									budget_id: budget.value
								}).then(response => {
									if (response) {
										this.listPastPayment(to);
									}
								});
							}
						});
					} else {
						resolve("Hatalı değer!");
					}
				});
			}
		});
	};

	renderPlayerFee = () => {
		const { player } = this.state;
		return player ? (player.fee ? player.fee.format() + " ₺" : "—") : "—";
	};

	renderFeeDay = () => {
		const { player } = this.state;
		return player
			? player.required_payment_date
				? "Her ayın " + moment(player.required_payment_date).format("D") + ". günü"
				: "—"
			: "—";
	};

	renderNeccesaryFeeAmount = () => {
		const { player, period } = this.state;
		return player ? (player.fee ? (player.fee * parseInt(period || 1)).format() + " ₺" : "—") : "—";
	};

	render() {
		const {
			fee,
			budget,
			paid_date,
			player,
			month,
			period,
			select,
			formErrors,
			pastData,
			loadingData,
			loadingPast,
			loadingButton
		} = this.state;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenciler &mdash; Ödeme Al</h1>
					<div className="col" />
					<div className="col-auto px-0" />
				</div>

				<form className="row" onSubmit={this.handleSubmit}>
					<div className="col-lg-7 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">
									<i className="fa fa-hand-holding-usd mr-2" /> Ödeme Al
								</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loadingData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="row mb-4">
											<div className="col-auto">
												<span
													className="avatar avatar-xxl"
													style={{
														backgroundImage: `url(${player ? player.image : null})`
													}}
												/>
											</div>
											<div className="col">
												<div className="form-group">
													<label className="form-label">
														Öğrenci
														<span className="form-required">*</span>
													</label>
													<Select
														value={player}
														onChange={val => this.handleSelect(val, "player")}
														options={select.players}
														name="player"
														placeholder="Öğrenci Seç..."
														styles={
															formErrors.player === true
																? customStylesError
																: customStyles
														}
														isSearchable={true}
														autoSize
														isDisabled={select.players ? false : true}
														noOptionsMessage={value => `"${value.inputValue}" bulunamadı`}
														components={{ Option: ImageOption }}
													/>
												</div>
											</div>
										</div>

										<div className={`dimmer ${player ? "" : "active"}`}>
											<div className="dimmer-content">
												<div className="row">
													<div className="col-sm-12 col-md-12 col-lg-6">
														<div className="form-group">
															<label className="form-label">Aidat Bilgisi</label>
															<div className="form-control-plaintext">
																{this.renderPlayerFee()}
															</div>
														</div>
													</div>

													<div className="col-sm-12 col-md-12 col-lg-6">
														<div className="form-group">
															<label className="form-label">Ödeme Günü</label>
															<div className="form-control-plaintext">
																{this.renderFeeDay()}
															</div>
														</div>
													</div>

													<div className="col-10">
														<div className="form-group">
															<label className="form-label">
																Ödeme Yapılacak Ay
																<span className="form-required">*</span>
															</label>
															<Select
																value={month}
																onChange={val => this.handleSelect(val, "month")}
																options={select.months}
																name="month"
																placeholder="Ay Seç..."
																styles={customStyles}
																isSearchable={true}
																autoSize
																isDisabled={select.months ? false : true}
																noOptionsMessage={value =>
																	`"${value.inputValue}" bulunamadı`
																}
															/>
														</div>
													</div>

													<div className="col-2">
														<div className="form-group">
															<label className="form-label">Dönem</label>
															<input
																name="period"
																className="form-control"
																type="number"
																min="1"
																max="24"
																value={period || ""}
																onChange={this.handleChange}
															/>
														</div>
													</div>

													<div className="col-12">
														<div className="alert alert-warning p-3">
															<strong className="mr-2">Ödemesi Gereken Tutar:</strong>
															{this.renderNeccesaryFeeAmount()}
														</div>
													</div>

													<div className="col-12">
														<div className="form-group">
															<label className="form-label">
																Ödenen Tutar
																<span className="form-required">*</span>
															</label>
															<input
																name="fee"
																className={`form-control ${formErrors.fee}`}
																type="text"
																value={fee || ""}
																onChange={this.handleChange}
															/>
														</div>
													</div>

													<div className="col-sm-12 col-md-12 col-lg-6">
														<div className="form-group ">
															<label className="form-label">
																Ödenen Tarih
																<span className="form-required">*</span>
															</label>
															<DatePicker
																selected={paid_date}
																selectsStart
																startDate={paid_date}
																name="paid_date"
																locale="tr"
																dateFormat="dd/MM/yyyy"
																onChange={date => this.handleDate(date, "paid_date")}
																className={`form-control ${formErrors.paid_date}`}
															/>
														</div>
													</div>

													<div className="col-sm-12 col-md-12 col-lg-6">
														<label className="form-label">
															Kasa Hesabı
															<span className="form-required">*</span>
														</label>
														<Select
															value={budget}
															onChange={val => this.handleSelect(val, "budget")}
															options={select.budgets}
															name="budget"
															placeholder="Kasa Seç..."
															styles={
																formErrors.budget === true
																	? customStylesError
																	: customStyles
															}
															isSearchable={true}
															autoSize
															isDisabled={select.budgets ? false : true}
															noOptionsMessage={value =>
																`"${value.inputValue}" bulunamadı`
															}
															components={{ Option: IconOption }}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer text-right">
								<button
									className={`btn btn-success ${loadingButton} ${
										player ? "" : "disabled disable-overlay"
									}`}>
									Ödeme Al
								</button>
							</div>
						</div>
					</div>

					<div className="col-lg-5 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header pr-3">
								<h3 className="card-title">
									<i className="fa fa-history mr-2" /> Geçmiş İşlemler
								</h3>
							</div>
							<div className="card-body">
								{pastData ? (
									pastData.length > 0 ? (
										<ul className="timeline mb-0">
											{pastData.map((el, key) => {
												if (el.fee > el.amount) {
													return (
														<li className="timeline-item" key={key.toString()}>
															<div className="timeline-badge bg-warning" />
															<div>
																<strong>{el.fee.format() + " ₺ "}</strong>
																ödemenin, <br />
																<strong className="text-blue">
																	{el.amount.format() + " ₺ "}
																</strong>
																ödemesi yapıldı.
																<br />
																<strong className="text-red">
																	{(el.fee - el.amount).format() + " ₺ "}
																</strong>
																borcu kaldı.
																<div className="small text-muted">
																	{this.formatPaidDate(el.month)}
																</div>
															</div>
															<div className="timeline-time">
																<button
																	onClick={() => this.completeFee(el)}
																	type="button"
																	data-toggle="tooltip"
																	title="Ödemeyi Tamamla"
																	className="btn btn-sm btn-primary btn-icon p-1">
																	<i className="fe fe-plus-circle"></i>
																</button>
															</div>
														</li>
													);
												} else {
													return (
														<li className="timeline-item" key={key.toString()}>
															<div className="timeline-badge bg-success" />
															<div>
																<strong>{el.amount.format() + " ₺ "}</strong>
																ödendi
																<div className="small text-muted">
																	{this.formatPaidDate(el.month)}
																</div>
															</div>
															<div className="timeline-time">
																<i className="fa fa-check-circle text-success"></i>
															</div>
														</li>
													);
												}
											})}
										</ul>
									) : (
										noRow()
									)
								) : (
									noRow(true)
								)}
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default withRouter(Payment);
