import React, { Component } from "react";
import { DetailPlayer, ListPlayerFees } from "../../services/Player";
import { fullnameGenerator, formatDate, formatMoney, nullCheck } from "../../services/Others";
import { CreatePaymentFee, UpdatePaymentFee, ListFees } from "../../services/PlayerAction";
import { GetBudgets } from "../../services/FillSelect";
import { Link } from "react-router-dom";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import Tabs from "../../components/Players/Tabs";
import ActionButton from "../../components/Players/ActionButton";
import moment from "moment";
import "moment/locale/tr";
import { Toast, showSwal } from "../Alert";

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
	);

const statusType = {
	0: "bg-danger",
	1: "bg-green",
	2: "bg-azure",
	3: "bg-indigo"
};

export class FeeDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			data: {},
			loading: "active"
		};
	}

	componentDidMount() {
		this.getPlayerDetail();
		this.listPlayerFees();
		this.listBudgets();
	}

	getPlayerDetail = () => {
		const { uid, to } = this.state;
		DetailPlayer({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				const data = response.data;
				if (status.code === 1020) {
					delete data.uid;
					this.setState({ ...data });
				}
				this.setState({ loading: "" });
			}
		});
	};

	listPlayerFees = () => {
		const { uid, to } = this.state;
		this.setState({ loading: "active" });
		ListPlayerFees({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				const data = response.data;
				if (status.code === 1020) {
					this.setState({ fees: data.reverse(), loading: "" });
				}
			}
		});
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
		const { uid, to, name, surname, fee, paid_date, period, month, payment_type, budget } = this.state;
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
			html: `<b>${fullnameGenerator(
				name,
				surname
			)}</b> adlı öğrencinin, <b>${totalDept.format(2, 3, '.', ',')} ₺</b> tutarında borcu bulunmaktadır.<hr>Ne kadarını ödemek istiyorsunuz?`,
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
							html: `<b>${fullnameGenerator(
								name,
								surname
							)}</b> adlı öğrencinin, <b>${totalDept.format(2, 3, '.', ',')} ₺</b> tutarındaki borcu için toplamda <b>${parseFloat(
								value
							).format(2, 3, '.', ',')} ₺</b> ödeme yapılacaktır.<br>
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
									to: to,
									fee_id: data.fee_id,
									amount: parseFloat(value.replace(",", ".")),
									paid_date: moment().format("YYYY-MM-DD"),
									payment_type: payment_type,
									budget_id: budget.value
								}).then(response => {
									if (response) {
										this.listPlayerFees();
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

	listBudgets = () => {
		try {
			GetBudgets().then(response => {
				this.setState(prevState => ({
					select: {
						...prevState.select,
						budgets: response
					},
					budget: response.find(x => x.default === 1) || null
				}));
			});
		} catch (e) {}
	};

	render() {
		const {
			to,
			name,
			surname,
			security_id,
			position,
			fee,
			is_scholarship,
			point,
			branch,
			start_date,
			end_date,
			email,
			phone,
			group,
			image,
			data,
			is_trial,
			status,
			fees,
			loading
		} = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Detay &mdash; Aidat Geçmişi</h1>
					<div className="col" />
					<div className="col-auto px-0">
						<Tabs match={match} to={to} />
					</div>
				</div>

				<div className="row">
					<div className="col-lg-4 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">Genel Bilgiler</h3>
							</div>
							<div className="card-body">
								<div className={`dimmer ${loading}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="media mb-5">
											<span
												className="avatar avatar-xxl mr-4"
												style={{ backgroundImage: `url(${image})` }}>
												<span
													className={`avatar-sm avatar-status ${
														is_trial ? statusType[3] : statusType[status]
													}`}
												/>
											</span>
											<div className="media-body">
												<h4 className="m-0">{fullnameGenerator(name, surname)}</h4>
												<p className="text-muted mb-0">{nullCheck(position, "—")}</p>
												<ul className="social-links list-inline mb-0 mt-2">
													<li className="list-inline-item">
														<a
															disabled
															className="employee_email"
															href={
																email
																	? `mailto:${nullCheck(email, "—")}`
																	: "javascript:void(0);"
															}
															data-original-title={nullCheck(email, "—")}
															data-toggle="tooltip">
															<i className="fa fa-envelope" />
														</a>
													</li>
													<li className="list-inline-item">
														<a
															className="employee_phone"
															href={
																email
																	? `tel:${nullCheck(phone, "—")}`
																	: "javascript:void(0);"
															}
															data-original-title={nullCheck(phone, "—")}
															data-toggle="tooltip">
															<i className="fa fa-phone" />
														</a>
													</li>
												</ul>
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">T.C. Kimlik Numarası</label>
											<div className="form-control-plaintext">{security_id}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Genel Puan</label>
											<div className="form-control-plaintext">{point}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Grup</label>
											<div className="form-control-plaintext">
												{group ? (
													<Link to={`/app/groups/detail/${group.group_id}`}>
														{group.name}
													</Link>
												) : (
													<div className="form-control-plaintext">
														{nullCheck(group, "—")}
													</div>
												)}
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">Aidat</label>
											<div className="form-control-plaintext">
												{is_scholarship ? "BURSLU" : formatMoney(fee)}
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">Branş</label>
											<div className="form-control-plaintext">{nullCheck(branch, "—")}</div>
										</div>

										<div className="form-group">
											<label className="form-label">Okula Başlama Tarihi</label>
											<div className="form-control-plaintext">{formatDate(start_date)}</div>
										</div>

										{end_date ? (
											<div className="form-group">
												<label className="form-label">Okuldan Ayrılma Tarihi</label>
												<div className="form-control-plaintext">{formatDate(start_date)}</div>
											</div>
										) : null}
									</div>
								</div>
							</div>
							<div className="card-footer">
								<ActionButton
									vacationButton={data =>
										this.setState({
											data: data
										})
									}
									groupChangeButton={data =>
										this.setState({
											data: data
										})
									}
									history={this.props.history}
									dropdown={false}
									data={{
										to: to,
										name: fullnameGenerator(name, surname),
										is_trial: is_trial,
										status: status,
										group: group
									}}
								/>

								<Vacation data={data} history={this.props.history} />
								<GroupChange data={data} history={this.props.history} />
							</div>
						</div>
					</div>

					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">İzin Geçmişi</h3>
								<button
									onClick={() => this.props.history.push("/app/players/payment/" + to)}
									className="btn btn-sm btn-success ml-auto">
									Aidat Öde
								</button>
							</div>
							<div className="card-body">
								{fees ? (
									fees.length > 0 ? (
										<ul className="timeline mb-0">
											{fees.map((el, key) => {
												if (el.fee > el.amount) {
													return (
														<li className="timeline-item" key={key.toString()}>
															<div className="timeline-badge bg-warning" />
															<div>
																<strong>{el.fee.format(2, 3, '.', ',') + " ₺ "}</strong>
																ödemenin, <br />
																<strong className="text-blue">
																	{el.amount.format(2, 3, '.', ',') + " ₺ "}
																</strong>
																ödemesi yapıldı.
																<br />
																<strong className="text-red">
																	{(el.fee - el.amount).format(2, 3, '.', ',') + " ₺ "}
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
																<strong>{el.amount.format(2, 3, '.', ',') + " ₺ "}</strong>
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
				</div>
			</div>
		);
	}
}

export default FeeDetail;
