import React, { Component } from "react";
import { DetailEmployee, DeleteEmployee } from "../../services/Employee.jsx";
import { ListVacations, DeleteVacation } from "../../services/EmployeeAction";
import { Vacation as ModalVacation } from "../EmployeeAction/Vacation";
import { Link } from "react-router-dom";
import { showSwal, Toast } from "../Alert.jsx";
import Tabs from "../../components/Employees/Tabs";
const CryptoJS = require("crypto-js");

const vacationStatus = {
	0: { type: "danger", text: "İptal" },
	1: { type: "success", text: "Onaylandı" },
	2: { type: "warning", text: "Kullanıldı" }
};

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

export class Vacation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			name: "—",
			email: "—",
			phone: "—",
			securityNo: "—",
			position: "—",
			branch: "—",
			image: "",
			salary: null,
			showSalary: false,
			onLoadedData: false,
			list: [],
			data: {},
			vacation: false
		};
	}

	componentDidMount() {
		const { uid, to } = this.state;
		DetailEmployee({
			uid: uid,
			to: to
		}).then(response => {
			if (response !== null) {
				const status = response.status;
				const stateData = {};
				stateData.body = {};
				if (status.code === 1020) {
					const data = response.data;
					stateData.name = `${data.name || ""} ${data.surname || ""}`;
					stateData.position = data.position || "—";
					stateData.securityNo = data.security_id || "—";
					stateData.phone = data.phone || "—";
					stateData.email = data.email || "—";
					stateData.branch = data.branch || "—";
					stateData.image = data.image || "—";
					stateData.salary = data.salary ? "∙∙∙∙∙∙" : null;
					stateData.secretSalary = data.salary
						? CryptoJS.AES.encrypt(data.salary.format(), "scSecretSalary").toString()
						: null;
					stateData.onLoadedData = true;

					this.setState({ ...stateData });
				}
			}
		});
		this.renderVacationList();
	}

	renderVacationList = () => {
		try {
			const { uid, to } = this.state;
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

	handleSalary = () => {
		const { secretSalary, showSalary } = this.state;
		const toggleShow = showSalary;
		this.setState({ showSalary: !toggleShow });
		if (!toggleShow) {
			const decryptSalary = CryptoJS.AES.decrypt(secretSalary, "scSecretSalary");
			const plaintext = decryptSalary.toString(CryptoJS.enc.Utf8);
			this.setState({ salary: plaintext + " ₺" });
		} else this.setState({ salary: "∙∙∙∙∙∙" });
	};

	deleteEmployee = () => {
		try {
			const { uid, to, name } = this.state;
			showSwal({
				type: "warning",
				title: "Emin misiniz?",
				html: `<b>${name}</b> adlı personeli <b>işten çıkarmak</b> istediğinize emin misiniz?`,
				confirmButtonText: "Evet",
				cancelButtonText: "Hayır",
				cancelButtonColor: "#868e96",
				confirmButtonColor: "#cd201f",
				showCancelButton: true,
				reverseButtons: true
			}).then(result => {
				if (result.value) {
					DeleteEmployee({
						uid: uid,
						to: to
					}).then(response => {
						if (response) {
							const status = response.status;
							if (status.code === 1020) {
								Toast.fire({
									type: "success",
									title: "İşlem başarılı..."
								});
								setTimeout(() => this.props.history.push("/app/employees"), 1000);
							}
						}
					});
				}
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
			const { uid, name } = this.state;
			showSwal({
				type: "warning",
				title: "Emin misiniz?",
				html: `<b>${name}</b> adlı personelin <b>#${key}</b> nolu iznini iptal etmek istediğinize emin misiniz?`,
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
			name,
			email,
			phone,
			position,
			securityNo,
			branch,
			image,
			salary,
			showSalary,
			to,
			list,
			onLoadedData,
			vacation,
			data
		} = this.state;
		const { match } = this.props;
		return (
			<div className="container">
				<div className="page-header">
					<h1 className="page-title">Personel Detay &mdash; İzin Geçmişi</h1>
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
								<div className={`dimmer ${!onLoadedData ? "active" : ""}`}>
									<div className="loader" />
									<div className="dimmer-content">
										<div className="media mb-5">
											<span
												className="avatar avatar-xxl mr-4"
												style={{ backgroundImage: `url(${image})` }}
											/>
											<div className="media-body">
												<h4 className="m-0">{name}</h4>
												<p className="text-muted mb-0">{position}</p>
												<ul className="social-links list-inline mb-0 mt-2">
													<li className="list-inline-item">
														<a
															className="employee_email"
															href={`mailto:${email}`}
															data-original-title={email}
															data-toggle="tooltip">
															<i className="fa fa-envelope" />
														</a>
													</li>
													<li className="list-inline-item">
														<a
															className="employee_phone"
															href={`tel:${phone}`}
															data-original-title={phone}
															data-toggle="tooltip">
															<i className="fa fa-phone" />
														</a>
													</li>
												</ul>
											</div>
										</div>
										<div className="form-group">
											<label className="form-label">T.C. Kimlik Numarası</label>
											<div className="form-control-plaintext">{securityNo}</div>
										</div>
										<div className="form-group">
											<label className="form-label">Branşı</label>
											<div className="form-control-plaintext">{branch}</div>
										</div>
										<div className="form-group">
											<label className="form-label">
												Maaşı
												<span className="ml-1 align-self-center">
													<span
														className="form-help"
														data-toggle="popover"
														data-trigger="hover"
														data-placement="top"
														data-html="true"
														data-content='<p>Maaş bölümünü sadece yöneticinin yetkilendirdiği kişiler görüntüleyebilir.</p><p>Yönetici ise maaşları şifreleri ile görüntüleyebilir.</p><b>"—"</b>: Belirtilmedi.'>
														?
													</span>
												</span>
											</label>
											<div className="form-control-plaintext">
												<span>{salary || "—"}</span>
												{salary ? (
													<button
														type="button"
														onClick={this.handleSalary}
														className="btn btn-sm btn-icon btn-secondary ml-2">
														<i className={`fe fe-${!showSalary ? "lock" : "unlock"}`} />
													</button>
												) : null}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer" style={{ padding: ".5rem 1.5rem" }}>
								<div className="d-flex justify-content-center">
									<Link
										to={`/app/employees/edit/${to}`}
										className={`btn ${!onLoadedData ? "disabled" : ""} btn-link btn-block`}>
										Bilgileri Düzenle
									</Link>
								</div>
							</div>
							<div className="card-footer" style={{ padding: ".5rem 1.5rem" }}>
								<div className="d-flex justify-content-center">
									<button
										onClick={this.deleteEmployee}
										className={`btn ${
											!onLoadedData ? "disabled" : ""
										} text-danger btn-link btn-block`}>
										<i className="fe fe-alert-octagon mr-1"></i>
										İşten Çıkar
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-8 col-sm-12 col-md-12">
						<div className="card">
							<div className="card-header">
								<h3 className="card-title">İzin Geçmişi</h3>
								<button
									onClick={() =>
										this.setState({
											vacation: true,
											data: { name: name, uid: to }
										})
									}
									className="btn btn-sm btn-success ml-auto">
									İzin Oluştur
								</button>

								{<ModalVacation data={data} visible={vacation} history={this.props.history} />}
							</div>
							<div className="card-body">
								<div className="table-responsive">
									<table className="table table-hover table-outline table-vcenter text-nowrap card-table text-center">
										<thead>
											<tr>
												<th className="w-1"></th>
												<th className="w-1">Başlangıç Tarihi</th>
												<th className="w-1">Bitiş Tarihi</th>
												<th className="w-1">Gün Sayısı</th>
												<th className="w-1">Durum</th>
												<th className="w-1"></th>
											</tr>
										</thead>
										<tbody>
											{list.length > 0
												? list.map((el, key) => {
														return (
															<tr key={key.toString()}>
																<td className="text-muted">#{key + 1}</td>
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
																			this.deleteVacation(el.vacation_id, key + 1)
																		}
																		data-toggle="tooltip"
																		title="İptal et">
																		<i className="fe fe-x"></i>
																	</button>
																</td>
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
		);
	}
}

export default Vacation;
