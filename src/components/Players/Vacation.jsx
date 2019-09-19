import React, { Component } from "react";
import { DetailPlayer, ListPlayerFees } from "../../services/Player";
import { fullnameGenerator, formatDate, formatMoney, nullCheck } from "../../services/Others";
import { UpdatePaymentFee, ListVacations, DeleteVacation } from "../../services/PlayerAction";
import { Link } from "react-router-dom";
import Vacation from "../PlayerAction/Vacation";
import GroupChange from "../PlayerAction/GroupChange";
import Tabs from "../../components/Players/Tabs";
import ActionButton from "../../components/Players/ActionButton";
import moment from "moment";
import "moment/locale/tr";
import { Toast, showSwal } from "../Alert";

const noRow = loading => (
	<tr style={{ height: 80 }}>
		<td colSpan="6" className="text-center text-muted font-italic">
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

const vacationStatus = {
	3: { type: "danger", text: "İptal" },
	1: { type: "success", text: "Aktif" },
	2: { type: "warning", text: "Tamamlandı" }
};

const statusType = {
	0: "bg-danger",
	1: "bg-green",
	2: "bg-azure",
	3: "bg-indigo"
};

export class VacationPlayer extends Component {
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
		this.renderVacationList();
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

	renderVacationList = () => {
		try {
			const { uid, to } = this.state;
			this.setState({ loadingData: true });
			ListVacations(
				{
					uid: uid,
					to: to
				},
				"player"
			).then(response => {
				console.log(response);
				if (response) {
					const status = response.status;
					if (status.code === 1020) this.setState({ vacations: response.data.reverse() });
				}

				this.setState({ loadingData: false });
			});
		} catch (e) {}
	};

	reload = () => {
		setTimeout(() => {
			const current = this.props.history.location.pathname;
			this.props.history.replace(`/`);
			setTimeout(() => {
				this.props.history.replace(current);
			});
		}, 1000);
	};

	deleteVacation = (vid, key) => {
		try {
			const { uid, name, surname } = this.state;
			showSwal({
				type: "warning",
				title: "Emin misiniz?",
				html: `<b>${fullnameGenerator(
					name,
					surname
				)}</b> adlı öğrencinin <b>#${vid}</b> nolu iznini iptal etmek istediğinize emin misiniz?`,
				confirmButtonText: "Evet",
				cancelButtonText: "Hayır",
				cancelButtonColor: "#868e96",
				confirmButtonColor: "#cd201f",
				showCancelButton: true,
				reverseButtons: true
			}).then(result => {
				if (result.value) {
					DeleteVacation({
						uid: uid,
						vacation_id: vid
					}).then(response => {
						if (response) {
							const status = response.status;
							if (status.code === 1020) {
								Toast.fire({
									type: "success",
									title: "İşlem başarılı..."
								});
								this.reload();
							}
						}
					});
				}
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
			vacations,
			loading
		} = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Öğrenci Detay &mdash; İzin Geçmişi</h1>
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
									data-toggle="modal"
									data-target="#vacationModal"
									onClick={() =>
										this.setState({
											data: { name: fullnameGenerator(name, surname), uid: to }
										})
									}
									className="btn btn-sm btn-success ml-auto">
									İzin Oluştur
								</button>
							</div>
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover table-outline table-vcenter text-nowrap card-table text-center">
										<thead>
											<tr>
												<th className="w-1">Başlangıç Tarihi</th>
												<th className="w-1">Bitiş Tarihi</th>
												<th className="w-1">Gün Sayısı</th>
												<th className="w-1">Durum</th>
												<th className="w-1"></th>
											</tr>
										</thead>
										<tbody>
											{vacations
												? vacations.length > 0
													? vacations.map((el, key) => {
															return (
																<tr key={key.toString()}>
																	<td>{el.start}</td>
																	<td>{el.end}</td>
																	<td>{el.day}</td>
																	<td>
																		<span
																			className={`badge badge-${vacationStatus[el.status].type}`}>
																			{vacationStatus[el.status].text}
																		</span>
																	</td>
																	<td className="text-right">
																		<button
																			className="btn btn-sm btn-icon btn-secondary"
																			onClick={() =>
																				this.deleteVacation(
																					el.vacation_id,
																					key + 1
																				)
																			}
																			data-toggle="tooltip"
																			title="İptal et">
																			<i className="fe fe-x"></i>
																		</button>
																	</td>
																</tr>
															);
													  })
													: noRow()
												: noRow(true)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default VacationPlayer;
