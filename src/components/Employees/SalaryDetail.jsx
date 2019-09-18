import React, { Component } from "react";
import { DetailEmployee } from "../../services/Employee.jsx";
import { ListSalaries } from "../../services/EmployeeAction";
import { fullnameGenerator } from "../../services/Others";
import { Link } from "react-router-dom";
import Tabs from "../../components/Employees/Tabs";
import moment from "moment";
const CryptoJS = require("crypto-js");

const noRow = loading =>
	loading ? (
		<div className={`dimmer active p-3`}>
			<div className="loader" />
			<div className="dimmer-content" />
		</div>
	) : (
		<div className="text-center text-muted font-italic">Kayıt bulunamadı...</div>
	);

export class SalaryDetail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: localStorage.getItem("UID"),
			to: props.match.params.uid,
			name: "—",
			email: "—",
			phone: "—",
			security_id: "—",
			position: "—",
			branch: "—",
			image: "",
			salary: null,
			showSalary: false,
			list: [],
			onLoadedData: false
		};
	}

	componentDidMount() {
		this.getEmployeeDetail();
		this.listSalaries();
	}

	listSalaries = () => {
		const { uid, to } = this.state;
		ListSalaries({
			uid: uid,
			to: to
		}).then(response => {
			if (response) {
				const status = response.status;
				if (status.code === 1020) {
					this.setState({ list: response.data.reverse() });
				}
			}
		});
	};

	getEmployeeDetail = () => {
		const { uid, to } = this.state;
		DetailEmployee({
			uid: uid,
			to: to
		}).then(response => {
			if (response !== null) {
				const status = response.status;
				if (status.code === 1020) {
					const data = response.data;
					this.setState({
						...data,
						salary: data.salary ? "∙∙∙∙∙∙" : null,
						secretSalary: data.salary
							? CryptoJS.AES.encrypt(data.salary.format(), "scSecretSalary").toString()
							: null,
						onLoadedData: true
					});
				}
			}
		});
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

	render() {
		const {
			name,
			surname,
			email,
			phone,
			position,
			security_id,
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
					<h1 className="page-title">Personel Detay &mdash; Maaş Geçmişi</h1>
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
												<h4 className="m-0">{fullnameGenerator(name, surname)}</h4>
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
											<div className="form-control-plaintext">{security_id}</div>
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
								<h3 className="card-title">Maaş Geçmişi</h3>
								<button
									onClick={() => this.props.history.push("/app/employees/salary/" + to)}
									className="btn btn-sm btn-success ml-auto">
									Maaş Öde
								</button>
							</div>
							<div className="card-body">
								{list ? (
									list.length > 0 ? (
										<ul className="timeline mb-0">
											{list.map((el, key) => (
												<li className="timeline-item" key={key.toString()}>
													<div
														className={`timeline-badge ${
															el.is_future === 0 ? "bg-success" : ""
														}`}
													/>
													<div>
														<strong>{el.amount ? el.amount.format() + " ₺" : null}</strong>{" "}
														maaş ödendi
													</div>
													<div className="timeline-time">
														{moment(el.payment_date).format("DD-MM-YYYY")}
													</div>

													<div>
														{el.is_future === 1 ? (
															<button
																type="button"
																data-toggle="tooltip"
																title="Maaşı Öde"
																className="btn btn-sm btn-success btn-icon p-1">
																<i className="fa fa-money-bill-wave"></i>
															</button>
														) : null}
													</div>
												</li>
											))}
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

export default SalaryDetail;
